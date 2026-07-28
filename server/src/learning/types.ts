import { letters } from "./categories.ts/letters.js";
import { numbers } from "./categories.ts/numbers.js";
import { colors } from "./categories.ts/colors.js";
import { shapes } from "./categories.ts/shapes.js";

export type LearningCategory = 
| "letters"
| "numbers"
| "colors"
| "shapes";

export interface LearningItem {
    id: number;
    value: string;
    answer: string;
}

export interface ItemProgress {
    itemId: number;
    correctAnswers: number;
    mastered: boolean;
}

export interface LearningState {
    category: LearningCategory;
    activeItemIds: number[];
    progress: ItemProgress[];
}

export interface QuestionResult {
    item: LearningItem;
    category: LearningCategory;
}

export interface AnswerResult {
    correct: boolean;
    mastered: boolean;
    correctAnswers: number;
    requiredAnswers: number;
    state: LearningState;
}