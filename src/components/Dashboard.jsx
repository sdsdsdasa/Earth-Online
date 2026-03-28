import { STATS } from '../data/statConfig'
import StatRow from './StatRow'
import ActionBar from './ActionBar'
import '../styles/Dashboard.css'

export default function Dashboard({ currentDay, pendingStats, onUp, onDown, onReset, onConfirm, onHistory }) {
  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Earth Online</span>
          <span className="card-day">Day {currentDay}</span>
        </div>
        <div className="stat-list">
          {STATS.map(stat => (
            <StatRow
              key={stat.key}
              label={stat.label}
              value={pendingStats[stat.key]}
              onUp={() => onUp(stat.key)}
              onDown={() => onDown(stat.key)}
            />
          ))}
        </div>
        <ActionBar onReset={onReset} onHistory={onHistory} onConfirm={onConfirm} />
      </div>
    </div>
  )
}
