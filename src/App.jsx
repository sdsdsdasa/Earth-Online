import { useState } from 'react'
import { STATS } from './data/statConfig'
import { load, save } from './utils/storage'
import Dashboard from './components/Dashboard'
import HistoryView from './components/HistoryView'

export default function App() {
  const [state, setState] = useState(() => load())
  const [view, setView] = useState('dashboard')

  function updatePending(key, delta) {
    setState(prev => {
      const def = STATS.find(s => s.key === key)
      const next = Math.min(def.max, Math.max(def.min, prev.pendingStats[key] + delta))
      const updated = {
        ...prev,
        pendingStats: { ...prev.pendingStats, [key]: next },
      }
      save(updated)
      return updated
    })
  }

  function handleReset() {
    setState(prev => {
      const updated = { ...prev, pendingStats: { ...prev.baseStats } }
      save(updated)
      return updated
    })
  }

  function handleConfirm() {
    setState(prev => {
      const delta = {}
      for (const key of Object.keys(prev.pendingStats)) {
        delta[key] = prev.pendingStats[key] - prev.baseStats[key]
      }
      const entry = {
        day: prev.currentDay,
        stats: { ...prev.pendingStats },
        delta,
        confirmedAt: new Date().toISOString(),
      }
      const updated = {
        currentDay: prev.currentDay + 1,
        baseStats: { ...prev.pendingStats },
        pendingStats: { ...prev.pendingStats },
        history: [...prev.history, entry],
      }
      save(updated)
      return updated
    })
  }

  if (view === 'history') {
    return <HistoryView history={state.history} onBack={() => setView('dashboard')} />
  }

  return (
    <Dashboard
      currentDay={state.currentDay}
      pendingStats={state.pendingStats}
      onUp={key => updatePending(key, 1)}
      onDown={key => updatePending(key, -1)}
      onReset={handleReset}
      onConfirm={handleConfirm}
      onHistory={() => setView('history')}
    />
  )
}
