import React from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import styles from "./AddComment.module.scss";

import { Avatar, TextField, Button } from "@mui/material";
import { authSelector } from "../../redux/slices/auth";

const AddComment = ({ postData, postUpdate }) => {
  const [input, setInput] = React.useState("");

  const { isAuth, data } = useSelector(authSelector);

  const handleClick = async (pID) => {
    const { data } = await axios.post("/comments", {
      pID,
      input,
    });

    await axios.patch(`/posts/${pID}`, {
      cID: data._id,
    });

    setInput("");

    postUpdate();
  };

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={
          data ? data.avatarUrl : "https://mui.com/static/images/avatar/5.jpg"
        }
      />
      <div className={styles.form}>
        <TextField
          label={isAuth ? "Leave a comment" : "Log in to add a comment"}
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          disabled={!isAuth}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          onClick={() => handleClick(postData._id)}
          disabled={!isAuth}
          variant="contained"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default AddComment;
