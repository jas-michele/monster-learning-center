import '../Home/Home.css'
import './Mechanic.css'
import { type CSSProperties, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import garageBg from '../../assets/mechanic/garagBG.png'
import CustomizationPanel from './CustomizationPanel'
import MechanicAvatar from './MechanicAvatar'
import TruckPreview from './TruckPreview'
import { colorOptions, defaultTruckCustomization, type TruckColor, type TruckCustomization } from './truckCustomization'
import { startConversation, respondConversation } from '../../services/conversationApi'
import type { ConversationState, Question, RespondConversationResponse } from '../../types/conversation'
import { speak } from "../../services/voice";


const paintOptions = colorOptions.filter((color) => ['red', 'blue', 'green', 'purple'].includes(color.value))

export default function Mechanic() {
  const navigate = useNavigate()
  const [customization, setCustomization] = useState<TruckCustomization>(defaultTruckCustomization)
  const [guideMessage, setGuideMessage] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
        response.firstQuestion
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadConversation();
  }, []);


  async function handleAnswer(answer: string) {
    if (!conversationState) return;

    try {
      setLoadingQuestion(true);

      if (!question) return;

      const response = await respondConversation(
        answer,
        question,
        conversationState
      );

    await handleResponse(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingQuestion(false);
    }
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
    response.nextQuestion
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
    nextQuestion: Question | null
  ) {
    try {
      setIsSpeaking(true);

      await speak(message);

      if (nextQuestion) {
        await speak(buildQuestionText(nextQuestion));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSpeaking(false);
    }
  }



  return (
    <div className="home" role="main" aria-label="Mechanic shop">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg mechanic__bg" style={{ backgroundImage: `url(${garageBg})` }} aria-hidden />
          <div className="mechanic-shop">
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
  )
}
