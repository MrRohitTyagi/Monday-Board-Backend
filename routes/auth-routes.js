import { Router } from "express";
import user from "../models/user-model.js";
import { VerifyToken } from "../utils/jwt.js";
const authRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

authRouter.get("/login", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    console.log('token',token)
    const decodedUser = VerifyToken(token);
    return res.send({ token, decodedUser });
    const users = await user.find();

    res.json({ count: users.length, success: true, response: users });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

export default authRouter;
