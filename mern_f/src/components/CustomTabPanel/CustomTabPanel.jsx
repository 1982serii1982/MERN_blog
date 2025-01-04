import React from "react";
import { Box, Grid2 } from "@mui/material";

import Post from "../Post";

const CustomTabPanel = ({
  isPostLoading,
  value,
  index,
  styles,
  posts,
  isAuth,
  data,
}) => {
  return (
    <Grid2
      size={8}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index &&
        (isPostLoading
          ? [...Array(5)]
          : posts.length > 0
          ? posts
          : [...Array(1)]
        ).map((item, i, arr) => {
          return isPostLoading ? (
            <Post isLoading={true} key={i} />
          ) : posts.length > 0 ? (
            <Post
              _id={item._id}
              title={item.title}
              imagePath={Boolean(item.imagePath) ? item.imagePath : ""}
              imageUrl={
                Boolean(item.imageUrl)
                  ? `${import.meta.env.VITE_API_URL}${item.imageUrl}`
                  : null
              }
              user={item.author}
              createdAt={item.createdAt}
              viewsCount={item.viewsCount}
              //commentsCount={item.comments ? item.comments.length : 0}
              comments={item.comments}
              tags={item.tags}
              isEditable={isAuth && data ? data._id === item.author._id : false}
              isLoading={false}
              key={i}
              //In acest caz lipseste 'isFullPost' ceeea ce implicit face ca valoare lui sa fie 'false'
            />
          ) : (
            <div key={i}>There is no more posts to show</div>
          );
        })}
    </Grid2>
  );
};

export default CustomTabPanel;
