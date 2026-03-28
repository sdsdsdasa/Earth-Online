import { STATS } from '../data/statConfig'
import '../styles/HistoryView.css'

function formatDelta(d) {
  if (d === 0) return '(0)'
  return d > 0 ? `(+${d})` : `(${d})`
}

function deltaClass(d) {
  if (d > 0) return 'delta-positive'
  if (d < 0) return 'delta-negative'
  return 'delta-zero'
}

export default function HistoryView({ history, onBack }) {
  return (
    <div className="page">
      <div className="card history-card">
        <div className="card-header">
          <span className="card-title">History</span>
          <button className="btn-yellow" onClick={onBack}>Back</button>
        </div>

        {history.length === 0 ? (
          <p className="no-history">No history yet. Confirm your first day to see it here.</p>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Day</th>
                  {STATS.map(s => <th key={s.key}>{s.label}</th>)}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map(entry => (
                  <tr key={entry.day}>
                    <td>{entry.day}</td>
                    {STATS.map(s => (
                      <td key={s.key}>
                        {entry.stats[s.key]}{' '}
                        <span className={deltaClass(entry.delta[s.key])}>
                          {formatDelta(entry.delta[s.key])}
                        </span>
                      </td>
                    ))}
                    <td>{new Date(entry.confirmedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
