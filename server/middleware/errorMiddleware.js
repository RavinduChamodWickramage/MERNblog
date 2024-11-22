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
