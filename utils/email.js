import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: "Monday Team",
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    return info;
  } catch (error) {
    throw new Error(error);
    console.log(error);
  }
};
