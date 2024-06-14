import mongoose from "mongoose";

const pulseSchema = new mongoose.Schema(
  {
    priority: { type: String },
    title: { type: String, required: true },
    assigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    status: { type: String },
    timeline: { start: String, end: String, default: {} },
    tag: { type: String },
  },
  { versionKey: false }
);

export default mongoose.model("pulse", pulseSchema);
