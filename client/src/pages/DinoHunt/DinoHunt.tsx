import '../Home/Home.css'
import './DinoHunt.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBookOpen, FaRedo, FaSignOutAlt } from 'react-icons/fa'
import dinoBg from '../../assets/dinoBG.png'
import jaxDinoHunt from '../../assets/JaxDinoHunt.png'
import trexWhole from '../../assets/dino/trex-whole.png'
import trexSkull from '../../assets/dino/trex-skull.png'
import trexFoot from '../../assets/dino/trex-foot.png'
import trexLeg from '../../assets/dino/trex-leg.png'
import trexTail from '../../assets/dino/trex-tail.png'
import trexDragSkull from '../../assets/dino/trexdd-skull.png'
import trexDragFoot from '../../assets/dino/trexdd-foot.png'
import trexDragLeg from '../../assets/dino/trexdd-leg.png'
import trexDragTail from '../../assets/dino/trexdd-tail.png'

const dinosaurOptions = ['T-Rex', 'Stegosaurus', 'Triceratops']
const buildOptions = [
  { id: 'skull', label: 'Skull', image: trexSkull, dragImage: trexDragSkull },
  { id: 'foot', label: 'Foot', image: trexFoot, dragImage: trexDragFoot },
  { id: 'leg', label: 'Leg', image: trexLeg, dragImage: trexDragLeg },
  { id: 'tail', label: 'Tail', image: trexTail, dragImage: trexDragTail },
]

const dropTargets: Record<string, { x: number; y: number }> = {
  skull: { x: 69.5, y: 36.5 },
  foot: { x: 62.8, y: 53.8 },
  leg: { x: 54.0, y: 67.7 },
  tail: { x: 30.8, y: 53.1 },
}

const completedPartPlacements: Record<string, { x: number; y: number; widthVw: number; maxRem: number }> = {
  skull: { x: 69.5, y: 36.5, widthVw: 11.6, maxRem: 10.4 },
  foot: { x: 62.8, y: 53.8, widthVw: 12.6, maxRem: 7 },
  leg: { x: 54.0, y: 67.7, widthVw: 13.4, maxRem: 8 },
  tail: { x: 30.8, y: 53.1, widthVw: 18, maxRem: 16 },
}

type BuildPart = typeof buildOptions[number]
type DraggingPart = BuildPart & { x: number; y: number; isDragging: boolean }

