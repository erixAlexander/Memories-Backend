import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

const getPosts = async (req, res) => {
  try {
    let { title, tagArray } = req?.query.filter;
    const currentPage = req?.query.currentPage;
    const postsPerPage = 4;
    if (title === "") title = null;
    if (!tagArray) tagArray = null;
    if (!title && !tagArray) {
      const postmessages = await PostMessage.find()
        .skip(postsPerPage * (currentPage - 1))
        .limit(postsPerPage)
        .sort({ _id: -1 });
      return res.status(200).json(postmessages);
    }

    const postmessages = await PostMessage.find({
      $or: [
        { tags: { $in: tagArray } },
        { title: { $regex: `${title}`, $options: "i" } },
      ],
    })
      .skip(postsPerPage * (currentPage - 1))
      .limit(postsPerPage)
      .sort({ _id: -1 });
    res.status(200).json(postmessages);
  } catch (error) {
    console.log(error);
    res.status(409).json({ error });
  }
};

const countPosts = async (req, res) => {
  let { title, tagArray, isFirstRender } = req?.query.filter;
  if (!isFirstRender && title === "") title = null;
  if (!isFirstRender && tagArray === []) tagArray = null;

  try {
    if (!title && !tagArray) {
      const postmessages = await PostMessage.find().count();
      return res.status(200).json(postmessages);
    }

    const count = await PostMessage.find({
      $or: [
        { tags: { $in: tagArray } },
        { title: { $regex: `${title}`, $options: "i" } },
      ],
    }).count();
    res.status(200).json(count);
  } catch (error) {
    console.log(error);
    res.status(409).json({ error });
  }
};

const createPost = async (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const post = req.body;
  try {
    const newPost = new PostMessage({
      ...post,
      creator: req.userId,
      createdAt: new Date().toISOString(),
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ error });
    console.log(error);
  }
};

const updatePost = async (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Post with that Id");
  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(409).json({ error });
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Post with that Id");
  try {
    const deletedPost = await PostMessage.findByIdAndRemove(_id);
    res.json(deletedPost);
  } catch (error) {
    res.status(409).json({ error });
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);
  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
  console.log(error);
};

export { getPosts, createPost, updatePost, deletePost, countPosts };
