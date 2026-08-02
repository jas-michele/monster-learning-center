import { useEffect, useState } from "react";
import { startConversation } from "../services/conversationApi";
import type { Question, ConversationState, RespondConversationResponse } from "../types/conversation";
import QuestionCard from "../components/QuestionCard";


export default function GaragePage() {
    const [greeting, setGreeting] = useState("");

    const [question, setQuestion] = useState<Question | null>(null);

    const [conversationState, setConversationState] =
        useState<ConversationState | null>(null);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadConversation() {
            try {
                const response = await startConversation();
                setGreeting(response.greeting);
                setQuestion(response.firstQuestion);
                setConversationState(response.conversationState);
            } catch (err) {
                console.error(err);
                setError("Unable to start conversation.")
            } finally {
                setLoading(false);
            }
        }

        loadConversation();
    }, []);

    if (loading) {
        return <h2>Loading Garage...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

   function handleResponse(response: RespondConversationResponse) {
    // Show Jax's latest message
    setMessage(response.message);

    // Replace the backend state
    setConversationState(response.conversationState);

    // Display the next question if there is one
    if (response.nextQuestion) {
        setQuestion(response.nextQuestion);
    }

    console.log("Game Action:", response.action);
}

    return (
        <div>
            <h1>Monster Truck Garage</h1>

            <h2>{greeting}</h2>

            {message && <h3>{message}</h3>}

            {question && conversationState && (
                <QuestionCard
                    question={question}
                    conversationState={conversationState}
                    onResponse={handleResponse}
                />
            )}
        </div>
    )
}