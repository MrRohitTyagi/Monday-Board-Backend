import { Router } from "express";
import board from "../models/board-model.js";
import userModel from "../models/user-model.js";
const boardRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

boardRouter.get("/get-all", async (req, res) => {
  try {
    const boards = await board.find();

    res.json({ count: boards.length, success: true, response: boards });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

boardRouter.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleBoard = await board.findById(id).populate([
      { path: "admins", select: "_id picture username" },
      { path: "members", select: "_id picture username" },
    ]);

    res.json({ success: true, response: singleBoard });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

boardRouter.post("/create", async (req, res) => {
  const body = req.body;
  try {
    const createdBoard = await board.create(body);

    const user = await userModel.findById([createdBoard.admins[0]]);
    user.boards = [...user.boards, createdBoard._id.toString()];
    await user.save();

    res.json({ success: true, response: createdBoard });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

boardRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const updatedBoard = await board.findByIdAndUpdate(id, body, { new: true });

    res.json({ success: true, response: updatedBoard });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

boardRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await board.findByIdAndDelete(id);
    res.json({ success: true, response: "Pulse deleted successfully!" });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

boardRouter.get("/get-assigned/", async (req, res) => {
  const { _id } = req.user;
  try {
    const singleBoard = await board
      .find({
        $or: [{ admins: _id }, { members: _id }],
      })
      .populate([
        { path: "admins", select: "_id picture username" },
        { path: "members", select: "_id picture username" },
        {
          path: "sprints",
          populate: {
            path: "pulses",
          },
        },
      ]);

    res.json({ success: true, response: singleBoard });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

export default boardRouter;
