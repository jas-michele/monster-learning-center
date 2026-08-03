import api from "./api"
import type {
    StartConversationResponse,
    RespondConversationResponse,
    Question
} from "../types/conversation";


export async function startConversation(): Promise<StartConversationResponse> {
    const { data } = await api.post<StartConversationResponse>(
        "/conversation/start",
       
    );

    return data;
}

export async function respondConversation(
    answer: string,
    question: Question,
    conversationState: unknown
): Promise<RespondConversationResponse> {
    const { data } = await api.post<RespondConversationResponse>(
        "/conversation/respond",
        {
            answer,
            conversationState,
            category: question.category,
            itemId: question.item.id,
        }
    );

    return data;
}

export default api;