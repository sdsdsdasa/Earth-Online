import '../styles/Toast.css'

export default function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.ts} className="toast">
          <span className="toast-icon">{t.icon}</span>
          <span>Achievement: <strong>{t.label}</strong></span>
        </div>
      ))}
    </div>
  )
}
