import { FlatList, View, StyleSheet, Text, Dimensions } from "react-native";
import CommentItem from "./CommentItem";
import { Colors } from "../../constants/styles";

const CommentList = ({ items }) => {
  const renderCommentItem = (itemData) => {
    const item = itemData.item;

    const commentItemProps = {
      id: item.id,
      value: item.value,
      createdAt: item.createdAt,
      owner: item.owner,
    };
    return <CommentItem {...commentItemProps} />;
  };

  if (items.length < 1) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>You have no comment yet!</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Comments</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderCommentItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CommentList;
const p8 = Dimensions.get("window").height / 250;
const p4 = Dimensions.get("window").height / 500;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: p8,
    borderRadius: p8,
    backgroundColor: Colors.primary100,
    padding: p4,
    borderRadius: p8,
  },
  heading: {
    color: Colors.primary800,
    textAlign: "center",
    padding: p4,
    fontSize: Dimensions.get("window").height / 60,
    fontWeight: "bold",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: p8,
    borderRadius: p8,
    backgroundColor: Colors.primary100,
    padding: p4,
    borderRadius: p8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: Dimensions.get("window").height / 50,
    fontWeight: "bold",
    color: Colors.primary800,
  },
});
