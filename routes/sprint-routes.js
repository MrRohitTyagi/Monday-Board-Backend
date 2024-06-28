import { Router } from "express";
import sprint from "../models/sprint-model.js";
import boardModel from "../models/board-model.js";
import pulseModel from "../models/pulse-model.js";
import chatModel from "../models/chat-model.js";
import threadModel from "../models/thread-model.js";

const sprintRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

sprintRouter.get("/get-all", async (req, res) => {
  try {
    const sprints = await sprint.find();

    res.json({ count: sprints.length, success: true, response: sprints });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

sprintRouter.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleSprint = await sprint.findById(id).populate({ path: "pulses" });
    res.json({ success: true, response: singleSprint });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

sprintRouter.post("/create", async (req, res) => {
  const { color, title, board: boardID } = req.body;
  try {
    const createdSprint = await sprint.create({
      color,
      title,
    });
    const board = await boardModel.findById(boardID);
    board.sprints = [createdSprint._id.toString(), ...board.sprints];
    await board.save();
    res.json({ success: true, response: createdSprint });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

sprintRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const updatedSprint = await sprint
      .findByIdAndUpdate(id, body, {
        new: true,
      })
      .populate("pulses");
    res.json({ success: true, response: updatedSprint });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

sprintRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSprint = await sprint.findByIdAndDelete(id);
    const promises = [];

    deletedSprint.pulses.forEach((p) => {
      promises.push(pulseModel.findByIdAndDelete(p.toString()));
      promises.push(chatModel.deleteMany({ pulseId: p.toString() }));
      promises.push(threadModel.deleteMany({ pulseId: p.toString() }));
    });

    const board = await boardModel.findOne({ sprints: id });
    board.sprints = board.sprints.filter((s) => s.toString() !== id);

    promises.push(board.save());

    await Promise.all(promises);

    res.json({ success: true, response: "Sprint deleted successfully!" });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

export default sprintRouter;
