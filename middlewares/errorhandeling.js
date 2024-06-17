// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    // Mongoose validation error
    return res
      .status(400)
      .json({
        message: "Validation Error",
        errors: err.errors,
        success: false,
      });
  } else if (err.code === 11000) {
    // Duplicate key error
    return res
      .status(409)
      .json({ message: "Email already exists", success: false });
  } else {
    // General or unknown error
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
}

export default errorHandler;
