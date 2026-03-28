import { useState, useEffect, useRef } from 'react'
import { getLevel, getLevelProgress } from '../utils/levels'
import '../styles/StatRow.css'

function getTrend(history, key) {
  const recent = history.slice(-7)
  if (recent.length < 2) return { arrow: '→', cls: 'trend-neutral' }
  const first = recent[0].stats[key] ?? 0
  const last  = recent[recent.length - 1].stats[key] ?? 0
  if (last > first) return { arrow: '↑', cls: 'trend-up' }
  if (last < first) return { arrow: '↓', cls: 'trend-down' }
  return { arrow: '→', cls: 'trend-neutral' }
}

export default function StatRow({ stat, value, baseValue, history, onUp, onDown }) {
  const [flash, setFlash] = useState('')
  const prevRef = useRef(value)

  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = value
    if (value !== prev) {
      setFlash(value > prev ? 'flash-up' : 'flash-down')
      const t = setTimeout(() => setFlash(''), 350)
      return () => clearTimeout(t)
    }
  }, [value])

  const delta   = value - baseValue
  const level   = getLevel(value)
  const progress = getLevelProgress(value)
  const trend   = getTrend(history, stat.key)

  return (
    <div className="stat-row">
      <div className="stat-main-row">
        <span className="stat-icon">{stat.icon}</span>
        <span className="stat-label">{stat.label}:</span>
        <div className={`stat-value ${flash}`}>{value}</div>
        <span className={`stat-delta ${delta > 0 ? 'sdelta-pos' : delta < 0 ? 'sdelta-neg' : 'sdelta-zero'}`}>
          {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : ''}
        </span>
        <span className={`trend ${trend.cls}`}>{trend.arrow}</span>
        <div className="stat-btns">
          <button className="btn-green" onClick={onUp}>Up</button>
          <button className="btn-green" onClick={onDown}>Down</button>
        </div>
      </div>
      <div className="stat-sub-row">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <span className="level-badge">Lv.{level.level} {level.title}</span>
      </div>
    </div>
  )
}
