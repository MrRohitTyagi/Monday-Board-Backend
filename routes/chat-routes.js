import { Router } from "express";

import chatModel from "../models/chat-model.js";

const chatRouter = Router();

chatRouter.get("/get-single/:_id", async (req, res, next) => {
  try {
    const _id = req.params._id;
    const chat = await chatModel.findById(_id);

    res.json({ success: true, response: chat });
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/get/:pulse_id", async (req, res, next) => {
  const { pulse_id } = req.params;
  try {
    const chatsBelongsToAPulse = await chatModel
      .find({ pulseId: pulse_id })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "thread",
          populate: { path: "createdBy", select: "username picture _id" },
        },
        { path: "createdBy", select: "username picture _id" },
      ]);
    res.json({ success: true, response: chatsBelongsToAPulse });
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/create", async (req, res, next) => {
  const { content, draft, pulseId, seenBy, thread, createdBy } = req.body;

  const user_id = req.user._id;

  try {
    let createdChat = await chatModel.create({
      content,
      draft,
      pulseId,
      seenBy: [user_id],
      thread,
      createdBy,
    });

    createdChat = await createdChat.populate([
      {
        path: "thread",
        populate: { path: "createdBy", select: "username picture _id" },
      },
      { path: "createdBy", select: "username picture _id" },
      { path: "seenBy", select: "username picture _id" },
    ]);

    res.json({ success: true, response: createdChat });
  } catch (error) {
    next(error);
  }
});

chatRouter.put("/update/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const body = req.body;
  console.log("body", body);
  try {
    const updatedChat = await chatModel.findByIdAndUpdate(_id, body, {
      new: true,
    });
    res.json({ success: true, response: updatedChat.toObject() });
  } catch (error) {
    next(error);
  }
});

chatRouter.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await chatModel.findByIdAndDelete(id);
    res.json({ success: true, response: "Chat deleted successfully!" });
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
