import '../styles/ActionBar.css'

export default function ActionBar({ onReset, onHistory, onConfirm }) {
  function handleReset() {
    if (window.confirm('Reset all changes for today?')) {
      onReset()
    }
  }

  return (
    <div className="action-bar">
      <button className="btn-yellow" onClick={handleReset}>Reset</button>
      <button className="btn-yellow" onClick={onHistory}>History</button>
      <button className="btn-yellow" onClick={onConfirm}>Confirm</button>
    </div>
  )
}
