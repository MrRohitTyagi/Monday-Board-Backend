import mongoose from "mongoose";
const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    picture: { type: String },
    admins: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] },
    ],
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] },
    ],
    statuses: {
      type: Map,
      of: new mongoose.Schema({
        title: { type: String, required: true },
        color: { type: String, required: true },
      }),
    },

    priority: {
      type: Map,
      of: new mongoose.Schema({
        title: { type: String, required: true },
        color: { type: String, required: true },
      }),
    },

    sprints: [
      { type: mongoose.Schema.Types.ObjectId, ref: "sprint", default: [] },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("board", boardSchema);
