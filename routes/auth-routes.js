import { Router } from "express";
import userModel from "../models/user-model.js";
import { comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
const authRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found, please check your credentials and try again",
      });
    }

    const isPassSame = await comparePassword(
      password,
      user.toObject().password
    );

    console.log({ isPassSame, password, user });

    if (isPassSame === false) {
      return res.status(409).json({
        success: false,
        message: "Password does not match, Please enter the corrent password",
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
    next();
  }
});

authRouter.post("/signup", async (req, res, next) => {
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

export default authRouter;
