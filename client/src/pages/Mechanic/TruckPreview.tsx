import truckBodyRed from '../../assets/truck-body-red.png'
import truckLights from '../../assets/truck-lights.png'
import truckWheelsRed from '../../assets/truck-wheels-red.png'
import type { TruckPart } from './Mechanic'

export default function TruckPreview({ completedParts, isComplete }: { completedParts: TruckPart[]; isComplete: boolean }) {
  const hasWheels = completedParts.includes('wheels')
  const hasBody = completedParts.includes('body')
  const hasLights = completedParts.includes('lights')

  return (
    <section className="truck-preview" aria-label="Truck assembly area">
      <div className={`truck-preview__assembly${isComplete ? ' truck-preview__assembly--complete' : ''}`}>
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
