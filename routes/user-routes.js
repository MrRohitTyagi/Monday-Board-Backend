import { Router } from "express";

import prisma from "../configs/prismaClient.js";
import { applyFilters } from "../utils.js";

const router = Router();

export const user_fields_tO_send = { email: true, name: true, pk: true };

router.get("/get-all", applyFilters, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: user_fields_tO_send,
      ...(req.filters || {}),
    });

    res.json({ count: users.length, success: true, response: users });
  } catch (error) {
    // getError(error, res);
    res.send({ success: false, message: "something went wrong" });
    console.log("error", error);
  }
});

router.get("/get/:pk", async (req, res) => {
  const { pk } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { pk: +pk },
      select: user_fields_tO_send,
    });
    res.json({ success: true, response: user });
  } catch (error) {
    // getError(error, res);
    res.send({ success: false, message: "something went wrong" });
    console.log("error", error);
  }
});

router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.create({ data: { name, email, password } });
    res.json({ success: true, response: user });
  } catch (error) {
    // getError(error, res);
    res.send({ success: false, message: "something went wrong" });
    console.log("error", error);
  }
});

router.put("/update/:pk", async (req, res) => {
  const { pk } = req.params;
  const { name } = req.body;
  try {
    const user = await prisma.user.update({
      where: { pk: +pk },
      data: { name: name },
    });
    res.json({ success: true, response: user });
  } catch (error) {
    // getError(error, res);
    res.send({ success: false, message: "something went wrong" });
    console.log("error", error);
  }
});

router.delete("/delete/:pk", async (req, res) => {
  const { pk } = req.params;
  try {
    await prisma.user.delete({ where: { pk: +pk } });
    res.json({ success: true, response: "user deleted successfully" });
  } catch (error) {
    // getError(error, res);
    res.send({ success: false, message: "something went wrong" });
    console.log("error", error);
  }
});

export default router;
