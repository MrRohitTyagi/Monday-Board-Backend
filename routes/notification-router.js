import { Router } from "express";
import notificationModel from "../models/notification-model.js";

const notificationRouter = Router();

notificationRouter.get("/get/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const singleSprint = await notificationModel
      .find({ attachedUser: user_id })
      .sort({ createdAt: -1 })
      .populate([
        { path: "createdBy", select: "_id picture username" },
        { path: "attachedUser", select: "_id picture username" },
        { path: "attachedPulse", select: "_id title" },
      ]);
    res.json({ success: true, response: singleSprint });
  } catch (error) {
    next(error);
  }
});

notificationRouter.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await notificationModel.findByIdAndDelete(id);
    res.json({ success: true, response: "Notification deleted successfully!" });
  } catch (error) {
    next(error);
  }
});

notificationRouter.put("/update/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const body = req.body;
  try {
    await notificationModel.findByIdAndUpdate(_id, body);
    res.json({ success: true, response: "Notification Updated successfully!" });
  } catch (error) {
    next(error);
  }
});

export default notificationRouter;
