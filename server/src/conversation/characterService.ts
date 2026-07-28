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


export async function generateGreeting(childName: string): Promise<string> {
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: mechanicPrompt,
        input: `Greet ${childName} and invite them to their monster truck.`,
    });

      console.log(JSON.stringify(response, null, 2));

    return response.output_text;

}

export async function generateQuestion(question: string): Promise<string> {
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: mechanicPrompt,
        input: `Ask the child this learning question: ${question}`,
    });

    return response.output_text;
}

export async function generatePraise(): Promise<string> {
    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        instructions: "Praise the child for answering correctly and celebrate installing a tire."
    });

    return response.output_text;
}