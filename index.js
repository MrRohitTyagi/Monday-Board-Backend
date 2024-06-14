import express from "express";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/user-routes.js";
import boardRouter from "./routes/board-routes.js";
import sprintRouter from "./routes/sprint-routes.js";
import pulseRouter from "./routes/pulse-routes.js";
import connectDatabase from "./configs/db.js";
import authRouter from "./routes/auth-routes.js";

//configurations
const app = express();
// app.use(compression({}));
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors("*"));
app.use(cors("*"));
app.use(express.json());
dotenv.config({ path: "./.env" });
connectDatabase();

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/user/", userRouter);
app.use("/board/", boardRouter);
app.use("/pulse/", pulseRouter);
app.use("/sprint/", sprintRouter);
app.use("/auth/", authRouter);

app.listen(5000, () => {
  console.log("server running at port 5000");
});
