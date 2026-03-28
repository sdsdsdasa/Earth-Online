import { ACHIEVEMENT_LIST } from '../data/statConfig'
import '../styles/AchievementsView.css'

export default function AchievementsView({ achievements, streak, onBack }) {
  return (
    <div className="page">
      <div className="card achievements-card">
        <div className="card-header">
          <span className="card-title">Achievements</span>
          <button className="btn-yellow back-btn" onClick={onBack}>Back</button>
        </div>

        <div className="streak-info">
          <div className="streak-box">
            <span className="streak-num">{streak.current}</span>
            <span className="streak-lbl">Current Streak 🔥</span>
          </div>
          <div className="streak-box">
            <span className="streak-num">{streak.best}</span>
            <span className="streak-lbl">Best Streak 🏅</span>
          </div>
        </div>

        <div className="achievement-grid">
          {ACHIEVEMENT_LIST.map(a => {
            const unlocked = achievements.includes(a.id)
            return (
              <div key={a.id} className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}>
                <span className="ach-icon">{unlocked ? a.icon : '🔒'}</span>
                <span className="ach-label">{a.label}</span>
                <span className="ach-desc">{a.desc}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
