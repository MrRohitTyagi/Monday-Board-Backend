import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
  {
    chatId: {
      ref: "chat",
      required: [true, "chat reference is required"],
      type: mongoose.Schema.Types.ObjectId,
    },

    createdBy: {
      ref: "user",
      required: [true, "User is required"],
      type: mongoose.Schema.Types.ObjectId,
    },

    content: {
      default: "",
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("thread", threadSchema);
