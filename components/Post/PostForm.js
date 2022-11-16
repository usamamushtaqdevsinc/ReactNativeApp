import { useCallback, useContext, useState } from "react";
import { ScrollView, StyleSheet, Alert, View } from "react-native";
import Button from "../UI/Button";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Input from "../Auth/Input";
import { AuthContext } from "../../store/auth-context";
import { Post } from "../../models/Post";
import { uploadImage } from "../../util/helpers";

function PostForm({ onCreatePost, onUpload, onError }) {
  const authCtx = useContext(AuthContext);
  const [enteredTitle, setEnteredTitle] = useState({
    value: "",
    isInvalid: false,
  });
  const [enteredDescription, setEnteredDescription] = useState({
    value: "",
    isInvalid: false,
  });
  const [selectedImage, setSelectedImage] = useState({
    value: undefined,
    isInvalid: false,
  });
  const [pickedLocation, setPickedLocation] = useState({
    value: undefined,
    isInvalid: false,
  });

  function changeTitleHandler(enteredText) {
    setEnteredTitle({ value: enteredText, isInvalid: false });
  }
  function changeDescriptionHandler(enteredDescription) {
    setEnteredDescription({ value: enteredDescription, isInvalid: false });
  }

  function takeImageHandler(imageUri) {
    setSelectedImage({ value: imageUri, isInvalid: false });
  }

  const pickLocationHandler = useCallback((location) => {
    setPickedLocation({ value: location, isInvalid: false });
  }, []);

  const savePostHandler = async () => {
    let title = enteredTitle.value;
    let description = enteredDescription.value;
    let image = selectedImage.value;
    let location = pickedLocation.value;

    title = title.trim();
    description = description.trim();

    const titleIsValid = title.length > 6 && title.length < 40;
    const descriptionIsValid =
      description.length > 10 && description.length < 100;
    const imageIsValid = image != undefined;
    const locationIsValid = location != undefined;

    if (
      !titleIsValid ||
      !descriptionIsValid ||
      !imageIsValid ||
      !locationIsValid
    ) {
      setEnteredTitle((prev) => ({
        value: prev.value,
        isInvalid: !titleIsValid,
      }));
      setEnteredDescription((prev) => ({
        value: prev.value,
        isInvalid: !descriptionIsValid,
      }));
      setSelectedImage((prev) => ({
        value: prev.value,
        isInvalid: !imageIsValid,
      }));
      setPickedLocation((prev) => ({
        value: prev.value,
        isInvalid: !locationIsValid,
      }));

      Alert.alert("Invalid input", "Please check your values.");

      return;
    }

    const owner = authCtx.userInfo.email;
    onUpload(true);
    imageURI = await uploadImage(selectedImage.value);
    if (imageURI === false) {
      onError(true);
      onUpload(false);
    }
    const postData = new Post(
      enteredTitle.value,
      imageURI,
      enteredDescription.value,
      owner,
      "",
      0,
      pickedLocation.value,
      new Date().toString(),
      ""
    );

    onCreatePost(postData);
  };

  return (
    <ScrollView style={styles.form}>
      <View>
        <Input
          label="Title"
          onUpdateValue={changeTitleHandler}
          value={enteredTitle.value}
          isInvalid={enteredTitle.isInvalid}
        />
        <Input
          label="Description"
          onUpdateValue={changeDescriptionHandler}
          value={enteredDescription.value}
          isInvalid={enteredDescription.isInvalid}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} useCamera />
      <LocationPicker onPickLocation={pickLocationHandler} />
      <View style={styles.buttonContainer}>
        <Button onPress={savePostHandler}>Add Post</Button>
      </View>
    </ScrollView>
  );
}

export default PostForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
    marginVertical: 24,
  },
  buttonContainer: {
    marginVertical: 12,
  },
});
