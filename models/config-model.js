import mongoose from "mongoose";

const userConfigSchema = mongoose.Schema(
  {
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    staredBoards: [
      {
        type: String,
      },
    ],
    likedChats: [
      {
        type: String,
      },
    ],
    likedThreads: [
      {
        type: String,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("config", userConfigSchema);
