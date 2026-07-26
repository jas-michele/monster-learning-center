import '../Home/Home.css'
import dinoBg from '../../assets/dinoBG.png'

export default function DinoHunt() {
  return (
    <div className="home" role="main" aria-label="Dino hunt">
      <div className="home__scene-frame">
        <div className="home__scene">
          <div className="home__bg" style={{ backgroundImage: `url(${dinoBg})` }} aria-hidden />
        </div>
      </div>
    </div>
  )
}
