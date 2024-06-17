import mongoose from "mongoose";

const chatSchema = (mongoose.Schema = {
  messages: [{ content: String }],
  count: { type: Number },
});

export default mongoose.model("chats", chatSchema);
