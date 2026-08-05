import { Request, Response } from "express";
import { generateSpeech } from "../services/voiceService.js";

export async function generateVoice(
  req: Request,
  res: Response
) {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required.",
      });
    }

    const audioStream = await generateSpeech(text);

    res.setHeader("Content-Type", "audio/mpeg");

    for await (const chunk of audioStream) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate speech.",
    });
  }
}