const express = require('express');
const router = express.Router();
const multer = require('multer');
const app = express()
const path = require('path');
const User = require('../Models/UserModel');
const cookieParser = require('cookie-parser');
const Post = require('../Models/AllPosts');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

app.use(cookieParser());

dotenv.config({
  path: './.env'
})

const secretcode = process.env.SECRET_CODE;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploaded_Images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png',
    'image/jpeg',
    'image/jpg',
  ];

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


router.post('/editprofile', upload.single('profile'), async (req, res) => {
  try {
    const { id, name, profession, city } = req.body;
    const user_name = await User.findOne({ name });

    if (user_name !== null) {
      return res.status(200).json({
        message: "Username Already Exists",
        success: false
      })
    }

    if (!id) {
      return res.status(400).json({ message: 'User ID is required for updating profile.' });
    }


    const updateData = {};
    if (name) updateData.name = name;
    if (profession) updateData.profession = profession;
    if (city) updateData.city = city;
    if (req.file) {
      updateData.profile = `/Uploaded_Images/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

   
    const postUpdateData = {};
    if (req.file) postUpdateData.authorImage = `/Uploaded_Images/${req.file.filename}`;

   
    await Post.updateMany(
      { 'author': id }, 
      { $set: postUpdateData }
    );

    if (name || req.file) {
      const posts = await Post.find({ 'comments.userId': id });
      for (const post of posts) {
        post.comments = post.comments.map((comment) => {
          if (comment.userId.toString() === id) {
            if (name) comment.userName = name; 
            if (req.file) comment.userImage = `/Uploaded_Images/${req.file.filename}`; 
          }
          return comment;
        });
        await post.save();
      }
    }

    if (updatedUser) {
      res.status(200).json({
        message: "Welcome ",
        user: updateData,
        success: true
      })
    }

  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_CODE, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.FRONTEND_URL}/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `Click on the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Password reset email sent" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_CODE);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;