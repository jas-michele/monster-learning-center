import '../Home/Home.css'
import './Storytime.css'
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import storyTimeBg from '../../assets/storytime/background.png'
import openBook from '../../assets/storytime/open-book-base.png'
import nextButton from '../../assets/storytime/button-next.png'
import readToMeButton from '../../assets/storytime/button-read-to-me.png'
import pauseButton from '../../assets/storytime/button-pause.png'
import previousButton from '../../assets/storytime/button-previous.png'
import { getStorytimeStory, type GeneratedStory, type StorySpread } from '../../services/storytimeService'

type TurnDirection = 'forward' | 'backward'
type AudioState = 'idle' | 'playing' | 'paused'

const turnDuration = 960
const storytimeDesignWidth = 1440
const storytimeDesignHeight = 700

const emptySpread: StorySpread = {
  id: 'empty',
  leftText: 'This storybook is waiting for its next adventure.',
  imageAlt: 'Empty storybook illustration area.',
}

function StoryPageText({ title, spread }: { title: string; spread: StorySpread }) {
  if (spread.endOnly) {
    return <div className="storytime__end-page storytime__end-page--left">THE</div>
  }

  return (
    <div className={`storytime__left-page-content${spread.titleOnly ? ' storytime__left-page-content--title-only' : ''}`}>
      {spread.titleOnly && <h1>{title}</h1>}
      {!spread.titleOnly && <p>{spread.leftText}</p>}
    </div>
  )
}

function StoryIllustration({ spread }: { spread: StorySpread }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage = spread.rightImageUrl && !imageFailed
  const presentation = spread.imagePresentation ?? 'cover'

  if (spread.endOnly) {
    return <div className="storytime__end-page storytime__end-page--right">END</div>
  }

  return (
    <figure className={`storytime__right-page-content storytime__right-page-content--${presentation}`}>
      {hasImage ? (
        <img
          src={spread.rightImageUrl}
          alt={spread.imageAlt || 'Story illustration'}
          onError={() => setImageFailed(true)}
          draggable={false}
        />
      ) : (
        <div className="storytime__image-placeholder" role="img" aria-label={spread.imageAlt || 'Story illustration placeholder'}>
          <span>Illustration loading...</span>
        </div>
      )}
    </figure>
  )
}

