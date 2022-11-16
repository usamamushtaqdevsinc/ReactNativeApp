import { createSlice } from "@reduxjs/toolkit";
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    values: [],
    myValues: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.values = action.payload.data;
    },
    setMyPosts: (state, action) => {
      state.myValues = action.payload.data;
    },
    addPost: (state, action) => {
      state.values.unshift({ ...action.payload.data });
      state.myValues.unshift({ ...action.payload.data });
    },
    removePost: (state, action) => {
      const postIndex = state.values.findIndex(
        (post) => post.id === action.payload.id
      );
      const myPostIndex = state.myValues.findIndex(
        (post) => post.id === action.payload.id
      );
      state.values.splice(postIndex, 1);
      state.myValues.splice(myPostIndex, 1);
    },
    updatePost: (state, action) => {
      const postIndex = state.values.findIndex(
        (post) => post.id === action.payload.id
      );
      const updatedItem = { ...action.payload.data };
      const updatedPosts = [...state.values];
      updatedPosts[postIndex] = updatedItem;
      state.values = updatedPosts;
    },
  },
});

export const addPost = postsSlice.actions.addPost;
export const removePost = postsSlice.actions.removePost;
export const updatePost = postsSlice.actions.updatePost;
export const setPosts = postsSlice.actions.setPosts;
export const setMyPosts = postsSlice.actions.setMyPosts;

export default postsSlice.reducer;
