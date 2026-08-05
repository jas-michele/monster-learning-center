import { useEffect, useState } from 'react'
import jaxAvatar from '../../assets/avatars/jax.png'
import type { Question } from '../../types/conversation'
import QuestionCard from '../../components/QuestionCard/QuestionCard'


type MechanicAvatarProps = {
  message: string;
  question: Question | null;
  loading: boolean;
  onSubmit: (answer: string) => Promise<void>;

  onMessageClick?: () => void
  messageActionLabel?: string
}

export default function MechanicAvatar({
  message,
  question,
  loading,
  onSubmit,
  onMessageClick,
  messageActionLabel,
}: MechanicAvatarProps) {
  const [typewriterState, setTypewriterState] = useState({ message, visibleLength: 0 })

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTypewriterState((currentState) => {
        if (currentState.message !== message) {
          return { message, visibleLength: 1 }
        }

        if (currentState.visibleLength >= message.length) {
          window.clearInterval(intervalId)
          return currentState
        }

        return { ...currentState, visibleLength: currentState.visibleLength + 1 }
      })
    }, 34)

    return () => window.clearInterval(intervalId)
  }, [message])

  const visibleMessage = typewriterState.message === message ? message.slice(0, typewriterState.visibleLength) : ''
  const messageContent = (
    <span className="mechanic-guide__message-text" data-message={message}>
      <span className="mechanic-guide__message-visible">{visibleMessage}</span>
    </span>
  )

  return (
    <aside className="mechanic-guide" aria-label="Jax the mechanic">
      {onMessageClick ? (
        <button
          type="button"
          key={message}
          className="mechanic-guide__message mechanic-guide__message--action"
          onClick={onMessageClick}
          aria-label={messageActionLabel}
          aria-live="polite"
        >
          {messageContent}
        </button>
      ) : (
        <div
          key={message}
          className="mechanic-guide__message"
          aria-live="polite"
        >
          {messageContent}

          {question && (
            <QuestionCard
              question={question}
              loading={loading}
              onSubmit={onSubmit}
            />
          )}
        </div>
      )}
      <div className="mechanic-guide__avatar" aria-hidden>
        <img src={jaxAvatar} alt="" className="mechanic-guide__avatar-image" draggable={false} />
      </div>
    </aside>
  )
}
