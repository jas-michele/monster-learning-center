import React, { useState } from 'react'
import './Home.css'
import bg from '../../assets/playhouseBG.png'
import Avatar, { type AvatarOutfit } from '../../components/Avatar'

const Home: React.FC = () => {
  const [outfit, setOutfit] = useState<AvatarOutfit>('casual')
  const isStorytime = outfit === 'storytime'

  const hoverAvatar = (avatarOutfit: AvatarOutfit) => () => setOutfit(avatarOutfit)
  const resetAvatar = () => setOutfit('casual')

  return (
    <div className="home" role="main" aria-label="Playhouse home screen">
      <div className="home__scene">
        <div className="home__bg" style={{ backgroundImage: `url(${bg})` }} aria-hidden />

        <nav className="home__nav-hotspots" aria-label="Play areas">
          <button
            className="home__nav-hotspot home__nav-hotspot--storytime"
            aria-label="Story time"
            onMouseEnter={hoverAvatar('storytime')}
            onMouseLeave={resetAvatar}
            onFocus={hoverAvatar('storytime')}
            onBlur={resetAvatar}
          />
          <button
            className="home__nav-hotspot home__nav-hotspot--mechanic"
            aria-label="Mechanic shop"
            onMouseEnter={hoverAvatar('mechanic')}
            onMouseLeave={resetAvatar}
            onFocus={hoverAvatar('mechanic')}
            onBlur={resetAvatar}
          />
          <button
            className="home__nav-hotspot home__nav-hotspot--racetrack"
            aria-label="Race track"
            onMouseEnter={hoverAvatar('race')}
            onMouseLeave={resetAvatar}
            onFocus={hoverAvatar('race')}
            onBlur={resetAvatar}
          />
          <button
            className="home__nav-hotspot home__nav-hotspot--dino"
            aria-label="Dino hunt"
            onMouseEnter={hoverAvatar('safari')}
            onMouseLeave={resetAvatar}
            onFocus={hoverAvatar('safari')}
            onBlur={resetAvatar}
          />
        </nav>

        <div className={`home__avatar-wrap${isStorytime ? ' home__avatar-wrap--storytime' : ''}`} aria-hidden>
          <Avatar outfit={outfit} animation="idle" className="home__avatar" />
        </div>
      </div>
    </div>
  )
}

export default Home
