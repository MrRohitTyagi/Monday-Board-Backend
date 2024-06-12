import express from "express";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/user-routes.js";

//configurations
const app = express();
app.use(compression({}));
app.use(cors());
app.use(express.json());
dotenv.config({ path: "./.env" });

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1/user/", userRouter);

app.listen(5000, () => {
  console.log("server running at port 5000");
});
