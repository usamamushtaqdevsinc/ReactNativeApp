import { Text, View, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../store/auth-context";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import PostList from "../components/Post/PostList";
import { fetchPosts } from "../util/http";
import { setMyPosts } from "../store/redux/posts";
import { Colors } from "../constants/styles";

function MyPostsScreen() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const token = authCtx.userInfo.token;
  const owner = authCtx.userInfo.email;
  const items = useSelector((state) => state.posts.myValues);

  const getPosts = async () => {
    setIsFetching(true);
    try {
      const fetchedPosts = await fetchPosts(token);
      const myPosts = fetchedPosts.filter((post) => post.owner === owner);
      dispatch(
        setMyPosts({
          data: myPosts,
        })
      );
    } catch (error) {
      setError("Could not fetch posts!");
    }
    setIsFetching(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay message="Loading..." />;
  }
  if (items.length < 1) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>You have no post yet!</Text>
      </View>
    );
  }
  return (
    <>
      <PostList items={items} />
    </>
  );
}

export default MyPostsScreen;
const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary800,
  },
});
