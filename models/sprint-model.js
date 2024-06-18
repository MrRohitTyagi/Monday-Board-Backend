import mongoose from "mongoose";
const sprintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    color: { type: String },
    pulses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "pulse", default: [] },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model("sprint", sprintSchema);
