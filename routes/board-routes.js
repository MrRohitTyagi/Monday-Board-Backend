import { Router } from "express";
import board from "../models/board-model.js";
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
    const singleBoard = await board.findById(id);
    res.json({ success: true, response: singleBoard });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

boardRouter.post("/create", async (req, res) => {
  const { description, picture, title } = req.body;
  try {
    const createdBoard = await board.create({
      description,
      picture,
      title,
    });
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

export default boardRouter;
