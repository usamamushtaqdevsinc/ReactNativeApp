import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Alert, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import CommentList from "../components/Comment/CommentList";
import IconButton from "../components/UI/IconButton";
import { Colors } from "../constants/styles";
import Input from "../components/Comment/Input";
import { timeAgo } from "../util/helpers";
import { AuthContext } from "../store/auth-context";
import { httpUpdatePost } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { updatePost } from "../store/redux/posts";
import { useNavigation } from "@react-navigation/native";
import { httpDeletePost } from "../util/http";
import { removePost } from "../store/redux/posts";

const PostDetailsScreen = ({ route }) => {
  const [commentValue, setCommentValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const itemId = route.params?.id;
  const items = useSelector((state) => state.posts.values);
  const item = items.find((item) => item.id === itemId);
  const authCtx = useContext(AuthContext);
  const token = authCtx.userInfo.token;
  const currUser = authCtx.userInfo.email;
  let isAllow = item?.owner === currUser;
  let postLikedBy = [];
  if (item?.likedBy !== "") {
    postLikedBy = item?.likedBy;
  }
  let isLiked = postLikedBy.includes(currUser);
  // const itemComments = item.hasOwnProperty("comments") ? item.comments : [];
  let itemComments = [];
  if (item?.comments !== "") {
    itemComments = item.comments;
  }

  useEffect(() => {
    Image.prefetch(item.image, () => {});
  }, []);

  useLayoutEffect(() => {
    if (!isAllow) {
      return;
    }
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="trash-outline"
          size={24}
          color={tintColor}
          onPress={removePostHandler}
        />
      ),
    });
  }, [navigation]);

  const removePostHandler = async () => {
    setIsSubmitting(true);
    try {
      await httpDeletePost(itemId, token);
      navigation.navigate("MyPosts");
      dispatch(removePost({ id: itemId }));
    } catch (error) {
      setError("Could not delete expense - please try again later!");
      setIsSubmitting(false);
    }
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
          id: itemId,
          data: postData,
        })
      );

      await httpUpdatePost(itemId, postData, token);
    } catch (error) {
      setError("Could not save data - please try again later!");
    }
  };

  const commentValueHandler = (enteredValue) => {
    setCommentValue(enteredValue);
  };
  const saveCommentValue = async () => {
    if (commentValue === "" || commentValue.length > 100) {
      Alert.alert("Invalid input", "Please enter some value.");
    } else {
      const postData = {
        ...item,
        comments: [
          ...itemComments,
          {
            id: Math.random().toString(),
            value: commentValue,
            owner: currUser,
            createdAt: new Date().toString(),
          },
        ],
      };
      try {
        dispatch(
          updatePost({
            id: itemId,
            data: postData,
          })
        );
        setCommentValue("");
        await httpUpdatePost(itemId, postData, token);
      } catch (error) {
        setError("Could not save data - please try again later!");
      }
      setIsSubmitting(false);
    }
  };

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay message="loading..." />;
  }
  return (
    <>
      <View style={styles.rootContainer}>
        <View style={styles.postItem}>
          <View style={styles.headerInfoContainer}>
            <Text style={styles.owner}>{item.owner}</Text>
            <View style={styles.timeContainer}>
              <Ionicons
                name={"timer-outline"}
                color={Colors.primary500}
                size={15}
              />
              {item.createdAt && (
                <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
              )}
            </View>
          </View>

          <View>
            {item.title && <Text style={styles.title}>{item.title}</Text>}
          </View>
          <View style={styles.descriptionContainer}>
            <View>
              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
          </View>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.infoContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.likeCount}>{item.likeCount.toString()}</Text>
              <IconButton
                icon={(isLiked && "heart") || "heart-outline"}
                color={Colors.like}
                size={24}
                onPress={likeHandler}
              />
            </View>
            <View style={styles.addressContainer}>
              {item.address && (
                <Text style={styles.address}>{item.address}</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.commentsContainer}>
        <CommentList items={itemComments} />
      </View>
      <View style={styles.input}>
        <Input
          props={{ placeholder: "Enter comment here" }}
          value={commentValue}
          onUpdateValue={commentValueHandler}
          onPress={saveCommentValue}
        />
      </View>
    </>
  );
};

export default PostDetailsScreen;
const p8 = Dimensions.get("window").height / 250;
const p4 = Dimensions.get("window").height / 500;
const p2 = Dimensions.get("window").height / 700;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginBottom: p8,
    marginTop: Dimensions.get("window").height / 100,
  },
  postItem: {
    flex: 1,
    marginHorizontal: p8,
    borderRadius: p8,
    backgroundColor: Colors.primary100,
  },
  pressed: {
    opacity: 0.7,
  },
  descriptionContainer: {
    borderRadius: p8,
    overflow: "hidden",
  },
  description: {
    fontSize: Dimensions.get("window").height / 90,
    margin: p8,
  },
  title: {
    fontSize: Dimensions.get("window").height / 70,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: Dimensions.get("window").height / 4,
  },
  pressable: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
  },
  address: {
    color: Colors.primary500,
    fontSize: Dimensions.get("window").height / 100,
  },
  addressContainer: {
    marginRight: p8,
  },
  commentsContainer: {
    flex: p2,
    marginVertical: p4,
  },
  input: {
    marginBottom: Dimensions.get("window").height / 45,
    marginTop: p4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Dimensions.get("window").height / 375,
  },
  time: {
    fontSize: Dimensions.get("window").height / 100,
    color: Colors.primary500,
    marginLeft: p2,
  },
  likeCount: {
    fontSize: Dimensions.get("window").height / 50,
    fontWeight: "bold",
    marginLeft: Dimensions.get("window").height / 150,
  },
  owner: {
    fontSize: Dimensions.get("window").height / 100,
    fontWeight: "bold",
    marginHorizontal: p8,
    marginTop: p4,
  },
});
