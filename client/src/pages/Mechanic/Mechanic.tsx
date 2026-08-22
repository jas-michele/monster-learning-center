import '../Home/Home.css'
import './Mechanic.css'
import { type CSSProperties, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import garageBg from '../../assets/mechanic/garagBG.png'
import CustomizationPanel from './CustomizationPanel'
import MechanicAvatar from './MechanicAvatar'
import TruckPreview from './TruckPreview'
import { colorOptions, defaultTruckCustomization, type TruckColor, type TruckCustomization } from './truckCustomization'
import { startConversation, respondConversation } from '../../services/conversationApi'
import type { ConversationState, Question, RespondConversationResponse } from '../../types/conversation'
import { startEngineRev } from '../../utils/engineAudio'
import { speak } from "../../services/voice";
import speechRecognitionService from "../../services/speechRecognition";
import { normalizeSpeech } from "../../utils/normalizeSpeech";


const paintOptions = colorOptions.filter((color) => ['red', 'blue', 'green', 'purple'].includes(color.value))

const mechanicDesignWidth = 1440
const mechanicDesignHeight = 700

export default function Mechanic() {
  const navigate = useNavigate()
  const [customization, setCustomization] = useState<TruckCustomization>(defaultTruckCustomization)
  const [stageLayout, setStageLayout] = useState({
  left: 0,
  top: 0,
  scale: 1,
})
  const [guideMessage, setGuideMessage] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [started, setStarted] = useState(false);

  const [installedTires, setInstalledTires] = useState({
    frontLeft: false,
    frontRight: false,
    rearLeft: false,
    rearRight: false,
  });



  function updateDialogue(
    message: string,
    nextQuestion: Question | null,
    nextConversationState: ConversationState
  ) {
    setConversationState(nextConversationState);
    setQuestion(nextQuestion);
    setGuideMessage(message);
  }

  async function startBuilding() {
    if (started) return;

    setStarted(true);
    await loadConversation();
  }

  async function loadConversation() {

    console.log("loadConversation");
    try {
      const response = await startConversation();

      updateDialogue(
        response.greeting,
        response.firstQuestion,
        response.conversationState
      );

      await playDialogue(
        response.greeting,
        response.firstQuestion,
        response.conversationState
      );
    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {
    const updateStageLayout = () => {
      const scale = Math.min(window.innerWidth / mechanicDesignWidth, window.innerHeight / mechanicDesignHeight)
      const scaledWidth = mechanicDesignWidth * scale
      const scaledHeight = mechanicDesignHeight * scale

      setStageLayout({
        left: (window.innerWidth - scaledWidth) / 2,
        top: (window.innerHeight - scaledHeight) / 2,
        scale,
      })
    }

    updateStageLayout()
    window.addEventListener('resize', updateStageLayout)

    return () => window.removeEventListener('resize', updateStageLayout)
  }, [])


  async function handleAnswerForQuestion(
    answer: string,
    questionToAnswer: Question,
    stateToUse: ConversationState
  ) {
    if (loadingQuestion) return;

    try {
      setLoadingQuestion(true);

      const response = await respondConversation(
        answer,
        questionToAnswer,
        stateToUse
      );

      await handleResponse(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function handleAnswer(answer: string) {
    if (!question || !conversationState) return;

    await handleAnswerForQuestion(
      answer,
      question,
      conversationState
    );
  }

  const isTruckComplete = installedTires.rearLeft;
  const canReset =
    installedTires.frontLeft ||
    installedTires.frontRight ||
    installedTires.rearRight ||
    installedTires.rearLeft;

  const resetTruck = () => {
    // Restore the default truck
    setCustomization(defaultTruckCustomization);

    // Remove all installed tires
    setInstalledTires({
      frontLeft: false,
      frontRight: false,
      rearRight: false,
      rearLeft: false,
    });

    // Reset guide message
    loadConversation();
  }

  const choosePaint = (color: TruckColor) => {
    setCustomization((current) => ({
      ...current,
      bodyColor: color,
    }));

    setGuideMessage("Awesome! Your truck is ready to race!");
  };

  const saveAndRace = (nextCustomization: TruckCustomization) => {
    setGuideMessage("Let's hit the track!")
    startEngineRev()
    window.localStorage.setItem(
      'monsterTruckCustomization',
      JSON.stringify({
        customization: nextCustomization,
        isGrayed: !isTruckComplete,
      }),
    )
    navigate('/practice-lap')
  }
  async function handleResponse(response: RespondConversationResponse) {
    if (response.correct) {
      if (
        installedTires.frontLeft &&
        installedTires.frontRight &&
        installedTires.rearRight &&
        !installedTires.rearLeft
      ) {
        setCustomization((currentCustomization) => ({
          ...currentCustomization,
          bodyColor: "black",
          roofLights: "four-light",
        }));
      }

      installNextTire();
    }

    updateDialogue(
      response.message,
      response.nextQuestion,
      response.conversationState
    );

    await playDialogue(
      response.message,
      response.nextQuestion,
      response.conversationState
    );
  }


  function installNextTire() {
    console.log("installNextTire called");
    setInstalledTires((current) => {
      if (!current.frontLeft) {
        return { ...current, frontLeft: true };
      }

      if (!current.frontRight) {
        return { ...current, frontRight: true };
      }

      if (!current.rearRight) {
        return { ...current, rearRight: true };
      }

      if (!current.rearLeft) {
        return { ...current, rearLeft: true };
      }

      return current;
    });
  }

  function buildQuestionText(question: Question) {
    switch (question.category) {
      case "letters":
        return "What letter is this?";

      case "numbers":
        return "What number is this?";

      case "colors":
        return "What color is this?";

      case "shapes":
        return "What shape is this?";

      default:
        return "";
    }
  }

  async function playDialogue(
    message: string,
    nextQuestion: Question | null,
    nextConversationState: ConversationState
  ) {
    try {
      setIsSpeaking(true);

      await speak(message);

      if (nextQuestion) {
        await speak(buildQuestionText(nextQuestion));
      }

      setIsSpeaking(false);

      if (nextQuestion) {
        const transcript =
          await speechRecognitionService.startListening(setIsListening);

        const normalizedAnswer = normalizeSpeech(
          transcript,
          nextQuestion.category
        );

        await handleAnswerForQuestion(
          normalizedAnswer,
          nextQuestion,
          nextConversationState
        );
      }
    } catch (err) {
      console.error("Mechanic voice/listening error:", err);
    } finally {
      setIsSpeaking(false);
    }
  }

  const canvasStyle: CSSProperties = {
  transform: `translate(${stageLayout.left}px, ${stageLayout.top}px) scale(${stageLayout.scale})`,
};


  return (
    <div className="home" role="main" aria-label="Mechanic shop">
      <div className="home__scene-frame">
       <div className="home__scene">
  <div
    className="mechanic__design-frame"
    style={canvasStyle}
  >
    <div
      className="home__bg mechanic__bg"
      style={{ backgroundImage: `url(${garageBg})` }}
      aria-hidden
    />

    <div className="mechanic-shop">

            {!started && (
              <button
                type="button"
                className="mechanic-start"
                onClick={startBuilding}
              >
                BUILD!
              </button>
            )}
            <Link className="mechanic-exit" to="/home" aria-label="Go back to the playhouse">
              <FaSignOutAlt aria-hidden />
            </Link>
            <CustomizationPanel
              onReset={resetTruck}
              onSaveAndRace={() => saveAndRace(customization)}
              canReset={canReset}
              canSave={isTruckComplete}
            />
            <TruckPreview
              bodyColor={customization.bodyColor}
              isComplete={isTruckComplete}
              installedTires={installedTires}
            />
            {isTruckComplete && (
              <div className="paint-picker" aria-label="Choose a truck paint color">
                {paintOptions.map((color) => (
                  <button
                    type="button"
                    className="paint-picker__choice"
                    style={{ '--paint-color': color.hex } as CSSProperties}
                    onClick={() => choosePaint(color.value)}
                    key={color.value}
                    aria-label={`Choose ${color.label} paint`}
                  >
                    <span aria-hidden />
                    {color.label}
                  </button>
                ))}
              </div>
            )}
            <MechanicAvatar
              message={guideMessage}
              question={question}
              loading={loadingQuestion}
              onSubmit={handleAnswer}
              isSpeaking={isSpeaking}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
