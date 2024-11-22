const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const User = require("../models/userModel");
const HttpError = require("../models/errorModel");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password || !password2) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters.", 422)
      );
    }

    if (password !== password2) {
      return next(new HttpError("Passwords do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPassword,
    });
    res.status(201).json(`New user ${newUser.email} registered.`);
  } catch (error) {
    return next(new HttpError("User registration failed.", 422));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Invalid credentials.", 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Invalid credentials.", 422));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login failed. Please check your credentials.", 422)
    );
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError("Failed to fetch user.", 500));
  }
};

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      // Multer stores the uploaded file in req.file, not req.files
      return next(new HttpError("Please choose an image.", 422));
    }

    const avatar = req.file;

    // Validate file size (max 500KB)
    if (avatar.size > 500000) {
      return next(
        new HttpError(
          "Profile picture too big. Should be less than 500KB.",
          422
        )
      );
    }

    // Validate file type (ensure it's an image)
    if (!avatar.mimetype.startsWith("image/")) {
      return next(new HttpError("Only image files are allowed.", 422));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    // If user already has an avatar, delete it
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError("Error deleting previous avatar.", 500));
        }
      });
    }

    // Generate a unique filename for the new avatar
    const newFilename = uuid() + path.extname(avatar.originalname);

    // Ensure the uploads directory exists
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Move the file to the uploads directory
    const uploadPathFile = path.join(uploadPath, newFilename);
    fs.rename(avatar.path, uploadPathFile, async (err) => {
      if (err) {
        return next(new HttpError("Error uploading avatar.", 500));
      }

      // Update the user's avatar in the database
      const updatedAvatar = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: newFilename },
        { new: true }
      );

      if (!updatedAvatar) {
        return next(new HttpError("Avatar couldn't be changed.", 422));
      }

      // Send updated user data with new avatar
      res.status(200).json(updatedAvatar);
    });
  } catch (error) {
    return next(
      new HttpError("An error occurred while processing the request.", 500)
    );
  }
};

const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found.", 403));
    }

    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id.toString() !== req.user.id) {
      return next(new HttpError("Email already exists.", 422));
    }

    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return next(new HttpError("Invalid current password.", 422));
    }

    if (newPassword !== confirmNewPassword) {
      return next(new HttpError("New passwords do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hash },
      { new: true }
    );

    if (!newInfo) {
      return next(
        new HttpError("Failed to update user details: Database error.", 500)
      );
    }

    res.status(200).json(newInfo);
  } catch (error) {
    return next(
      new HttpError(
        "Failed to update user details: Internal server error.",
        500
      )
    );
  }
};

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    if (!authors || authors.length === 0) {
      return next(new HttpError("No authors found.", 404));
    }
    res.status(200).json(authors);
  } catch (error) {
    return next(new HttpError("Failed to fetch authors.", 500));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
