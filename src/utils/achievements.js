export function checkNewAchievements(prevAchievements, state, confirmedStats) {
  const newOnes = []
  function check(id, cond) {
    if (!prevAchievements.includes(id) && cond) newOnes.push(id)
  }
  const vals = Object.values(confirmedStats)
  check('first-blood',  state.history.length >= 1)
  check('week-warrior', state.streak.current >= 7)
  check('century',      vals.some(v => v >= 100))
  check('balanced',     vals.length > 0 && Math.max(...vals) - Math.min(...vals) <= 10)
  check('iron-will',    (confirmedStats.discipline ?? 0) >= 80)
  check('speed-demon',  (confirmedStats.speed ?? 0) >= 90)
  return newOnes
}
