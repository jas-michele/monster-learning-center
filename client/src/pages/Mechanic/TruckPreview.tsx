import { type CSSProperties, type DragEvent } from 'react'
import truckBodyBlue from '../../assets/truck-body-blue.png'
import truckBodyGreen from '../../assets/truck-body-green.png'
import truckBodyPurple from '../../assets/truck-body-purple.png'
import truckBodyRed from '../../assets/truck-body-red.png'
import truckLightsBlue from '../../assets/truck-lights-blue.png'
import truckLightsGreen from '../../assets/truck-lights-green.png'
import truckLightsPurple from '../../assets/truck-lights-purple.png'
import truckLights from '../../assets/truck-lights.png'
import truckWheelsBlue from '../../assets/truck-wheels-blue.png'
import truckWheelsGreen from '../../assets/truck-wheels-green.png'
import truckWheelsPurple from '../../assets/truck-wheels-purple.png'
import truckWheelsRed from '../../assets/truck-wheels-red.png'
import type { TruckPart } from './truckBuild'
import type { TruckColor } from './truckCustomization'
import blackTruck from "../../assets/Truck-body-bl.png"
import blackTire from "../../assets/Tires (1).png"
import completeTruck from "../../assets/blackTruck.png"

type TruckPreviewProps = {
  completedParts: TruckPart[]
  earnedPart: TruckPart | undefined
  lastPlacedPart: TruckPart | undefined
  dropOffset: { x: number; y: number } | undefined
  bodyColor: TruckColor
  isComplete: boolean
  onPartPlaced: (part: TruckPart, dropOffset?: { x: number; y: number }) => void

  installedTires: {
    frontLeft: boolean;
    frontRight: boolean;
    rearLeft: boolean;
    rearRight: boolean;
  }
}

const partAnchors: Record<TruckPart, { x: number; y: number }> = {
  wheels: { x: 0.5, y: 0.76 },
  body: { x: 0.5, y: 0.38 },
  lights: { x: 0.5, y: 0.13 },
  paint: { x: 0.5, y: 0.5 },
}

const bodyLayerAssets: Record<TruckColor, string> = {
  red: truckBodyRed,
  orange: truckBodyRed,
  green: truckBodyGreen,
  blue: truckBodyBlue,
  purple: truckBodyPurple,
  black: truckBodyRed,
}

const wheelLayerAssets: Record<TruckColor, string> = {
  red: truckWheelsRed,
  orange: truckWheelsRed,
  green: truckWheelsGreen,
  blue: truckWheelsBlue,
  purple: truckWheelsPurple,
  black: truckWheelsRed,
}

const lightLayerAssets: Record<TruckColor, string> = {
  red: truckLights,
  orange: truckLights,
  green: truckLightsGreen,
  blue: truckLightsBlue,
  purple: truckLightsPurple,
  black: truckLights,
}

export default function TruckPreview({ completedParts, earnedPart, lastPlacedPart, dropOffset, bodyColor, isComplete, onPartPlaced, installedTires }: TruckPreviewProps) {
  const hasWheels = completedParts.includes('wheels')
  const hasBody = completedParts.includes('body')
  const hasLights = completedParts.includes('lights')
  const hasPaint = completedParts.includes('paint')
  const bodyAsset = hasPaint ? bodyLayerAssets[bodyColor] : truckBodyRed
  const wheelAsset = hasPaint ? wheelLayerAssets[bodyColor] : truckWheelsRed
  const lightAsset = hasPaint ? lightLayerAssets[bodyColor] : truckLights


  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!earnedPart) return
    event.preventDefault()
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedPart = event.dataTransfer.getData('text/plain') as TruckPart
    if (droppedPart === earnedPart) {
      const bounds = event.currentTarget.getBoundingClientRect()
      const anchor = partAnchors[droppedPart]
      const releaseX = event.clientX - bounds.left
      const releaseY = event.clientY - bounds.top
      const targetX = bounds.width * anchor.x
      const targetY = bounds.height * anchor.y
      onPartPlaced(droppedPart, {
        x: ((releaseX - targetX) / bounds.width) * 100,
        y: ((releaseY - targetY) / bounds.height) * 100,
      })
    }
  }

  const placedStyle =
    lastPlacedPart && dropOffset
      ? ({
        '--drop-x': `${dropOffset.x}%`,
        '--drop-y': `${dropOffset.y}%`,
      } as CSSProperties)
      : undefined

      console.log(installedTires);
  return (
    <section className="truck-preview" aria-label="Truck assembly area">
      <div
        className={`truck-preview__assembly${hasPaint ? ' truck-preview__assembly--painted' : ''}${isComplete ? ' truck-preview__assembly--complete' : ''}${earnedPart ? ` truck-preview__assembly--target-${earnedPart}` : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {earnedPart && <div className={`truck-preview__target truck-preview__target--${earnedPart}`} aria-hidden />}
        {hasWheels && (
          <img
            className="truck-preview__part truck-preview__part--wheels"
            src={wheelAsset}
            alt="Wheels and axle added"
            style={lastPlacedPart === 'wheels' ? placedStyle : undefined}
            draggable={false}
          />
        )}

        {!installedTires.rearLeft ? (
          <>
            <img
              className="truck-preview__body"
              src={blackTruck}
              alt="Monster Truck"
              draggable={false}
            />

            {installedTires.frontLeft && (
              <img
                className="truck-preview__tire truck-preview__tire--front-left"
                src={blackTire}
                alt=""
                draggable={false}
              />
            )}

            {installedTires.frontRight && (
              <img
                className="truck-preview__tire truck-preview__tire--front-right"
                src={blackTire}
                alt=""
                draggable={false}
              />
            )}

            {installedTires.rearRight && (
              <img
                className="truck-preview__tire truck-preview__tire--rear-right"
                src={blackTire}
                alt=""
                draggable={false}
              />
            )}
          </>
        ) : (
          <img
            className="truck-preview__body truck-preview__body--complete"
            src={completeTruck}
            alt="Completed Monster Truck"
            draggable={false}
          />
        )}

      </div>
    </section>
  )
}