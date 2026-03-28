# Earth Online — Implementation Plan

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **React + Vite** | Component-per-stat, easy state management, fast dev server |
| Styling | **Plain CSS** (no framework) | Matches the custom RPG palette exactly; no overrides needed |
| Persistence | **localStorage** | No backend needed; runs fully local |
| Language | **JavaScript (ES modules)** | No TypeScript overhead for a personal tool this size |

---

## Data Model

Everything lives in `localStorage` under the key `earth-online`.

```js
{
  currentDay: 1,
  baseStats: {              // values at start of today (yesterday's confirmed values)
    power: 50,
    speed: 50,
    intelligence: 50,
    abilitySkill: 50,
    social: 50,
    cooking: 50,
    discipline: 50,
    clean: 50
  },
  pendingStats: {           // live values being edited today (copy of baseStats on load)
    power: 50,
    ...
  },
  history: [
    {
      day: 1,
      stats: { power: 53, ... },   // confirmed snapshot
      delta: { power: +2, ... },   // change vs previous day
      confirmedAt: "2026-03-28T14:00:00Z"
    }
  ]
}
```

**Rules:**
- `baseStats` = read-only for the day; set once when day starts (on Confirm of previous day)
- `pendingStats` = what the user edits via Up/Down
- **Reset** copies `baseStats` → `pendingStats`
- **Confirm** pushes `pendingStats` into `history`, sets new `baseStats`, increments `currentDay`

---

## File Structure

```
Earth-Online/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx              # React root mount
│   ├── App.jsx               # Router between Dashboard and History views
│   ├── data/
│   │   └── statConfig.js     # Stat definitions (name, key, initial value, min, max)
│   ├── utils/
│   │   └── storage.js        # load(), save(), reset() wrappers for localStorage
│   ├── components/
│   │   ├── Dashboard.jsx     # Main stat-tracker screen
│   │   ├── StatRow.jsx       # Single stat row (label + value box + Up + Down)
│   │   ├── ActionBar.jsx     # Reset / History / Confirm buttons
│   │   └── HistoryView.jsx   # Day-by-day history table
│   └── styles/
│       ├── global.css        # Background, font, box-sizing
│       ├── Dashboard.css
│       ├── StatRow.css
│       ├── ActionBar.css
│       └── HistoryView.css
```

---

## Component Breakdown

### `statConfig.js`
Defines the stat list as an array — single source of truth for what stats exist and their starting values.

```js
export const STATS = [
  { key: "power",        label: "Power",        initial: 50, min: 0, max: 999 },
  { key: "speed",        label: "Speed",        initial: 50, min: 0, max: 999 },
  { key: "intelligence", label: "Intelligence", initial: 50, min: 0, max: 999 },
  { key: "abilitySkill", label: "Ability/Skill",initial: 50, min: 0, max: 999 },
  { key: "social",       label: "Social",       initial: 50, min: 0, max: 999 },
  { key: "cooking",      label: "Cooking",      initial: 50, min: 0, max: 999 },
  { key: "discipline",   label: "Discipline",   initial: 50, min: 0, max: 999 },
  { key: "clean",        label: "Clean",        initial: 50, min: 0, max: 999 },
]
```

Adding a new stat = one line in this file only. Everything else picks it up automatically.

---

### `storage.js`
```
load()      → parses localStorage; if empty, seeds from statConfig.js defaults
save(state) → JSON.stringify to localStorage
```

---

### `App.jsx`
Holds top-level state (`gameState`) and view toggle (`"dashboard"` | `"history"`). Passes state and handlers down as props. No routing library needed — it's two views.

---

### `Dashboard.jsx`
- Renders the blue card
- Header row: `"Earth Online"` left, `"Day {currentDay}"` right
- Maps over `STATS` → renders a `<StatRow>` for each
- Renders `<ActionBar>`

---

### `StatRow.jsx`
Props: `label`, `value`, `onUp`, `onDown`

```
[Label:]  [  value  ]  [ Up ]  [ Down ]
```

- `onUp`   → `pendingStats[key] = Math.min(max, value + 1)`
- `onDown` → `pendingStats[key] = Math.max(min, value - 1)`

---

### `ActionBar.jsx`
Three buttons:

| Button | Action |
|---|---|
| **Reset** | Show confirm dialog → copy `baseStats` → `pendingStats` |
| **History** | Switch view to `HistoryView` |
| **Confirm** | Compute delta, append to `history`, set `baseStats = pendingStats`, `currentDay++`, save |

---

### `HistoryView.jsx`
Table layout:

| Day | Power | Speed | ... | Clean | Date |
|---|---|---|---|---|---|
| 1 | 53 (+3) | 48 (0) | ... | 50 (0) | 2026-03-28 |
| 2 | 56 (+2) | 47 (-1) | ... | 52 (+2) | 2026-03-29 |

- Deltas shown in parentheses, color-coded: green for positive, red for negative, gray for zero
- "Back" button returns to Dashboard

---

## Visual Style Guide

| Element | Color / Style |
|---|---|
| Page background | `#3a5a8a` (steel blue) |
| Card background | `#4a6d9c` (lighter blue) |
| Stat value box | White, `border: 2px solid #ccc`, `border-radius: 4px` |
| Up / Down buttons | `#4caf50` green, `border-radius: 8px`, dark green text |
| Action buttons (Reset / History / Confirm) | `#f0c030` yellow, `border-radius: 12px`, dark text |
| Font | System sans-serif or `'Segoe UI'`; no external font needed |

---

## Implementation Phases

### Phase 1 — Static UI
- Vite + React scaffold
- Hardcoded stat values, no logic
- Pixel-perfect match to the mockup

### Phase 2 — Core Logic
- `storage.js` with load/save
- Up/Down buttons update `pendingStats`
- Reset reverts to `baseStats`
- Confirm commits the day

### Phase 3 — History View
- History table renders from `state.history`
- Delta calculation and color coding
- Back button

### Phase 4 — Polish
- Confirm dialog for Reset (prevent accidental wipe)
- Stat value animates briefly on change (CSS transition)
- Stats cannot go below `min` or above `max`
- Day date recorded on Confirm (for the History table)

### Phase 5 — Future Extensions
_(Not in scope now, but the architecture accommodates these)_
- Add/remove/rename stats via a settings screen (already supported by `statConfig.js` pattern)
- Chart view (line graph per stat over time)
- Export history as CSV
- Themes / color schemes
