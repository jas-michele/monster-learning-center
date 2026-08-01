import { type DragEvent } from 'react'
import truckBodyRed from '../../assets/truck-body-red.png'
import truckLights from '../../assets/truck-lights.png'
import truckWheelsRed from '../../assets/truck-wheels-red.png'
import type { TruckPart } from './truckBuild'

type TruckPreviewProps = {
  completedParts: TruckPart[]
  earnedPart: TruckPart | undefined
  isComplete: boolean
  onPartPlaced: (part: TruckPart) => void
}

export default function TruckPreview({ completedParts, earnedPart, isComplete, onPartPlaced }: TruckPreviewProps) {
  const hasWheels = completedParts.includes('wheels')
  const hasBody = completedParts.includes('body')
  const hasLights = completedParts.includes('lights')

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!earnedPart) return
    event.preventDefault()
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedPart = event.dataTransfer.getData('text/plain') as TruckPart
    if (droppedPart === earnedPart) {
      onPartPlaced(droppedPart)
    }
  }

  return (
    <section className="truck-preview" aria-label="Truck assembly area">
      <div
        className={`truck-preview__assembly${isComplete ? ' truck-preview__assembly--complete' : ''}${earnedPart ? ` truck-preview__assembly--target-${earnedPart}` : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {earnedPart && <div className={`truck-preview__target truck-preview__target--${earnedPart}`} aria-hidden />}
        {hasWheels && (
          <img
            className="truck-preview__part truck-preview__part--wheels"
            src={truckWheelsRed}
            alt="Wheels and axle added"
            draggable={false}
          />
        )}
        {hasBody && (
          <img className="truck-preview__part truck-preview__part--body" src={truckBodyRed} alt="Truck body added" draggable={false} />
        )}
        {hasLights && (
          <img className="truck-preview__part truck-preview__part--lights" src={truckLights} alt="Roof lights added" draggable={false} />
        )}
      </div>
    </section>
  )
}
