import '../Home/Home.css'
import './ExploreDino.css'
import { type CSSProperties, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import exploreDinoBg from '../../assets/dinohunt/explore/background.png'
import dinoFactsButtons from '../../assets/dinohunt/explore/fact-buttons.png'
import bodiedTrex from '../../assets/dinohunt/explore/trex-bodied.png'
import bodiedSteg from '../../assets/dinohunt/explore/steg-bodied-transparent.png'
import bodiedTriceratop from '../../assets/dinohunt/explore/TriceratopBodied.png'
import safariAvatar from '../../assets/avatars/safari.png'
import bushOverlay from '../../assets/dinohunt/explore/bush-overlay.png'
import { getDinoFact, type DinoTopic } from '../../services/dinoApi'
import { speak } from '../../services/voice'

const factButtons = [
  { id: 'facts', label: 'Facts' },
  { id: 'habitat', label: 'Habitat' },
  { id: 'diet', label: 'Diet' },
  { id: 'size', label: 'Size' },
]

type DinosaurId = 'trex' | 'stegosaurus' | 'triceratop'
type LocationState = {
  dinosaur?: DinosaurId
}
type ExploreDinosaur = {
  name: string
  pronunciation: string
  image: string
  imageAlt: string
  funFacts: string[]
}

const exploreDinosaurs: Record<DinosaurId, ExploreDinosaur> = {
  trex: {
    name: 'Tyrannosaurus Rex',
    pronunciation: 'tie-ran-uh-sawr-us rex',
    image: bodiedTrex,
    imageAlt: 'Completed Tyrannosaurus Rex',
    funFacts: [
      'Its name means tyrant lizard king.',
      'Its teeth could grow about as long as bananas.',
      'It had a powerful sense of smell.',
    ],
  },
  stegosaurus: {
    name: 'Stegosaurus',
    pronunciation: 'steg-uh-sawr-us',
    image: bodiedSteg,
    imageAlt: 'Completed Stegosaurus',
    funFacts: [
      'Its name means roof lizard.',
      'It had big plates along its back.',
      'Its spiky tail helped keep it safe.',
    ],
  },
  triceratop: {
    name: 'Triceratops',
    pronunciation: 'try-ser-uh-tops',
    image: bodiedTriceratop,
    imageAlt: 'Completed Triceratops',
    funFacts: [
      'Its name means three-horned face.',
      'It had a big bony frill behind its head.',
      'It used a beak to chomp plants.',
    ],
  },
}

const exploreDesignWidth = 1440
const exploreDesignHeight = 700

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext
}

const playSyntheticRoar = () => {
  const audioWindow = window as AudioWindow
  const AudioContextConstructor = audioWindow.AudioContext || audioWindow.webkitAudioContext

  if (!AudioContextConstructor) return undefined

  const audioContext = new AudioContextConstructor()
  const startTime = audioContext.currentTime + 0.28
  const endTime = startTime + 1.75
  const masterGain = audioContext.createGain()
  const rumble = audioContext.createOscillator()
  const growl = audioContext.createOscillator()
  const noiseFilter = audioContext.createBiquadFilter()
  const noiseGain = audioContext.createGain()
  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate)
  const noiseSource = audioContext.createBufferSource()
  const samples = noiseBuffer.getChannelData(0)

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length)
  }

  masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime)
  masterGain.gain.exponentialRampToValueAtTime(0.34, startTime + 0.18)
  masterGain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.9)
  masterGain.gain.exponentialRampToValueAtTime(0.0001, endTime)

  rumble.type = 'sawtooth'
  rumble.frequency.setValueAtTime(54, startTime)
  rumble.frequency.exponentialRampToValueAtTime(34, endTime)

  growl.type = 'triangle'
  growl.frequency.setValueAtTime(92, startTime)
  growl.frequency.exponentialRampToValueAtTime(58, endTime)

  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.setValueAtTime(420, startTime)
  noiseFilter.frequency.exponentialRampToValueAtTime(150, endTime)
  noiseFilter.Q.setValueAtTime(5, startTime)

  noiseGain.gain.setValueAtTime(0.0001, audioContext.currentTime)
  noiseGain.gain.exponentialRampToValueAtTime(0.24, startTime + 0.22)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, endTime)

  noiseSource.buffer = noiseBuffer
  noiseSource.loop = false

  rumble.connect(masterGain)
  growl.connect(masterGain)
  noiseSource.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(masterGain)
  masterGain.connect(audioContext.destination)

  void audioContext.resume().then(() => {
    rumble.start(startTime)
    growl.start(startTime)
    noiseSource.start(startTime)
    rumble.stop(endTime)
    growl.stop(endTime)
    noiseSource.stop(endTime)
  }).catch(() => undefined)

  return () => {
    rumble.disconnect()
    growl.disconnect()
    noiseSource.disconnect()
    noiseFilter.disconnect()
    noiseGain.disconnect()
    masterGain.disconnect()
    void audioContext.close().catch(() => undefined)
  }
}

