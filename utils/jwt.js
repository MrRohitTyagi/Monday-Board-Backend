import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signature = process.env.JWT_SIGNATURE;

export function generateToken(payload) {
  const token = jwt.sign(payload, signature, { expiresIn: "1d" });
  return token;
}

export function VerifyToken(req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      const customError = new Error("User Not Authorized");
      customError.code = 401;
      throw customError;
    }
    const user = jwt.verify(token, signature);
    if (user) {
      req.user = user;
    }
    console.log("user", user);
    next();
  } catch (error) {
    console.log("error", error);
    const customError = new Error("Session Expired");
    customError.code = 401;
    throw customError;
  }
}
