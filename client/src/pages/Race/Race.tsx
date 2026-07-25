import '../Home/Home.css'
import raceBg from '../../assets/raceBG.png'

export default function Race() {
  return (
    <div className="home" role="main" aria-label="Race track">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg" style={{ backgroundImage: `url(${raceBg})` }} aria-hidden />
        </div>
      </div>
    </div>
  )
}
