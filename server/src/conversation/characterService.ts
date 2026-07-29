import { openai } from "../config/openai.js";
import { mechanicPrompt } from "../prompts/mechanicPrompt.js";

async function askJax(input: string): Promise<string> {
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: mechanicPrompt,
        input,
    });

    return response.output_text;
}


export  function generateGreeting(childName: string): Promise<string> {
    return askJax(
        `Greet ${childName} and invite them to build their monster truck.`
    );     
    };

export async function generateQuestion(question: string): Promise<string> {
   return askJax(
    `Ask the child this learning question: ${question}`
   );
}

export function generatePraise(): Promise<string> {
    return askJax(
        "Praise the child for answering correctly and celebrate installing a tire."
    );
}

export async function generateEncouragement(): Promise<string> {
    return askJax(
        "Encourage the child after an incorrect answer. Never reveal the answer."
    )
}