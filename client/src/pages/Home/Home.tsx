import React, { useState } from 'react'
import './Home.css'
import bg from '../../assets/playhouseBG.png'
import Avatar1 from '../../assets/avatar1.png'
import Avatar2 from '../../assets/avatar2.png'
import Avatar3 from '../../assets/avatar3.png'
import Avatar4 from '../../assets/avatar4.png'
import Avatar5 from '../../assets/avatar5.png'
import mechanicNav from '../../assets/mechanicNav.png'
import storyTimeNav from '../../assets/storyTimeNav.png'
import racetrackNav from '../../assets/racetrackNav.png'
import dinohuntNav from '../../assets/dinohuntNav.png'

const Home: React.FC = () => {
  const [avatarSrc, setAvatarSrc] = useState(Avatar1)
  const isLandscapeAvatar = avatarSrc === Avatar5

  const hoverAvatar = (avatar: string) => () => setAvatarSrc(avatar)
  const resetAvatar = () => setAvatarSrc(Avatar1)

  return (
    <div className="home" role="main" aria-label="Playhouse home screen">
      <div className="home__bg" style={{ backgroundImage: `url(${bg})` }} aria-hidden />

      <div className="home__inner">
        <div className="home__stage">
          <div className="home__nav-layer">
            <div className="home__nav-groups">
              <div className="home__nav-group home__nav-group--left">
                <button
                  className="home__nav-button"
                  aria-label="Mechanic shop"
                  onMouseEnter={hoverAvatar(Avatar2)}
                  onMouseLeave={resetAvatar}
                  onFocus={hoverAvatar(Avatar2)}
                  onBlur={resetAvatar}
                >
                  <img src={mechanicNav} alt="Mechanic shop" className="home__nav-icon" />
                </button>
                <button
                  className="home__nav-button"
                  aria-label="Race track"
                  onMouseEnter={hoverAvatar(Avatar3)}
                  onMouseLeave={resetAvatar}
                  onFocus={hoverAvatar(Avatar3)}
                  onBlur={resetAvatar}
                >
                  <img src={racetrackNav} alt="Race track" className="home__nav-icon" />
                </button>
              </div>

              <div className="home__nav-group home__nav-group--right">
                <button
                  className="home__nav-button"
                  aria-label="Dino hunt"
                  onMouseEnter={hoverAvatar(Avatar4)}
                  onMouseLeave={resetAvatar}
                  onFocus={hoverAvatar(Avatar4)}
                  onBlur={resetAvatar}
                >
                  <img src={dinohuntNav} alt="Dino hunt" className="home__nav-icon" />
                </button>
                <button
                  className="home__nav-button"
                  aria-label="Story time"
                  onMouseEnter={hoverAvatar(Avatar5)}
                  onMouseLeave={resetAvatar}
                  onFocus={hoverAvatar(Avatar5)}
                  onBlur={resetAvatar}
                >
                  <img src={storyTimeNav} alt="Story time" className="home__nav-icon" />
                </button>
              </div>
            </div>
          </div>

          <div className="home__avatar-wrap" aria-hidden>
            <img
              src={avatarSrc}
              alt="Avatar standing in the center of the playhouse rug"
              className={`home__avatar${isLandscapeAvatar ? ' home__avatar--landscape' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
