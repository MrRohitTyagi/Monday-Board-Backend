import { Router } from "express";
import sprint from "../models/sprint-model.js";
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
  const { color, title } = req.body;
  try {
    const createdSprint = await sprint.create({
      color,
      title,
    });
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
    const updatedSprint = await sprint.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.json({ success: true, response: updatedSprint });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

sprintRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sprint.findByIdAndDelete(id);
    res.json({ success: true, response: "Pulse deleted successfully!" });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

export default sprintRouter;
