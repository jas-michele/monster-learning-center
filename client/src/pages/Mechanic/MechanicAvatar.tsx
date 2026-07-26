import { useEffect, useState } from 'react'
import Avatar from '../../components/Avatar'

export default function MechanicAvatar({ message }: { message: string }) {
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

  return (
    <aside className="mechanic-guide" aria-label="Derrick the mechanic">
      <div key={message} className="mechanic-guide__message" aria-live="polite">
        <span className="mechanic-guide__message-text">{visibleMessage}</span>
      </div>
      <div className="mechanic-guide__avatar" aria-hidden>
        <Avatar outfit="mechanic" animation="stand" className="mechanic-guide__avatar-image" />
      </div>
    </aside>
  )
}
