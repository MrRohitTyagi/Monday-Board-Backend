import { Router } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/user-model.js";

import { VerifyToken, generateToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/bcrypt.js";
import otpModel from "../models/otp-Model.js";
import { sendMail } from "../utils/email.js";
import { generateOtp } from "../utils/otp.js";
import { throwEarlyError } from "../middlewares/errorhandeling.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found, please check your credentials and try again",
      });
    }

    const isPassSame = await comparePassword(
      password,
      user.toObject().password
    );

    if (isPassSame === false) {
      return res.status(400).json({
        success: false,
        message:
          "Password is incorrect, please check your password and try again",
      });
    }

    user = user.toObject();
    delete user.password;

    const token = generateToken(user);

    return res.json({
      success: true,
      response: user,
      message: "Login Successfull!",
      token: token,
    });
  } catch (error) {
    console.log("error", error);
    next();
  }
});

authRouter.post("/signup", async (req, res, next) => {
  const { username, email, password, picture } = req.body;
  try {
    const payload = { username, email, password, picture };

    let user = await userModel.create(payload);

    user = user.toObject();
    delete user.password;

    const token = generateToken(user);
    res.json({
      success: true,
      response: user,
      token,
      message: "SignUp successfull",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/change-password", VerifyToken, async (req, res, next) => {
  try {
    const { new_password, otp } = req.body;
    const { _id: user_id } = req.user;

    const otpDoc = await otpModel.findOne({ user_id: user_id });
    if (otpDoc.otp !== otp) {
      return throwEarlyError({ res, message: "Please enter correct OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    await userModel.findByIdAndUpdate(user_id, { password: hashedPassword });

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/resend-otp", VerifyToken, async (req, res) => {
  try {
    await sendOTP(req.user);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/check-password", VerifyToken, async (req, res, next) => {
  const { _id: user_id } = req.user;

  const { password } = req.body;
  try {
    const singleUser = await userModel.findById(user_id);

    const isPassSame = await comparePassword(
      password,
      singleUser.toObject().password
    );

    if (isPassSame === false) {
      return res.status(400).json({
        success: false,
        message:
          "Currect password is incorrect, please check your password and try again",
      });
    }

    const otp = await sendOTP(req.user);

    res.json({ success: true, otp });
  } catch (error) {
    next(error);
  }
});
async function sendOTP(user) {
  const { _id: user_id, email, username } = user;
  const otp = generateOtp();

  await Promise.all([
    otpModel.deleteMany({ user_id: user_id }),
    otpModel.create({ user_id: user_id, otp: otp, isActive: true }),
  ]);

  let htmlTemplate = fs.readFileSync(
    path.join(__dirname, "../utils/otpTemplate.html"),
    "utf-8"
  );

  htmlTemplate = htmlTemplate
    .replace("${user}", username)
    .replace("${otp}", otp);

  sendMail({
    to: email,
    subject: "One time password for account password change",
    html: htmlTemplate,
  });

  return otp;
}

export default authRouter;
