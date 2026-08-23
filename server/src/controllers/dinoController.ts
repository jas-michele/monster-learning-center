import type { Request, Response } from "express";
import {
  generateDinoFact,
  type DinoTopic,
} from "../services/dinoService.js";

const allowedTopics: DinoTopic[] = [
  "facts",
  "habitat",
  "diet",
  "size",
];

export async function getDinoFact(
  req: Request,
  res: Response
) {
  try {
    const { dinosaur, topic } = req.body;

    if (!dinosaur || !topic) {
      return res.status(400).json({
        error: "Dinosaur and topic are required.",
      });
    }

    if (!allowedTopics.includes(topic as DinoTopic)) {
      return res.status(400).json({
        error: "Invalid dinosaur topic.",
      });
    }

    const message = await generateDinoFact(
      dinosaur,
      topic as DinoTopic
    );

    return res.json({
      dinosaur,
      topic,
      message,
    });
  } catch (error) {
    console.error("Dino AI error:", error);

    return res.status(500).json({
      error: "Failed to generate dinosaur fact.",
    });
  }
}