import { Link } from 'react-router-dom'
import playhouseNav from '../assets/playhouse/playhouseNav-mechanic-fit.png'
import mechanicNav from '../assets/mechanic/mechanicNav.png'
import racetrackNav from '../assets/practiceLap/racetrackNav.png'
import dinohuntNav from '../assets/dinohunt/scene/nav.png'
import storyTimeNav from '../assets/storytime/nav.png'
import type { AvatarOutfit } from './Avatar'
import { startEngineRev } from '../utils/engineAudio'

type NavItem = {
  key: 'mechanic' | 'race' | 'safari' | 'storytime'
  label: string
  image: string
}

type PlayAreaNavProps = {
  mechanicAsHome?: boolean
  onPreview?: (outfit: AvatarOutfit) => void
  onResetPreview?: () => void
}

const navItems: NavItem[] = [
  { key: 'mechanic', label: 'Mechanic shop', image: mechanicNav },
  { key: 'race', label: 'Race car', image: racetrackNav },
  { key: 'safari', label: 'Dino hunt', image: dinohuntNav },
  { key: 'storytime', label: 'Story time', image: storyTimeNav },
]

export default function PlayAreaNav({ mechanicAsHome = false, onPreview, onResetPreview }: PlayAreaNavProps) {
  const previewProps = (outfit: AvatarOutfit) => ({
    onMouseEnter: () => onPreview?.(outfit),
    onMouseLeave: onResetPreview,
    onFocus: () => onPreview?.(outfit),
    onBlur: onResetPreview,
  })

  return (
    <nav className="home__nav-hotspots" aria-label="Play areas">
      {mechanicAsHome ? (
        <Link className="home__nav-hotspot home__nav-hotspot--playhouse" aria-label="Playhouse" to="/">
          <img src={playhouseNav} alt="" className="home__nav-image" aria-hidden />
        </Link>
      ) : (
        <Link
          className="home__nav-hotspot home__nav-hotspot--mechanic"
          aria-label="Mechanic shop"
          to="/mechanic"
          {...previewProps('mechanic')}
        >
          <img src={mechanicNav} alt="" className="home__nav-image" aria-hidden />
        </Link>
      )}

      {navItems.slice(1).map((item) => {
        if (item.key === 'race') {
          return (
          <Link
            key={item.key}
            className="home__nav-hotspot home__nav-hotspot--race"
            aria-label={item.label}
            to="/practice-lap"
            onClick={startEngineRev}
            {...previewProps(item.key)}
          >
            <img src={item.image} alt="" className="home__nav-image" aria-hidden />
          </Link>
          )
        }

        if (item.key === 'safari') {
          return (
            <Link
              key={item.key}
              className="home__nav-hotspot home__nav-hotspot--dino"
              aria-label={item.label}
              to="/dinohunt"
              {...previewProps(item.key)}
            >
              <img src={item.image} alt="" className="home__nav-image" aria-hidden />
            </Link>
          )
        }

        return (
          <Link
            key={item.key}
            className={`home__nav-hotspot home__nav-hotspot--${item.key}`}
            aria-label={item.label}
            to="/storytime"
            {...previewProps(item.key)}
          >
            <img src={item.image} alt="" className="home__nav-image" aria-hidden />
          </Link>
        )
      })}
    </nav>
  )
}
