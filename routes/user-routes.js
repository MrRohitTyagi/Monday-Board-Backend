import { Router } from "express";
import user from "../models/user-model.js";
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
  const { id } = req.params;
  const user_id = req?.user?._id;
  try {
    const singleUser = await user
      .findById(user_id || id)
      .populate([{ path: "boards", select: "_id picture title" }])
      .select("-password");

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

export default userRouter;
