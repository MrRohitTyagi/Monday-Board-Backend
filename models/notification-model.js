import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User relation is required"],
      ref: "user",
    },
    seen: {
      default: false,
      type: Boolean,
    },
    attachedPulse: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Pulse relation is required"],
      ref: "pulse",
    },
    attachedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user relation is required"],
      ref: "user",
    },
    postfix_text: {
      type: String,
    },
    prefix_text: {
      type: String,
    },
    notificationType: {
      type: String,
      emun: ["ASSIGNED_TO", "NEW_UPDATE", "NEW_REPLY"],
      required: [true, "Notification type is required"],
    },
    content: {
      type: String,
    },
    redirect_url: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("notification", notificationSchema);
