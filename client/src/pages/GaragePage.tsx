import { useEffect, useState } from "react";
import {
  startConversation,
  respondConversation,
} from "../services/conversationApi";

import type {
  Question,
  ConversationState,
  RespondConversationResponse,
} from "../types/conversation";

import QuestionCard from "../components/QuestionCard/QuestionCard";

export default function GaragePage() {
  const [greeting, setGreeting] = useState("");
  const [message, setMessage] = useState("");

  const [question, setQuestion] = useState<Question | null>(null);

  const [conversationState, setConversationState] =
    useState<ConversationState | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const [error, setError] = useState("");


    async function loadConversation() {
      try {
        const response = await startConversation();

        setGreeting(response.greeting);
        setQuestion(response.firstQuestion);
        setConversationState(response.conversationState);
      } catch (err) {
        console.error(err);
        setError("Unable to start conversation.");
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {

    loadConversation();
  }, []);

  async function handleAnswer(answer: string) {
    if (!conversationState || !question) return;

    try {
      setLoadingQuestion(true);

      const response = await respondConversation(
        answer,
        question,
        conversationState
      );

      handleResponse(response);
    } catch (err) {
      console.error(err);
      setError("Unable to process answer.");
    } finally {
      setLoadingQuestion(false);
    }
  }

  function handleResponse(response: RespondConversationResponse) {
    setMessage(response.message);

    setConversationState(response.conversationState);

    setQuestion(response.nextQuestion);

    console.log("Game Action:", response.action);
  }

  if (loading) {
    return <h2>Loading Garage...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Monster Truck Garage</h1>

      <h2>{greeting}</h2>

      {message && <h3>{message}</h3>}

      {question && (
        <QuestionCard
          question={question}
          loading={loadingQuestion}
          onSubmit={handleAnswer}
        />
      )}
    </div>
  );
}