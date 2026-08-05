import { type CSSProperties } from 'react'
import truckStage0Axles from '../../assets/mechanic/truck-stage-0-axles.png'
import truckStage1OneWheel from '../../assets/mechanic/truck-stage-1-one-wheel.png'
import truckStage2TwoWheels from '../../assets/mechanic/truck-stage-2-two-wheels.png'
import truckStage3ThreeWheels from '../../assets/mechanic/truck-stage-3-three-wheels.png'
import { bodyAssets, type TruckColor } from './truckCustomization'

type TruckPreviewProps = {
  bodyColor: TruckColor
  isComplete: boolean

  installedTires: {
    frontLeft: boolean;
    frontRight: boolean;
    rearLeft: boolean;
    rearRight: boolean;
  }
}

const truckStageAssets = [
  truckStage0Axles,
  truckStage1OneWheel,
  truckStage2TwoWheels,
  truckStage3ThreeWheels,
] as const

const truckStageAlignment = [
  { x: '0.92%', y: '0.38%' },
  { x: '-0.12%', y: '-2.68%' },
  { x: '-0.52%', y: '0.39%' },
  { x: '0%', y: '0%' },
] as const

const completeTruckAlignment: Record<TruckColor, { x: string; y: string }> = {
  blue: { x: '0%', y: '0%' },
  black: { x: '0.04%', y: '-2.49%' },
  red: { x: '-1.48%', y: '-6.66%' },
  green: { x: '-0.11%', y: '-7.52%' },
  purple: { x: '-1.7%', y: '-2.83%' },
}

function getTruckStage(installedTires: TruckPreviewProps['installedTires']) {
  if (installedTires.rearRight || installedTires.rearLeft) return 3
  if (installedTires.frontRight) return 2
  if (installedTires.frontLeft) return 1
  return 0
}

function TruckStageImage({ stage }: { stage: number }) {
  const alignment = truckStageAlignment[stage]
  const stageStyle = {
    '--stage-x': alignment.x,
    '--stage-y': alignment.y,
  } as CSSProperties

  return (
    <div className="truck-preview__stage-window" aria-hidden>
      <img
        className="truck-preview__stage-image"
        src={truckStageAssets[stage]}
        style={stageStyle}
        alt=""
        draggable={false}
      />
    </div>
  )
}

function CompleteTruckImage({ bodyColor }: { bodyColor: TruckColor }) {
  const alignment = completeTruckAlignment[bodyColor]
  const completeTruckStyle = {
    '--complete-truck-x': alignment.x,
    '--complete-truck-y': alignment.y,
  } as CSSProperties

  return (
    <div className="truck-preview__complete-window" aria-hidden>
      <img
        className="truck-preview__complete-image"
        src={bodyAssets[bodyColor]}
        style={completeTruckStyle}
        alt=""
        draggable={false}
      />
    </div>
  )
}

export default function TruckPreview({ bodyColor, isComplete, installedTires }: TruckPreviewProps) {
  const truckStage = getTruckStage(installedTires)

  return (
    <section className="truck-preview" aria-label="Truck assembly area">
      <div className={`truck-preview__assembly${isComplete ? ' truck-preview__assembly--complete' : ''}`}>
        {isComplete ? <CompleteTruckImage bodyColor={bodyColor} /> : <TruckStageImage stage={truckStage} />}
      </div>
    </section>
  )
}
