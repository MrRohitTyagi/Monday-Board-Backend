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
    return jwt.verify(token, signature);
  } catch (error) {
    const customError = new Error("Session Expired");
    customError.code = 401;
    throw customError;
  }
}
