import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";

function Button({ children, onPress, light }) {
  const backgroundColor = {
    backgroundColor: light ? Colors.primary500 : Colors.primary800,
  };
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        backgroundColor,
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 12,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
