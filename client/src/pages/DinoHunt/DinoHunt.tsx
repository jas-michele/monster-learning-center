import '../Home/Home.css'
import './DinoHunt.css'
import { type CSSProperties, type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import stegosaurusBuildDrop from '../../assets/dinohunt/stegosaurus/build-drop.png'
import stegosaurusSkull from '../../assets/dinohunt/stegosaurus/buttons/skull.png'
import stegosaurusPlate from '../../assets/dinohunt/stegosaurus/buttons/plate.png'
import stegosaurusLeg from '../../assets/dinohunt/stegosaurus/buttons/leg.png'
import stegosaurusTail from '../../assets/dinohunt/stegosaurus/buttons/tail.png'
import stegosaurusDragSkull from '../../assets/dinohunt/stegosaurus/drag/skull.png'
import stegosaurusDragPlate from '../../assets/dinohunt/stegosaurus/drag/plate.png'
import stegosaurusDragLeg from '../../assets/dinohunt/stegosaurus/drag/leg.png'
import stegosaurusDragTail from '../../assets/dinohunt/stegosaurus/drag/tail.png'
import triceratopBuildDrop from '../../assets/dinohunt/triceratop/build-drop-wide.png'
import triceratopFrill from '../../assets/dinohunt/triceratop/buttons/frill.png'
import triceratopLeg from '../../assets/dinohunt/triceratop/buttons/leg.png'
import triceratopHip from '../../assets/dinohunt/triceratop/buttons/hip.png'
import triceratopTail from '../../assets/dinohunt/triceratop/buttons/tail.png'
import triceratopDragFrill from '../../assets/dinohunt/triceratop/drag-matched/frill.png'
import triceratopDragLeg from '../../assets/dinohunt/triceratop/drag-matched/leg.png'
import triceratopDragHip from '../../assets/dinohunt/triceratop/drag-matched/hip.png'
import triceratopDragTail from '../../assets/dinohunt/triceratop/drag-matched/tail.png'

type DinosaurId = 'trex' | 'stegosaurus' | 'triceratop'
type BuildPart = {
  id: string
  label: string
  image: string
  dragImage: string
}
type DinoPoint = { x: number; y: number }
type PartPlacement = DinoPoint & { widthVw: number; maxRem: number; rotationDeg?: number }
type PlacementDebugMode = 'placed' | 'popup'
type DinosaurConfig = {
  id: DinosaurId
  label: string
  wholeImage: string
  wholeAlt: string
  buildOptions: BuildPart[]
  stagingPoint: DinoPoint
  stagingPartPlacements?: Record<string, PartPlacement>
  dropTargets: Record<string, DinoPoint>
  completedPartPlacements: Record<string, PartPlacement>
  initialMessage: string
  resetMessage: string
}

const trexBuildOptions: BuildPart[] = [
  { id: 'skull', label: 'Skull', image: trexSkull, dragImage: trexDragSkull },
  { id: 'foot', label: 'Foot', image: trexFoot, dragImage: trexDragFoot },
  { id: 'leg', label: 'Leg', image: trexLeg, dragImage: trexDragLeg },
  { id: 'tail', label: 'Tail', image: trexTail, dragImage: trexDragTail },
]

const stegosaurusBuildOptions: BuildPart[] = [
  { id: 'skull', label: 'Skull', image: stegosaurusSkull, dragImage: stegosaurusDragSkull },
  { id: 'plate', label: 'Plate', image: stegosaurusPlate, dragImage: stegosaurusDragPlate },
  { id: 'leg', label: 'Leg', image: stegosaurusLeg, dragImage: stegosaurusDragLeg },
  { id: 'tail', label: 'Tail', image: stegosaurusTail, dragImage: stegosaurusDragTail },
]

const triceratopBuildOptions: BuildPart[] = [
  { id: 'frill', label: 'Frill', image: triceratopFrill, dragImage: triceratopDragFrill },
  { id: 'leg', label: 'Leg', image: triceratopLeg, dragImage: triceratopDragLeg },
  { id: 'hip', label: 'Hip', image: triceratopHip, dragImage: triceratopDragHip },
  { id: 'tail', label: 'Tail', image: triceratopTail, dragImage: triceratopDragTail },
]

const dinosaurConfigs: Record<DinosaurId, DinosaurConfig> = {
  trex: {
    id: 'trex',
    label: 'T-Rex',
    wholeImage: trexWhole,
    wholeAlt: 'T-Rex skeleton',
    buildOptions: trexBuildOptions,
    stagingPoint: { x: 36, y: 43 },
    dropTargets: {
      skull: { x: 69.5, y: 36.5 },
      foot: { x: 62.8, y: 53.8 },
      leg: { x: 54.0, y: 67.7 },
      tail: { x: 30.8, y: 53.1 },
    },
    completedPartPlacements: {
      skull: { x: 69.5, y: 36.5, widthVw: 11.6, maxRem: 10.4 },
      foot: { x: 62.8, y: 53.8, widthVw: 12.6, maxRem: 7 },
      leg: { x: 54.0, y: 67.7, widthVw: 13.4, maxRem: 8 },
      tail: { x: 30.8, y: 53.1, widthVw: 18, maxRem: 16 },
    },
    initialMessage: "Great choice, Derrick! Pick a T-Rex piece and let's build it together.",
    resetMessage: "Let's try that T-Rex again. Pick a piece to start building.",
  },
  stegosaurus: {
    id: 'stegosaurus',
    label: 'Stegosaurus',
    wholeImage: stegosaurusBuildDrop,
    wholeAlt: 'Stegosaurus skeleton',
    buildOptions: stegosaurusBuildOptions,
    stagingPoint: { x: 30, y: 27 },
    dropTargets: {
      skull: { x: 71.5, y: 62.5 },
      plate: { x: 47.7, y: 36.7 },
      leg: { x: 59.4, y: 68.5 },
      tail: { x: 26.5, y: 60.7 },
    },
    completedPartPlacements: {
      skull: { x: 71.5, y: 62.5, widthVw: 11.2, maxRem: 9.6 },
      plate: { x: 47.7, y: 36.7, widthVw: 7.1, maxRem: 6.4 },
      leg: { x: 59.4, y: 68.5, widthVw: 9.9, maxRem: 8.2 },
      tail: { x: 26.5, y: 60.7, widthVw: 10.4, maxRem: 9.3 },
    },
    initialMessage: "Great choice, Derrick! Pick a Stegosaurus piece and let's build it together.",
    resetMessage: "Let's try that Stegosaurus again. Pick a piece to start building.",
  },
  triceratop: {
    id: 'triceratop',
    label: 'Triceratops',
    wholeImage: triceratopBuildDrop,
    wholeAlt: 'Triceratops skeleton',
    buildOptions: triceratopBuildOptions,
    stagingPoint: { x: 50, y: 72 },
    stagingPartPlacements: {
      frill: { x: 50, y: 72, widthVw: 9.8, maxRem: 8.9, rotationDeg: 0 },
      leg: { x: 50, y: 72, widthVw: 9.9, maxRem: 8.9, rotationDeg: 0 },
      hip: { x: 50, y: 72, widthVw: 11, maxRem: 9.8, rotationDeg: 0 },
      tail: { x: 50, y: 72, widthVw: 14.7, maxRem: 12.9, rotationDeg: 0 },
    },
    dropTargets: {
      frill: { x: 34.6, y: 41.1 },
      leg: { x: 40.5, y: 69 },
      hip: { x: 53.5, y: 45.6 },
      tail: { x: 67.8, y: 55.5 },
    },
    completedPartPlacements: {
      frill: { x: 34.6, y: 41.1, widthVw: 9.8, maxRem: 8.9, rotationDeg: 0 },
      leg: { x: 40.5, y: 69, widthVw: 11.1, maxRem: 10.1, rotationDeg: 0 },
      hip: { x: 53.5, y: 45.6, widthVw: 11.4, maxRem: 10.2, rotationDeg: 18 },
      tail: { x: 67.8, y: 55.5, widthVw: 15.5, maxRem: 13.7, rotationDeg: 8 },
    },
    initialMessage: "Great choice, Derrick! Pick a Triceratops piece and let's build it together.",
    resetMessage: "Let's try that Triceratops again. Pick a piece to start building.",
  },
}

const dinosaurOptions = ['T-Rex', 'Stegosaurus', 'Triceratops']
const dinosaurByLabel: Partial<Record<string, DinosaurId>> = {
  'T-Rex': 'trex',
  Stegosaurus: 'stegosaurus',
  Triceratops: 'triceratop',
}

const dinoDesignWidth = 1500
const dinoDesignHeight = 700

type DraggingPart = BuildPart & {
  x: number
  y: number
  isDragging: boolean
  widthVw?: number
  maxRem?: number
  rotationDeg?: number
}
type PlacementDebugDrag = { partId: string; offsetX: number; offsetY: number } | null

const getScenePositionStyle = (x: number, y: number): CSSProperties => ({
  '--dino-x': `${x}%`,
  '--dino-y': `${y}%`,
  left: `${x}%`,
  top: `${y}%`,
} as CSSProperties)

const getPlacementDebuggerDinosaur = (search: string) => {
  const searchParams = new URLSearchParams(search)
  const debugDinosaur = searchParams.get('placementDebug') ?? searchParams.get('debugPlacement')
  const normalizedDebugDinosaur = debugDinosaur?.toLowerCase()

  if (normalizedDebugDinosaur === '' || normalizedDebugDinosaur === 'true' || normalizedDebugDinosaur === '1') {
    return 'triceratop'
  }

  if (normalizedDebugDinosaur === 'triceratops' || normalizedDebugDinosaur === 'trcieratop') {
    return 'triceratop'
  }

  return normalizedDebugDinosaur && normalizedDebugDinosaur in dinosaurConfigs ? normalizedDebugDinosaur as DinosaurId : null
}

const getStagingPlacements = (config: DinosaurConfig): Record<string, PartPlacement> => (
  Object.fromEntries(config.buildOptions.map((part) => {
    const completedPlacement = config.completedPartPlacements[part.id]
    const stagingPlacement = config.stagingPartPlacements?.[part.id]

    return [part.id, {
      x: stagingPlacement?.x ?? config.stagingPoint.x,
      y: stagingPlacement?.y ?? config.stagingPoint.y,
      widthVw: stagingPlacement?.widthVw ?? completedPlacement.widthVw,
      maxRem: stagingPlacement?.maxRem ?? completedPlacement.maxRem,
      rotationDeg: stagingPlacement?.rotationDeg ?? completedPlacement.rotationDeg ?? 0,
    }]
  }))
)

const getPartTransform = (rotationDeg = 0) => `translate(-50%, -50%) rotate(${rotationDeg}deg)`

export default function DinoHunt() {
  const navigate = useNavigate()
  const location = useLocation()
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const placementDebuggerDinosaur = getPlacementDebuggerDinosaur(location.search)
  const isPlacementDebugger = Boolean(placementDebuggerDinosaur)
  const [stageLayout, setStageLayout] = useState({ left: 0, top: 0, scale: 1 })
  const [selectedDinosaur, setSelectedDinosaur] = useState<DinosaurId | null>(placementDebuggerDinosaur)
  const [selectedParts, setSelectedParts] = useState<string[]>(() => (
    placementDebuggerDinosaur ? dinosaurConfigs[placementDebuggerDinosaur].buildOptions.map((part) => part.id) : []
  ))
  const [draggingPart, setDraggingPart] = useState<DraggingPart | null>(null)
  const [buildMessage, setBuildMessage] = useState(dinosaurConfigs.trex.initialMessage)
  const [debugMode, setDebugMode] = useState<PlacementDebugMode>('placed')
  const [debugPlacements, setDebugPlacements] = useState<Record<string, PartPlacement>>(() => (
    placementDebuggerDinosaur ? dinosaurConfigs[placementDebuggerDinosaur].completedPartPlacements : {}
  ))
  const [debugPopupPlacements, setDebugPopupPlacements] = useState<Record<string, PartPlacement>>(() => (
    placementDebuggerDinosaur ? getStagingPlacements(dinosaurConfigs[placementDebuggerDinosaur]) : {}
  ))
  const [activeDebugPart, setActiveDebugPart] = useState<string | null>(() => (
    placementDebuggerDinosaur ? dinosaurConfigs[placementDebuggerDinosaur].buildOptions[0]?.id ?? null : null
  ))
  const [debugDrag, setDebugDrag] = useState<PlacementDebugDrag>(null)
  const selectedDinosaurConfig = selectedDinosaur ? dinosaurConfigs[selectedDinosaur] : null
  const buildOptions = selectedDinosaurConfig?.buildOptions ?? []
  const canResetDino = selectedParts.length > 0
  const canSaveDino = selectedParts.length === buildOptions.length
  const visiblePlacements = isPlacementDebugger ? debugPlacements : selectedDinosaurConfig?.completedPartPlacements
  const activeDebugPlacements = debugMode === 'popup' ? debugPopupPlacements : debugPlacements

  useEffect(() => {
    if (!placementDebuggerDinosaur) return

    const debugConfig = dinosaurConfigs[placementDebuggerDinosaur]

    setSelectedDinosaur(placementDebuggerDinosaur)
    setSelectedParts(debugConfig.buildOptions.map((part) => part.id))
    setDebugPlacements(debugConfig.completedPartPlacements)
    setDebugPopupPlacements(getStagingPlacements(debugConfig))
    setActiveDebugPart(debugConfig.buildOptions[0]?.id ?? null)
    setDraggingPart(null)
    setBuildMessage(`${debugConfig.label} placement debugger`)
  }, [placementDebuggerDinosaur])

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
    if (isPlacementDebugger) {
      setActiveDebugPart(part.id)
      return
    }

    if (selectedParts.includes(part.id)) {
      setBuildMessage(`The ${part.label.toLowerCase()} is already in place. Pick another piece!`)
      return
    }

    const stagingPlacement = selectedDinosaurConfig?.stagingPartPlacements?.[part.id]
      ?? (selectedDinosaurConfig ? getStagingPlacements(selectedDinosaurConfig)[part.id] : null)

    setDraggingPart({
      ...part,
      ...(stagingPlacement ?? selectedDinosaurConfig?.stagingPoint ?? dinosaurConfigs.trex.stagingPoint),
      rotationDeg: stagingPlacement?.rotationDeg ?? 0,
      isDragging: false,
    })
    setBuildMessage(`Great! Now drag the ${part.label.toLowerCase()} into its glowing spot.`)
  }

  const getDropTargetForPart = useCallback((partId: string) => {
    if (isPlacementDebugger && debugPlacements[partId]) {
      return debugPlacements[partId]
    }

    return selectedDinosaurConfig?.dropTargets[partId] ?? dinosaurConfigs.trex.dropTargets[partId]
  }, [debugPlacements, isPlacementDebugger, selectedDinosaurConfig])

  const getCompletedPlacementForPart = (partId: string) => {
    return visiblePlacements?.[partId] ?? dinosaurConfigs.trex.completedPartPlacements[partId]
  }

  const getDraggingPartStyle = (part: DraggingPart) => {
    if (selectedDinosaur === 'stegosaurus' || selectedDinosaur === 'triceratop') {
      const placement = getCompletedPlacementForPart(part.id)

      return {
        ...getScenePositionStyle(part.x, part.y),
        width: `min(${part.widthVw ?? placement.widthVw}%, ${part.maxRem ?? placement.maxRem}rem)`,
        transform: getPartTransform(part.rotationDeg ?? placement.rotationDeg),
      }
    }

    return getScenePositionStyle(part.x, part.y)
  }

  const chooseDinosaur = (dinosaur: string) => {
    if (isPlacementDebugger) return

    const dinosaurId = dinosaurByLabel[dinosaur]

    setSelectedParts([])
    setDraggingPart(null)

    if (!dinosaurId) {
      setSelectedDinosaur(null)
      setBuildMessage("That dinosaur is coming soon. Pick T-Rex, Stegosaurus, or Triceratops today!")
      return
    }

    setSelectedDinosaur(dinosaurId)
    setBuildMessage(dinosaurConfigs[dinosaurId].initialMessage)
  }

  const startDraggingPart = (clientX: number, clientY: number) => {
    if (isPlacementDebugger) return

    const scenePoint = getScenePoint(clientX, clientY)
    setDraggingPart((currentPart) => (
      currentPart ? { ...currentPart, ...scenePoint, isDragging: true } : currentPart
    ))
  }

  const resetDino = () => {
    if (isPlacementDebugger && selectedDinosaurConfig) {
      setDebugPlacements(selectedDinosaurConfig.completedPartPlacements)
      setDebugPopupPlacements(getStagingPlacements(selectedDinosaurConfig))
      setActiveDebugPart(selectedDinosaurConfig.buildOptions[0]?.id ?? null)
      return
    }

    setSelectedParts([])
    setDraggingPart(null)
    setBuildMessage(selectedDinosaurConfig?.resetMessage ?? dinosaurConfigs.trex.resetMessage)
  }

  const saveDino = () => {
    if (isPlacementDebugger) return

    if (selectedDinosaur) {
      window.localStorage.setItem('dinohunt:lastSavedDinosaur', selectedDinosaur)
    }

    navigate('/explore-dino', { state: { dinosaur: selectedDinosaur ?? 'trex' } })
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
    if (!isPlacementDebugger || !debugDrag) return

    const moveDebugPart = (event: PointerEvent) => {
      const scenePoint = getScenePoint(event.clientX, event.clientY)
      const setPlacements = debugMode === 'popup' ? setDebugPopupPlacements : setDebugPlacements

      setPlacements((currentPlacements) => {
        const currentPlacement = currentPlacements[debugDrag.partId]

        if (!currentPlacement) return currentPlacements

        return {
          ...currentPlacements,
          [debugDrag.partId]: {
            ...currentPlacement,
            x: Number((scenePoint.x - debugDrag.offsetX).toFixed(1)),
            y: Number((scenePoint.y - debugDrag.offsetY).toFixed(1)),
          },
        }
      })
    }

    const finishDebugPart = () => {
      setDebugDrag(null)
    }

    window.addEventListener('pointermove', moveDebugPart)
    window.addEventListener('pointerup', finishDebugPart, { once: true })

    return () => {
      window.removeEventListener('pointermove', moveDebugPart)
      window.removeEventListener('pointerup', finishDebugPart)
    }
  }, [debugDrag, debugMode, getScenePoint, isPlacementDebugger])

  useEffect(() => {
    if (isPlacementDebugger) return
    if (!draggingPart?.isDragging) return

    const moveDraggingPart = (event: PointerEvent) => {
      const scenePoint = getScenePoint(event.clientX, event.clientY)
      setDraggingPart((currentPart) => (
        currentPart ? { ...currentPart, ...scenePoint } : currentPart
      ))
    }

    const finishDraggingPart = (event: PointerEvent) => {
      if (!selectedDinosaurConfig) return

      const scenePoint = getScenePoint(event.clientX, event.clientY)
      const target = getDropTargetForPart(draggingPart.id)
      const distanceFromTarget = Math.hypot(scenePoint.x - target.x, scenePoint.y - target.y)

      if (distanceFromTarget <= 8) {
        setSelectedParts((currentParts) => (
          currentParts.includes(draggingPart.id) ? currentParts : [...currentParts, draggingPart.id]
        ))
        setBuildMessage(`You found the right spot for the ${draggingPart.label.toLowerCase()}!`)
        setDraggingPart(null)
      } else {
        const stagingPlacement = selectedDinosaurConfig?.stagingPartPlacements?.[draggingPart.id]
        setBuildMessage(`Almost! Try moving the ${draggingPart.label.toLowerCase()} closer to its glowing spot.`)
        setDraggingPart({
          ...draggingPart,
          ...(stagingPlacement ?? selectedDinosaurConfig?.stagingPoint ?? dinosaurConfigs.trex.stagingPoint),
          rotationDeg: stagingPlacement?.rotationDeg ?? draggingPart.rotationDeg ?? 0,
          isDragging: false,
        })
      }
    }

    window.addEventListener('pointermove', moveDraggingPart)
    window.addEventListener('pointerup', finishDraggingPart, { once: true })

    return () => {
      window.removeEventListener('pointermove', moveDraggingPart)
      window.removeEventListener('pointerup', finishDraggingPart)
    }
  }, [draggingPart, getDropTargetForPart, getScenePoint, selectedDinosaurConfig])

  const startDebugPartDrag = (event: ReactPointerEvent<HTMLElement>, partId: string) => {
    if (!isPlacementDebugger) return

    event.preventDefault()
    const scenePoint = getScenePoint(event.clientX, event.clientY)
    const placement = activeDebugPlacements[partId]

    if (!placement) return

    setActiveDebugPart(partId)
    setDebugDrag({
      partId,
      offsetX: scenePoint.x - placement.x,
      offsetY: scenePoint.y - placement.y,
    })
  }

  const adjustDebugPartSize = (partId: string, delta: number) => {
    const setPlacements = debugMode === 'popup' ? setDebugPopupPlacements : setDebugPlacements

    setPlacements((currentPlacements) => {
      const currentPlacement = currentPlacements[partId]

      if (!currentPlacement) return currentPlacements

      const nextWidth = Math.max(2, Number((currentPlacement.widthVw + delta).toFixed(1)))
      const maxRemDelta = delta * 0.9

      return {
        ...currentPlacements,
        [partId]: {
          ...currentPlacement,
          widthVw: nextWidth,
          maxRem: Math.max(2, Number((currentPlacement.maxRem + maxRemDelta).toFixed(1))),
        },
      }
    })
  }

  const adjustDebugPartRotation = (partId: string, delta: number) => {
    const setPlacements = debugMode === 'popup' ? setDebugPopupPlacements : setDebugPlacements

    setPlacements((currentPlacements) => {
      const currentPlacement = currentPlacements[partId]

      if (!currentPlacement) return currentPlacements

      return {
        ...currentPlacements,
        [partId]: {
          ...currentPlacement,
          rotationDeg: Number(((currentPlacement.rotationDeg ?? 0) + delta).toFixed(1)),
        },
      }
    })
  }

  const debugConfigText = buildOptions
    .map((option) => {
      const placement = activeDebugPlacements[option.id]

      if (!placement) return ''

      return `${option.id}: { x: ${placement.x}, y: ${placement.y}, widthVw: ${placement.widthVw}, maxRem: ${placement.maxRem}, rotationDeg: ${placement.rotationDeg ?? 0} },`
    })
    .filter(Boolean)
    .join('\n')

  const placementDebuggerPanel = isPlacementDebugger && selectedDinosaurConfig ? (
    <aside className="dino-hunt__placement-debugger" aria-label="Placement debugger">
      <strong>{selectedDinosaurConfig.label} placements</strong>
      <div className="dino-hunt__placement-debugger-modes">
        <button
          type="button"
          className={debugMode === 'placed' ? 'dino-hunt__placement-debugger-part dino-hunt__placement-debugger-part--active' : 'dino-hunt__placement-debugger-part'}
          onClick={() => setDebugMode('placed')}
        >
          Placed
        </button>
        <button
          type="button"
          className={debugMode === 'popup' ? 'dino-hunt__placement-debugger-part dino-hunt__placement-debugger-part--active' : 'dino-hunt__placement-debugger-part'}
          onClick={() => setDebugMode('popup')}
        >
          Popup
        </button>
      </div>
      <div className="dino-hunt__placement-debugger-parts">
        {buildOptions.map((option) => (
          <button
            type="button"
            className={activeDebugPart === option.id ? 'dino-hunt__placement-debugger-part dino-hunt__placement-debugger-part--active' : 'dino-hunt__placement-debugger-part'}
            onClick={() => setActiveDebugPart(option.id)}
            key={option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
      {activeDebugPart && activeDebugPlacements[activeDebugPart] && (
        <div className="dino-hunt__placement-debugger-controls">
          <span>
            {debugMode === 'popup' ? 'popup' : 'placed'} | x {activeDebugPlacements[activeDebugPart].x} | y {activeDebugPlacements[activeDebugPart].y}
          </span>
          <span>
            width {activeDebugPlacements[activeDebugPart].widthVw}% | max {activeDebugPlacements[activeDebugPart].maxRem}rem
          </span>
          <span>
            rotation {activeDebugPlacements[activeDebugPart].rotationDeg ?? 0}deg
          </span>
          <button type="button" onClick={() => adjustDebugPartSize(activeDebugPart, -0.2)}>
            Smaller
          </button>
          <button type="button" onClick={() => adjustDebugPartSize(activeDebugPart, 0.2)}>
            Larger
          </button>
          <button type="button" onClick={() => adjustDebugPartRotation(activeDebugPart, -5)}>
            Rotate -5
          </button>
          <button type="button" onClick={() => adjustDebugPartRotation(activeDebugPart, -1)}>
            Rotate -1
          </button>
          <button type="button" onClick={() => adjustDebugPartRotation(activeDebugPart, 1)}>
            Rotate +1
          </button>
          <button type="button" onClick={() => adjustDebugPartRotation(activeDebugPart, 5)}>
            Rotate +5
          </button>
        </div>
      )}
      <strong>{debugMode === 'popup' ? 'stagingPartPlacements' : 'completedPartPlacements'}</strong>
      <pre>{debugConfigText}</pre>
    </aside>
  ) : null

  const canvasStyle: CSSProperties = {
    transform: `translate(${stageLayout.left}px, ${stageLayout.top}px) scale(${stageLayout.scale})`,
  }

  return (
    <div className="home" role="main" aria-label="Dino hunt">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="dino-hunt__stage">
            <div
              className={`dino-hunt__canvas${isPlacementDebugger ? ' dino-hunt__canvas--debugging' : ''}`}
              style={canvasStyle}
              ref={sceneRef}
            >
              <div className="home__bg" style={{ backgroundImage: `url(${dinoBg})` }} aria-hidden />
              <Link className="dino-hunt__exit" to="/home" aria-label="Go back to the playhouse">
                <FaSignOutAlt aria-hidden />
              </Link>
              {selectedDinosaurConfig ? (
                <div
                  className={`dino-hunt__trex-scene dino-hunt__build-scene dino-hunt__build-scene--${selectedDinosaurConfig.id}`}
                  aria-label={`Build a ${selectedDinosaurConfig.label}`}
                >
                <div className="dino-hunt__message dino-hunt__message--build" aria-live="polite">
                  <span className="dino-hunt__message-prompt">
                    {buildMessage}
                  </span>
                </div>
                <img
                  src={selectedDinosaurConfig.wholeImage}
                  alt={selectedDinosaurConfig.wholeAlt}
                  className={`dino-hunt__trex dino-hunt__skeleton dino-hunt__skeleton--${selectedDinosaurConfig.id}`}
                  draggable={false}
                />
	                <div className="dino-hunt__completed-parts" aria-hidden={!isPlacementDebugger}>
	                  {buildOptions.map((option) => (
	                    ((isPlacementDebugger && debugMode === 'placed') || (!isPlacementDebugger && selectedParts.includes(option.id))) && (
	                      <img
	                        src={option.dragImage}
	                        alt=""
                        className={`dino-hunt__completed-part dino-hunt__completed-part--${option.id}${activeDebugPart === option.id ? ' dino-hunt__completed-part--debug-active' : ''}`}
                        style={{
	                          ...getScenePositionStyle(
	                            getCompletedPlacementForPart(option.id).x,
	                            getCompletedPlacementForPart(option.id).y,
	                          ),
	                          width: `min(${getCompletedPlacementForPart(option.id).widthVw}%, ${getCompletedPlacementForPart(option.id).maxRem}rem)`,
	                          transform: getPartTransform(getCompletedPlacementForPart(option.id).rotationDeg),
	                        }}
	                        draggable={false}
	                        onPointerDown={(event) => startDebugPartDrag(event, option.id)}
                        key={option.id}
                      />
                    )
	                  ))}
	                </div>
	                {isPlacementDebugger && debugMode === 'popup' && activeDebugPart && activeDebugPlacements[activeDebugPart] && (
	                  <div
	                    className={`dino-hunt__dragging-part dino-hunt__dragging-part--${activeDebugPart} dino-hunt__dragging-part--active`}
	                    style={{
	                      ...getScenePositionStyle(
	                        activeDebugPlacements[activeDebugPart].x,
	                        activeDebugPlacements[activeDebugPart].y,
	                      ),
	                      width: `min(${activeDebugPlacements[activeDebugPart].widthVw}%, ${activeDebugPlacements[activeDebugPart].maxRem}rem)`,
	                      transform: getPartTransform(activeDebugPlacements[activeDebugPart].rotationDeg),
	                    }}
	                    onPointerDown={(event) => startDebugPartDrag(event, activeDebugPart)}
	                    role="presentation"
	                  >
	                    <img
	                      src={buildOptions.find((option) => option.id === activeDebugPart)?.dragImage}
	                      alt=""
	                      draggable={false}
	                    />
	                  </div>
	                )}
                <div className="dino-hunt__drop-targets" aria-hidden>
                  {buildOptions.map((option) => (
                    <span
                      className={`dino-hunt__drop-target${draggingPart?.id === option.id ? ' dino-hunt__drop-target--active' : ''}${selectedParts.includes(option.id) ? ' dino-hunt__drop-target--complete' : ''}`}
                      style={getScenePositionStyle(
                        getDropTargetForPart(option.id).x,
                        getDropTargetForPart(option.id).y,
                      )}
                      key={option.id}
                    />
                  ))}
                </div>
                <div className="dino-hunt__build-options" aria-label={`${selectedDinosaurConfig.label} build options`}>
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
                    style={getDraggingPartStyle(draggingPart)}
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
                        onClick={() => chooseDinosaur(dinosaur)}
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
          {placementDebuggerPanel}
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
