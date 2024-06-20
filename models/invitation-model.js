import mongoose, { Schema } from "mongoose";

const invitationSchema = new Schema(
  {
    board_name: { type: String, required: [true, "Board name is required"] },
    board_id: { type: String, required: [true, "Board ID is required"] },
    from: { type: String },
    to: { type: String },
    extra: { type: String },
    createdAt: { type: Date, expires: "10m", default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("invitations", invitationSchema);
