import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import postsReducer from "./posts";

const customMiddleware = [
  ...getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
];

export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
  middleware: [...customMiddleware],
});