function PageTurnBackContent({ spread }: { spread: StorySpread }) {
  if (spread.endOnly) {
    return <div className="storytime__turn-back-end">THE</div>
  }

  const sentences = spread.turnBackText ?? [spread.leftText]
  const graphicUrl = spread.turnBackImageUrl ?? spread.rightImageUrl

  return (
    <div className="storytime__turn-back-content">
      <div className="storytime__turn-back-copy">
        {sentences.slice(0, 2).map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
      </div>
      {graphicUrl && (
        <img
          className="storytime__turn-back-graphic"
          src={graphicUrl}
          alt={spread.turnBackImageAlt || spread.imageAlt || ''}
          draggable={false}
        />
      )}
    </div>
  )
}

export default function Storytime() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [stageLayout, setStageLayout] = useState({ left: 0, top: 0, scale: 1 })
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [currentSpread, setCurrentSpread] = useState(0)
  const [pendingSpread, setPendingSpread] = useState<number | null>(null)
  const [direction, setDirection] = useState<TurnDirection>('forward')
  const [isTurning, setIsTurning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [audioState, setAudioState] = useState<AudioState>('idle')

  const spreads = story?.spreads ?? []
  const activeSpread = spreads[currentSpread] ?? emptySpread
  const targetSpread = pendingSpread === null ? activeSpread : spreads[pendingSpread] ?? emptySpread
  const displayLeftSpread = isTurning && direction === 'backward' ? targetSpread : activeSpread
  const displayRightSpread = isTurning && direction === 'forward' ? targetSpread : activeSpread
  const title = story?.title ?? 'Storytime'
  const hasStory = spreads.length > 0
  const canTurn = hasStory && !isTurning
  const currentReadText = activeSpread.titleOnly ? title : activeSpread.leftText
  const canReadCurrentSpread = Boolean(activeSpread.narrationUrl || currentReadText)

  const statusMessage = useMemo(() => {
    if (isLoading) return 'Derrick is getting your story ready...'
    if (error) return error
    if (!hasStory) return 'The storybook is empty right now. Try again in a moment.'
    return null
  }, [error, hasStory, isLoading])

  const stopNarration = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null

    if (utteranceRef.current) {
      window.speechSynthesis.cancel()
      utteranceRef.current = null
    }

    setAudioState('idle')
  }, [])

  const loadStory = useCallback(() => {
    const controller = new AbortController()

    setIsLoading(true)
    setError(null)
    setStory(null)
    setCurrentSpread(0)
    setPendingSpread(null)
    setIsTurning(false)
    stopNarration()

    getStorytimeStory(controller.signal)
      .then((nextStory) => {
        if (controller.signal.aborted) return

        setStory(nextStory)
      })
      .catch((storyError: unknown) => {
        if (controller.signal.aborted) return

        console.error('Unable to load Storytime story', storyError)
        setError('Oops, the storybook had trouble opening. Try again!')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return controller
  }, [stopNarration])

  useEffect(() => {
    let controller: AbortController | null = null

    void Promise.resolve().then(() => {
      controller = loadStory()
    })

    return () => {
      controller?.abort()
      stopNarration()
    }
  }, [loadStory, stopNarration])

  useEffect(() => {
    const updateStageLayout = () => {
      const scale = Math.min(window.innerWidth / storytimeDesignWidth, window.innerHeight / storytimeDesignHeight)
      const scaledWidth = storytimeDesignWidth * scale
      const scaledHeight = storytimeDesignHeight * scale

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

  const canvasStyle: CSSProperties = {
    transform: `translate(${stageLayout.left}px, ${stageLayout.top}px) scale(${stageLayout.scale})`,
  }

  const turnToSpread = (nextSpread: number, nextDirection: TurnDirection) => {
    if (!canTurn || nextSpread < 0 || nextSpread >= spreads.length) return

    stopNarration()
    setDirection(nextDirection)
    setPendingSpread(nextSpread)
    setIsTurning(true)

    window.setTimeout(() => {
      setCurrentSpread(nextSpread)
      setPendingSpread(null)
      setIsTurning(false)
    }, turnDuration)
  }

  const readCurrentSpread = () => {
    if (!canReadCurrentSpread || audioState === 'playing') return

    if (audioState === 'paused') {
      audioRef.current?.play().catch((audioError: unknown) => {
        console.error('Unable to resume narration', audioError)
      })
      window.speechSynthesis.resume()
      setAudioState('playing')
      return
    }

    stopNarration()

    if (activeSpread.narrationUrl) {
      const audio = new Audio(activeSpread.narrationUrl)
      audioRef.current = audio
      audio.addEventListener('ended', () => setAudioState('idle'), { once: true })
      audio.addEventListener('error', () => {
        console.error('Unable to play narration audio', activeSpread.narrationUrl)
        setAudioState('idle')
      }, { once: true })
      audio.play()
        .then(() => setAudioState('playing'))
        .catch((audioError: unknown) => {
          console.error('Unable to start narration audio', audioError)
          setAudioState('idle')
        })
      return
    }

    const utterance = new SpeechSynthesisUtterance(currentReadText)
    utterance.rate = 0.88
    utterance.pitch = 1.05
    utterance.onend = () => {
      utteranceRef.current = null
      setAudioState('idle')
    }
    utterance.onerror = (speechError) => {
      console.error('Unable to read Storytime spread', speechError)
      utteranceRef.current = null
      setAudioState('idle')
    }
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setAudioState('playing')
  }

  const pauseNarration = () => {
    if (audioState !== 'playing') return

    audioRef.current?.pause()
    window.speechSynthesis.pause()
    setAudioState('paused')
  }

  return (
    <div className="home storytime" role="main" aria-label="Storytime">
      <div className="home__scene-frame">
        <div className="home__scene storytime__scene">
          <div className="storytime__design-frame" style={canvasStyle}>
            <div className="home__bg storytime__bg" style={{ backgroundImage: `url(${storyTimeBg})` }} aria-hidden />

            <div className="storytime__stage">
            <Link className="storytime__exit" to="/home" aria-label="Go back to the playhouse">
              <FaSignOutAlt aria-hidden />
            </Link>
            <div
              className={`storytime__book${isTurning ? ` storytime__book--turning storytime__book--turning-${direction}` : ''}`}
              aria-live="polite"
            >
              <img className="storytime__book-base" src={openBook} alt="" draggable={false} aria-hidden />

              <div className="storytime__page storytime__page--left">
                <StoryPageText title={title} spread={displayLeftSpread} />
              </div>
              <div className={`storytime__page storytime__page--right storytime__page--${displayRightSpread.imagePresentation ?? 'cover'}`}>
                <StoryIllustration spread={displayRightSpread} />
              </div>

              {isTurning && direction === 'forward' && (
                <div className="storytime__page storytime__page--left storytime__page-preview storytime__page-preview--forward">
                  <StoryPageText title={title} spread={targetSpread} />
                </div>
              )}

              {isTurning && direction === 'backward' && (
                <div className={`storytime__page storytime__page--right storytime__page--${targetSpread.imagePresentation ?? 'cover'} storytime__page-preview storytime__page-preview--backward`}>
                  <StoryIllustration spread={targetSpread} />
                </div>
              )}

              {statusMessage && (
                <div className={`storytime__status${error ? ' storytime__status--error' : ''}`}>
                  <p>{statusMessage}</p>
                  {error && (
                    <button type="button" onClick={() => loadStory()}>
                      Retry
                    </button>
                  )}
                  {isLoading && <span className="storytime__sparkle" aria-hidden />}
                </div>
              )}

              {isTurning && (
                <>
                  <span className={`storytime__turn-shadow storytime__turn-shadow--${direction}`} aria-hidden />
                  <div
                    className={`storytime__turning-sheet storytime__turning-sheet--${direction}`}
                    aria-hidden
                  >
                    <div className="storytime__turning-face storytime__turning-face--front">
                      {direction === 'forward' ? (
                        <StoryIllustration spread={activeSpread} />
                      ) : (
                        <StoryPageText title={title} spread={activeSpread} />
                      )}
                    </div>
                    <div className="storytime__turning-face storytime__turning-face--back">
                      {direction === 'forward' ? (
                        <PageTurnBackContent spread={targetSpread} />
                      ) : (
                        <StoryIllustration spread={targetSpread} />
                      )}
                    </div>
                    {direction === 'forward' && (
                      <div className="storytime__turn-preview">
                        <div className="storytime__turn-preview-copy">
                          {(targetSpread.turnBackText ?? [targetSpread.leftText]).slice(0, 2).map((sentence) => (
                            <span key={sentence}>{sentence}</span>
                          ))}
                        </div>
                        {(targetSpread.turnBackImageUrl ?? targetSpread.rightImageUrl) && (
                          <img
                            className="storytime__turn-preview-graphic"
                            src={targetSpread.turnBackImageUrl ?? targetSpread.rightImageUrl}
                            alt=""
                            draggable={false}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              <span className="storytime__spine-shadow" aria-hidden />
            </div>

            <div className="storytime__page-indicators" aria-label="Story pages">
              {spreads.map((spread, index) => (
                <span
                  className={`storytime__dot${index === currentSpread ? ' storytime__dot--active' : ''}`}
                  aria-label={`Page ${index + 1} of ${spreads.length}`}
                  aria-current={index === currentSpread ? 'page' : undefined}
                  key={spread.id}
                />
              ))}
            </div>

            <div className="storytime__controls" aria-label="Storytime controls">
              <button
                type="button"
                className="storytime__control storytime__control--previous"
                onClick={() => turnToSpread(currentSpread - 1, 'backward')}
                disabled={!canTurn || currentSpread === 0}
                aria-label="Previous story page"
              >
                <img src={previousButton} alt="" draggable={false} aria-hidden />
              </button>
              <button
                type="button"
                className="storytime__control storytime__control--read"
                onClick={readCurrentSpread}
                disabled={!hasStory || !canReadCurrentSpread || audioState === 'playing'}
                aria-label="Read this story page to me"
              >
                <img src={readToMeButton} alt="" draggable={false} aria-hidden />
              </button>
              <button
                type="button"
                className="storytime__control storytime__control--pause"
                onClick={pauseNarration}
                disabled={audioState !== 'playing'}
                aria-label="Pause narration"
                aria-pressed={audioState === 'paused'}
              >
                <img src={pauseButton} alt="" draggable={false} aria-hidden />
              </button>
              <button
                type="button"
                className="storytime__control storytime__control--next"
                onClick={() => turnToSpread(currentSpread + 1, 'forward')}
                disabled={!canTurn || currentSpread === spreads.length - 1}
                aria-label="Next story page"
              >
                <img src={nextButton} alt="" draggable={false} aria-hidden />
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
