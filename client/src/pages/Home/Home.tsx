import React, { useState } from 'react'
import './Home.css'
import bg from '../../assets/playhouseBG-centered-rug.png'
import Avatar, { type AvatarOutfit } from '../../components/Avatar'
import PlayAreaNav from '../../components/PlayAreaNav'

const Home: React.FC = () => {
  const [outfit, setOutfit] = useState<AvatarOutfit>('casual')
  const isStorytime = outfit === 'storytime'

  const resetAvatar = () => setOutfit('casual')

  return (
    <div className="home" role="main" aria-label="Playhouse home screen">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg" style={{ backgroundImage: `url(${bg})` }} aria-hidden />

          <PlayAreaNav onPreview={setOutfit} onResetPreview={resetAvatar} />

          <div className={`home__avatar-wrap${isStorytime ? ' home__avatar-wrap--storytime' : ''}`} aria-hidden>
            <Avatar outfit={outfit} animation="idle" className="home__avatar" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
