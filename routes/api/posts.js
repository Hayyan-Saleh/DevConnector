import express from "express";
import jwtMiddleware from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";
import Profile from "../../models/Profile.js";
import Post from "../../models/Post.js";
const router = express.Router();

// ================= Post Routes =================

// @route    POST api/posts
// @desc     Create a post
// @access   Private

router.post(
  "/",
  [jwtMiddleware, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const post = new Post({
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        text: req.body.text,
      });
      await post.save();
      return res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error", details: err.message });
    }
  },
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private

router.get("/", jwtMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().sort("-date");
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private

router.get("/:id", jwtMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete post by ID
// @access   Private

router.delete("/:id", jwtMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // check user id post id
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "User not authorized" });
    }
    await Post.deleteOne({ _id: req.params.id });
    return res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// ================== Post Like/Unlike Routes ==================

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private

router.put("/like/:id", jwtMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ error: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private

router.put("/unlike/:id", jwtMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ error: "Post hasn't been liked yet" });
    }
    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// ================== Comment Routes ==================

// @route    POST api/posts/comment/:id
// @desc     Create a comment on a post
// @access   Private

router.post(
  "/comment/:id",
  [jwtMiddleware, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        text: req.body.text,
      };
      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error", details: err.message });
    }
  },
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete a comment from a post
// @access   Private

router.delete("/comment/:id/:comment_id", jwtMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);

    // check if comment exists
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id,
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "User not authorized" });
    }
    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.id.toString())
      .indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

export default router;
