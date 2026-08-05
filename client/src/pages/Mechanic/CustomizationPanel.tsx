import { FaFlagCheckered, FaRedo } from 'react-icons/fa'

type CustomizationPanelProps = {
  onReset: () => void
  onSaveAndRace: () => void
  canReset: boolean
  canSave: boolean
}

export default function CustomizationPanel({
  onReset,
  onSaveAndRace,
  canReset,
  canSave,
}: CustomizationPanelProps) {
  return (
    <section className="mechanic-actions build-tray" aria-label="Truck actions">
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
