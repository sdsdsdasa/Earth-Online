import { LEVEL_THRESHOLDS } from '../data/statConfig'

export function getLevel(value) {
  let result = LEVEL_THRESHOLDS[0]
  for (const t of LEVEL_THRESHOLDS) {
    if (value >= t.min) result = t
    else break
  }
  return result
}

export function getLevelProgress(value) {
  let current = LEVEL_THRESHOLDS[0]
  let nextMin = null
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (value >= LEVEL_THRESHOLDS[i].min) {
      current = LEVEL_THRESHOLDS[i]
      nextMin = LEVEL_THRESHOLDS[i + 1]?.min ?? null
    } else break
  }
  if (nextMin === null) return 1
  return (value - current.min) / (nextMin - current.min)
}

export function getCharacterLevel(pendingStats) {
  const values = Object.values(pendingStats)
  if (!values.length) return LEVEL_THRESHOLDS[0]
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  return getLevel(Math.round(avg))
}
