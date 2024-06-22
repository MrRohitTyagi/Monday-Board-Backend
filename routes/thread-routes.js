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

threadsRouter.get("/get/:chat_id", async (req, res, next) => {
  const { chat_id } = req.params;
  try {
    const threadsBelongsToAChat = await threadModel
      .find({ chatId: chat_id })
      .populate([{ path: "createdBy", select: "username picture _id" }]);
    res.json({ success: true, response: threadsBelongsToAChat });
  } catch (error) {
    next(error);
  }
});

threadsRouter.post("/create", async (req, res, next) => {
  const { content, chatId: chat_id } = req.body;

  const user_id = req.user._id;

  try {
    let createdThread = await threadModel.create({
      content,
      chatId: chat_id,
      createdBy: [user_id],
    });

    createdThread = await createdThread.populate([
      { path: "createdBy", select: "username picture _id" },
    ]);

    res.json({ success: true, response: createdThread });
  } catch (error) {
    next(error);
  }
});

threadsRouter.put("/update/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const body = req.body;

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
