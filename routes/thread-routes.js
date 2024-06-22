import { Router } from "express";

import threadModel from "../models/thread-model.js";
import chatModel from "../models/chat-model.js";

const threadsRouter = Router();

import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    });

    const chat = await chatModel.findById(chat_id);
    chat.threadCount = chat.threadCount + 1;
    await chat.save();

    createdThread = await createdThread.populate([
      { path: "createdBy", select: "username picture _id" },
    ]);

    res.json({ success: true, response: createdThread });

    ////////////////////WORKER/////////////////////
    createdThread = await createdThread.toObject();

    createdThread = { ...createdThread };

    const workerPayload = {
      data: { pulseId: pulseId, boardId: boardId },
      chat: createdThread,
      user: req.user,
      type: "NEW_REPLY",
    };
    new Worker(path.resolve(__dirname, "../workers/notification.js"), {
      workerData: workerPayload,
    });
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
    console.log("deletedThread", deletedThread.toObject());

    const chat = await chatModel.findById(deletedThread.chatId.toString());
    chat.threadCount = chat.threadCount - 1;
    await chat.save();

    res.json({ success: true, response: "Chat deleted successfully!" });
  } catch (error) {
    next(error);
  }
});

export default threadsRouter;
