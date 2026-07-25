import { useState } from 'react'
import { FaBolt, FaCheck, FaCog, FaFire, FaPalette } from 'react-icons/fa'
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
  selectedOptions: {
    bodyColor: boolean
    decal: boolean
    wheelColor: boolean
    roofLights: boolean
  }
  onColorChange: (color: TruckColor) => void
  onDecalChange: (decal: TruckDecal) => void
  onWheelColorChange: (color: WheelColor) => void
  onLightChange: (option: RoofLightOption) => void
}

type CustomizationTab = 'paint' | 'decal' | 'wheels' | 'lights'

const customizationTabs: Array<{ value: CustomizationTab; label: string; icon: React.ComponentType<{ 'aria-hidden'?: boolean }> }> = [
  { value: 'paint', label: 'Paint', icon: FaPalette },
  { value: 'decal', label: 'Decal', icon: FaFire },
  { value: 'wheels', label: 'Wheels', icon: FaCog },
  { value: 'lights', label: 'Lights', icon: FaBolt },
]

function SelectionCheck() {
  return <FaCheck aria-hidden className="mechanic-panel__check" />
}

function PaintPicker({ selected, onColorChange }: { selected: TruckColor | null; onColorChange: (color: TruckColor) => void }) {
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

function DecalPicker({ selected, onDecalChange }: { selected: TruckDecal | null; onDecalChange: (decal: TruckDecal) => void }) {
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

function WheelPicker({ selected, onWheelColorChange }: { selected: WheelColor | null; onWheelColorChange: (color: WheelColor) => void }) {
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

function LightPicker({ selected, onLightChange }: { selected: RoofLightOption | null; onLightChange: (option: RoofLightOption) => void }) {
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
  selectedOptions,
  onColorChange,
  onDecalChange,
  onWheelColorChange,
  onLightChange,
}: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<CustomizationTab | null>(null)

  const activeTitle = customizationTabs.find((tab) => tab.value === activeTab)?.label ?? 'Paint'

  return (
    <section className="mechanic-panel" aria-labelledby="customize-title">
      <div className="mechanic-panel__top">
        <h2 id="customize-title">Customize Your Truck</h2>
        <div className="mechanic-panel__tabs" role="tablist" aria-label="Customization categories">
          {customizationTabs.map((tab) => {
            const Icon = tab.icon

            return (
              <button
                key={tab.value}
                type="button"
                className="mechanic-panel__tab"
                role="tab"
                aria-selected={activeTab === tab.value}
                aria-controls={activeTab ? 'customization-options' : undefined}
                onClick={() => setActiveTab(tab.value)}
              >
                <Icon aria-hidden />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {activeTab && (
        <div className="mechanic-panel__section mechanic-panel__section--active" id="customization-options" role="tabpanel">
          <h3>{activeTitle}</h3>
          {activeTab === 'paint' && (
            <PaintPicker selected={selectedOptions.bodyColor ? customization.bodyColor : null} onColorChange={onColorChange} />
          )}
          {activeTab === 'decal' && <DecalPicker selected={selectedOptions.decal ? customization.decal : null} onDecalChange={onDecalChange} />}
          {activeTab === 'wheels' && (
            <WheelPicker selected={selectedOptions.wheelColor ? customization.wheelColor : null} onWheelColorChange={onWheelColorChange} />
          )}
          {activeTab === 'lights' && <LightPicker selected={selectedOptions.roofLights ? customization.roofLights : null} onLightChange={onLightChange} />}
        </div>
      )}
    </section>
  )
}
