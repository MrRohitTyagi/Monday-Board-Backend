import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String },
    org: { type: String },
    boards: [{ ref: "board", type: mongoose.Schema.ObjectId, default: [] }],
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error); // Pass any errors to the next middleware
  }
});
export default mongoose.model("user", userSchema);
