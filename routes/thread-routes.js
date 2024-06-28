import { Router } from "express";

import threadModel from "../models/thread-model.js";
import chatModel from "../models/chat-model.js";
import { generateNotification } from "../workers/notification.js";

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
  const { content, chatId: chat_id, boardId, pulseId } = req.body;

  const user_id = req.user._id;

  try {
    let createdThread = await threadModel.create({
      content,
      chatId: chat_id,
      createdBy: [user_id],
      pulseId: pulseId,
    });

    const chat = await chatModel.findById(chat_id);
    chat.threadCount = chat.threadCount + 1;
    await chat.save();

    createdThread = await createdThread.populate([
      { path: "createdBy", select: "username picture _id" },
    ]);

    res.json({ success: true, response: createdThread });

    ////////////////////GENERATE NOTIFICATION/////////////////////
    createdThread = await createdThread.toObject();

    createdThread = { ...createdThread };

    const notificationPayload = {
      data: { pulseId: pulseId, boardId: boardId },
      chat: createdThread,
      user: req.user,
      type: "NEW_REPLY",
    };
    generateNotification(notificationPayload);
  } catch (error) {
    next(error);
  }
});

threadsRouter.put("/update/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const body = req.body;

  try {
    const updatedChat = await threadModel
      .findByIdAndUpdate(_id, body, {
        new: true,
      })
      .populate({ path: "createdBy", select: "username picture _id" });

    res.json({ success: true, response: updatedChat.toObject() });
  } catch (error) {
    next(error);
  }
});

threadsRouter.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedThread = await threadModel.findByIdAndDelete(id);

    const chat = await chatModel.findById(deletedThread.chatId.toString());
    chat.threadCount = chat.threadCount - 1;
    await chat.save();

    res.json({ success: true, response: "Chat deleted successfully!" });
  } catch (error) {
    next(error);
  }
});

export default threadsRouter;
