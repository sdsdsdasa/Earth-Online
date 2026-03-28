import { useState, useEffect } from 'react'
import { load, save } from './utils/storage'
import { updateStreak, getMissedDays } from './utils/streak'
import { checkNewAchievements } from './utils/achievements'
import { ACHIEVEMENT_LIST } from './data/statConfig'
import Dashboard from './components/Dashboard'
import HistoryView from './components/HistoryView'
import SettingsView from './components/SettingsView'
import AchievementsView from './components/AchievementsView'
import Toast from './components/Toast'

export default function App() {
  const [state, setState] = useState(() => {
    const s = load()
    document.body.className = s.settings?.theme === 'light' ? 'theme-light' : 'theme-dark'
    return s
  })
  const [view, setView] = useState('dashboard')
  const [toasts, setToasts] = useState([])
  const [missedDismissed, setMissedDismissed] = useState(false)

  useEffect(() => {
    document.body.className = state.settings?.theme === 'light' ? 'theme-light' : 'theme-dark'
  }, [state.settings?.theme])

  const stats = state.settings.stats
  const missedDays = missedDismissed ? 0 : getMissedDays(state.streak.lastConfirmedDate)

  function showToasts(ids) {
    if (!ids.length) return
    const items = ids.map(id => {
      const a = ACHIEVEMENT_LIST.find(x => x.id === id)
      return { id, label: a?.label ?? id, icon: a?.icon ?? '🏆', ts: Date.now() + Math.random() }
    })
    setToasts(items)
    setTimeout(() => setToasts([]), 3500)
  }

  function updatePending(key, delta) {
    setState(prev => {
      const def = prev.settings.stats.find(s => s.key === key)
      if (!def) return prev
      const step = def.step * (delta > 0 ? 1 : -1)
      const current = prev.pendingStats[key] ?? def.initial
      const next = Math.min(def.max, Math.max(def.min, current + step))
      const updated = { ...prev, pendingStats: { ...prev.pendingStats, [key]: next } }
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

  function handleConfirm(note = '') {
    setState(prev => {
      const delta = {}
      for (const key of Object.keys(prev.pendingStats)) {
        delta[key] = (prev.pendingStats[key] ?? 0) - (prev.baseStats[key] ?? 0)
      }
      const confirmedAt = new Date().toISOString()
      const entry = { day: prev.currentDay, stats: { ...prev.pendingStats }, delta, confirmedAt, note }
      const newHistory = [...prev.history, entry]
      const newStreak  = updateStreak(prev.streak, confirmedAt)
      const partial    = { ...prev, history: newHistory, streak: newStreak }
      const newAchs    = checkNewAchievements(prev.achievements, partial, prev.pendingStats)
      const updated = {
        ...partial,
        currentDay:   prev.currentDay + 1,
        baseStats:    { ...prev.pendingStats },
        pendingStats: { ...prev.pendingStats },
        achievements: [...prev.achievements, ...newAchs],
      }
      save(updated)
      showToasts(newAchs)
      return updated
    })
  }

  function applyHabit(habit) {
    setState(prev => {
      const next = { ...prev.pendingStats }
      for (const [key, amount] of Object.entries(habit.deltas)) {
        const def = prev.settings.stats.find(s => s.key === key)
        if (!def) continue
        next[key] = Math.min(def.max, Math.max(def.min, (next[key] ?? def.initial) + amount))
      }
      const updated = { ...prev, pendingStats: next }
      save(updated)
      return updated
    })
  }

  function handleBackfill(count) {
    setState(prev => {
      let next = { ...prev }
      const lastDate = prev.streak.lastConfirmedDate ? new Date(prev.streak.lastConfirmedDate) : new Date()
      for (let i = 1; i <= count; i++) {
        const d = new Date(lastDate)
        d.setDate(d.getDate() + i)
        const entry = {
          day: next.currentDay,
          stats: { ...next.baseStats },
          delta: Object.fromEntries(Object.keys(next.baseStats).map(k => [k, 0])),
          confirmedAt: d.toISOString(),
          note: '(missed — backfilled)',
        }
        next = { ...next, currentDay: next.currentDay + 1, history: [...next.history, entry] }
      }
      next.streak = { ...next.streak, current: 0 }
      save(next)
      return next
    })
    setMissedDismissed(true)
  }

  function updateSettings(newSettings) {
    setState(prev => {
      const newKeys = new Set(newSettings.stats.map(s => s.key))
      const newPending = { ...prev.pendingStats }
      const newBase    = { ...prev.baseStats }
      for (const stat of newSettings.stats) {
        if (!(stat.key in newPending)) { newPending[stat.key] = stat.initial; newBase[stat.key] = stat.initial }
      }
      for (const key of Object.keys(newPending)) {
        if (!newKeys.has(key)) { delete newPending[key]; delete newBase[key] }
      }
      const updated = { ...prev, settings: newSettings, pendingStats: newPending, baseStats: newBase }
      save(updated)
      return updated
    })
  }

  function updateHabits(habits) {
    setState(prev => { const u = { ...prev, habits }; save(u); return u })
  }

  function handleImport(newState) {
    document.body.className = newState.settings?.theme === 'light' ? 'theme-light' : 'theme-dark'
    save(newState)
    setState(newState)
    setView('dashboard')
  }

  return (
    <>
      {view === 'dashboard' && (
        <Dashboard
          state={state} stats={stats} missedDays={missedDays}
          onUp={key => updatePending(key, 1)} onDown={key => updatePending(key, -1)}
          onReset={handleReset} onConfirm={handleConfirm}
          onHistory={() => setView('history')} onSettings={() => setView('settings')}
          onAchievements={() => setView('achievements')}
          onApplyHabit={applyHabit} onBackfill={handleBackfill}
          onDismissMissed={() => setMissedDismissed(true)}
        />
      )}
      {view === 'history' && (
        <HistoryView history={state.history} stats={stats} onBack={() => setView('dashboard')} />
      )}
      {view === 'settings' && (
        <SettingsView
          settings={state.settings} habits={state.habits} fullState={state}
          onUpdateSettings={updateSettings} onUpdateHabits={updateHabits}
          onImport={handleImport} onBack={() => setView('dashboard')}
        />
      )}
      {view === 'achievements' && (
        <AchievementsView achievements={state.achievements} streak={state.streak} onBack={() => setView('dashboard')} />
      )}
      {toasts.length > 0 && <Toast toasts={toasts} />}
    </>
  )
}
