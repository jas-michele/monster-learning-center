import '../Home/Home.css'
import './Mechanic.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import garageBg from '../../assets/garagBG.png'
import CustomizationPanel from './CustomizationPanel'
import GarageActionBar from './GarageActionBar'
import MechanicAvatar from './MechanicAvatar'
import TruckPreview from './TruckPreview'
import { defaultTruckCustomization, type TruckCustomization } from './truckCustomization'

const defaultSelectedOptions = {
  bodyColor: false,
  decal: false,
  wheelColor: false,
  roofLights: false,
}

export default function Mechanic() {
  const navigate = useNavigate()
  const [customization, setCustomization] = useState<TruckCustomization>(defaultTruckCustomization)
  const [selectedOptions, setSelectedOptions] = useState(defaultSelectedOptions)
  const [guideMessage, setGuideMessage] = useState("Let's build your truck and get ready for an adventure!")
  const [isTruckFresh, setIsTruckFresh] = useState(true)

  const resetTruck = () => {
    setCustomization(defaultTruckCustomization)
    setSelectedOptions(defaultSelectedOptions)
    setIsTruckFresh(true)
    setGuideMessage("Let's try another look!")
  }

  const saveAndRace = (nextCustomization: TruckCustomization) => {
    setGuideMessage("Let's hit the track!")
    window.localStorage.setItem(
      'monsterTruckCustomization',
      JSON.stringify({
        customization: nextCustomization,
        isGrayed: isTruckFresh,
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
              customization={customization}
              selectedOptions={selectedOptions}
              onColorChange={(bodyColor) => {
                setCustomization((current) => ({ ...current, bodyColor }))
                setSelectedOptions((current) => ({ ...current, bodyColor: true }))
                setIsTruckFresh(false)
                setGuideMessage('Awesome color!')
              }}
              onDecalChange={(decal) => {
                setCustomization((current) => ({ ...current, decal }))
                setSelectedOptions((current) => ({ ...current, decal: true }))
                setIsTruckFresh(false)
                setGuideMessage('That looks cool!')
              }}
              onWheelColorChange={(wheelColor) => {
                setCustomization((current) => ({ ...current, wheelColor }))
                setSelectedOptions((current) => ({ ...current, wheelColor: true }))
                setIsTruckFresh(false)
                setGuideMessage('Great wheels!')
              }}
              onLightChange={(roofLights) => {
                setCustomization((current) => ({ ...current, roofLights }))
                setSelectedOptions((current) => ({ ...current, roofLights: true }))
                setIsTruckFresh(false)
                setGuideMessage('Those lights look great!')
              }}
            />
            <TruckPreview customization={customization} isGrayed={isTruckFresh} />
            <MechanicAvatar message={guideMessage} />
            <GarageActionBar customization={customization} onReset={resetTruck} onSaveAndRace={saveAndRace} />
          </div>
        </div>
      </div>
    </div>
  )
}
