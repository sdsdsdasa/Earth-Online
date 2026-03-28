import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { STAT_COLORS } from '../data/statConfig'
import { exportCSV } from '../utils/export'
import '../styles/HistoryView.css'

function getBestWorst(history) {
  if (history.length === 0) return { best: null, worst: null }
  const scored = history.map(e => ({
    day: e.day,
    score: Object.values(e.delta ?? {}).reduce((a, b) => a + b, 0),
  }))
  const best  = scored.reduce((a, b) => b.score > a.score ? b : a)
  const worst = scored.reduce((a, b) => b.score < a.score ? b : a)
  return { best: best.score > 0 ? best.day : null, worst: worst.score < 0 ? worst.day : null }
}

function Summary({ history, stats }) {
  const n = Math.min(7, history.length)
  if (n < 2) return null
  const recent = history.slice(-n)
  const changes = stats.map(s => ({
    s, diff: (recent[recent.length - 1].stats[s.key] ?? 0) - (recent[0].stats[s.key] ?? 0),
  }))
  const best  = changes.reduce((a, b) => b.diff > a.diff ? b : a)
  const worst = changes.reduce((a, b) => b.diff < a.diff ? b : a)
  return (
    <div className="summary-card">
      <p className="summary-title">Last {n} days</p>
      <div className="summary-grid">
        {changes.map(({ s, diff }) => (
          <span key={s.key} className={`summary-item ${diff > 0 ? 'spos' : diff < 0 ? 'sneg' : ''}`}>
            {s.icon} {diff > 0 ? '+' : ''}{diff}
          </span>
        ))}
      </div>
      <p className="summary-highlight">
        Best: {best.s.icon} {best.s.label} ({best.diff > 0 ? '+' : ''}{best.diff})
        {worst.diff < 0 && <> · Focus: {worst.s.icon} {worst.s.label} ({worst.diff})</>}
      </p>
    </div>
  )
}

function Delta({ d }) {
  if (d === undefined || d === 0) return <span className="dhist-zero">(0)</span>
  if (d > 0) return <span className="dhist-pos">(+{d})</span>
  return <span className="dhist-neg">({d})</span>
}

export default function HistoryView({ history, stats, onBack }) {
  const [tab, setTab] = useState('table')
  const { best, worst } = getBestWorst(history)

  const chartData = history.map(e => ({
    name: `D${e.day}`,
    ...Object.fromEntries(stats.map(s => [s.key, e.stats[s.key] ?? null])),
  }))

  return (
    <div className="page">
      <div className="card history-card">
        <div className="card-header">
          <span className="card-title">History</span>
          <div className="history-header-right">
            <button className={`tab-btn ${tab === 'table' ? 'active' : ''}`} onClick={() => setTab('table')}>Table</button>
            <button className={`tab-btn ${tab === 'chart' ? 'active' : ''}`} onClick={() => setTab('chart')}>Chart</button>
            <button className="btn-yellow back-btn" onClick={onBack}>Back</button>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="no-history">No history yet. Confirm your first day to see it here.</p>
        ) : (
          <>
            <Summary history={history} stats={stats} />

            {tab === 'table' && (
              <>
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        {stats.map(s => <th key={s.key}>{s.icon} {s.label}</th>)}
                        <th>Note</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(entry => (
                        <tr key={entry.day} className={entry.day === best ? 'row-best' : entry.day === worst ? 'row-worst' : ''}>
                          <td>{entry.day === best ? '🏆' : entry.day === worst ? '📉' : ''} {entry.day}</td>
                          {stats.map(s => (
                            <td key={s.key}>
                              {entry.stats[s.key] ?? '—'} <Delta d={entry.delta?.[s.key] ?? 0} />
                            </td>
                          ))}
                          <td className="note-cell">{entry.note || ''}</td>
                          <td>{new Date(entry.confirmedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn-export" onClick={() => exportCSV(history, stats)}>Export CSV</button>
              </>
            )}

            {tab === 'chart' && (
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ background: '#1e3050', border: 'none', borderRadius: 6, fontSize: 12 }} labelStyle={{ color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#ccc' }} />
                    {stats.map((s, i) => (
                      <Line key={s.key} type="monotone" dataKey={s.key} name={s.label}
                        stroke={STAT_COLORS[i % STAT_COLORS.length]} strokeWidth={2} dot={false} connectNulls />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
