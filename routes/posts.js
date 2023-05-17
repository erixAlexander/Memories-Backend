import express from "express";
const router = express.Router();
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  countPosts,
} from "../controllers/postsController.js";
import auth from "../middleware/auth.js";

router.get("/", getPosts);
router.get("/count", countPosts);

router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

export default router;
