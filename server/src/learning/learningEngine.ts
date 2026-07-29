import { letters } from "./categories.ts/letters.js"
import { numbers } from "./categories.ts/numbers.js"
import { colors } from "./categories.ts/colors.js";
import { shapes } from "./categories.ts/shapes.js"
import { REQUIRED_CORRECT_ANSWERS, ACTIVE_POOL_SIZE } from "./constants.js";
import {
    LearningCategory,
    LearningItem,
    CategoryState,
    LearningState,
    QuestionResult,
    AnswerResult,
} from "./types.js"


const curriculum: Record<LearningCategory, LearningItem[]> = {
    letters,
    numbers,
    colors,
    shapes,
};

function createCategoryState(
    category: LearningCategory
): CategoryState {
    const categoryItems = curriculum[category];

    const startingItems = categoryItems
        .slice(0, ACTIVE_POOL_SIZE)
        .map((item) => item.id);

        return {
            activeItemIds: startingItems,
            progress: startingItems.map((itemId) => ({
                itemId,
                correctAnswers: 0,
                mastered: false,
            }))
        }
}

export function createLearningState(): LearningState {
    return {
        letters: createCategoryState("letters"),
        numbers: createCategoryState("numbers"),
        colors: createCategoryState("colors"),
        shapes: createCategoryState("shapes"),
    }
}

export function getNextQuestion(
    state: LearningState,
    category: LearningCategory
): QuestionResult {

    const categoryState = state[category];
    const categoryItems = curriculum[category];

    const activeItems = categoryItems.filter((item) =>
        categoryState.activeItemIds.includes(item.id)
    );

    if (activeItems.length === 0) {
        throw new Error("No active learning items are available.");
    }

    const randomIndex = Math.floor(
        Math.random() * activeItems.length
    );

    return {
        category,
        item: activeItems[randomIndex],
    };

}

export function submitAnswer(
    state: LearningState,
    category: LearningCategory,
    itemId: number,
    childAnswer: string
): AnswerResult {

    const categoryState = state[category];
    const categoryItems = curriculum[category];

    const learningItem = categoryItems.find(
        (item) => item.id === itemId
    );

    if (!learningItem) {
        throw new Error("Learning item not found.");
    }

    const normalizedChildAnswer = childAnswer
        .trim()
        .toLowerCase();

    const normalizedCorrectAnswer = learningItem.answer
        .trim()
        .toLowerCase();

    const correct =
        normalizedChildAnswer === normalizedCorrectAnswer;

    const updatedProgress = categoryState.progress.map(
        (progressItem) => {

            if (
                progressItem.itemId !== itemId ||
                !correct
            ) {
                return progressItem;
            }

            const correctAnswers =
                progressItem.correctAnswers + 1;

            return {
                ...progressItem,
                correctAnswers,
                mastered:
                    correctAnswers >= REQUIRED_CORRECT_ANSWERS,
            };
        }
    );

    const currentProgress = updatedProgress.find(
        (progressItem) => progressItem.itemId === itemId
    );

    if (!currentProgress) {
        throw new Error("Progress record not found.");
    }

    let updatedActiveItemIds = [
        ...categoryState.activeItemIds,
    ];

    let finalProgress = [...updatedProgress];

    if (currentProgress.mastered) {

        updatedActiveItemIds =
            updatedActiveItemIds.filter(
                (activeItemId) =>
                    activeItemId !== itemId
            );

        const nextItem = categoryItems.find(
            (item) =>
                !updatedActiveItemIds.includes(item.id) &&
                !finalProgress.some(
                    (progressItem) =>
                        progressItem.itemId === item.id
                )
        );

        if (nextItem) {

            updatedActiveItemIds.push(nextItem.id);

            finalProgress.push({
                itemId: nextItem.id,
                correctAnswers: 0,
                mastered: false,
            });

        }

    }

    const updatedState: LearningState = {

        ...state,

        [category]: {
            activeItemIds: updatedActiveItemIds,
            progress: finalProgress,
        },

    };

    return {

        correct,

        mastered: currentProgress.mastered,

        correctAnswers:
            currentProgress.correctAnswers,

        requiredAnswers:
            REQUIRED_CORRECT_ANSWERS,

        state: updatedState,

    };

}