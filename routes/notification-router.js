import { Router } from "express";
import notificationModel from "../models/notification-model.js";

const notificationRouter = Router();

notificationRouter.get("/get/:user_id", async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const notifications = await notificationModel
      .find({ attachedUser: user_id })
      .sort({ createdAt: -1 })
      .populate([
        { path: "createdBy", select: "_id picture username" },
        { path: "attachedUser", select: "_id picture username" },
        { path: "attachedPulse", select: "_id title" },
      ]);
    res.json({ success: true, response: notifications });
  } catch (error) {
    next(error);
  }
});

notificationRouter.delete("/delete/:noti_id", async (req, res, next) => {
  const { noti_id } = req.params;
  try {
    await notificationModel.findByIdAndDelete(noti_id);
    res.json({ success: true, response: "Notification deleted successfully!" });
  } catch (error) {
    next(error);
  }
});

notificationRouter.delete("/delete-all/:user_id", async (req, res, next) => {
  const { user_id } = req.params;
  try {
    await notificationModel.deleteMany({ attachedUser: user_id });
    res.json({
      success: true,
      response: "Notifications deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
});
notificationRouter.put("/read-all/:user_id", async (req, res, next) => {
  const { user_id } = req.params;
  try {
    await notificationModel.updateMany(
      { attachedUser: user_id },
      { seen: true }
    );
    res.json({ success: true, response: "All notifications marked as read" });
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
