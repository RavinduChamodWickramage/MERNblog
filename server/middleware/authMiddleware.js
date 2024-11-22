const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(new HttpError("Unauthorized. No token", 402));
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return next(new HttpError("Unauthorized. Invalid token.", 403));
    }
    req.user = decodedToken;
    next();
  });
};

module.exports = authMiddleware;
