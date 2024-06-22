import { Router } from "express";

import threadModel from "../models/thread-model.js";

const threadsRouter = Router();

threadsRouter.get("/get-single/:_id", async (req, res, next) => {
  try {
    const _id = req.params._id;
    const thread = await threadModel.findById(_id);

    res.json({ success: true, response: thread });
  } catch (error) {
    next(error);
  }
});

threadsRouter.get("/get/:pulse_id", async (req, res, next) => {
  const { pulse_id } = req.params;
  try {
    const threadsBelongsToAChat = await threadModel
      .find({ pulseId: pulse_id })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "thread",
          populate: { path: "createdBy", select: "username picture _id" },
        },
        { path: "createdBy", select: "username picture _id" },
      ]);
    res.json({ success: true, response: threadsBelongsToAChat });
  } catch (error) {
    next(error);
  }
});

threadsRouter.post("/create", async (req, res, next) => {
  const { content, draft, pulseId, seenBy, thread, createdBy } = req.body;

  const user_id = req.user._id;

  try {
    let createdChat = await threadModel.create({
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

threadsRouter.put("/update/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const body = req.body;
  console.log("body", body);
  try {
    const updatedChat = await threadModel.findByIdAndUpdate(_id, body, {
      new: true,
    });
    res.json({ success: true, response: updatedChat.toObject() });
  } catch (error) {
    next(error);
  }
});

threadsRouter.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await threadModel.findByIdAndDelete(id);
    res.json({ success: true, response: "Chat deleted successfully!" });
  } catch (error) {
    next(error);
  }
});

export default threadsRouter;
