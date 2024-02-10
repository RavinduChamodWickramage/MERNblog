// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");
// const path = require("path");
// const { v4: uuid } = require("uuid");
// const User = require("../models/userModel");
// const HttpError = require("../models/errorModel");

// // POST: api/users/register
// const registerUser = async (req, res, next) => {
//   try {
//     const { name, email, password, password2 } = req.body;
//     if (!name || !email || !password || !password2) {
//       return next(new HttpError("Fill in all fields.", 422));
//     }

//     const newEmail = email.toLowerCase();
//     const emailExists = await User.findOne({ email: newEmail });
//     if (emailExists) {
//       return next(new HttpError("Email already exists.", 422));
//     }

//     if (password.trim().length < 6) {
//       return next(
//         new HttpError("Password should be at least 6 characters.", 422)
//       );
//     }

//     if (password !== password2) {
//       return next(new HttpError("Passwords do not match.", 422));
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newUser = await User.create({
//       name,
//       email: newEmail,
//       password: hashedPassword,
//     });
//     res.status(201).json(`New user ${newUser.email} registered.`);
//   } catch (error) {
//     return next(new HttpError("User registration failed.", 422));
//   }
// };

// // POST: api/users/login
// const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return next(new HttpError("Fill in all fields.", 422));
//     }

//     const newEmail = email.toLowerCase();

//     const user = await User.findOne({ email: newEmail });
//     if (!user) {
//       return next(new HttpError("Invalid credentials.", 422));
//     }

//     const comparePass = await bcrypt.compare(password, user.password);
//     if (!comparePass) {
//       return next(new HttpError("Invalid credentials.", 422));
//     }

//     const { _id: id, name } = user;
//     const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(200).json({ token, id, name });
//   } catch (error) {
//     return next(
//       new HttpError("Login failed. Please check your credentials.", 422)
//     );
//   }
// };

// // POST: api/users/:id
// const getUser = async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return next(new HttpError("User not found.", 404));
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     return next(new HttpError("Failed to fetch user.", 500));
//   }
// };

// // // POST: api/users/change-avatar
// const changeAvatar = async (req, res, next) => {
//   try {
//     if (!req.files || !req.files.avatar) {
//       return next(new HttpError("Please choose an image.", 422));
//     }

//     /* find user from database */
//     const user = await User.findById(req.user.id);

//     /* delete old avatar if exists */
//     if (user.avatar) {
//       fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
//         if (err) {
//           return next(new HttpError(err));
//         }
//       });
//     }

//     const avatar = req.files.avatar;

//     // Check file size
//     if (avatar.size > 500000) {
//       return next(
//         new HttpError("Profile picture too big. Should be less than 500kb"),
//         422
//       );
//     }

//     let fileName = avatar.name;
//     let splittedFilename = fileName.split(".");
//     let newFilename =
//       splittedFilename[0] +
//       uuid() +
//       "." +
//       splittedFilename[splittedFilename.length - 1];
//     avatar.mv(
//       path.join(__dirname, "..", "uploads", newFilename),
//       async (err) => {
//         if (err) {
//           return next(new HttpError(err));
//         }

//         try {
//           const updatedAvatar = await User.findByIdAndUpdate(
//             req.user.id,
//             { avatar: newFilename },
//             { new: true }
//           );
//           if (!updatedAvatar) {
//             return next(new HttpError("Avatar couldn't be changed.", 422));
//           }
//           res.status(200).json(updatedAvatar);
//         } catch (error) {
//           return next(new HttpError("Error updating user avatar.", 500));
//         }
//       }
//     );
//   } catch (error) {
//     return next(
//       new HttpError("An error occurred while processing the request.", 500)
//     );
//   }
// };

// // const changeAvatar = async (req, res, next) => {
// //   try {
// //     if (!req.files || !req.files.avatar) {
// //       return next(new HttpError("Please choose an image.", 422));
// //     }

// //     // find user from database
// //     const avatar = req.files.avatar;
// //     const user = await User.findById(req.user.id);

// //     if (user.avatar) {
// //       try {
// //         fs.unlinkSync(path.join(__dirname, "..", "uploads", user.avatar));
// //       } catch (error) {
// //         console.error("Error deleting old avatar:", error);
// //         // Handle error deleting old avatar
// //       }
// //     }

// //     if (avatar.size > 500000) {
// //       return next(
// //         new HttpError("Profile picture too big. Should be less than 500kb", 422)
// //       );
// //     }

// //     const fileName = avatar.name;
// //     const fileExtension = fileName.split(".").pop();
// //     const newFilename = `${uuid()}.${fileExtension}`;

// //     avatar.mv(
// //       path.join(__dirname, "..", "uploads", newFilename),
// //       async (err) => {
// //         if (err) {
// //           console.error("Error saving avatar:", err);
// //           return next(new HttpError("Error saving avatar.", 500));
// //         }

// //         try {
// //           const updatedUser = await User.findByIdAndUpdate(
// //             req.user.id,
// //             { avatar: newFilename },
// //             { new: true }
// //           );
// //           if (!updatedUser) {
// //             return next(new HttpError("Avatar couldn't be changed.", 422));
// //           }
// //           res.status(200).json({ avatar: updatedUser.avatar });
// //         } catch (error) {
// //           console.error("Error updating user avatar:", error);
// //           return next(new HttpError("Error updating user avatar.", 500));
// //         }
// //       }
// //     );
// //   } catch (error) {
// //     console.error("An error occurred while processing the request:", error);
// //     return next(
// //       new HttpError("An error occurred while processing the request.", 500)
// //     );
// //   }
// // };


// // POST: api/users/edit-user
// const editUser = async (req, res, next) => {
//   try {
//     const { name, email, currentPassword, newPassword, confirmNewPassword } =
//       req.body;
//     if (!name || !email || !currentPassword || !newPassword) {
//       return next(new HttpError("Fill in all fields.", 422));
//     }

//     // Get user from database
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return next(new HttpError("User not found.", 403));
//     }

//     // Make sure new email doesn't already exist
//     const emailExist = await User.findOne({ email });
//     if (emailExist && emailExist._id.toString() !== req.user.id) {
//       return next(new HttpError("Email already exists.", 422));
//     }

//     // Compare current password to db password
//     const validateUserPassword = await bcrypt.compare(
//       currentPassword,
//       user.password
//     );
//     if (!validateUserPassword) {
//       return next(new HttpError("Invalid current password.", 422));
//     }

//     // Compare new passwords
//     if (newPassword !== confirmNewPassword) {
//       return next(new HttpError("New passwords do not match.", 422));
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(newPassword, salt);

//     // Update user info in database
//     const newInfo = await User.findByIdAndUpdate(
//       req.user.id,
//       { name, email, password: hash },
//       { new: true }
//     );

//     if (!newInfo) {
//       return next(
//         new HttpError("Failed to update user details: Database error.", 500)
//       );
//     }

//     res.status(200).json(newInfo);
//   } catch (error) {
//     return next(
//       new HttpError(
//         "Failed to update user details: Internal server error.",
//         500
//       )
//     );
//   }
// };

// // POST: api/users/authors
// const getAuthors = async (req, res, next) => {
//   try {
//     const authors = await User.find().select("-password");
//     if (!authors || authors.length === 0) {
//       return next(new HttpError("No authors found.", 404));
//     }
//     res.status(200).json(authors);
//   } catch (error) {
//     return next(new HttpError("Failed to fetch authors.", 500));
//   }
// };


// module.exports = {
//   registerUser,
//   loginUser,
//   getUser,
//   changeAvatar,
//   editUser,
//   getAuthors,
// };

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
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("Please choose an image.", 422));
    }

    const user = await User.findById(req.user.id);

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    const avatar = req.files.avatar;

    if (avatar.size > 500000) {
      return next(
        new HttpError("Profile picture too big. Should be less than 500kb"),
        422
      );
    }

    let fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFilename),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        try {
          const updatedAvatar = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: newFilename },
            { new: true }
          );
          if (!updatedAvatar) {
            return next(new HttpError("Avatar couldn't be changed.", 422));
          }
          res.status(200).json(updatedAvatar);
        } catch (error) {
          return next(new HttpError("Error updating user avatar.", 500));
        }
      }
    );
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
