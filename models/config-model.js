import mongoose from "mongoose";

const filterSchema = new mongoose.Schema(
  {
    search: { type: String, default: "" },
    priority: { type: String, default: "" },
    status: { type: String, default: "" },
    user: { type: String, default: "" },
  },
  { _id: false }
);

const userConfigSchema = mongoose.Schema(
  {
    belongsTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    staredBoards: [{ type: String }],
    likedChats: [{ type: String }],
    likedThreads: [{ type: String }],
    themeID: { type: String },
    pulseHeight: { type: String },
    filters: {
      type: Map,
      of: filterSchema,
    },
  },
  { versionKey: false }
);

export default mongoose.model("config", userConfigSchema);
