import React from "react";
import { useDispatch } from "react-redux";

import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import { fetchDeletePost } from "../../redux/slices/post";

import styles from "./Post.module.scss";
import PostSkeleton from "./PostSkeleton";
import { UserInfo } from "../UserInfo";
import { Link } from "react-router-dom";

const Post = ({
  _id,
  title,
  createdAt,
  imagePath,
  imageUrl,
  user,
  viewsCount,
  //commentsCount,
  comments,
  tags,
  children,
  isFullPost, //Componentul Post prevede ca o sa fie la intrare prop cu numele 'isFullPost'
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();

  const onClickRemove = (obj) => {
    dispatch(fetchDeletePost(obj));
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${_id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            onClick={() => onClickRemove({ _id, imagePath })}
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tags/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{comments.length}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;
