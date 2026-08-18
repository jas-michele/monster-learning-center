import "./Race.css";
import raceLight from "../../assets/race/raceLight.png";

import { startConversation, respondConversation } from "../../services/conversationApi";
import type {
  ConversationState,
  Question,
} from "../../types/conversation";

import speechRecognitionService from "../../services/speechRecognition";
import { normalizeSpeech } from "../../utils/normalizeSpeech";
import { speak } from "../../services/voice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import PracticeTrack from "../../components/PracticeTrack";
import type { TruckColor } from "../Mechanic/truckCustomization";

import completeTruck from "../../assets/mechanic/blackTruck.png";
import redCompleteTruck from "../../assets/mechanic/redTruck.png";
import blueCompleteTruck from "../../assets/mechanic/blueTruck.png";
import greenCompleteTruck from "../../assets/mechanic/greenTruck.png";
import purpleCompleteTruck from "../../assets/mechanic/purpleTruck.png";
import lapAssets from "../../assets/practiceLap/lapassets.png";
import raceAvatar from "../../assets/avatars/race.png";
import {
  playCrowdCheer,
  playPuddleSplash,
  scheduleEngineRevStop,
  startEngineRev,
  stopEngineRev,
} from "../../utils/engineAudio";

import Countdown from "../../components/Countdown/Countdown";

