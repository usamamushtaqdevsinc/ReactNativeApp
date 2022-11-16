import { useDispatch } from "react-redux";
import { useState, useContext } from "react";
import PostForm from "../components/Post/PostForm";
import { httpStorePost } from "../util/http";
import { addPost } from "../store/redux/posts";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
// import { insertPost } from "../util/database";

const AddPostScreen = ({ navigation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const token = authCtx.userInfo.token;

  async function createPostHandler(post) {
    console.log(post);
    // await insertPost(post);
    setIsSubmitting(true);
    try {
      const id = await httpStorePost(post, token);
      dispatch(
        addPost({
          data: { ...post, id: id },
        })
      );
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later!");
      setIsSubmitting(false);
    }
  }
  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay message="Saving Your Post" />;
  }

  return (
    <PostForm
      onCreatePost={createPostHandler}
      onUpload={setIsSubmitting}
      onError={setError}
    />
  );
};

export default AddPostScreen;
