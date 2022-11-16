import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/styles";

const Input = ({ props, onPress, onUpdateValue, value }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input]}
          {...props}
          onChangeText={onUpdateValue}
          value={value}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onPress}
        >
          <Ionicons
            name="send"
            color={Colors.primary800}
            size={24}
            style={styles.icon}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Input;
const p8 = Dimensions.get("window").height / 250;
const p6 = Dimensions.get("window").height / 187;
const p10 = Dimensions.get("window").height / 312;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  inputContainer: {
    flex: 4,
    marginLeft: p8,
  },
  input: {
    backgroundColor: Colors.primary100,
    paddingVertical: p8,
    paddingHorizontal: p6,
    borderTopLeftRadius: p8,
    borderBottomLeftRadius: p8,
    fontSize: Dimensions.get("window").height / 50,
  },
  buttonContainer: {
    flex: 0.4,
    marginRight: p8,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary100,
    borderTopRightRadius: p8,
    borderBottomRightRadius: p8,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginTop: p8,
    marginLeft: p10,
  },
});
