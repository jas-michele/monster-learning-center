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

      {question.category === "colors" ? (
        <div
          className="question-card__color"
          style={{ backgroundColor: question.item.value }}
        />
      ) : question.category === "shapes" ? (
        <div className={`question-card__shape question-card__shape--${question.item.value}`} />
      ) : (
        <h1 className="question-card__value">
          {question.item.value}
        </h1>
      )}

      <input
        className="question-card__input"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
      />

      <button
        className="question-card__button"
        onClick={handleSubmit}
        disabled={loading}
      >
        Build Truck!
      </button>
    

    </div >
  );

}