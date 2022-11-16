import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../constants/styles";
import { timeAgo } from "../../util/helpers";

const CommentItem = ({ value, owner, createdAt }) => {
  return (
    <View style={styles.commentItem}>
      <View>
        {owner && <Text style={styles.owner}>{owner}</Text>}
        {value && <Text style={styles.value}>{value}</Text>}
        {createdAt && (
          <Text style={styles.createdAt}>{timeAgo(createdAt)}</Text>
        )}
      </View>
    </View>
  );
};

export default CommentItem;
const p8 = Dimensions.get("window").height / 250;
const p4 = Dimensions.get("window").height / 500;
const p2 = Dimensions.get("window").height / 700;
const styles = StyleSheet.create({
  commentItem: {
    flex: 1,
    marginHorizontal: p2,
    marginVertical: p2,
    padding: p4,
    borderRadius: p8,
    backgroundColor: Colors.primary100,
    elevation: p2,
    shadowColor: Colors.primary800,
    shadowOpacity: 0.25,
    shadowOffset: { height: p2, width: 0 },
    shadowRadius: p8,
  },
  value: {
    fontSize: Dimensions.get("window").height / 70,
    marginHorizontal: p8,
    paddingTop: p4,
  },
  owner: {
    fontSize: Dimensions.get("window").height / 150,
    fontWeight: "bold",
    marginHorizontal: p4,
  },
  createdAt: {
    fontSize: Dimensions.get("window").height / 150,
    color: Colors.primary500,
    textAlign: "right",
    marginHorizontal: p8,
  },
});
