import express from "express";

import { sendMail } from "../utils/email.js";

import OTP from "../models/otp-Model.js";
import invitationModel from "../models/invitation-model.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const emailRouter = express.Router();

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// emailRouter.post("/send-otp", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const stamp = Date.now().toString();
//     const token = stamp.substring(stamp.length - 4);

//     await OTP.create({ email, token, isActive: true });
//     sendMail(token, email);
//     res.send({ success: true, message: "Token sent successfully" });
//   } catch (error) {
//     console.log("error", error);
//   }
// });

emailRouter.post("/verify-otp", async (req, res) => {
  const { _id: user_id } = req.user;
  try {
    const { otp } = req.body;
    const response = await OTP.findOne({ user_id: user_id, otp: otp });

    if (!response) {
      res
        .status(400)
        .send({ success: false, message: "Please enter correct otp" });
    }

    if (response.isActive) {
      await OTP.findByIdAndUpdate(response._id.toString(), {
        isActive: false,
      });
      res.send({ success: true, message: "Varification successfull" });
    } else {
      res.status(400).send({
        success: false,
        message: "This top is Expired please genrate new one and try again",
      });
    }
  } catch (error) {
    console.log("error", error);
  }
});

emailRouter.post("/send-invite", async (req, res, next) => {
  const feUrl = req.headers["referer"];
  try {
    const {
      to = "",
      extra = "",
      from = "",
      board: board_id = "",
      board_name = "",
    } = req.body;

    if (!to || !board_id) {
      return res.status(400).json({
        message: !to ? "Email is required" : "Board is required",
        success: false,
      });
    }

    const invitation = await invitationModel.create({
      board_id: board_id,
      board_name: board_name,
      extra: extra,
      from: from,
      to: to,
    });
    // return res.send();
    let htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../utils/emailTemplate.html"),
      "utf-8"
    );

    const url = `${feUrl}invite?invitation_id=${invitation._id}`;

    htmlTemplate = htmlTemplate
      .replace("${from}", from)
      .replace("${board_name}", board_name)
      .replace("${url}", url);

    const subject = `${board_name} invitation`;
    const text = `Hi \nGreatings of the day`;
    const html = htmlTemplate;

    await sendMail({ to: to, subject: subject, text: text, html });

    res.send({
      success: true,
      message: "Invite sent successfully",
    });
  } catch (error) {
    next(error);
  }
});
export default emailRouter;
