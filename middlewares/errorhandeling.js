// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.log("error=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", err);
  if (err.name === "ValidationError") {
    // Mongoose validation error
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors,
      success: false,
    });
  } else if (err.code === 11000) {
    // Duplicate key error
    return res
      .status(400)
      .json({ message: "Email already exists", success: false });
  } else {
    // General or unknown error
    return res.status(500).json({
      message: err?.message || "Internal Server Error, please try again later",
      success: false,
    });
  }
}

function throwEarlyError({
  res,
  message = "Something went wrong",
  extra = {},
  status = 400,
}) {
  return res.status(status).json({
    success: false,
    message,
    ...extra,
  });
}
export { throwEarlyError };

export default errorHandler;
