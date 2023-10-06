import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Tabs, Tab, Grid, Snackbar, Alert, Slide } from "@mui/material";
import { fetchPosts, fetchTags } from "../../redux/slices/post";
import { authSelector } from "../../redux/slices/auth";

import TagsBlock from "../../components/TagsBlock";
import CommentsBlock from "../../components/CommentsBlock";
import CustomTabPanel from "../../components/CustomTabPanel";

import styles from "./Home.module.scss";

const Home = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const { name } = useParams();

  const firstLoad = React.useRef(true);

  function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
  }

  function tabProps(index) {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = (event, reason) => {
    // if (reason === "clickaway") {
    //   return;
    // }

    setOpen(false);
  };

  const dispatch = useDispatch();

  const { posts, tags } = useSelector((state) => state.posts);
  const { isAuth, data } = useSelector(authSelector);

  const isPostLoading = posts.status === "Loading";
  const isTagLoading = tags.status === "Loading";

  React.useEffect(() => {
    dispatch(fetchPosts(name ? name : ""));
    dispatch(fetchTags());
  }, [name]);

  React.useEffect(() => {
    if (posts.deleting) {
      firstLoad.current = false;
      dispatch(fetchPosts(name ? name : ""));
      dispatch(fetchTags());
    }
  }, [posts]);

  if (
    posts.status === "Loaded" &&
    tags.status === "Loaded" &&
    !firstLoad.current
  ) {
    setOpen(true);
    firstLoad.current = true;
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
          Post was deleted successfully.
        </Alert>
      </Snackbar>
      <Tabs
        onChange={handleChange}
        style={{ marginBottom: 15 }}
        value={value}
        aria-label="basic tabs example"
      >
        <Tab label="New" {...tabProps(0)} />
        <Tab label="Popular" {...tabProps(1)} />
      </Tabs>
      {name && <div className={styles.tag}># {name}</div>}
      <Grid container spacing={4}>
        <CustomTabPanel
          isPostLoading={isPostLoading}
          value={value}
          index={0}
          styles={styles}
          posts={posts.items}
          isAuth={isAuth}
          data={data}
        />
        <CustomTabPanel
          isPostLoading={isPostLoading}
          value={value}
          index={1}
          styles={styles}
          posts={posts.itemsSorted}
          isAuth={isAuth}
          data={data}
        />
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagLoading} />
          <CommentsBlock items={posts.comments} isLoading={false} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
