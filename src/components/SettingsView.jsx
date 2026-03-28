import { useState } from 'react'
import { DEFAULT_STATS } from '../data/statConfig'
import { exportJSON, importJSON } from '../utils/export'
import '../styles/SettingsView.css'

export default function SettingsView({ settings, habits, fullState, onUpdateSettings, onUpdateHabits, onImport, onBack }) {
  const [localStats,  setLocalStats]  = useState(settings.stats)
  const [localHabits, setLocalHabits] = useState(habits)
  const [localTheme,  setLocalTheme]  = useState(settings.theme)
  const [section,     setSection]     = useState('stats')
  const [importError, setImportError] = useState('')

  function handleSave() {
    onUpdateSettings({ ...settings, stats: localStats, theme: localTheme })
    onUpdateHabits(localHabits)
    onBack()
  }

  /* ---- Stats ---- */
  function addStat() {
    setLocalStats(p => [...p, { key: 'stat_' + Math.random().toString(36).slice(2, 7), label: 'New Stat', icon: '⭐', initial: 50, min: 0, max: 999, step: 1 }])
  }
  function updateStat(i, field, value) {
    setLocalStats(p => p.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }
  function deleteStat(i) {
    if (!window.confirm('Remove this stat?')) return
    setLocalStats(p => p.filter((_, idx) => idx !== i))
  }
  function moveStat(i, dir) {
    const next = [...localStats], j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    setLocalStats(next)
  }

  /* ---- Habits ---- */
  function addHabit() {
    setLocalHabits(p => [...p, { id: 'h_' + Math.random().toString(36).slice(2, 7), name: 'New Habit', deltas: {} }])
  }
  function updateHabit(i, field, value) {
    setLocalHabits(p => p.map((h, idx) => idx === i ? { ...h, [field]: value } : h))
  }
  function deleteHabit(i) { setLocalHabits(p => p.filter((_, idx) => idx !== i)) }
  function addEffect(hi) {
    const used = Object.keys(localHabits[hi].deltas)
    const avail = localStats.find(s => !used.includes(s.key))
    if (!avail) return
    updateHabit(hi, 'deltas', { ...localHabits[hi].deltas, [avail.key]: 1 })
  }
  function updateEffect(hi, oldKey, newKey, amount) {
    const next = { ...localHabits[hi].deltas }
    if (oldKey !== newKey) delete next[oldKey]
    next[newKey] = Number(amount)
    updateHabit(hi, 'deltas', next)
  }
  function removeEffect(hi, key) {
    const next = { ...localHabits[hi].deltas }
    delete next[key]
    updateHabit(hi, 'deltas', next)
  }

  /* ---- Import ---- */
  function handleImportFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setImportError('')
    importJSON(file, data => onImport(data), err => setImportError(err))
    e.target.value = ''
  }

  const SECTIONS = ['stats', 'habits', 'data', 'appearance']

  return (
    <div className="page">
      <div className="card settings-card">
        <div className="card-header">
          <span className="card-title">Settings</span>
          <button className="btn-yellow back-btn" onClick={onBack}>Back</button>
        </div>

        <div className="settings-tabs">
          {SECTIONS.map(s => (
            <button key={s} className={`tab-btn ${section === s ? 'active' : ''}`} onClick={() => setSection(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {section === 'stats' && (
          <div className="settings-section">
            <p className="settings-hint">Edit your stats. Changes apply when you click Save.</p>
            {localStats.map((stat, i) => (
              <div key={stat.key} className="stat-edit-row">
                <div className="reorder-btns">
                  <button className="btn-icon" onClick={() => moveStat(i, -1)} disabled={i === 0}>↑</button>
                  <button className="btn-icon" onClick={() => moveStat(i, 1)}  disabled={i === localStats.length - 1}>↓</button>
                </div>
                <input className="settings-input icon-input" value={stat.icon}  onChange={e => updateStat(i, 'icon',  e.target.value)} maxLength={2} />
                <input className="settings-input label-input" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Label" />
                <label className="inline-label">Step</label>
                <input className="settings-input step-input" type="number" min={1} value={stat.step} onChange={e => updateStat(i, 'step', Math.max(1, Number(e.target.value)))} />
                <button className="btn-danger" onClick={() => deleteStat(i)}>✕</button>
              </div>
            ))}
            <div className="row-gap">
              <button className="btn-small" onClick={addStat}>+ Add Stat</button>
              <button className="btn-small btn-ghost" onClick={() => { if (window.confirm('Reset stats to defaults?')) setLocalStats(DEFAULT_STATS) }}>Reset Defaults</button>
            </div>
          </div>
        )}

        {section === 'habits' && (
          <div className="settings-section">
            <p className="settings-hint">Define quick-action shortcuts shown on the dashboard.</p>
            {localHabits.map((habit, hi) => (
              <div key={habit.id} className="habit-edit-card">
                <div className="habit-edit-header">
                  <input className="settings-input habit-name-input" value={habit.name} onChange={e => updateHabit(hi, 'name', e.target.value)} placeholder="Habit name" />
                  <button className="btn-danger" onClick={() => deleteHabit(hi)}>Delete</button>
                </div>
                {Object.entries(habit.deltas).map(([key, amount]) => (
                  <div key={key} className="delta-edit-row">
                    <select className="settings-select" value={key} onChange={e => updateEffect(hi, key, e.target.value, amount)}>
                      {localStats.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
                    </select>
                    <input className="settings-input delta-num" type="number" value={amount} onChange={e => updateEffect(hi, key, key, e.target.value)} />
                    <button className="btn-icon" onClick={() => removeEffect(hi, key)}>✕</button>
                  </div>
                ))}
                <button className="btn-small" onClick={() => addEffect(hi)}>+ Effect</button>
              </div>
            ))}
            <button className="btn-small" onClick={addHabit}>+ Add Habit</button>
          </div>
        )}

        {section === 'data' && (
          <div className="settings-section">
            <div className="data-block">
              <p className="data-title">Export Backup</p>
              <p className="data-desc">Download all data as a JSON file.</p>
              <button className="btn-small" onClick={() => exportJSON(fullState)}>Export JSON</button>
            </div>
            <div className="data-block">
              <p className="data-title">Import Backup</p>
              <p className="data-desc">Restore from a backup. This overwrites all current data.</p>
              <label className="btn-small btn-file-label">
                Import JSON
                <input type="file" accept=".json" onChange={handleImportFile} hidden />
              </label>
              {importError && <p className="import-error">{importError}</p>}
            </div>
          </div>
        )}

        {section === 'appearance' && (
          <div className="settings-section">
            <p className="settings-hint">Choose your theme.</p>
            <div className="theme-toggle">
              <button className={`theme-btn ${localTheme === 'dark'  ? 'active' : ''}`} onClick={() => setLocalTheme('dark')}>🌙 Dark</button>
              <button className={`theme-btn ${localTheme === 'light' ? 'active' : ''}`} onClick={() => setLocalTheme('light')}>☀️ Light</button>
            </div>
          </div>
        )}

        <div className="settings-footer">
          <button className="btn-yellow save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
