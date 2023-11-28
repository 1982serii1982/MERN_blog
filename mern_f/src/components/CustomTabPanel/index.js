import React from "react";
import { Grid } from "@mui/material";

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
    <Grid
      xs={8}
      item
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
                  ? //? `http://localhost:4444${item.imageUrl}`
                    `http://api.mern2.sergiucotruta.co.uk${item.imageUrl}`
                  : "https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
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
            <div key={i} className={styles.root}>
              There is no more posts to show
            </div>
          );
        })}
    </Grid>
  );
};

export default CustomTabPanel;
