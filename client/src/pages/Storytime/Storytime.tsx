import '../Home/Home.css'
import storyTimeBg from '../../assets/storyTimeBG.png'

export default function Storytime() {
  return (
    <div className="home" role="main" aria-label="Storytime">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg" style={{ backgroundImage: `url(${storyTimeBg})` }} aria-hidden />
        </div>
      </div>
    </div>
  )
}
