import '../Home/Home.css'
import './DinoHunt.css'
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBookOpen, FaRedo, FaSignOutAlt } from 'react-icons/fa'
import dinoBg from '../../assets/dinohunt/scene/background.png'
import jaxDinoHunt from '../../assets/dinohunt/scene/jax.png'
import trexWhole from '../../assets/dinohunt/trex/whole.png'
import trexSkull from '../../assets/dinohunt/trex/buttons/skull.png'
import trexFoot from '../../assets/dinohunt/trex/buttons/foot.png'
import trexLeg from '../../assets/dinohunt/trex/buttons/leg.png'
import trexTail from '../../assets/dinohunt/trex/buttons/tail.png'
import trexDragSkull from '../../assets/dinohunt/trex/drag/skull.png'
import trexDragFoot from '../../assets/dinohunt/trex/drag/foot.png'
import trexDragLeg from '../../assets/dinohunt/trex/drag/leg.png'
import trexDragTail from '../../assets/dinohunt/trex/drag/tail.png'

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

const dinoDesignWidth = 1440
const dinoDesignHeight = 700
const partStagingPoint = { x: 36, y: 43 }

type BuildPart = typeof buildOptions[number]
type DraggingPart = BuildPart & { x: number; y: number; isDragging: boolean }

const getScenePositionStyle = (x: number, y: number): CSSProperties => ({
  '--dino-x': `${x}%`,
  '--dino-y': `${y}%`,
} as CSSProperties)

export default function DinoHunt() {
  const navigate = useNavigate()
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const [stageLayout, setStageLayout] = useState({ left: 0, top: 0, scale: 1 })
  const [selectedDinosaur, setSelectedDinosaur] = useState<string | null>(null)
  const [selectedParts, setSelectedParts] = useState<string[]>([])
  const [draggingPart, setDraggingPart] = useState<DraggingPart | null>(null)
  const [buildMessage, setBuildMessage] = useState("Great choice, Derrick! Pick a T-Rex piece and let's build it together.")
  const isTrexSelected = selectedDinosaur === 'T-Rex'
  const canResetDino = selectedParts.length > 0
  const canSaveDino = selectedParts.length === buildOptions.length

  const getScenePoint = useCallback((clientX: number, clientY: number) => {
    const sceneBounds = sceneRef.current?.getBoundingClientRect()

    if (!sceneBounds) {
      return { x: 50, y: 50 }
    }

    const logicalX = (clientX - sceneBounds.left) / stageLayout.scale
    const logicalY = (clientY - sceneBounds.top) / stageLayout.scale

    return {
      x: (logicalX / dinoDesignWidth) * 100,
      y: (logicalY / dinoDesignHeight) * 100,
    }
  }, [stageLayout.scale])

  const showBuildPart = (part: BuildPart) => {
    if (selectedParts.includes(part.id)) {
      setBuildMessage(`The ${part.label.toLowerCase()} is already in place. Pick another piece!`)
      return
    }

    setDraggingPart({ ...part, ...partStagingPoint, isDragging: false })
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
    navigate('/explore-dino')
  }

  useEffect(() => {
    const updateStageLayout = () => {
      const scale = Math.min(window.innerWidth / dinoDesignWidth, window.innerHeight / dinoDesignHeight)
      const scaledWidth = dinoDesignWidth * scale
      const scaledHeight = dinoDesignHeight * scale

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
        setDraggingPart(null)
      } else {
        setBuildMessage(`Almost! Try moving the ${draggingPart.label.toLowerCase()} closer to its glowing spot.`)
        setDraggingPart({ ...draggingPart, ...partStagingPoint, isDragging: false })
      }
    }

    window.addEventListener('pointermove', moveDraggingPart)
    window.addEventListener('pointerup', finishDraggingPart, { once: true })

    return () => {
      window.removeEventListener('pointermove', moveDraggingPart)
      window.removeEventListener('pointerup', finishDraggingPart)
    }
  }, [draggingPart, getScenePoint])

  const canvasStyle: CSSProperties = {
    transform: `translate(${stageLayout.left}px, ${stageLayout.top}px) scale(${stageLayout.scale})`,
  }

  return (
    <div className="home" role="main" aria-label="Dino hunt">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="dino-hunt__stage">
            <div className="dino-hunt__canvas" style={canvasStyle} ref={sceneRef}>
              <div className="home__bg" style={{ backgroundImage: `url(${dinoBg})` }} aria-hidden />
              <Link className="dino-hunt__exit" to="/home" aria-label="Go back to the playhouse">
                <FaSignOutAlt aria-hidden />
              </Link>
              {isTrexSelected ? (
                <div className="dino-hunt__trex-scene" aria-label="Build a T-Rex">
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
                          ...getScenePositionStyle(
                            completedPartPlacements[option.id].x,
                            completedPartPlacements[option.id].y,
                          ),
                          width: `min(${completedPartPlacements[option.id].widthVw}%, ${completedPartPlacements[option.id].maxRem}rem)`,
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
                      style={getScenePositionStyle(dropTargets[option.id].x, dropTargets[option.id].y)}
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
                    style={getScenePositionStyle(draggingPart.x, draggingPart.y)}
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
                    Save &amp; Explore
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
            </div>
          </div>
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
  )
}
