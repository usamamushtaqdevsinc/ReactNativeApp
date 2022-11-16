import { Text, View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/auth-context";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import PostList from "../components/Post/PostList";
import { fetchPosts } from "../util/http";
import { setPosts } from "../store/redux/posts";
import { Colors } from "../constants/styles";

function WelcomeScreen() {
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const token = authCtx.userInfo.token;
  const items = useSelector((state) => state.posts.values);

  const getPosts = async () => {
    setIsFetching(true);
    try {
      const fetchedPosts = await fetchPosts(token);
      const sortedPosts = fetchedPosts.sort(
        (objA, objB) =>
          Number(new Date(objB.createdAt)) - Number(new Date(objA.createdAt))
      );
      dispatch(
        setPosts({
          data: sortedPosts,
        })
      );
    } catch (error) {
      setError("Could not fetch posts!");
    }
    setIsFetching(false);
  };
  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fetchedPosts = await fetchPosts(token);
      const sortedPosts = fetchedPosts.sort(
        (objA, objB) =>
          Number(new Date(objB.createdAt)) - Number(new Date(objA.createdAt))
      );
      dispatch(
        setPosts({
          data: sortedPosts,
        })
      );
    } catch (error) {
      setError("Could not fetch posts!");
    }

    setIsRefreshing(false);
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
      <PostList items={items} onRefresh={onRefresh} refreshing={isRefreshing} />
    </>
  );
}

export default WelcomeScreen;
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
