import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const signature = process.env.JWT_SIGNATURE;

export function generateToken(payload) {
  const token = jwt.sign(payload, signature, { expiresIn: "1d" });
  return token;
}

export function VerifyToken(req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (!token || token === "undefined") {
      throw new Error();
    }
    const user = jwt.verify(token, signature);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    res.status(401).send({
      message: "Session Expired. Please login again",
      success: false,
    });
  }
}