export default function ExploreDino() {
  const location = useLocation()
  const [stageLayout, setStageLayout] = useState({ left: 0, top: 0, scale: 1 })
  const [dinoMessage, setDinoMessage] = useState("")
  const [loadingFact, setLoadingFact] = useState(false)
  const routeDinosaur = (location.state as LocationState | null)?.dinosaur
  const savedDinosaur = window.localStorage.getItem('dinohunt:lastSavedDinosaur') as DinosaurId | null
  const currentDinosaurId = routeDinosaur ?? savedDinosaur ?? 'trex'
  const currentDinosaur = exploreDinosaurs[currentDinosaurId] ?? exploreDinosaurs.trex

  useEffect(() => {
    const stopRoar = playSyntheticRoar()

    return () => {
      stopRoar?.()
    }
  }, [])

  useEffect(() => {
    const readDinosaurIntro = async () => {
      const facts = currentDinosaur.funFacts.join(' ')

      const intro =
        `This is a ${currentDinosaur.name}. ` +
        `${facts}`

      try {
        await speak(intro)
      } catch (error) {
        console.error('Dino intro voice error:', error)
      }
    }

    void readDinosaurIntro()
  }, [currentDinosaur])

  useEffect(() => {
    const updateStageLayout = () => {
      const scale = Math.min(window.innerWidth / exploreDesignWidth, window.innerHeight / exploreDesignHeight)
      const scaledWidth = exploreDesignWidth * scale
      const scaledHeight = exploreDesignHeight * scale

      setStageLayout({
        left: (window.innerWidth - scaledWidth) / 2,
        top: (window.innerHeight - scaledHeight) / 2,
        scale,
      })
    }

    updateStageLayout()
    window.addEventListener('resize', updateStageLayout)

    return () => window.removeEventListener('resize', updateStageLayout)
  }, [])

  async function handleFactClick(topic: DinoTopic) {
    if (loadingFact) return

    try {
      setLoadingFact(true)

      const response = await getDinoFact(
        currentDinosaur.name,
        topic
      )

      setDinoMessage(response.message)

      await speak(response.message)
    } catch (error) {
      console.error("Dino AI error:", error)
    } finally {
      setLoadingFact(false)
    }
  }

  const canvasStyle: CSSProperties = {
    transform: `translate(${stageLayout.left}px, ${stageLayout.top}px) scale(${stageLayout.scale})`,
  }

  return (
    <div className="home" role="main" aria-label="Explore dinosaur facts">
      <div className="home__scene-frame">
        <div className={`home__scene explore-dino explore-dino--${currentDinosaurId}`}>
          <div className="explore-dino__design-frame" style={canvasStyle}>
            <div className="home__bg explore-dino__bg" style={{ backgroundImage: `url(${exploreDinoBg})` }} aria-hidden />
            <nav className="explore-dino__nav" aria-label="Explore dinosaur navigation">
              <Link className="explore-dino__nav-button explore-dino__nav-button--back" to="/dinohunt" aria-label="Go back to Dino Hunt">
                <FaSignOutAlt aria-hidden />
              </Link>
              <Link className="explore-dino__nav-button explore-dino__nav-button--forward" to="/home" aria-label="Go forward to the playhouse">
                <FaSignOutAlt aria-hidden />
              </Link>
            </nav>
            <aside
              className="explore-dino__info-panel"
              aria-label={`${currentDinosaur.name} fun facts`}
            >
              <h1>{currentDinosaur.name}</h1>
              <p>({currentDinosaur.pronunciation})</p>

              {dinoMessage ? (
                <p className="explore-dino__ai-message">
                  {dinoMessage}
                </p>
              ) : (
                <ul>
                  {currentDinosaur.funFacts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              )}
            </aside>
            <section className="explore-dino__stage" aria-label={`Completed ${currentDinosaur.name}`}>
              <img
                src={currentDinosaur.image}
                alt={currentDinosaur.imageAlt}
                className="explore-dino__dinosaur"
                draggable={false}
              />
              <div className="explore-dino__roar" aria-hidden>
                <span />
                <span />
                <span />
              </div>
            </section>
            <div className="explore-dino__fact-buttons" aria-label="Dinosaur fact topics">
              {factButtons.map((button) => (
                <button
                  type="button"
                  className={`explore-dino__fact-button explore-dino__fact-button--${button.id}`}
                  aria-label={`Explore ${button.label}`}
                  style={{ backgroundImage: `url(${dinoFactsButtons})` }}
                  key={button.id}
                  disabled={loadingFact}
                  onClick={() => handleFactClick(button.id as DinoTopic)}
                />
              ))}
            </div>
          </div>
          <div className="explore-dino__breakout-layer" style={canvasStyle} aria-hidden>
            <div className="explore-dino__avatar">
              <img
                src={safariAvatar}
                alt=""
                className="explore-dino__avatar-image"
                draggable={false}
              />
            </div>
            <img
              className="explore-dino__foreground-bush"
              src={bushOverlay}
              alt=""
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  )
}
