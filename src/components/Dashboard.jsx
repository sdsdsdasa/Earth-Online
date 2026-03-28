import { useState } from 'react'
import { getCharacterLevel } from '../utils/levels'
import StatRow from './StatRow'
import ActionBar from './ActionBar'
import HabitBar from './HabitBar'
import MissedDayBanner from './MissedDayBanner'
import '../styles/Dashboard.css'

export default function Dashboard({
  state, stats, missedDays,
  onUp, onDown, onReset, onConfirm,
  onHistory, onSettings, onAchievements,
  onApplyHabit, onBackfill, onDismissMissed,
}) {
  const [note, setNote] = useState('')
  const { currentDay, pendingStats, baseStats, streak, history, habits } = state
  const charLevel = getCharacterLevel(pendingStats)

  function handleConfirm() {
    onConfirm(note)
    setNote('')
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Earth Online</span>
          <div className="card-header-right">
            <span className="char-level">Lv.{charLevel.level} {charLevel.title}</span>
            <span className="card-day">Day {currentDay}</span>
          </div>
        </div>

        <div className="header-sub">
          <span className="streak-badge">🔥 {streak.current} day streak</span>
          <span className="streak-best">Best: {streak.best}</span>
        </div>

        {missedDays > 0 && (
          <MissedDayBanner
            missedDays={missedDays}
            onBackfill={onBackfill}
            onDismiss={onDismissMissed}
          />
        )}

        <HabitBar habits={habits} onApplyHabit={onApplyHabit} />

        <div className="stat-list">
          {stats.map(stat => (
            <StatRow
              key={stat.key}
              stat={stat}
              value={pendingStats[stat.key] ?? stat.initial}
              baseValue={baseStats[stat.key] ?? stat.initial}
              history={history}
              onUp={() => onUp(stat.key)}
              onDown={() => onDown(stat.key)}
            />
          ))}
        </div>

        <textarea
          className="note-input"
          placeholder="Today's note (optional)..."
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
        />

        <ActionBar
          onReset={onReset}
          onHistory={onHistory}
          onConfirm={handleConfirm}
          onSettings={onSettings}
          onAchievements={onAchievements}
        />
      </div>
    </div>
  )
}
