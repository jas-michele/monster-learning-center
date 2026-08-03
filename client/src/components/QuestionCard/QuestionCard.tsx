import { useState } from "react";
import type { Question } from "../../types/conversation";
import "./QuestionCard.css";


interface QuestionCardProps {
  question: Question;
  loading: boolean;
  onSubmit: (answer: string) => void
}


export default function QuestionCard({
  question,
  loading,
  onSubmit,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("");


  function handleSubmit() {
    if (!answer.trim()) return;

    onSubmit(answer);

    setAnswer("");
  }
return (
  <div className="question-card">

    <p className="question-card__prompt">
      What {question.category.slice(0, -1)} is this?
    </p>

    <h1 className="question-card__value">
      {question.item.value}
    </h1>

    <input
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      placeholder="Type your answer..."
    />

    <button
      onClick={handleSubmit}
      disabled={loading}
    >
      Build Truck!
    </button>

  </div>
);
 
}