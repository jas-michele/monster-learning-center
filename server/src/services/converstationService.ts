import { createLearningState, getNextQuestion } from "../learning/learningEngine.js";
import { generateGreeting } from "../conversation/characterService.js";

export async function startConversation(childName: string) {
    const learningState = createLearningState("letters");

    const question = getNextQuestion(learningState);

    const greeting = await generateGreeting(childName);

    return {
        character: "jax",
        message: greeting,
        question,
        learningState
    };
}