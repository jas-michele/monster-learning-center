import { FaCheck, FaFlagCheckered, FaLock, FaRedo } from 'react-icons/fa'
import truckBodyRed from '../../assets/truck-body-red.png'
import truckLights from '../../assets/truck-lights.png'
import truckWheelsRed from '../../assets/truck-wheels-red.png'
import type { TruckPart } from './Mechanic'

type CustomizationPanelProps = {
  completedParts: TruckPart[]
  currentPart: TruckPart | undefined
  onPartSelect: (part: TruckPart) => void
  onReset: () => void
  onSaveAndRace: () => void
  canSave: boolean
}

const partOptions: Array<{ value: TruckPart; label: string; instruction: string; asset: string }> = [
  { value: 'wheels', label: 'Wheels', instruction: 'Step 1', asset: truckWheelsRed },
  { value: 'body', label: 'Body', instruction: 'Step 2', asset: truckBodyRed },
  { value: 'lights', label: 'Lights', instruction: 'Step 3', asset: truckLights },
]

export default function CustomizationPanel({ completedParts, currentPart, onPartSelect, onReset, onSaveAndRace, canSave }: CustomizationPanelProps) {
  return (
    <section className="mechanic-panel build-tray" aria-labelledby="build-title">
      <h2 id="build-title">Build the Monster Truck</h2>

      <div className="build-tray__parts" role="list" aria-label="Truck parts">
        {partOptions.map((part) => {
          const isComplete = completedParts.includes(part.value)
          const isLocked = !isComplete && part.value !== currentPart

          return (
            <div className="build-tray__slot" role="listitem" key={part.value}>
              <button
                type="button"
                className={`build-tray__part build-tray__part--${part.value}${isComplete ? ' build-tray__part--complete' : ''}`}
                aria-label={`${part.label} truck part${isLocked ? ' locked' : isComplete ? ' complete' : ' ready'}`}
                aria-pressed={isComplete}
                disabled={isLocked || isComplete}
                onClick={() => onPartSelect(part.value)}
              >
                <span className="build-tray__status" aria-hidden>
                  {isComplete ? <FaCheck /> : isLocked ? <FaLock /> : part.instruction}
                </span>
                <img src={part.asset} alt="" draggable={false} aria-hidden />
                <span className="build-tray__label">{part.label}</span>
              </button>
            </div>
          )
        })}
      </div>

      <button type="button" className="build-tray__reset" onClick={onReset}>
        <FaRedo aria-hidden />
        Reset Truck
      </button>

      <button type="button" className="build-tray__save" disabled={!canSave} onClick={onSaveAndRace}>
        <FaFlagCheckered aria-hidden />
        Save &amp; Race
      </button>
    </section>
  )
}
