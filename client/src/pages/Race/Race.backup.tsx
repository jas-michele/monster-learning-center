import '../Home/Home.css'
import './Race.css'
import { useEffect, useState } from 'react'
import raceBg from '../../assets/race/raceTrack.png'
import raceAvatar from '../../assets/avatars/race.png'
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
import {
  playCrowdCheer,
  playPuddleSplash,
  scheduleEngineRevStop,
  startEngineRev,
  stopEngineRev
} from '../../utils/engineAudio'

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
    const parsedCustomization = parseCustomization(maybeSavedRaceTruck.customization)

    if ('customization' in maybeSavedRaceTruck) {
      return {
        customization: parsedCustomization,
        isGrayed: maybeSavedRaceTruck.isGrayed === true,
      }
    }

    const legacyCustomization = parseCustomization(parsed)

    return {
      customization: legacyCustomization,
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

  const [countdown, setCountdown] = useState('3')
const [driving, setDriving] = useState(false)

useEffect(() => {
  const values = ['3', '2', '1', 'GO!']

  startEngineRev()

  let index = 0

  const timer = window.setInterval(() => {
    index++

    if (index < values.length) {
      setCountdown(values[index])
    } else {
      window.clearInterval(timer)
      stopEngineRev()

      window.setTimeout(() => {
        setCountdown('')
        setDriving(true)
      }, 1000)
    }
  }, 1000)

  return () => {
    window.clearInterval(timer)
    scheduleEngineRevStop()
  }
}, [])

useEffect(() => {
  if (!driving) return

  const splashTimer = window.setTimeout(() => {
    playPuddleSplash()
  }, 7560)

  const cheerTimer = window.setTimeout(() => {
    playCrowdCheer()
  }, 8100)

  return () => {
    window.clearTimeout(splashTimer)
    window.clearTimeout(cheerTimer)
  }
}, [driving])

  return (
    <div className="home" role="main" aria-label="Race track">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg" style={{ backgroundImage: `url(${raceBg})` }} aria-hidden />
         {countdown && (
  <div className="race-countdown">
    {countdown}
  </div>
)}

<div
  className={`race-runner ${
    countdown && !driving ? 'race-runner--revving' : ''
  } ${driving ? 'race-runner--driving' : ''}`}
>
  <section
    className={`race-truck${isGrayed ? ' race-truck--grayed' : ''}`}
    aria-label="Your monster truck"
  >
    <div className="race-driver" aria-hidden>
      <img src={raceAvatar} alt="" />
    </div>

    <div className="race-smoke" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </div>

    <img
      className="race-truck__body-image"
      src={bodyAssets[customization.bodyColor]}
      alt="Your customized monster truck on the race track"
    />

    <RaceTruckDecal decal={customization.decal} />
    <RaceTruckLights roofLights={customization.roofLights} />
  </section>
</div>
        </div>
      </div>
    </div>
  )
}
