import axios from "axios";
import { Post } from "../models/Post";

const BACKEND_URL =
  "https://react-native-expense-tra-d2e5e-default-rtdb.firebaseio.com/";

export const httpStorePost = async (postData, token) => {
  const response = await axios.post(
    BACKEND_URL + "/posts.json?auth=" + token,
    postData
  );
  const id = response.data.name;
  return id;
};

export const fetchPosts = async (token) => {
  const response = await axios.get(BACKEND_URL + "/posts.json?auth=" + token);
  const posts = [];
  for (const key in response.data) {
    posts.push(
      new Post(
        response.data[key].title,
        response.data[key].image,
        response.data[key].description,
        response.data[key].owner,
        response.data[key].likedBy,
        response.data[key].likeCount,
        {
          address: response.data[key].address,
          lat: response.data[key].location.lat,
          lng: response.data[key].location.lng,
        },
        response.data[key].createdAt,
        response.data[key].comments,
        key
      )
    );
  }

  return posts;
};

export const httpUpdatePost = (id, postData, token) => {
  return axios.put(BACKEND_URL + `/posts/${id}.json?auth=` + token, postData);
};

export const httpDeletePost = (id, token) => {
  return axios.delete(BACKEND_URL + `/posts/${id}.json?auth=` + token);
};
