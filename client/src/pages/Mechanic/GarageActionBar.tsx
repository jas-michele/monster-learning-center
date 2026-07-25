import { Link } from 'react-router-dom'
import playhouseNav from '../../assets/playhouseNav-mechanic-fit.png'
import resetTruckNav from '../../assets/resetTruckNav.png'
import saveRaceNav from '../../assets/saveRaceNav.png'
import type { TruckCustomization } from './truckCustomization'

type GarageActionBarProps = {
  customization: TruckCustomization
  onReset: () => void
  onSaveAndRace: (customization: TruckCustomization) => void
}

export default function GarageActionBar({ customization, onReset, onSaveAndRace }: GarageActionBarProps) {
  return (
    <nav className="garage-actions" aria-label="Garage actions">
      <Link className="garage-actions__link garage-actions__link--mechanic" aria-label="Playhouse" to="/">
        <img src={playhouseNav} alt="" className="garage-actions__nav-image" aria-hidden />
      </Link>

      <button type="button" className="garage-actions__link garage-actions__link--dino" aria-label="Reset truck" onClick={onReset}>
        <img src={resetTruckNav} alt="" className="garage-actions__nav-image" aria-hidden />
      </button>

      <button
        type="button"
        className="garage-actions__link garage-actions__link--storytime"
        aria-label="Save and race"
        onClick={() => onSaveAndRace(customization)}
      >
        <img src={saveRaceNav} alt="" className="garage-actions__nav-image" aria-hidden />
      </button>
    </nav>
  )
}
