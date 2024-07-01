import { Router } from "express";

import pulse from "../models/pulse-model.js";
import sprintModel from "../models/sprint-model.js";
import { generateNotification } from "../workers/notification.js";
import chatModel from "../models/chat-model.js";

const pulseRouter = Router();

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
  const { priority, status, tag, timeline, title, sprint: sprintID } = req.body;
  try {
    const createdPulse = await pulse.create({
      priority,
      status,
      tag,
      timeline,
      title,
    });
    const sprint = await sprintModel.findById(sprintID);
    sprint.pulses = [...sprint.pulses, createdPulse._id.toString()];
    await sprint.save();

    res.json({ success: true, response: createdPulse });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

pulseRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;

  const { boardId, ...body } = req.body;
  const assigned = body?.assigned || [];
  try {
    let updatedPulse = await pulse.findByIdAndUpdate(id, body, { new: true });
    res.json({ success: true, response: updatedPulse.toObject() });

    if (assigned?.length === 0) return; // other pulse updates

    updatedPulse = await updatedPulse.toObject();
    updatedPulse = { ...updatedPulse, assigned: [assigned[0]] };

    ///////////////////////GENERATE NOTIFICATION////////////////////////////////////////

    const notificationPayload = {
      data: { boardId: boardId, pulseId: updatedPulse._id.toString() },
      chat: {},
      user: req.user,
      type: "ASSIGNED_TO",
      updatedPulse: updatedPulse,
    };

    generateNotification(notificationPayload);
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

pulseRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pulse.findByIdAndDelete(id);
    await chatModel.deleteMany({ pulseId: id });
    res.json({ success: true, response: "Pulse deleted successfully!" });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

pulseRouter.delete("/delete-bulk/", async (req, res) => {
  const { pulses } = req.body;
  const promises = [];

  try {
    for (const pulseID of pulses) {
      promises.push(pulse.findByIdAndDelete(pulseID));
      promises.push(chatModel.deleteMany({ pulseId: pulseID }));
    }
    await Promise.all(promises);

    res.json({
      success: true,
      response: "Pulses deleted successfully!",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

pulseRouter.put("/move-bulk/", async (req, res) => {
  const { pulses, toSprint } = req.body;
  const promises = [];

  try {
    const sprintsConfig = {};

    for (const pulse of pulses) {
      sprintsConfig[pulse.sprintID] = [
        ...(sprintsConfig[pulse.sprintID] || []),
        pulse._id,
      ];
    }

    for (const sprintID in sprintsConfig) {
      const eachSprint = await sprintModel.findById(sprintID);

      eachSprint.pulses = [...eachSprint.pulses].filter((p) => {
        if (sprintsConfig[sprintID].includes(p.toString())) {
          return false;
        } else return true;
      });
      promises.push(eachSprint.save());
    }

    const addToSprint = await sprintModel.findById(toSprint);

    const unique = Array.from(
      new Set([...addToSprint.pulses, ...pulses.map((p) => p._id)])
    );
    addToSprint.pulses = [...unique];
    promises.push(addToSprint.save());

    await Promise.all(promises);

    res.json({
      success: true,
      response: "Pulses moved successfully!",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
});

export default pulseRouter;
