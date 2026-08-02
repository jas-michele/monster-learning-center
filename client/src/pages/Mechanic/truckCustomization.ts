import blackTruck from '../../assets/blackTruck.png'
import blueTruck from '../../assets/blueTruck.png'
import greenTruck from '../../assets/greenTruck.png'
import orangeTruck from '../../assets/orangeTruck.png'
import purpleTruck from '../../assets/purpleTruck.png'
import redTruck from '../../assets/redTruck.png'
import blackWheels from '../../assets/black-wheels.png'
import blueWheels from '../../assets/blue-wheels.png'
import greenWheels from '../../assets/green-wheels.png'
import orangeWheels from '../../assets/orange-wheels.png'
import purpleWheels from '../../assets/purple-wheels.png'
import redWheels from '../../assets/red-wheels.png'

export type TruckColor = 'red' | 'orange' | 'green' | 'blue' | 'purple' | 'black'
export type TruckDecal = 'flames' | 'claw-marks' | 'skull' | 'none'
export type WheelColor = TruckColor
export type RoofLightOption = 'none' | 'three-light' | 'four-light'

export interface TruckCustomization {
  bodyColor: TruckColor
  decal: TruckDecal
  wheelColor: WheelColor
  roofLights: RoofLightOption
}

export const defaultTruckCustomization: TruckCustomization = {
  bodyColor: 'red',
  decal: 'none',
  wheelColor: 'red',
  roofLights: 'none',
}

export const colorOptions: Array<{ value: TruckColor; label: string; hex: string }> = [
  { value: 'red', label: 'Red', hex: '#d71919' },
  { value: 'orange', label: 'Orange', hex: '#ff8a00' },
  { value: 'green', label: 'Green', hex: '#4fb800' },
  { value: 'blue', label: 'Blue', hex: '#0877d8' },
  { value: 'purple', label: 'Purple', hex: '#7b22c8' },
  { value: 'black', label: 'Black', hex: '#171717' },
]

export const bodyAssets: Record<TruckColor, string> = {
  red: redTruck,
  orange: orangeTruck,
  green: greenTruck,
  blue: blueTruck,
  purple: purpleTruck,
  black: blackTruck,
}

export const wheelOptions: Record<WheelColor, { label: string; asset: string }> = {
  red: { label: 'Red wheels', asset: redWheels },
  orange: { label: 'Orange wheels', asset: orangeWheels },
  green: { label: 'Green wheels', asset: greenWheels },
  blue: { label: 'Blue wheels', asset: blueWheels },
  purple: { label: 'Purple wheels', asset: purpleWheels },
  black: { label: 'Black wheels', asset: blackWheels },
}

export const decalOptions: Array<{ value: TruckDecal; label: string; icon: string }> = [
  { value: 'none', label: 'None', icon: '—' },
  { value: 'flames', label: 'Flames', icon: '🔥' },
  { value: 'claw-marks', label: 'Claw Marks', icon: '///' },
  { value: 'skull', label: 'Skull', icon: '☠' },
]

export const lightOptions: Array<{ value: RoofLightOption; label: string; count: number }> = [
  { value: 'none', label: 'None', count: 0 },
  { value: 'three-light', label: 'Three-light bar', count: 3 },
  { value: 'four-light', label: 'Four-light bar', count: 4 },
]
