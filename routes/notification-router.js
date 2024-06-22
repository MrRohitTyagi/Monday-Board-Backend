import { Router } from "express";
import notificationModel from "../models/notification-model.js";

const notificationRouter = Router();

notificationRouter.get("/get/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const singleSprint = await notificationModel
      .find({ attachedUser: user_id })
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

export default notificationRouter;
