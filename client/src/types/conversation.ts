export type LearningCategory = 
| "letters"
| "numbers"
| "colors"
| "shapes";

export type GameAction = 
| "install_tire"
| "shake_tire"
| "start_race"
| "continue_learning";

export interface LearningItem {
    id: number;
    value: string;
    answer: string;
}

export interface Question {
    category: LearningCategory;
    item: LearningItem;
}

export interface Character {
    name: string;
}

export interface ConversationState {
    learningState: unknown;
    truckState: unknown;
}

export interface StartConversationResponse {
    character: Character;
    greeting: string;
    firstQuestion: Question;
    conversationState: ConversationState;
}

export interface RespondConversationResponse {
    correct: boolean;
    message: string;
    action: GameAction;
    mastered: boolean;
    correctAnswer: number;
    requiredAnswers: number;
    nextQuestion: Question | null;
    conversationState: ConversationState;
}