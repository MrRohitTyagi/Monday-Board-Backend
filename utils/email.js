import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rt2tyagi4366@gmail.com",
        pass: "zxgwqvztssxfjlmu",
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
    console.log(error);
    res.status(400).send("ni gya");
  }
};
