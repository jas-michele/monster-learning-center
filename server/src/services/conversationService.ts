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
        character: {
            name: "jax",
        },
        greeting,
        firstQuestion: question,
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

    const CATEGORY_ORDER: LearningCategory[] = [
        "letters",
        "numbers",
        "colors",
        "shapes",
    ];

    const currentIndex = CATEGORY_ORDER.indexOf(category);

    const nextCategory =
        result.correct && action === "install_tire"
            ? CATEGORY_ORDER[currentIndex + 1]
            : category;


    console.log("Current category:", category);
    console.log("Next category:", nextCategory);
  const nextQuestion =
    action === "start_race"
        ? null
        : getNextQuestion(
            updatedConversationState.learningState,
            nextCategory
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