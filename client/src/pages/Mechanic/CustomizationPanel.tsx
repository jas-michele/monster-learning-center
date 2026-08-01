import { FaCheck, FaFlagCheckered, FaLock, FaRedo } from 'react-icons/fa'
import buildIconBody from '../../assets/build-icon-body.png'
import buildIconLights from '../../assets/build-icon-lights.png'
import buildIconWheels from '../../assets/build-icon-wheels.png'
import type { TruckPart } from './truckBuild'

type CustomizationPanelProps = {
  completedParts: TruckPart[]
  earnedPart: TruckPart | undefined
  nextPart: TruckPart | undefined
  onReset: () => void
  onEarnPart: () => void
  onSaveAndRace: () => void
  canSave: boolean
}

const partOptions: Array<{ value: TruckPart; label: string; instruction: string; asset: string }> = [
  { value: 'wheels', label: 'Wheels', instruction: 'Step 1', asset: buildIconWheels },
  { value: 'body', label: 'Body', instruction: 'Step 2', asset: buildIconBody },
  { value: 'lights', label: 'Lights', instruction: 'Step 3', asset: buildIconLights },
]

export default function CustomizationPanel({
  completedParts,
  earnedPart,
  nextPart,
  onReset,
  onEarnPart,
  onSaveAndRace,
  canSave,
}: CustomizationPanelProps) {
  const nextPartLabel = nextPart ? partOptions.find((part) => part.value === nextPart)?.label : undefined

  return (
    <section className="mechanic-panel build-tray" aria-labelledby="build-title">
      <h2 id="build-title">Build the Monster Truck</h2>

      <div className="build-tray__parts" role="list" aria-label="Truck parts">
        {partOptions.map((part) => {
          const isComplete = completedParts.includes(part.value)
          const isEarned = part.value === earnedPart
          const isLocked = !isComplete && !isEarned

          return (
            <div className="build-tray__slot" role="listitem" key={part.value}>
              <button
                type="button"
                className={`build-tray__part build-tray__part--${part.value}${isComplete ? ' build-tray__part--complete' : ''}`}
                aria-label={`${part.label} truck part${isLocked ? ' locked' : isComplete ? ' complete' : ' unlocked'}`}
                aria-pressed={isComplete}
                disabled
              >
                <span className="build-tray__status" aria-hidden>
                  {isComplete ? <FaCheck /> : isLocked ? <FaLock /> : 'Ready'}
                </span>
                <img className="build-tray__icon" src={part.asset} alt="" draggable={false} aria-hidden />
                <span className="build-tray__label">{part.label}</span>
              </button>
            </div>
          )
        })}
      </div>

      <button type="button" className="build-tray__earn" disabled={!nextPart || Boolean(earnedPart)} onClick={onEarnPart}>
        {nextPartLabel ? `Earn ${nextPartLabel}` : 'All Parts Earned'}
      </button>

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
