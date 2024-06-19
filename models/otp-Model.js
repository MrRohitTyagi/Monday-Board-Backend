import mongoose, { Schema } from "mongoose";

const otpschema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, expires: 60, default: Date.now },
});

export default mongoose.model("otp", otpschema);
