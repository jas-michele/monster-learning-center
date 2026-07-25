import Avatar from '../../components/Avatar'

export default function MechanicAvatar({ message }: { message: string }) {
  return (
    <aside className="mechanic-guide" aria-label="Derrick the mechanic">
      <div key={message} className="mechanic-guide__message" aria-live="polite">
        {message}
      </div>
      <div className="mechanic-guide__avatar" aria-hidden>
        <Avatar outfit="mechanic" animation="stand" className="mechanic-guide__avatar-image" />
      </div>
    </aside>
  )
}
