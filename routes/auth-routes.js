import { Router } from "express";
import userModel from "../models/user-model.js";
import { comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
const authRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.json({
        success: true,
        message: "User not found, please check your credentials and try again",
      });
    }

    const isPassSame = await comparePassword(
      password,
      user.toObject().password
    );

    if (isPassSame === false) {
      return res.json({
        success: false,
        message: "Password does not match, Please enter the corrent password",
      });
    }

    return res.json({
      success: false,
      response: user.toObject(),
      message: "Login Successfull!",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});
authRouter.post("/signup", async (req, res) => {
  const { username, email, password, org, picture } = req.body;
  try {
    let user = await userModel.create({
      username,
      email,
      password,
      org,
      picture,
    });

    user = user.toObject();
    delete user.password;

    const token = generateToken(user);
    res.json({ success: true, response: user, token });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

export default authRouter;
