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

export default function Mechanic() {
  const navigate = useNavigate()
  const [customization, setCustomization] = useState<TruckCustomization>(defaultTruckCustomization)
  const [guideMessage, setGuideMessage] = useState("Let's build your truck!")

  const resetTruck = () => {
    setCustomization(defaultTruckCustomization)
    setGuideMessage("Let's try another look!")
  }

  const saveAndRace = (nextCustomization: TruckCustomization) => {
    setGuideMessage("Let's hit the track!")
    window.localStorage.setItem('monsterTruckCustomization', JSON.stringify(nextCustomization))
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
              onColorChange={(bodyColor) => {
                setCustomization((current) => ({ ...current, bodyColor }))
                setGuideMessage('Awesome color!')
              }}
              onDecalChange={(decal) => {
                setCustomization((current) => ({ ...current, decal }))
                setGuideMessage('That looks cool!')
              }}
              onWheelColorChange={(wheelColor) => {
                setCustomization((current) => ({ ...current, wheelColor }))
                setGuideMessage('Great wheels!')
              }}
              onLightChange={(roofLights) => {
                setCustomization((current) => ({ ...current, roofLights }))
                setGuideMessage('Those lights look great!')
              }}
            />
            <TruckPreview customization={customization} />
            <MechanicAvatar message={guideMessage} />
            <GarageActionBar customization={customization} onReset={resetTruck} onSaveAndRace={saveAndRace} />
          </div>
        </div>
      </div>
    </div>
  )
}
