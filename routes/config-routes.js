import { Router } from "express";

import configModel from "../models/config-model.js";

const configRouter = Router();

configRouter.get("/get", async (req, res, next) => {
  const { _id } = req.user;
  try {
    const config = await configModel.findOne({ belongsTo: _id });
    if (config?._id) {
      return res.json({ success: true, response: config });
    } else {
      const config = await configModel.create({ belongsTo: _id });
      return res.json({ success: true, response: config.toObject() });
    }
  } catch (error) {
    next(error);
  }
});

configRouter.put("/update/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const body = req.body;

  try {
    await configModel.findByIdAndUpdate(_id, body, {
      new: true,
    });

    res.json({ success: true, message: "Config updated successfully" });
  } catch (error) {
    next(error);
  }
});

// configRouter.delete("/delete/:id", async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const deletedThread = await threadModel.findByIdAndDelete(id);

//     const chat = await chatModel.findById(deletedThread.chatId.toString());
//     chat.threadCount = chat.threadCount - 1;
//     await chat.save();

//     res.json({ success: true, response: "Chat deleted successfully!" });
//   } catch (error) {
//     next(error);
//   }
// });

export default configRouter;
