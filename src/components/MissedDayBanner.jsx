import '../styles/MissedDayBanner.css'

export default function MissedDayBanner({ missedDays, onBackfill, onDismiss }) {
  return (
    <div className="missed-banner">
      <span>⚠️ You missed {missedDays} day{missedDays > 1 ? 's' : ''}!</span>
      <div className="missed-actions">
        <button className="btn-small" onClick={() => onBackfill(missedDays)}>Backfill</button>
        <button className="btn-small btn-ghost" onClick={onDismiss}>Dismiss</button>
      </div>
    </div>
  )
}
