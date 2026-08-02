import { useState } from "react";
import type {
    Question,
    ConversationState,
    RespondConversationResponse,
} from "../types/conversation";
import { respondConversation } from "../services/conversationApi";

interface QuestionCardProps {
    question: Question;
    conversationState: ConversationState;
    onResponse: (response: RespondConversationResponse) => void;
}

export default function QuestionCard({
    question,
    conversationState,
    onResponse,
}: QuestionCardProps) {
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!answer.trim()) return;

        try {
            setLoading(true);

            const response = await respondConversation(
                answer,
                conversationState
            );

            onResponse(response);

            setAnswer("");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

     return (
    <div>
      <h2>{question.category.toUpperCase()}</h2>

      <h1>{question.item.value}</h1>

      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer..."
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
      >
        Submit
      </button>
    </div>
  );
}