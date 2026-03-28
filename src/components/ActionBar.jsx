import '../styles/ActionBar.css'

export default function ActionBar({ onReset, onHistory, onConfirm, onSettings, onAchievements }) {
  function handleReset() {
    if (window.confirm('Reset all changes for today?')) onReset()
  }
  return (
    <div className="action-bar">
      <div className="action-row">
        <button className="btn-yellow" onClick={handleReset}>Reset</button>
        <button className="btn-yellow btn-confirm" onClick={onConfirm}>Confirm</button>
      </div>
      <div className="action-row secondary">
        <button className="btn-nav" onClick={onHistory}>📜 History</button>
        <button className="btn-nav" onClick={onAchievements}>🏆 Awards</button>
        <button className="btn-nav" onClick={onSettings}>⚙️ Settings</button>
      </div>
    </div>
  )
}
