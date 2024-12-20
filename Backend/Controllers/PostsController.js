const express = require('express');
const router = express.Router();
const multer = require('multer');
const app = express()
const path = require('path');
const Post = require('../Models/AllPosts');
const User = require('../Models/UserModel')
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploaded_Images/Post_Images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png',
    'image/jpeg',
    'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PNG and JPG are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

//create post
router.post('/', upload.single('image'), async (req, res) => {
  const { title, content, userId, postType } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }


  const author = new mongoose.Types.ObjectId(userId);

  let authorImage = '';
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    authorImage = user.profile;
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }

  let image = '';
  if (req.file) {
    image = `/Uploaded_Images/Post_Images/${req.file.filename}`;
  }

  try {
    const newPost = new Post({
      title,
      content,
      postType,
      image,
      author,
      authorImage,
    });


    await newPost.save();


    await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

//get all posts
router.get('/', async (req, res) => {
  try {

    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }


    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

//for likes
router.put('/like/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    const userIndex = post.likes.findIndex((id) => id.toString() === userId);

    if (userIndex === -1) {

      post.likes.push(userId);
    } else {

      post.likes.splice(userIndex, 1);
    }


    await post.save();

    res.status(200).json({
      message: userIndex === -1 ? 'Post liked successfully' : 'Post disliked successfully',
      likesCount: post.likes.length,
      post
    });
  } catch (error) {
    console.error('Error handling like:', error.message);
    res.status(500).json({ message: 'Error liking/disliking post', error: error.message });
  }
});

//for comments
router.post('/comment/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;

  try {

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newComment = {
      userId,
      comment,
      userName: user?.name,
      userImage: user?.profile,
      createdAt: new Date(),
    };


    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Comment added successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

//for user posts
router.post('/myposts', async (req, res) => {
  try {
    const { userId } = req.body;
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching posts' });
  }
});

router.put("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, content, type } = req.body;
  const image = req.file ? `/Uploaded_Images/Post_Images/${req.file.filename}` : undefined;

  try {
    const updatedData = {
      title,
      content,
      type,
    };

    if (image) {
      updatedData.image = image;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Post updated successfully", post: posts });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post" });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await User.updateOne(
      { _id: post.author },
      { $pull: { posts: post._id } }
    );

    res.status(200).json({ message: "Post deleted and removed from myposts successfully!" });

  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post and remove from myposts" });
  }
});



module.exports = router