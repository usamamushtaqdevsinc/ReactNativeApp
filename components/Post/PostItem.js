import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../UI/IconButton";
import { Colors } from "../../constants/styles";
import { timeAgo } from "../../util/helpers";
import { AuthContext } from "../../store/auth-context";
import { updatePost } from "../../store/redux/posts";
import { httpUpdatePost } from "../../util/http";

const PostItem = ({ title, image, createdAt, owner, id, likeCount }) => {
  const navigation = useNavigation();
  const items = useSelector((state) => state.posts.values);
  const dispatch = useDispatch();
  const item = items.find((item) => item.id === id);
  const authCtx = useContext(AuthContext);
  const token = authCtx.userInfo.token;
  const currUser = authCtx.userInfo.email;
  let postLikedBy = [];

  if (item?.likedBy !== "") {
    postLikedBy = item?.likedBy;
  }
  let isLiked = postLikedBy.includes(currUser);

  const pressHandler = () => {
    navigation.navigate("PostDetails", {
      id: id,
    });
  };
  const likeHandler = async () => {
    let postData = {};
    if (isLiked === false) {
      postData = {
        ...item,
        likedBy: [...postLikedBy, currUser],
        likeCount: item.likeCount + 1,
      };
    } else {
      let likedList = postLikedBy.filter((v) => v !== currUser);
      if (likedList.length < 1) {
        likedList = "";
      }
      postData = {
        ...item,
        likedBy: likedList,
        likeCount: item.likeCount - 1,
      };
    }
    try {
      dispatch(
        updatePost({
          id: id,
          data: postData,
        })
      );

      await httpUpdatePost(id, postData, token);
    } catch (error) {
      setError("Could not save data - please try again later!");
    }
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.postItem}>
        <Pressable
          android_ripple={{ color: "#ccc" }}
          style={({ pressed }) => [
            styles.pressable,
            pressed ? styles.pressed : null,
          ]}
          onPress={pressHandler}
        >
          <View>
            {owner && <Text style={styles.owner}>{owner}</Text>}
            {title && <Text style={styles.title}>{title} </Text>}
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        </Pressable>
        <View style={styles.infoContainer}>
          <View style={styles.iconsContainer}>
            <Text style={styles.likeCount}>{likeCount.toString()}</Text>
            <IconButton
              icon={(isLiked && "heart") || "heart-outline"}
              color={Colors.like}
              size={24}
              onPress={likeHandler}
            />
            <IconButton
              icon="chatbubble"
              color={Colors.primary800}
              size={24}
              onPress={pressHandler}
            />
          </View>
          <View style={styles.timeContainer}>
            <Ionicons
              name={"timer-outline"}
              color={Colors.primary500}
              size={15}
            />
            {createdAt && <Text style={styles.time}>{timeAgo(createdAt)}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  rootContainer: {
    paddingVertical: 4,
  },
  postItem: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: Colors.primary100,
    elevation: 4,
    overflow: Platform.select({ android: "hidden", ios: "visible" }),
  },
  pressed: {
    opacity: 0.7,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    margin: 8,
  },
  image: {
    width: "100%",
    height: 200,
  },
  pressable: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
  },
  time: {
    fontSize: 12,
    color: Colors.primary500,
    marginLeft: 2,
  },
  iconsContainer: {
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
  },
  owner: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 8,
    marginTop: 4,
  },
  likeCount: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
});
