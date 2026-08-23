import { openai } from "../config/openai.js";
import { dinoPrompt } from "../prompts/dinoPrompt.js";

export type DinoTopic =
  | "facts"
  | "habitat"
  | "diet"
  | "size";

export async function generateDinoFact(
  dinosaur: string,
  topic: DinoTopic
): Promise<string> {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions: dinoPrompt,
    input: `
Dinosaur: ${dinosaur}
Topic: ${topic}

Teach the child about this topic.
`,
  });

  return response.output_text;
}