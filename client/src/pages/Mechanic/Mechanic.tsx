import '../Home/Home.css'
import './Mechanic.css'
import { type CSSProperties, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import buildIconBody from '../../assets/build-icon-body.png'
import buildIconLights from '../../assets/build-icon-lights.png'
import buildIconWheels from '../../assets/build-icon-wheels.png'
import garageBg from '../../assets/garagBG.png'
import CustomizationPanel from './CustomizationPanel'
import MechanicAvatar from './MechanicAvatar'
import TruckPreview from './TruckPreview'
import { BUILD_ORDER, type TruckPart } from './truckBuild'
import { colorOptions, defaultTruckCustomization, type TruckColor, type TruckCustomization } from './truckCustomization'

const paintOptions = colorOptions.filter((color) => ['red', 'blue', 'green', 'purple'].includes(color.value))
const tapPlaceOffsets: Partial<Record<TruckPart, { x: number; y: number }>> = {
  wheels: { x: 0, y: -12 },
  body: { x: 0, y: -10 },
  lights: { x: 0, y: -4 },
}

const earnPrompts: Record<TruckPart, string> = {
  wheels: "Yo Derrick! I'm Jax! Tap here to earn the wheels.",
  body: 'Great wheels! Tap here to earn the body.',
  lights: 'Nice work! Tap here to earn the lights.',
  paint: 'Great lights! Tap here to earn paint.',
}

const earnLabels: Record<TruckPart, string> = {
  wheels: 'Earn the wheels',
  body: 'Earn the body',
  lights: 'Earn the lights',
  paint: 'Earn paint',
}

export default function Mechanic() {
  const navigate = useNavigate()
  const [customization, setCustomization] = useState<TruckCustomization>(defaultTruckCustomization)
  const [completedParts, setCompletedParts] = useState<TruckPart[]>([])
  const [earnedPart, setEarnedPart] = useState<TruckPart | undefined>()
  const [lastPlacedPart, setLastPlacedPart] = useState<TruckPart | undefined>()
  const [dropOffset, setDropOffset] = useState<{ x: number; y: number } | undefined>()
  const [guideMessage, setGuideMessage] = useState(earnPrompts.wheels)

  const nextPart = BUILD_ORDER[completedParts.length]
  const isTruckComplete = completedParts.length === BUILD_ORDER.length
  const canReset = completedParts.length > 0 || Boolean(earnedPart)

  const resetTruck = () => {
    setCustomization(defaultTruckCustomization)
    setCompletedParts([])
    setEarnedPart(undefined)
    setLastPlacedPart(undefined)
    setDropOffset(undefined)
    setGuideMessage(earnPrompts.wheels)
  }

  const earnNextPart = () => {
    if (!nextPart || earnedPart) return
    setEarnedPart(nextPart)

    if (nextPart === 'wheels') {
      setGuideMessage('You earned the wheels! Drag them to the glowing outline.')
      return
    }

    if (nextPart === 'body') {
      setGuideMessage('You earned the body! Put it on the truck.')
      return
    }

    if (nextPart === 'lights') {
      setGuideMessage('You earned the lights! Place them on top.')
      return
    }

    setGuideMessage('You earned paint! Pick a color for your truck.')
  }

  const addPart = (part: TruckPart, releaseOffset?: { x: number; y: number }) => {
    if (part !== earnedPart || part === 'paint' || completedParts.includes(part)) return

    const nextCompletedParts = [...completedParts, part]
    setCompletedParts(nextCompletedParts)
    setEarnedPart(undefined)
    setLastPlacedPart(part)
    setDropOffset(releaseOffset ?? tapPlaceOffsets[part] ?? { x: 0, y: -8 })

    if (part === 'wheels') {
      setCustomization((current) => ({ ...current, wheelColor: 'red' }))
      setGuideMessage(earnPrompts.body)
      return
    }

    if (part === 'body') {
      setCustomization((current) => ({ ...current, bodyColor: 'red' }))
      setGuideMessage(earnPrompts.lights)
      return
    }

    setCustomization((current) => ({ ...current, roofLights: 'four-light' }))
    setGuideMessage(earnPrompts.paint)
  }

  const choosePaint = (color: TruckColor) => {
    if (earnedPart !== 'paint' || completedParts.includes('paint')) return
    setCustomization((current) => ({ ...current, bodyColor: color, wheelColor: color }))
    setCompletedParts((current) => [...current, 'paint'])
    setEarnedPart(undefined)
    setLastPlacedPart('paint')
    setDropOffset(undefined)
    setGuideMessage('Truck complete! You are ready to race!')
  }

  const saveAndRace = (nextCustomization: TruckCustomization) => {
    setGuideMessage("Let's hit the track!")
    window.localStorage.setItem(
      'monsterTruckCustomization',
      JSON.stringify({
        customization: nextCustomization,
        isGrayed: !isTruckComplete,
        selectedOptions: {
          bodyColor: completedParts.includes('body'),
          decal: false,
          wheelColor: completedParts.includes('wheels'),
          roofLights: completedParts.includes('lights'),
          paint: completedParts.includes('paint'),
        },
      }),
    )
    navigate('/race')
  }

  const placeablePart = earnedPart === 'paint' ? undefined : earnedPart
  const partAsset = earnedPart === 'wheels' ? buildIconWheels : earnedPart === 'body' ? buildIconBody : earnedPart === 'lights' ? buildIconLights : undefined
  const partAlt =
    earnedPart === 'wheels' ? 'Unlocked wheels truck part' : earnedPart === 'body' ? 'Unlocked body truck part' : 'Unlocked lights truck part'
  const canEarnFromSpeech = Boolean(nextPart && !earnedPart)

  return (
    <div className="home" role="main" aria-label="Mechanic shop">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg mechanic__bg" style={{ backgroundImage: `url(${garageBg})` }} aria-hidden />
          <div className="mechanic-shop">
            <Link className="mechanic-exit" to="/" aria-label="Go back to the playhouse">
              <FaSignOutAlt aria-hidden />
            </Link>
            <CustomizationPanel
              completedParts={completedParts}
              earnedPart={earnedPart}
              onReset={resetTruck}
              onSaveAndRace={() => saveAndRace(customization)}
              canReset={canReset}
              canSave={isTruckComplete}
            />
            <TruckPreview
              completedParts={completedParts}
              earnedPart={placeablePart}
              lastPlacedPart={lastPlacedPart}
              dropOffset={dropOffset}
              bodyColor={customization.bodyColor}
              isComplete={isTruckComplete}
              onPartPlaced={addPart}
            />
            {earnedPart && partAsset && (
              <button
                type="button"
                className={`earned-part earned-part--${earnedPart}`}
                draggable
                onClick={() => addPart(earnedPart)}
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', earnedPart)
                  event.dataTransfer.effectAllowed = 'move'
                }}
                aria-label={`${partAlt}. Drag it to the glowing outline or tap to place it.`}
              >
                <img src={partAsset} alt="" draggable={false} aria-hidden />
              </button>
            )}
            {earnedPart === 'paint' && (
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
              onMessageClick={canEarnFromSpeech ? earnNextPart : undefined}
              messageActionLabel={nextPart ? earnLabels[nextPart] : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
