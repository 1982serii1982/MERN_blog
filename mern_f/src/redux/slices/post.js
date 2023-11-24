import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import moment from "moment";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (param) => {
    let obj = {};
    const compareViews = (x, y) => {
      if (x.viewsCount > y.viewsCount) {
        return -1;
      } else if (x.viewsCount < y.viewsCount) {
        return 1;
      }
      return 0;
    };

    const compareTime = (x, y) => {
      if (moment(x.createdAt) > moment(y.createdAt)) {
        return -1;
      } else if (moment(x.createdAt) < moment(y.createdAt)) {
        return 1;
      }
      return 0;
    };

    const { data } = await axios.get("/posts", {
      params: {
        tag: param,
      },
    });

    let comments = data
      .flatMap((item, i) => {
        return item.comments;
      })
      .sort(compareTime)
      .slice(0, 3);

    obj.original = [...data];
    data.sort(compareViews);
    obj.sorted = data;
    obj.comments = comments;
    return obj;
  }
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchDeletePost = createAsyncThunk(
  "posts/fetchDeletePost",
  async (obj, { rejectWithValue }) => {
    try {
      if (obj.imagePath) {
        await axios.post("/delete/upload", {
          imagePath: obj.imagePath,
        });
      }

      await axios.delete(`/posts/${obj._id}`);

      await axios.delete(`/comments/${obj._id}`);
    } catch (error) {
      // if (error.response.status === 401) {
      // }
      return rejectWithValue(error.response.data); //{message: 'Failed to delete, file not found'}
    }
  }
);

const initialState = {
  posts: {
    items: [],
    itemsSorted: [],
    comments: [],
    status: "Loading",
    deleting: false,
  },
  tags: {
    items: [],
    status: "Loading",
  },
};

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state, action) => {
      state.posts.items = [];
      state.posts.itemsSorted = [];
      state.posts.comments = [];
      state.posts.status = "Loading";
      state.posts.deleting = false;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.items = action.payload.original;
      state.posts.itemsSorted = action.payload.sorted;
      state.posts.comments = action.payload.comments;
      state.posts.status = "Loaded";
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.posts.items = [];
      state.posts.itemsSorted = [];
      state.posts.comments = [];
      state.posts.status = "Error";
    });
    builder.addCase(fetchTags.pending, (state, action) => {
      state.tags.items = [];
      state.tags.status = "Loading";
      state.posts.deleting = false;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "Loaded";
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.tags.items = [];
      state.tags.status = "Error";
    });
    builder.addCase(fetchDeletePost.pending, (state, action) => {});
    builder.addCase(fetchDeletePost.fulfilled, (state, action) => {
      state.posts.deleting = true;
    });
    builder.addCase(fetchDeletePost.rejected, (state, action) => {});
  },
});

export default postSlice.reducer;
