import '../styles/HabitBar.css'

export default function HabitBar({ habits, onApplyHabit }) {
  if (!habits || habits.length === 0) return null
  return (
    <div className="habit-bar">
      <p className="habit-bar-label">Quick Actions</p>
      <div className="habit-buttons">
        {habits.map(h => (
          <button key={h.id} className="habit-btn" onClick={() => onApplyHabit(h)}>
            {h.name}
          </button>
        ))}
      </div>
    </div>
  )
}
