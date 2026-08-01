import '../Home/Home.css'
import './Mechanic.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import garageBg from '../../assets/garagBG.png'
import CustomizationPanel from './CustomizationPanel'
import MechanicAvatar from './MechanicAvatar'
import TruckPreview from './TruckPreview'
import { defaultTruckCustomization, type TruckCustomization } from './truckCustomization'

export type TruckPart = 'wheels' | 'body' | 'lights'

const BUILD_ORDER: TruckPart[] = ['wheels', 'body', 'lights']

export default function Mechanic() {
  const navigate = useNavigate()
  const [customization, setCustomization] = useState<TruckCustomization>(defaultTruckCustomization)
  const [completedParts, setCompletedParts] = useState<TruckPart[]>([])
  const [guideMessage, setGuideMessage] = useState("Yo Derrick! I'm Jax! Let's build your truck and go racing!")

  const currentPart = BUILD_ORDER[completedParts.length]
  const isTruckComplete = completedParts.length === BUILD_ORDER.length

  const resetTruck = () => {
    setCustomization(defaultTruckCustomization)
    setCompletedParts([])
    setGuideMessage("Yo Derrick! I'm Jax! Let's build your truck and go racing!")
  }

  const addPart = (part: TruckPart) => {
    if (part !== currentPart || completedParts.includes(part)) return

    const nextCompletedParts = [...completedParts, part]
    setCompletedParts(nextCompletedParts)

    if (part === 'wheels') {
      setCustomization((current) => ({ ...current, wheelColor: 'red' }))
      setGuideMessage('Great wheels! Now add the body.')
      return
    }

    if (part === 'body') {
      setCustomization((current) => ({ ...current, bodyColor: 'red' }))
      setGuideMessage('Nice work! Put the lights on top.')
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

  return (
    <div className="home" role="main" aria-label="Mechanic shop">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg mechanic__bg" style={{ backgroundImage: `url(${garageBg})` }} aria-hidden />
          <div className="mechanic-shop">
            <CustomizationPanel
              completedParts={completedParts}
              currentPart={currentPart}
              onPartSelect={addPart}
              onReset={resetTruck}
              onSaveAndRace={() => saveAndRace(customization)}
              canSave={isTruckComplete}
            />
            <TruckPreview completedParts={completedParts} isComplete={isTruckComplete} />
            <MechanicAvatar message={guideMessage} />
          </div>
        </div>
      </div>
    </div>
  )
}
