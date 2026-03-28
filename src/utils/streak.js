function toDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function updateStreak(streak, confirmedAt) {
  const confirmedDay = toDay(new Date(confirmedAt))
  if (!streak.lastConfirmedDate) {
    return { current: 1, best: 1, lastConfirmedDate: confirmedAt }
  }
  const lastDay = toDay(new Date(streak.lastConfirmedDate))
  const diff = Math.round((confirmedDay - lastDay) / 86400000)
  if (diff === 0) return { ...streak, lastConfirmedDate: confirmedAt }
  const current = diff === 1 ? streak.current + 1 : 1
  return { current, best: Math.max(current, streak.best), lastConfirmedDate: confirmedAt }
}

export function getMissedDays(lastConfirmedDate) {
  if (!lastConfirmedDate) return 0
  const last = toDay(new Date(lastConfirmedDate))
  const today = toDay(new Date())
  const diff = Math.round((today - last) / 86400000)
  return diff > 1 ? diff - 1 : 0
}
