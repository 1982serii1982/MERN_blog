import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  Tabs,
  Tab,
  Grid2,
  Snackbar,
  Alert,
  Slide,
  Container,
  useTheme,
  Box,
} from "@mui/material";
import { fetchPosts, fetchTags } from "../../redux/slices/post";
import { authSelector } from "../../redux/slices/auth";

import TagsBlock from "../../components/TagsBlock";
import CommentsBlock from "../../components/CommentsBlock";
import CustomTabPanel from "../../components/CustomTabPanel/CustomTabPanel";

const Home = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const dispatch = useDispatch();
  const theme = useTheme();

  const { name } = useParams();
  const firstLoad = React.useRef(true);

  const { posts, tags } = useSelector((state) => state.posts);
  const { isAuth, data } = useSelector(authSelector);

  const isPostLoading = posts.status === "Loading";
  const isTagLoading = tags.status === "Loading";

  if (
    posts.status === "Loaded" &&
    tags.status === "Loaded" &&
    !firstLoad.current
  ) {
    setOpen(true);
    firstLoad.current = true;
  }

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

  return (
    <Container maxWidth={false} fixed={true} disableGutters={true}>
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
        sx={{
          marginBottom: "25px",
        }}
        value={value}
        aria-label="basic tabs example"
      >
        <Tab label="New" {...tabProps(0)} />
        <Tab label="Popular" {...tabProps(1)} />
      </Tabs>
      {name && <Box># {name}</Box>}
      <Grid2
        container
        sx={{
          justifyContent: "space-between",
        }}
      >
        <CustomTabPanel
          isPostLoading={isPostLoading}
          value={value}
          index={0}
          posts={posts.items}
          isAuth={isAuth}
          data={data}
        />
        <CustomTabPanel
          isPostLoading={isPostLoading}
          value={value}
          index={1}
          posts={posts.itemsSorted}
          isAuth={isAuth}
          data={data}
        />
        <Grid2
          size={2}
          container
          direction="column"
          rowSpacing={2}
          sx={{
            padding: "20px",
            backgroundColor: theme.palette.primary.light_light,
            borderRadius: "10px",
          }}
        >
          <TagsBlock items={tags.items} isLoading={isTagLoading} />
          <CommentsBlock items={posts.comments} isLoading={false} />
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Home;
