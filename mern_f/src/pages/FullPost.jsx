import React from "react";
import axios from "../utils/axios";
import { useParams } from "react-router-dom";
import { Snackbar, Alert, Slide } from "@mui/material";

import Post from "../components/Post";
import CommentsBlock from "../components/CommentsBlock";
import AddComment from "../components/AddComment";

const FullPost = () => {
  const [postData, setPostData] = React.useState();
  const [postDataUpdate, setPostDataUpdate] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const { id } = useParams();
  const firstLoad = React.useRef(true);

  const postUpdate = () => {
    firstLoad.current = false;
    setPostDataUpdate(!postDataUpdate);
  };

  function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
  }

  const handleClose = (event, reason) => {
    // if (reason === "clickaway") {
    //   return;
    // }

    setOpen(false);
  };

  React.useEffect(() => {
    const fetchPost = async () => {
      const { data } = await axios.get(`/posts/${id}`);
      setPostData(data);
      setIsLoading(false);
    };

    const fetchPostEdit = async (param) => {
      const { data } = await axios.get(`/posts/${id}/edit`);
      setPostData(data);
      setIsLoading(false);
      if (!param.current) {
        setOpen(true);
      }
    };

    if (window.localStorage.getItem("reload")) {
      fetchPostEdit(firstLoad);
    } else {
      fetchPost();
    }
  }, [postDataUpdate]);

  React.useEffect(() => {
    if (!window.localStorage.getItem("reload")) {
      window.localStorage.setItem("reload", "true");
    }

    return () => {
      //Aceasta portiune de cod se executa doar cind se paraseste pagina FullPost(se face unmount)
      //La reloadul paginii (refreshul) operatiunea de unmount nu se face
      window.localStorage.removeItem("reload");
    };
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
      >
        <Alert elevation={16} variant="filled">
          Comment was added successfully
        </Alert>
      </Snackbar>
      <Post
        _id={postData._id}
        title={postData.title}
        imageUrl={
          Boolean(postData.imageUrl)
            ? `${import.meta.env.VITE_API_URL}${postData.imageUrl}`
            : null
        }
        user={postData.author}
        createdAt={postData.createdAt}
        viewsCount={postData.viewsCount}
        comments={postData.comments}
        tags={postData.tags}
        isFullPost //In acest caz 'isFullPost' este prezent fara a avea vreo valoare
        //asta se subintelege ca valoarea lui este 'true' (implicit), sau se poate de facut
        //si explicit (isFullPost={true})
      >
        <p>{postData.text}</p>
      </Post>
      <CommentsBlock items={postData.comments} isLoading={false}>
        <AddComment postData={postData} postUpdate={postUpdate} />
      </CommentsBlock>
    </>
  );
};

export default FullPost;
