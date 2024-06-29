import mongoose, { Schema } from "mongoose";

const otpschema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user Id is required"],
      ref: "user",
    },
    otp: { type: String, required: true },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: { type: Date, expires: 60, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("otp", otpschema);
