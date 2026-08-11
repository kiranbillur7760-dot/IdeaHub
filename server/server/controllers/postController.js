import Post from "../models/Post.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { text, image, video } = req.body;

    if (!text && !image && !video) {
      return res.status(400).json({
        message: "Post cannot be empty",
      });
    }

    const post = await Post.create({
      author: req.user.id,
      text: text || "",
      image: image || "",
      video: video || "",
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name email");

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("CREATE POST ERROR:", error);

    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};


// Get all social posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};


// Like / Unlike a post
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes,
      likeCount: post.likes.length,
    });
  } catch (error) {
    console.error("LIKE POST ERROR:", error);

    res.status(500).json({
      message: "Failed to like post",
      error: error.message,
    });
  }
};


// Add a comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user.id,
      text: text.trim(),
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("comments.user", "name");

    res.status(200).json({
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};