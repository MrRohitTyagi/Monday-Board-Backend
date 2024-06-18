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
        textColor: { type: String, required: true },
        id: { type: String, required: true },
      }),
    },

    priority: {
      type: Map,
      of: new mongoose.Schema({
        textColor: { type: String, required: true },
        id: { type: String, required: true },
        title: { type: String, required: true },
        color: { type: String, required: true },
      }),
    },

    sprints: [
      { type: mongoose.Schema.Types.ObjectId, ref: "sprint", default: [] },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model("board", boardSchema);
