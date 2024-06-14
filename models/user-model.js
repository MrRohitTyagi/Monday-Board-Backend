import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String },
    org: { type: String },
    boards: [{ ref: "board", type: mongoose.Schema.ObjectId, default: [] }],
  },
  { versionKey: false }
);

export default mongoose.model("user", userSchema);
