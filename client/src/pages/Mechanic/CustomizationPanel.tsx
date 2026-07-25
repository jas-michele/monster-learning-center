import { FaCheck } from 'react-icons/fa'
import {
  colorOptions,
  decalOptions,
  lightOptions,
  type RoofLightOption,
  type TruckColor,
  type TruckCustomization,
  type TruckDecal,
  type WheelColor,
} from './truckCustomization'

type CustomizationPanelProps = {
  customization: TruckCustomization
  onColorChange: (color: TruckColor) => void
  onDecalChange: (decal: TruckDecal) => void
  onWheelColorChange: (color: WheelColor) => void
  onLightChange: (option: RoofLightOption) => void
}

function SelectionCheck() {
  return <FaCheck aria-hidden className="mechanic-panel__check" />
}

function PaintPicker({ selected, onColorChange }: { selected: TruckColor; onColorChange: (color: TruckColor) => void }) {
  return (
    <div className="mechanic-panel__paint-row" role="group" aria-label="Paint color">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          type="button"
          className="mechanic-panel__swatch"
          style={{ '--swatch-color': color.hex } as React.CSSProperties}
          aria-label={`${color.label} paint`}
          aria-pressed={selected === color.value}
          onClick={() => onColorChange(color.value)}
        >
          {selected === color.value && <SelectionCheck />}
        </button>
      ))}
    </div>
  )
}

function DecalPicker({ selected, onDecalChange }: { selected: TruckDecal; onDecalChange: (decal: TruckDecal) => void }) {
  return (
    <div className="mechanic-panel__card-row mechanic-panel__card-row--decals" role="group" aria-label="Decal">
      {decalOptions.map((decal) => (
        <button
          key={decal.value}
          type="button"
          className="mechanic-panel__option"
          aria-pressed={selected === decal.value}
          onClick={() => onDecalChange(decal.value)}
        >
          <span className={`mechanic-panel__decal-icon mechanic-panel__decal-icon--${decal.value}`} aria-hidden>
            {decal.icon}
          </span>
          <span>{decal.label}</span>
          {selected === decal.value && <SelectionCheck />}
        </button>
      ))}
    </div>
  )
}

function WheelPicker({ selected, onWheelColorChange }: { selected: WheelColor; onWheelColorChange: (color: WheelColor) => void }) {
  return (
    <div className="mechanic-panel__wheel-row" role="group" aria-label="Wheel color">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          type="button"
          className="mechanic-panel__wheel-choice"
          style={{ '--swatch-color': color.hex } as React.CSSProperties}
          aria-label={`${color.label} wheels`}
          aria-pressed={selected === color.value}
          onClick={() => onWheelColorChange(color.value)}
        >
          <span aria-hidden />
          {selected === color.value && <SelectionCheck />}
        </button>
      ))}
    </div>
  )
}

function LightPreview({ count }: { count: number }) {
  return (
    <span className="mechanic-panel__light-preview" aria-hidden>
      {count > 0 ? Array.from({ length: count }, (_, index) => <span key={index} />) : <span className="mechanic-panel__no-light" />}
    </span>
  )
}

function LightPicker({ selected, onLightChange }: { selected: RoofLightOption; onLightChange: (option: RoofLightOption) => void }) {
  return (
    <div className="mechanic-panel__card-row" role="group" aria-label="Roof lights">
      {lightOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className="mechanic-panel__option"
          aria-pressed={selected === option.value}
          onClick={() => onLightChange(option.value)}
        >
          <LightPreview count={option.count} />
          <span>{option.label}</span>
          {selected === option.value && <SelectionCheck />}
        </button>
      ))}
    </div>
  )
}

export default function CustomizationPanel({
  customization,
  onColorChange,
  onDecalChange,
  onWheelColorChange,
  onLightChange,
}: CustomizationPanelProps) {
  return (
    <section className="mechanic-panel" aria-labelledby="customize-title">
      <h2 id="customize-title">Customize Your Truck</h2>
      <div className="mechanic-panel__section">
        <h3>Paint Color</h3>
        <PaintPicker selected={customization.bodyColor} onColorChange={onColorChange} />
      </div>
      <div className="mechanic-panel__section">
        <h3>Decal</h3>
        <DecalPicker selected={customization.decal} onDecalChange={onDecalChange} />
      </div>
      <div className="mechanic-panel__section">
        <h3>Wheel Color</h3>
        <WheelPicker selected={customization.wheelColor} onWheelColorChange={onWheelColorChange} />
      </div>
      <div className="mechanic-panel__section">
        <h3>Lights</h3>
        <LightPicker selected={customization.roofLights} onLightChange={onLightChange} />
      </div>
    </section>
  )
}
