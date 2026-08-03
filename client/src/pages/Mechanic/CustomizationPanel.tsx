import { FaCheck, FaFlagCheckered, FaLock, FaRedo } from 'react-icons/fa'
import buildIconPaint from '../../assets/build-icon-paint.png'
import buildIconWheels from '../../assets/build-icon-wheels.png'
import type { TruckPart } from './truckBuild'

type CustomizationPanelProps = {
  completedParts: TruckPart[]
  onReset: () => void
  onSaveAndRace: () => void
  canReset: boolean
  canSave: boolean
}

const partOptions = [
  {
    value: 'wheels',
    label: 'Wheels',
    instruction: 'Build',
    asset: buildIconWheels,
  },
  {
    value: 'paint',
    label: 'Paint',
    instruction: 'Customize',
    asset: buildIconPaint,
  },
]


function PartIcon({ part }: { part: (typeof partOptions)[number] }) {
  return <img className="build-tray__icon" src={part.asset} alt="" draggable={false} aria-hidden />
}

export default function CustomizationPanel({
  completedParts,
  onReset,
  onSaveAndRace,
  canReset,
  canSave,
}: CustomizationPanelProps) {

  const wheelsComplete = completedParts.includes("wheels");
  const paintComplete = completedParts.includes("paint");
  return (
    <section className="mechanic-panel build-tray" aria-label="Build the monster truck">
      <div className="build-tray__parts" role="list" aria-label="Truck parts">
        {partOptions.map((part) => {
          const isComplete =
            part.value === "wheels"
              ? wheelsComplete
              : paintComplete;

          const isLocked =
            part.value === "paint"
              ? !wheelsComplete
              : false;

          return (
            <div className="build-tray__slot" role="listitem" key={part.value}>
              <button
                type="button"
                className={`build-tray__part build-tray__part--${part.value}${isComplete ? " build-tray__part--complete" : ""
                  }${isLocked ? " build-tray__part--locked" : ""
                  }`}
                aria-label={`${part.label} truck part ${isLocked ? "locked" : isComplete ? "complete" : "ready"
                  }`}
                aria-pressed={isComplete}
                disabled
              ></button>
            </div>
          )
        })}
      </div>

      <button type="button" className="build-tray__reset" disabled={!canReset} onClick={onReset}>
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