export default function Race() {

  const savedTruck = localStorage.getItem("monsterTruckCustomization");
  const [countdown, setCountdown] = useState("");
  const [driving, setDriving] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [conversationState, setConversationState] =
    useState<ConversationState | null>(null);

  const [raceStep, setRaceStep] = useState(0);
  const [learningComplete, setLearningComplete] = useState(false);
  const [raceStarted, setRaceStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showRaceLight, setShowRaceLight] = useState(true);

  const truckData = savedTruck
    ? JSON.parse(savedTruck)
    : null;

  const completeTruckAssets: Record<TruckColor, string> = {
    black: completeTruck,
    red: redCompleteTruck,
    blue: blueCompleteTruck,
    green: greenCompleteTruck,
    purple: purpleCompleteTruck,
  };

  const savedBodyColor = truckData?.customization?.bodyColor;
  const bodyColor: TruckColor =
    typeof savedBodyColor === "string" && savedBodyColor in completeTruckAssets
      ? savedBodyColor as TruckColor
      : "black";
  useEffect(() => {
    async function loadRaceQuestion() {
      try {
        const data = await startConversation();

        setQuestion(data.firstQuestion);
        setConversationState(data.conversationState);

        // await speak(
        //   `What ${data.firstQuestion.category.slice(0, -1)} is this?`
        // );
      } catch (error) {
        console.error("Unable to start race learning:", error);
      }
    }

    loadRaceQuestion();
  }, []);

  async function askAndListen(nextQuestion: Question) {
    try {
      await speak(
        `What ${nextQuestion.category.slice(0, -1)} is this?`
      );

      const transcript =
        await speechRecognitionService.startListening(setIsListening);

      const normalizedAnswer = normalizeSpeech(
        transcript,
        nextQuestion.category
      );

      await handleRaceAnswer(
        normalizedAnswer,
        nextQuestion
      );
    } catch (error) {
      console.error("Race voice/listening error:", error);
    }
  }

  async function handleStartRaceLearning() {
    if (!question || raceStarted) return;

    setRaceStarted(true);

    await askAndListen(question);
  }

  async function handleRaceAnswer(
    answer: string,
    questionToAnswer: Question
  ) {
    if (!conversationState || loading) return;

    try {
      setLoading(true);

      const currentCategory = questionToAnswer.category;

      const response = await respondConversation(
        answer,
        questionToAnswer,
        conversationState
      );

      setConversationState(response.conversationState);

      if (!response.correct) {
        setLoading(false);

        await speak("Try again!");

        await askAndListen(questionToAnswer);

        return;
      }

      await speak("Great job!");

      if (currentCategory === "letters") {
        setRaceStep(1);
      }

      if (currentCategory === "numbers") {
        setRaceStep(2);
      }

      if (currentCategory === "colors") {
        setRaceStep(3);
        setQuestion(null);

        window.setTimeout(() => {
          setShowRaceLight(false);
          setLearningComplete(true);
        }, 3000);

        return;
      }

      if (response.nextQuestion) {
        setQuestion(response.nextQuestion);
        setLoading(false);

        await askAndListen(response.nextQuestion);
      }

    } catch (error) {
      console.error("Unable to submit race answer:", error);
    } finally {
      setLoading(false);
    }
  }
  async function handleRaceMic() {
    if (!question || loading || isListening) return;

    try {
      const transcript =
        await speechRecognitionService.startListening(setIsListening);

      const normalizedAnswer = normalizeSpeech(
        transcript,
        question.category
      );

      await handleRaceAnswer(
        normalizedAnswer,
        question
      );
    } catch (error) {
      console.error("Race microphone error:", error);
    }
  }
  useEffect(() => {
    if (!learningComplete) return;

    const values = ["3", "2", "1", "GO!"];

    setCountdown(values[0]);
    startEngineRev();

    let index = 0;

    const timer = window.setInterval(() => {
      index++;

      if (index < values.length) {
        setCountdown(values[index]);
      } else {
        window.clearInterval(timer);
        stopEngineRev();

        window.setTimeout(() => {
          setCountdown("");
          setDriving(true);
        }, 1000);
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
      scheduleEngineRevStop();
    };
  }, [learningComplete]);

  useEffect(() => {
    if (!driving) return undefined;

    const splashTimer = window.setTimeout(() => {
      playPuddleSplash();
    }, 7560);
    const cheerTimer = window.setTimeout(() => {
      playCrowdCheer();
    }, 8100);

    return () => {
      window.clearTimeout(splashTimer);
      window.clearTimeout(cheerTimer);
    };
  }, [driving]);


  return (
    <main className="race-page">
      <PracticeTrack />

      {showRaceLight && !learningComplete && (
        <div className="race-learning">

          <div className="race-start-light">
            <img src={raceLight} alt="Race starting lights" />

            <span
              className={`race-start-light__bulb race-start-light__bulb--red ${raceStep >= 1 ? "race-start-light__bulb--active" : ""
                }`}
            />

            <span
              className={`race-start-light__bulb race-start-light__bulb--yellow ${raceStep >= 2 ? "race-start-light__bulb--active" : ""
                }`}
            />

            <span
              className={`race-start-light__bulb race-start-light__bulb--green ${raceStep >= 3 ? "race-start-light__bulb--active" : ""
                }`}
            />
          </div>

          {question && (
            <div className="race-question">

              {!raceStarted && (
                <button
                  type="button"
                  className="race-question__start"
                  onClick={handleStartRaceLearning}
                >
                  START RACE
                </button>
              )}

              {raceStarted && (
                <>
                  <p className="race-question__prompt">
                    What {question.category.slice(0, -1)} is this?
                  </p>

                  {question.category === "colors" ? (
                    <div
                      className="race-question__color"
                      style={{ backgroundColor: question.item.value }}
                    />
                  ) : (
                    <div className="race-question__value">
                      {question.item.value}
                    </div>
                  )}

                  <button
                    type="button"
                    className="race-question__mic"
                    onClick={handleRaceMic}
                    disabled={isListening || loading}
                  >
                    {isListening ? "🎙️ Listening..." : "🎤"}
                  </button>
                </>
              )}



            </div>
          )}

        </div>
      )}

      <Link className="practice-lap-nav practice-lap-nav--playhouse" to="/home" aria-label="Return to playhouse">
        <FaSignOutAlt aria-hidden />
      </Link>

      <Countdown value={countdown} />

      <div className={`practice-lap-effects ${driving ? "practice-lap-effects--active" : ""}`} aria-hidden>
        <div className="practice-lap-obstacle practice-lap-obstacle--mound" style={{ backgroundImage: `url(${lapAssets})` }} />
        <div className="practice-lap-obstacle practice-lap-obstacle--puddle" style={{ backgroundImage: `url(${lapAssets})` }} />
        <div className="practice-lap-splash" />
        <div className="practice-lap-finished" style={{ backgroundImage: `url(${lapAssets})` }} />
        <div className="practice-lap-confetti">
          {Array.from({ length: 28 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>

      <div className={`practice-truck-runner ${countdown && !driving ? "practice-truck-runner--revving" : ""} ${driving ? "practice-truck-runner--driving" : ""}`}>
        <div className="practice-truck-stack">
          <div className="practice-truck-smoke" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="practice-truck-driver" aria-hidden>
            <img src={raceAvatar} alt="" />
          </div>
          <img
            className="practice-truck"
            src={completeTruckAssets[bodyColor]}
            alt="Monster Truck"
          />
        </div>
      </div>

    </main>
  );
}
