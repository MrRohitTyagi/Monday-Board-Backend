import { Router } from "express";
import userModel from "../models/user-model.js";
import boardModel from "../models/board-model.js";

import { comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

import { throwEarlyError } from "../middlewares/errorhandeling.js";
const invitationRouter = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

invitationRouter.post("/invite-accept", async (req, res, next) => {
  const {
    user_id,
    board_id,
    //create user params
    username,
    email,
    password,
    // identifier
    reqType,
  } = req.body;

  if (!board_id) {
    return throwEarlyError({
      message: "Required params were not sent",
      res,
    });
  }
  try {
    let user;
    let token;

    const board = await boardModel.findById(board_id);
    if (!board) {
      return throwEarlyError({
        res,
        message: "Board not found",
      });
    }

    if (user_id) {
      user = await userModel.findById(user_id);
      if (!user) {
        return throwEarlyError({
          res,
          message: "User not found",
        });
      }
    } else if (reqType === "SIGNUP") {
      user = await userModel.create({ password: password, email, username });
      const { password: _, ...restUser } = user.toObject();
      token = generateToken(restUser);
    } else if (reqType === "LOGIN") {
      user = await userModel.findOne({ email: email });
      const isPassSame = await comparePassword(
        password,
        user.toObject().password
      );

      if (isPassSame === false) {
        return throwEarlyError({
          res,
          message:
            "Password is incorrect, please check your password and try again",
        });
      }
      if (!user) {
        return throwEarlyError({
          res,
          message: "Use does not exists",
        });
      }
      const { password: _, ...restUser } = user.toObject();
      token = generateToken(restUser);
    }

    user.boards = user.boards.concat(board._id.toString());

    board.members = board.members.concat(user._id.toString());

    let [updatedBoard, updatedUser] = await Promise.all([
      board.save(),
      user.save(),
    ]);

    const { password: _pass, ...userDataToSend } = updatedUser.toObject();

    const boardDataToSend = {
      picture: updatedBoard.picture,
      _id: updatedBoard._id.toString(),
      title: updatedBoard.title,
    };

    const finalRes = { board: boardDataToSend };
    if (!user_id) finalRes.user = userDataToSend;
    if (token) finalRes.token = token;

    return res.json({
      success: true,
      response: finalRes,
      message: `Your are not a member of ${board.toObject().title}`,
    });
  } catch (error) {
    console.log("error", error);
    next();
  }
});

export default invitationRouter;
