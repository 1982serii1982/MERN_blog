import CommentModel from "./../models/Comment.js";

export const getCommentsById = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await CommentModel.find({ post: postId })
      .populate("author")
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get comments",
    });
  }
};

export const deleteMultipleComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const numOfDoc = await CommentModel.deleteMany({
      post: postId,
    });

    res.json(numOfDoc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Create comment failed",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const commentDoc = new CommentModel({
      text: req.body.input,
      author: req.userId,
      post: req.body.pID,
    });

    const newComment = await commentDoc.save();
    res.json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Create comment failed",
    });
  }
};
