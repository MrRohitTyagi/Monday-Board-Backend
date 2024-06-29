import { GoogleGenerativeAI } from "@google/generative-ai";
import { Router } from "express";
const aiRouter = Router();

const generationConfig = {
  // maxOutputTokens: 100,
  //   temperature: 0,
  //   topP: 0.1,
  //   topK: 16,
};
const KEY = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig,
});

aiRouter.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.status(200).send({ success: true, message: text });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

export default aiRouter;
