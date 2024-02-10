// const notFound = (req, res, next) => {
//   const  error = new Error(`Not found - ${req.originalUrl}`);
//   res.status(404);
//   next(error)
// }

// // const errorHandler = (error, req, res, next) => {
// //   if(res.headerSent) {
// //     return next(error)
// //   }

// //   res.status(error.code || 500).json({message: error.message || "An unknown error occured"})
// // }

// const HttpError = require("../models/errorModel");

// const errorHandler = (err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   res
//     .status(err.code || 500)
//     .json({ message: err.message || "An unknown error occurred." });
// };

// // const errorHandler = (error, req, res, next) => {
// //   const statusCode = error.code || 500;
// //   const message = error.message || "An unknown error occurred";
// //   res.status(statusCode).json({ message });
// // };

// module.exports = { notFound, errorHandler };

const HttpError = require("../models/errorModel");

const notFound = (req, res, next) => {
  const error = new HttpError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred." });
};

module.exports = { notFound, errorHandler };
