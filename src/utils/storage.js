import { STATS } from '../data/statConfig'

const KEY = 'earth-online'

function buildInitialStats() {
  return Object.fromEntries(STATS.map(s => [s.key, s.initial]))
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}

  const initial = buildInitialStats()
  return {
    currentDay: 1,
    baseStats: initial,
    pendingStats: { ...initial },
    history: [],
  }
}

export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}
