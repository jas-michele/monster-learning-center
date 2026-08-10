import { useState } from "react";
import type { Question } from "../../types/conversation";
import "./QuestionCard.css";

import speechRecognitionService from "../../services/speechRecognition";
import { normalizeSpeech } from "../../utils/normalizeSpeech";


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
  const [isListening, setIsListening] = useState(false);


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
        type="button"
        className="question-card__mic"
        disabled={isListening}
        onClick={async () => {
          try {
            const transcript =
              await speechRecognitionService.startListening(
                setIsListening
              );

            const normalizedAnswer = normalizeSpeech(
              transcript,
              question.category
            );

            setAnswer(normalizedAnswer);

            onSubmit(normalizedAnswer);
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {isListening ? "🎙️ Listening..." : "🎤"}
      </button>
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