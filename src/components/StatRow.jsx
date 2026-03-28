import '../styles/StatRow.css'

export default function StatRow({ label, value, onUp, onDown }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}:</span>
      <div className="stat-value">{value}</div>
      <button className="btn-green" onClick={onUp}>Up</button>
      <button className="btn-green" onClick={onDown}>Down</button>
    </div>
  )
}
