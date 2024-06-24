import express from "express";
// import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/user-routes.js";
import boardRouter from "./routes/board-routes.js";
import sprintRouter from "./routes/sprint-routes.js";
import pulseRouter from "./routes/pulse-routes.js";
import emailRouter from "./routes/email-otp-routes.js";
import threadRouter from "./routes/thread-routes.js";
import authRouter from "./routes/auth-routes.js";
import chatRouter from "./routes/chat-routes.js";
import notificationRouter from "./routes/notification-router.js";

import connectDatabase from "./configs/db.js";

import { VerifyToken } from "./utils/jwt.js";
import errorHandler from "./middlewares/errorhandeling.js";
import invitationRouter from "./routes/invitation-router.js";
import aiRouter from "./routes/ai-routes.js";

//configurations
const app = express();
// app.use(compression({}));
app.use(cors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.options("*", cors("*"));
app.use(cors("*"));
app.use(express.json());
dotenv.config({ path: "./.env.local" });
connectDatabase();

// middleware

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/email/", emailRouter);
app.use("/invitation/", invitationRouter);
app.use("/auth/", authRouter);

app.use("/user/", VerifyToken, userRouter);
app.use("/ai/", VerifyToken, aiRouter);
app.use("/board/", VerifyToken, boardRouter);
app.use("/pulse/", VerifyToken, pulseRouter);
app.use("/chat/", VerifyToken, chatRouter);
app.use("/thread/", VerifyToken, threadRouter);
app.use("/sprint/", VerifyToken, sprintRouter);
app.use("/notification/", VerifyToken, notificationRouter);

app.use(errorHandler);

app.listen(5000, () => {
  console.clear();
  console.log("server running at port 5000");
});
