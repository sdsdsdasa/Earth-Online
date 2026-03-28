export const DEFAULT_STATS = [
  { key: 'power',        label: 'Power',        icon: '💪', initial: 50, min: 0, max: 999, step: 1 },
  { key: 'speed',        label: 'Speed',        icon: '⚡', initial: 50, min: 0, max: 999, step: 1 },
  { key: 'intelligence', label: 'Intelligence', icon: '🧠', initial: 50, min: 0, max: 999, step: 1 },
  { key: 'abilitySkill', label: 'Ability/Skill',icon: '🎯', initial: 50, min: 0, max: 999, step: 1 },
  { key: 'social',       label: 'Social',       icon: '🗣️', initial: 50, min: 0, max: 999, step: 1 },
  { key: 'cooking',      label: 'Cooking',      icon: '🍳', initial: 50, min: 0, max: 999, step: 1 },
  { key: 'discipline',   label: 'Discipline',   icon: '🔥', initial: 50, min: 0, max: 999, step: 1 },
  { key: 'clean',        label: 'Clean',        icon: '✨', initial: 50, min: 0, max: 999, step: 1 },
]

export const LEVEL_THRESHOLDS = [
  { min: 0,   level: 1, title: 'Untrained' },
  { min: 20,  level: 2, title: 'Novice' },
  { min: 40,  level: 3, title: 'Apprentice' },
  { min: 60,  level: 4, title: 'Adept' },
  { min: 80,  level: 5, title: 'Expert' },
  { min: 100, level: 6, title: 'Master' },
  { min: 120, level: 7, title: 'Legend' },
]

export const DEFAULT_HABITS = [
  { id: 'h1', name: 'Morning Run',  deltas: { speed: 2, discipline: 1 } },
  { id: 'h2', name: 'Cook Dinner',  deltas: { cooking: 1 } },
  { id: 'h3', name: 'Read 30 min',  deltas: { intelligence: 1 } },
  { id: 'h4', name: 'Skip Workout', deltas: { discipline: -1 } },
]

export const ACHIEVEMENT_LIST = [
  { id: 'first-blood',  label: 'First Blood',   desc: 'Confirm your first day',             icon: '🩸' },
  { id: 'week-warrior', label: 'Week Warrior',  desc: 'Maintain a 7-day streak',            icon: '⚔️' },
  { id: 'century',      label: 'Century',       desc: 'Any stat reaches 100',               icon: '💯' },
  { id: 'balanced',     label: 'Balanced',      desc: 'All stats within 10 of each other',  icon: '⚖️' },
  { id: 'iron-will',    label: 'Iron Will',     desc: 'Discipline reaches 80',              icon: '🔩' },
  { id: 'speed-demon',  label: 'Speed Demon',   desc: 'Speed reaches 90',                   icon: '💨' },
]

export const STAT_COLORS = [
  '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6',
  '#10b981', '#f97316', '#ec4899', '#06b6d4',
]
