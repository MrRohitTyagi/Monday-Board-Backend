import mongoose from "mongoose";
const sprintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    color: { type: String },
    pulses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "pulse", default: [] },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("sprint", sprintSchema);
