import '../Home/Home.css'
import './Race.css'
import raceBg from '../../assets/raceBG.png'
import {
  bodyAssets,
  colorOptions,
  defaultTruckCustomization,
  lightOptions,
  type RoofLightOption,
  type TruckColor,
  type TruckCustomization,
  type TruckDecal,
} from '../Mechanic/truckCustomization'

const truckColors = new Set(colorOptions.map((color) => color.value))
const truckDecals = new Set(['none', 'flames', 'claw-marks', 'skull'])
const roofLightOptions = new Set(lightOptions.map((option) => option.value))

type SavedRaceTruck = {
  customization: TruckCustomization
  isGrayed: boolean
}

function isTruckColor(value: unknown): value is TruckColor {
  return typeof value === 'string' && truckColors.has(value as TruckColor)
}

function isTruckDecal(value: unknown): value is TruckDecal {
  return typeof value === 'string' && truckDecals.has(value)
}

function isRoofLightOption(value: unknown): value is RoofLightOption {
  return typeof value === 'string' && roofLightOptions.has(value as RoofLightOption)
}

function parseCustomization(value: unknown): TruckCustomization {
  if (!value || typeof value !== 'object') return defaultTruckCustomization

  const maybeCustomization = value as Partial<TruckCustomization>

  return {
    bodyColor: isTruckColor(maybeCustomization.bodyColor) ? maybeCustomization.bodyColor : defaultTruckCustomization.bodyColor,
    decal: isTruckDecal(maybeCustomization.decal) ? maybeCustomization.decal : defaultTruckCustomization.decal,
    wheelColor: isTruckColor(maybeCustomization.wheelColor) ? maybeCustomization.wheelColor : defaultTruckCustomization.wheelColor,
    roofLights: isRoofLightOption(maybeCustomization.roofLights) ? maybeCustomization.roofLights : defaultTruckCustomization.roofLights,
  }
}

function getSavedRaceTruck(): SavedRaceTruck {
  try {
    const savedCustomization = window.localStorage.getItem('monsterTruckCustomization')
    if (!savedCustomization) {
      return {
        customization: defaultTruckCustomization,
        isGrayed: false,
      }
    }

    const parsed: unknown = JSON.parse(savedCustomization)
    if (!parsed || typeof parsed !== 'object') {
      return {
        customization: defaultTruckCustomization,
        isGrayed: false,
      }
    }

    const maybeSavedRaceTruck = parsed as Partial<SavedRaceTruck>

    if ('customization' in maybeSavedRaceTruck) {
      return {
        customization: parseCustomization(maybeSavedRaceTruck.customization),
        isGrayed: maybeSavedRaceTruck.isGrayed === true,
      }
    }

    return {
      customization: parseCustomization(parsed),
      isGrayed: false,
    }
  } catch {
    return {
      customization: defaultTruckCustomization,
      isGrayed: false,
    }
  }
}

function RaceTruckDecal({ decal }: { decal: TruckDecal }) {
  if (decal === 'none') return null

  return (
    <div className={`race-truck__decal race-truck__decal--${decal}`} aria-hidden>
      {decal === 'flames' && '🔥'}
      {decal === 'claw-marks' && '///'}
      {decal === 'skull' && '☠'}
    </div>
  )
}

function RaceTruckLights({ roofLights }: { roofLights: RoofLightOption }) {
  const count = lightOptions.find((option) => option.value === roofLights)?.count ?? 0
  if (count === 0) return null

  return (
    <div className="race-truck__lights" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}

export default function Race() {
  const { customization, isGrayed } = getSavedRaceTruck()

  return (
    <div className="home" role="main" aria-label="Race track">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg" style={{ backgroundImage: `url(${raceBg})` }} aria-hidden />
          <section className={`race-truck${isGrayed ? ' race-truck--grayed' : ''}`} aria-label="Your monster truck">
            <img src={bodyAssets[customization.bodyColor]} alt="Your customized monster truck on the race track" />
            <RaceTruckDecal decal={customization.decal} />
            <RaceTruckLights roofLights={customization.roofLights} />
          </section>
        </div>
      </div>
    </div>
  )
}
