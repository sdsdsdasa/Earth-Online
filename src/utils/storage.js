import { DEFAULT_STATS, DEFAULT_HABITS } from '../data/statConfig'

const KEY = 'earth-online'

const DEFAULT_SETTINGS = { theme: 'dark', stats: DEFAULT_STATS }

function buildInitialStats(stats) {
  return Object.fromEntries(stats.map(s => [s.key, s.initial]))
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      return {
        streak: { current: 0, best: 0, lastConfirmedDate: null },
        achievements: [],
        habits: DEFAULT_HABITS,
        ...saved,
        settings: {
          ...DEFAULT_SETTINGS,
          ...(saved.settings || {}),
          stats: saved.settings?.stats || DEFAULT_STATS,
        },
      }
    }
  } catch {}
  const initial = buildInitialStats(DEFAULT_STATS)
  return {
    currentDay: 1,
    baseStats: initial,
    pendingStats: { ...initial },
    history: [],
    streak: { current: 0, best: 0, lastConfirmedDate: null },
    achievements: [],
    habits: DEFAULT_HABITS,
    settings: DEFAULT_SETTINGS,
  }
}

export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}
