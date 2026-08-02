import axios from "axios";
import type {
    StartConversationResponse,
    RespondConversationResponse,
} from "../types/conversation";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export async function startConversation(): Promise<StartConversationResponse> {
    const { data } = await api.post<StartConversationResponse>(
        "/conversation/start"
    );

    return data;
}

export async function respondConversation(
    answer: string,
    conversationState: unknown
): Promise<RespondConversationResponse> {
    const { data } = await api.post<RespondConversationResponse>(
        "/conversation/respon",
        {
            answer,
            conversationState
        }
    );

    return data;
}

export default api;