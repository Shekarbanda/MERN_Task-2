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

// File filter to accept only images
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
    limits: { fileSize: 20 * 1024 * 1024 }, // Limit: 5 MB
});

router.post('/', upload.single('image'), async (req, res) => {
    const { title, content, userId, postType } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Convert userId to ObjectId
    const author = new mongoose.Types.ObjectId(userId);

    // Fetch author image from the User model
    let authorImage = '';
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        authorImage = user.profile; // Assuming the `image` field in the User model stores the image path or URL
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }

    let image = '';
    if (req.file) {
        image = `/Uploaded_Images/Post_Images/${req.file.filename}`; // Store the relative path of the post image
    }

    try {
        // Create a new post with author image included
        const newPost = new Post({
            title,
            content,
            postType,
            image, // Post image
            author, // Author's ObjectId
            authorImage, // Author's image URL/path
        });

        // Save post to the database
        await newPost.save();

        // Add the post ID to the user's posts array
        await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

        res.status(201).json({ message: 'Post created successfully!', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

router.get('/',async (req,res)=>{
    try {
        // Fetch all posts, populate the 'author' field to get user details
        const posts = await Post.find()
            .populate('author', 'name email') // Populate 'author' with user details (e.g., name, email)
            .sort({ createdAt: -1 });  // Sort posts by creation date (newest first)
        
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        // Return the posts in the response
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});

router.put('/like/:postId', async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        // Fetch the post by ID
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Initialize `likes` as an array if it doesn't exist
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        // Check if the user has already liked the post
        const userIndex = post.likes.findIndex((id) => id.toString() === userId);

        if (userIndex === -1) {
            // If not liked, add the userId to the `likes` array
            post.likes.push(userId);
        } else {
            // If already liked, remove the userId from the `likes` array
            post.likes.splice(userIndex, 1);
        }

        // Save the updated post
        await post.save();

        res.status(200).json({ 
            message: userIndex === -1 ? 'Post liked successfully' : 'Post disliked successfully',
            likesCount: post.likes.length, // Send updated likes count for frontend display
            post 
        });
    } catch (error) {
        console.error('Error handling like:', error.message);
        res.status(500).json({ message: 'Error liking/disliking post', error: error.message });
    }
});
  

// Add comment to a post
router.post('/comment/:postId', async (req, res) => {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    try {
        // Validate postId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a comment object with user's details
        console.log(user.profile)
        const newComment = {
            userId,
            comment,
            userName: user?.name,   // Fetch user name from User model
            userImage: user?.profile, // Fetch user image from User model
            createdAt: new Date(),
        };

        // Add the comment to the post's comments array
        const post = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment } },
            { new: true } // Return the updated document
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Comment added successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
});


router.post('/myposts', async (req, res) => {
    try {
      const {userId} = req.body; 
      const posts = await Post.find({ author: userId }).sort({ createdAt: -1 }); // Fetch user's posts sorted by date
      res.status(200).json({ success: true, posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching posts' });
    }
  });

  router.put("/update/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { title, content, type } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  
    try {
      const updatedData = {
        title,
        content,
        type,
      };
  
      // Add image path if a new image is uploaded
      if (image) {
        updatedData.image = image;
      }
  
      const updatedPost = await Post.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
      });
  
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      const posts = await Post.find()
      .populate('author', 'name email') // Populate 'author' with user details (e.g., name, email)
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
      // 1. Find and delete the post from the posts collection
      const post = await Post.findByIdAndDelete(id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // 2. Remove the postId from the user's myposts array
      // Assuming the post's `author` field contains the user's ID
      await User.updateOne(
        { _id: post.author },
        { $pull: { posts: post._id } } // Remove post ID from the `myposts` array
      );
  
      res.status(200).json({ message: "Post deleted and removed from myposts successfully!" });
  
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post and remove from myposts" });
    }
  });

  

module.exports = router