export default function DinoHunt() {
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const [selectedDinosaur, setSelectedDinosaur] = useState<string | null>(null)
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [draggingPart, setDraggingPart] = useState<DraggingPart | null>(null)
  const [buildMessage, setBuildMessage] = useState("Great choice, Derrick! Pick a T-Rex piece and let's build it together.")
  const isTrexSelected = selectedDinosaur === 'T-Rex'
  const canResetDino = selectedParts.length > 0
  const canSaveDino = selectedParts.length === buildOptions.length

  const getScenePoint = (clientX: number, clientY: number) => {
    const sceneBounds = sceneRef.current?.getBoundingClientRect()

    if (!sceneBounds) {
      return { x: 50, y: 50 }
    }

    return {
      x: ((clientX - sceneBounds.left) / sceneBounds.width) * 100,
      y: ((clientY - sceneBounds.top) / sceneBounds.height) * 100,
    }
  }

  const showBuildPart = (part: BuildPart) => {
    if (selectedParts.includes(part.id)) {
      setBuildMessage(`The ${part.label.toLowerCase()} is already in place. Pick another piece!`)
      return
    }

    setDraggingPart({ ...part, x: 36, y: 43, isDragging: false })
    setBuildMessage(`Great! Now drag the ${part.label.toLowerCase()} into its glowing spot.`)
  }

  const startDraggingPart = (clientX: number, clientY: number) => {
    const scenePoint = getScenePoint(clientX, clientY)
    setDraggingPart((currentPart) => (
      currentPart ? { ...currentPart, ...scenePoint, isDragging: true } : currentPart
    ))
  }

  const resetDino = () => {
    setSelectedParts([])
    setDraggingPart(null)
    setBuildMessage("Let's try that T-Rex again. Pick a piece to start building.")
  }

  const saveDino = () => {
    setBuildMessage("Amazing build, Derrick! Your T-Rex is ready for dinosaur facts.")
  }

  useEffect(() => {
    if (!draggingPart?.isDragging) return

    const moveDraggingPart = (event: PointerEvent) => {
      const scenePoint = getScenePoint(event.clientX, event.clientY)
      setDraggingPart((currentPart) => (
        currentPart ? { ...currentPart, ...scenePoint } : currentPart
      ))
    }

    const finishDraggingPart = (event: PointerEvent) => {
      const scenePoint = getScenePoint(event.clientX, event.clientY)
      const target = dropTargets[draggingPart.id]
      const distanceFromTarget = Math.hypot(scenePoint.x - target.x, scenePoint.y - target.y)

      if (distanceFromTarget <= 8) {
        setSelectedParts((currentParts) => (
          currentParts.includes(draggingPart.id) ? currentParts : [...currentParts, draggingPart.id]
        ))
        setBuildMessage(`You found the right spot for the ${draggingPart.label.toLowerCase()}!`)
      } else {
        setBuildMessage(`Almost! Try moving the ${draggingPart.label.toLowerCase()} closer to its glowing spot.`)
      }

      setDraggingPart(null)
    }

    window.addEventListener('pointermove', moveDraggingPart)
    window.addEventListener('pointerup', finishDraggingPart, { once: true })

    return () => {
      window.removeEventListener('pointermove', moveDraggingPart)
      window.removeEventListener('pointerup', finishDraggingPart)
    }
  }, [draggingPart])

  return (
    <div className="home" role="main" aria-label="Dino hunt">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg" style={{ backgroundImage: `url(${dinoBg})` }} aria-hidden />
          <Link className="dino-hunt__exit" to="/home" aria-label="Go back to the playhouse">
            <FaSignOutAlt aria-hidden />
          </Link>
          <div className="dino-hunt__stage">
            {isTrexSelected ? (
              <div className="dino-hunt__trex-scene" aria-label="Build a T-Rex" ref={sceneRef}>
                <div className="dino-hunt__message dino-hunt__message--build" aria-live="polite">
                  <span className="dino-hunt__message-prompt">
                    {buildMessage}
                  </span>
                </div>
                <img src={trexWhole} alt="T-Rex skeleton" className="dino-hunt__trex" draggable={false} />
                <div className="dino-hunt__completed-parts" aria-hidden>
                  {buildOptions.map((option) => (
                    selectedParts.includes(option.id) && (
                      <img
                        src={option.dragImage}
                        alt=""
                        className={`dino-hunt__completed-part dino-hunt__completed-part--${option.id}`}
                        style={{
                          left: `${completedPartPlacements[option.id].x}%`,
                          top: `${completedPartPlacements[option.id].y}%`,
                          width: `min(${completedPartPlacements[option.id].widthVw}vw, ${completedPartPlacements[option.id].maxRem}rem)`,
                        }}
                        draggable={false}
                        key={option.id}
                      />
                    )
                  ))}
                </div>
                <div className="dino-hunt__drop-targets" aria-hidden>
                  {buildOptions.map((option) => (
                    <span
                      className={`dino-hunt__drop-target${draggingPart?.id === option.id ? ' dino-hunt__drop-target--active' : ''}${selectedParts.includes(option.id) ? ' dino-hunt__drop-target--complete' : ''}`}
                      style={{
                        left: `${dropTargets[option.id].x}%`,
                        top: `${dropTargets[option.id].y}%`,
                      }}
                      key={option.id}
                    />
                  ))}
                </div>
                <div className="dino-hunt__build-options" aria-label="T-Rex build options">
                  {buildOptions.map((option) => (
                    <button
                      type="button"
                      className={`dino-hunt__build-option${selectedParts.includes(option.id) ? ' dino-hunt__build-option--active' : ''}`}
                      key={option.id}
                      aria-label={`Add ${option.label}`}
                      aria-pressed={selectedParts.includes(option.id)}
                      onClick={() => {
                        showBuildPart(option)
                      }}
                    >
                      <img src={option.image} alt="" draggable={false} />
                    </button>
                  ))}
                </div>
                {draggingPart && (
                  <div
                    className={`dino-hunt__dragging-part dino-hunt__dragging-part--${draggingPart.id}${draggingPart.isDragging ? ' dino-hunt__dragging-part--active' : ''}`}
                    style={{
                      left: `${draggingPart.x}%`,
                      top: `${draggingPart.y}%`,
                    }}
                    onPointerDown={(event) => {
                      event.preventDefault()
                      startDraggingPart(event.clientX, event.clientY)
                    }}
                    role="presentation"
                  >
                    <img src={draggingPart.dragImage} alt="" draggable={false} />
                  </div>
                )}
                <div className="dino-hunt__actions" aria-label="Dino actions">
                  <button type="button" className="dino-hunt__reset" disabled={!canResetDino} onClick={resetDino}>
                    <FaRedo aria-hidden />
                    Reset Dino
                  </button>
                  <button type="button" className="dino-hunt__save" disabled={!canSaveDino} onClick={saveDino}>
                    <FaBookOpen aria-hidden />
                    Save &amp; Explore Dino Facts
                  </button>
                </div>
              </div>
            ) : (
              <div className="dino-hunt__message" aria-live="polite">
                <span className="dino-hunt__message-prompt">
                  Derrick, which dinosaur would you like to build?
                </span>
                <span className="dino-hunt__message-options">
                  {dinosaurOptions.map((dinosaur) => (
                    <button
                      type="button"
                      className="dino-hunt__option"
                      onClick={() => setSelectedDinosaur(dinosaur)}
                      key={dinosaur}
                    >
                      {dinosaur}
                    </button>
                  ))}
                </span>
              </div>
            )}
            <div className="dino-hunt__avatar" aria-hidden>
              <img
                src={jaxDinoHunt}
                alt=""
                className="dino-hunt__avatar-image"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
