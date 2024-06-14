import { Router } from "express";
import pulse from "../models/pulse-model.js";
const pulseRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

pulseRouter.get("/get-all", async (req, res) => {
  try {
    const pulses = await pulse.find();

    res.json({ count: pulses.length, success: true, response: pulses });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

pulseRouter.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singlePulses = await pulse.findById(id);
    res.json({ success: true, response: singlePulses });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

pulseRouter.post("/create", async (req, res) => {
  const { priority, status, tag, timeline, title } = req.body;
  try {
    const createdPulse = await pulse.create({
      priority,
      status,
      tag,
      timeline,
      title,
    });
    res.json({ success: true, response: createdPulse });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

pulseRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { key, value } = req.body;
  try {
    const updatedPulse = await pulse.findByIdAndUpdate(
      id,
      { [key]: value },
      { new: true }
    );
    res.json({ success: true, response: updatedPulse });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

pulseRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pulse.findByIdAndDelete(id);
    res.json({ success: true, response: "Pulse deleted successfully!" });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

export default pulseRouter;
