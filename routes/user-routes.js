import { Router } from "express";
import user from "../models/user-model.js";
import { throwEarlyError } from "../middlewares/errorhandeling.js";
import { comparePassword } from "../utils/bcrypt.js";
import otpModel from "../models/otp-Model.js";
import { sendMail } from "../utils/email.js";
import { generateOtp } from "../utils/otp.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

userRouter.get("/get-all", async (req, res) => {
  try {
    const users = await user.find();

    res.json({ count: users.length, success: true, response: users });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: false,
      message: error.message || "something went wrong",
    });
  }
});

userRouter.get("/get/:id", async (req, res) => {
  const user_id = req?.user?._id;
  try {
    const singleUser = await user
      .findById(user_id)
      .populate([
        {
          path: "boards",
          populate: { path: "members admins", select: "_id username" },
        },
      ])
      .select("-password");

    if (!singleUser) {
      return throwEarlyError({
        res,
        message: "User not fount , please login again",
        status: 401,
      });
    }

    res.json({ success: true, response: singleUser });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: false,
      message: error.message || "something went wrong",
    });
  }
});

userRouter.post("/create", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const createdUser = await user.create({ username, email, password });
    res.json({ success: true, response: createdUser });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: false,
      message: error.message || "something went wrong",
    });
  }
});

userRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const user_id = req?.user?._id;
  try {
    const updatedUser = await user.findByIdAndUpdate(user_id || id, body, {
      new: true,
    });
    res.json({ success: true, response: updatedUser });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: false,
      message: error.message || "something went wrong",
    });
  }
});

userRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await user.findByIdAndDelete(id);
    res.json({ success: true, response: "User deleted successfully!" });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: false,
      message: error.message || "something went wrong",
    });
  }
});

userRouter.post("/change-password", async (req, res) => {
  const { _id: user_id, email, username } = req?.user;

  const { password } = req.body;
  try {
    const singleUser = await user.findById(user_id);

    const isPassSame = await comparePassword(
      password,
      singleUser.toObject().password
    );

    if (isPassSame === false) {
      return res.status(400).json({
        success: false,
        message:
          "Password is incorrect, please check your password and try again",
      });
    }
    const otp = generateOtp();

    await otpModel.deleteMany({ user_id: user_id });

    await otpModel.create({ user_id: user_id, otp: otp, isActive: true });

    res.json({ success: true });

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
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      success: false,
      message: error.message || "something went wrong",
    });
  }
});

export default userRouter;
