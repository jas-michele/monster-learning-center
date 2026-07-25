import {
  bodyAssets,
  lightOptions,
  type RoofLightOption,
  type TruckCustomization,
  type TruckDecal,
} from './truckCustomization'

function DecalLayer({ decal }: { decal: TruckDecal }) {
  if (decal === 'none') return null

  return (
    <div className={`truck-preview__decal truck-preview__decal--${decal}`} aria-hidden>
      {decal === 'flames' && '🔥'}
      {decal === 'claw-marks' && '///'}
      {decal === 'skull' && '☠'}
    </div>
  )
}

function LightLayer({ roofLights }: { roofLights: RoofLightOption }) {
  const count = lightOptions.find((option) => option.value === roofLights)?.count ?? 0
  if (count === 0) return null

  return (
    <div className={`truck-preview__lights truck-preview__lights--${count}`} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}

export default function TruckPreview({ customization }: { customization: TruckCustomization }) {
  return (
    <section className="truck-preview" aria-label="Truck preview">
      <div
        className={`truck-preview__truck truck-preview__truck--body-${customization.bodyColor} truck-preview__truck--wheels-${customization.wheelColor}`}
      >
        <img src={bodyAssets[customization.bodyColor]} alt="Customized monster truck preview" />
        <DecalLayer decal={customization.decal} />
        <LightLayer roofLights={customization.roofLights} />
      </div>
    </section>
  )
}
