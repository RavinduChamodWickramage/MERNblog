const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

const createPost = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    // Check if a thumbnail file is provided in the request
    let thumbnailFileName = null;
    if (req.files && req.files.thumbnail) {
      const thumbnailFile = req.files.thumbnail;
      thumbnailFileName = thumbnailFile.name;

      // Move the thumbnail file to the uploads folder
      const uploadDir = path.join(__dirname, "..", "uploads");
      await thumbnailFile.mv(path.join(uploadDir, thumbnailFileName));
    }

    const newPost = await Post.create({
      title,
      category,
      description,
      thumbnail: thumbnailFileName, // Set thumbnail filename in the database
      creator: req.user.id,
    });

    if (!newPost) {
      return next(new HttpError("Post couldn't be created.", 422));
    }

    // Find user and increase post count by 1
    const currentUser = await User.findById(req.user.id);
    if (currentUser) {
      const userPostCount = currentUser.posts + 1;
      await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
    }

    res.status(201).json(newPost);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const editPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, category, description } = req.body;

    if (!title || !category || description.length < 12) {
      return next(
        new HttpError(
          "Fill in all fields and ensure description is at least 12 characters long.",
          422
        )
      );
    }

    let updatedPost;

    if (req.files) {
      const { thumbnail } = req.files;

      // Check file size
      if (thumbnail.size > 2000000) {
        return next(
          new HttpError("Thumbnail too big. Should be less than 2mb", 422)
        );
      }

      const fileName = thumbnail.name;
      const splittedFilename = fileName.split(".");
      const newFilename =
        splittedFilename[0] +
        uuid() +
        "." +
        splittedFilename[splittedFilename.length - 1];

      // Move the thumbnail to the uploads directory
      thumbnail.mv(
        path.join(__dirname, "..", "uploads", newFilename),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );

      // Update post with new thumbnail
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description, thumbnail: newFilename },
        { new: true }
      );
    } else {
      // If there are no new files, update post without changing the thumbnail
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description },
        { new: true }
      );
    }

    if (!updatedPost) {
      return next(new HttpError("Couldn't update post.", 400));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post unavailable.", 400));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }

    const fileName = post.thumbnail;

    // Delete post before deleting the associated thumbnail
    await Post.findByIdAndDelete(postId);

    // Delete thumbnail from uploads folder
    fs.unlink(path.join(__dirname, "..", "uploads", fileName), async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        // Find user and reduce post count by 1
        const currentUser = await User.findById(req.user.id);
        if (currentUser) {
          const userPostCount = currentUser.posts - 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        }
      }
    });

    res.status(200).json({ message: `Post ${postId} deleted successfully.` });
  } catch (error) {
    return next(
      new HttpError("An error occurred while deleting the post.", 500)
    );
  }
};

module.exports = {
  createPost,
  getPost,
  getPosts,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
