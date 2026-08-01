import '../Home/Home.css'
import './Mechanic.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import buildIconBody from '../../assets/build-icon-body.png'
import buildIconLights from '../../assets/build-icon-lights.png'
import buildIconWheels from '../../assets/build-icon-wheels.png'
import garageBg from '../../assets/garagBG.png'
import CustomizationPanel from './CustomizationPanel'
import MechanicAvatar from './MechanicAvatar'
import TruckPreview from './TruckPreview'
import { BUILD_ORDER, type TruckPart } from './truckBuild'
import { defaultTruckCustomization, type TruckCustomization } from './truckCustomization'

export default function Mechanic() {
  const navigate = useNavigate()
  const [customization, setCustomization] = useState<TruckCustomization>(defaultTruckCustomization)
  const [completedParts, setCompletedParts] = useState<TruckPart[]>([])
  const [earnedPart, setEarnedPart] = useState<TruckPart | undefined>()
  const [guideMessage, setGuideMessage] = useState("Yo Derrick! I'm Jax! Let's build your truck and go racing!")

  const nextPart = BUILD_ORDER[completedParts.length]
  const isTruckComplete = completedParts.length === BUILD_ORDER.length

  const resetTruck = () => {
    setCustomization(defaultTruckCustomization)
    setCompletedParts([])
    setEarnedPart(undefined)
    setGuideMessage("Yo Derrick! I'm Jax! Let's build your truck and go racing!")
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

    setGuideMessage('You earned the lights! Place them on top.')
  }

  const addPart = (part: TruckPart) => {
    if (part !== earnedPart || completedParts.includes(part)) return

    const nextCompletedParts = [...completedParts, part]
    setCompletedParts(nextCompletedParts)
    setEarnedPart(undefined)

    if (part === 'wheels') {
      setCustomization((current) => ({ ...current, wheelColor: 'red' }))
      setGuideMessage('Great wheels! Earn the body next.')
      return
    }

    if (part === 'body') {
      setCustomization((current) => ({ ...current, bodyColor: 'red' }))
      setGuideMessage('Nice work! Earn the lights next.')
      return
    }

    setCustomization((current) => ({ ...current, roofLights: 'four-light' }))
    setGuideMessage('Truck Complete!')
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
        },
      }),
    )
    navigate('/race')
  }

  const partAsset = earnedPart === 'wheels' ? buildIconWheels : earnedPart === 'body' ? buildIconBody : earnedPart === 'lights' ? buildIconLights : undefined
  const partAlt =
    earnedPart === 'wheels' ? 'Unlocked wheels truck part' : earnedPart === 'body' ? 'Unlocked body truck part' : 'Unlocked lights truck part'

  return (
    <div className="home" role="main" aria-label="Mechanic shop">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg mechanic__bg" style={{ backgroundImage: `url(${garageBg})` }} aria-hidden />
          <div className="mechanic-shop">
            <CustomizationPanel
              completedParts={completedParts}
              earnedPart={earnedPart}
              nextPart={nextPart}
              onReset={resetTruck}
              onEarnPart={earnNextPart}
              onSaveAndRace={() => saveAndRace(customization)}
              canSave={isTruckComplete}
            />
            <TruckPreview completedParts={completedParts} earnedPart={earnedPart} isComplete={isTruckComplete} onPartPlaced={addPart} />
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
            <MechanicAvatar message={guideMessage} />
          </div>
        </div>
      </div>
    </div>
  )
}
