import {
    createLearningState,
    getNextQuestion,
    submitAnswer,
} from "../learning/learningEngine.js";

import {
    generateGreeting,
    generatePraise,
    generateEncouragement,
} from "../conversation/characterService.js";

import {
    GameAction,
    ConversationState,
    LearningCategory,
} from "../learning/types.js";

import {
    createTruckState,
    installPart,
} from "../learning/truckState.js";

export async function startConversation(childName: string) {
    const learningState = createLearningState();

    const truckState = createTruckState();

    const question = getNextQuestion(
        learningState,
        "letters"
    );

    const conversationState: ConversationState = {
        learningState,
        truckState,
    };

    const greeting = await generateGreeting(childName);

    return {
        character: "jax",
        message: greeting,
        question,
        conversationState,
    };
}

export async function respondToAnswer(
    conversationState: ConversationState,
    category: LearningCategory,
    itemId: number,
    answer: string
) {
    const result = submitAnswer(
        conversationState.learningState,
        category,
        itemId,
        answer
    );

    const updatedTruckState = result.correct
        ? installPart(conversationState.truckState, category)
        : conversationState.truckState;

    let action: GameAction;

    if (!result.correct) {
        action = "shake_tire";
    } else if (updatedTruckState.completed) {
        action = "start_race"
    }
     else {
        action = "install_tire";
    }

    const message = result.correct
        ? await generatePraise()
        : await generateEncouragement();

    const updatedConversationState: ConversationState = {
        learningState: result.state,
        truckState: updatedTruckState,
    };

    const nextQuestion = getNextQuestion(
        updatedConversationState.learningState,
        category
    );
    return {
        correct: result.correct,
        message,
        action,
        mastered: result.mastered,
        correctAnswers: result.correctAnswers,
        requiredAnswers: result.requiredAnswers,
        nextQuestion,
        conversationState: updatedConversationState,
    };
}