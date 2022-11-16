import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import PostItem from "./PostItem";

const PostList = ({ items, onRefresh, refreshing }) => {
  const renderPostItem = (itemData) => {
    const item = itemData.item;
    const postItemProps = {
      id: item.id,
      title: item.title,
      image: item.image,
      likedBy: item.likedBy,
      createdAt: item.createdAt,
      owner: item.owner,
      likeCount: item.likeCount,
    };
    return <PostItem {...postItemProps} />;
  };

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderPostItem}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default PostList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
});
