import { letters } from "./categories.ts/letters.js";
import { numbers } from "./categories.ts/numbers.js";
import { colors } from "./categories.ts/colors.js";
import { shapes } from "./categories.ts/shapes.js";

export type LearningCategory =
    | "letters"
    | "numbers"
    | "colors"
    | "shapes";

export type GameAction =
    | "install_tire"
    | "shake_tire"
    | "start_race"
    | "celebrate"
    | "continue_learning";

export type TruckPart =
    | "front_left_tire"
    | "front_right_tire"
    | "rear_left_tire"
    | "rear_right_tire";

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

export interface CategoryState {
    activeItemIds: number[];
    progress: ItemProgress[];
}

export interface LearningState {
   letters: CategoryState;
   numbers: CategoryState;
   colors: CategoryState;
   shapes: CategoryState;
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



export interface InstalledPart {
    part: TruckPart;
    category: LearningCategory;
    installed: boolean;
}

export interface TruckState {
    installedParts: InstalledPart[];
    completed: boolean;
}

export interface ConversationState {
    learningState: LearningState;
    truckState: TruckState;
}