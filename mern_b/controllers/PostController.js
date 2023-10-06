import PostModel from "./../models/Post.js";

export const getAllPosts = async (req, res) => {
  try {
    const tag = req.query.tag;
    const posts = await PostModel.find()
      .sort({ createdAt: "desc" })
      .populate("author")
      .populate({
        path: "comments",
        populate: { path: "author", model: "User" },
      })
      .exec();

    if (Boolean(tag)) {
      let postsFiltered = posts.filter((elem, i) => {
        return elem.tags.includes(tag);
      });
      res.json(postsFiltered);
    } else {
      res.json(posts);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get all posts",
    });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((item, i) => item.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get all posts",
    });
  }
};

export const getOnePostEdit = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findById({
      _id: postId,
    })
      .populate("author")
      .populate({
        path: "comments",
        populate: { path: "author", model: "User" },
      })
      .exec();

    if (!doc) {
      return res.status(404).json({
        message: "Post not find",
      });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get post",
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }, //aceasta operatie ne permite sa incrementam '$inc' campul
        //'viewsCount' cu o unitate
      },
      {
        returnDocument: "after", //inseamna sa returnam rezultatul incremenetat din baza de date
      }
    )
      .populate("author")
      .populate({
        path: "comments",
        populate: { path: "author", model: "User" },
      });

    if (!doc) {
      return res.status(404).json({
        message: "Post not find",
      });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get post",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const postDoc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      imagePath: req.body.imagePath,
      author: req.userId,
    });

    const newPost = await postDoc.save();
    res.json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Create post failed",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const doc = await PostModel.findOneAndDelete({
      _id: postId,
      author: {
        _id: userId,
      },
    });

    if (!doc) {
      return res.status(404).json({
        message: "Can not delete post",
        error: true,
      });
    }

    res.json({
      success: true,
      error: false,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete post",
      error: true,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        $push: { comments: req.body.cID },
        imageUrl: req.body.imageUrl,
        imagePath: req.body.imagePath,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Update post failed",
    });
  }
};
