// // const {Schema, model} = require('mongoose')

// // const userSchema = new Schema ({
// //   name: {type: String, required: true},
// //   email: {type: String, required: true},
// //   password: {type: String, required: true},
// //   avatar: {type: String},
// //   posts: {type: Number, default: 0}
// // })

// // module.exports = model('User', userSchema)

// const { Schema, model } = require("mongoose");

// const userSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   avatar: { type: String },
//   posts: { type: Number, default: 0 },
// });

// module.exports = model("User", userSchema);

// userModel.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  posts: { type: Number, default: 0 },
});

module.exports = model("User", userSchema);
