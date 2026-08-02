import React, { useState, useEffect } from 'react'
import './Home.css'
import achievementsIcon from '../../assets/home-icon-achievements.png'
import backpackIcon from '../../assets/home-icon-backpack.png'
import settingsIcon from '../../assets/home-icon-settings.png'
import bg from '../../assets/playhouseBG-centered-rug.png'
import Avatar, { type AvatarOutfit } from '../../components/Avatar'
import { getHomeData } from '../../services/homeService'
import { useNavigate } from 'react-router-dom'
import PlayAreaNav from '../../components/PlayAreaNav'

const Home: React.FC = () => {
  const [outfit, setOutfit] = useState<AvatarOutfit>('casual');
  const [homeData, setHomeData] = useState<any>(null);
  const isStorytime = outfit === 'storytime'
  const navigate = useNavigate();

  const hoverAvatar = (avatarOutfit: AvatarOutfit) => () => {
    setOutfit(avatarOutfit);
  };

  const resetAvatar = () => setOutfit('casual')

  useEffect(() => {
    async function loadHome() {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const data = await getHomeData(token);

        console.log(data);

        setHomeData(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadHome();
  }, []);


  return (
    <div className="home" role="main" aria-label="Playhouse home screen">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg" style={{ backgroundImage: `url(${bg})` }} aria-hidden />

          <div className="home__top-actions" aria-label="Playhouse tools">
            <button type="button" className="home__top-action home__top-action--achievements" aria-label="Achievements">
              <img src={achievementsIcon} alt="" draggable={false} aria-hidden />
            </button>
            <button type="button" className="home__top-action home__top-action--settings" aria-label="Settings">
              <img src={settingsIcon} alt="" draggable={false} aria-hidden />
            </button>
            <button type="button" className="home__top-action home__top-action--backpack" aria-label="Backpack">
              <img src={backpackIcon} alt="" draggable={false} aria-hidden />
            </button>
          </div>

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
