import { firebase } from "../config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);

export const getArray = (value) => {
  return value.split(",");
};

export const uploadImage = async (uri) => {
  const img = await fetch(uri);
  const blob = await img.blob();
  const date = Date.now().toString();
  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const fileRef = ref(firebase.storage(), `images/${filename + date}`);

  try {
    await uploadBytesResumable(fileRef, blob);

    blob.close();
    return await getDownloadURL(fileRef);
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const timeAgo = (date) => {
  const timeAgo = new TimeAgo("en-US");
  return timeAgo.format(new Date(date));
};
