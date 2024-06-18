import mongoose from "mongoose";

const chatSchema = (mongoose.Schema = {
  messages: [{ content: String }],
  count: { type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

export default mongoose.model("chats", chatSchema);
