import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    pulseId: {
      ref: "pulse",
      required: [true, "Pulse reference is required"],
      type: mongoose.Schema.Types.ObjectId,
    },

    threadCount: { type: Number, default: 0 },

    createdBy: {
      ref: "user",
      required: [true, "User is required"],
      type: mongoose.Schema.Types.ObjectId,
    },
    seenBy: [
      {
        ref: "user",
        default: [],
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    content: {
      default: "",
      type: String,
    },
    draft: {
      default: "",
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("chat", chatSchema);
