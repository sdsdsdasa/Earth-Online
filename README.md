# Earth Online

An RPG-style life tracker where your daily actions level up your real-world stats.

## Setup

Requires [Node.js](https://nodejs.org/) (v18+).

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run build      # production build → dist/
```

## Features

- **Stats** — 8 tracked stats, each with a level (Untrained → Legend), progress bar, and 7-day trend arrow
- **Delta indicators** — see today's change (+/-) live as you press Up/Down
- **Flash animations** — green/red flash on every stat change
- **Quick habits** — one-tap shortcuts that apply preset stat changes
- **Day notes** — attach a note to each confirmed day
- **Streaks & character level** — overall level shown in header, daily streak tracked
- **Achievements** — 6 unlockable badges with toast notifications
- **History** — table view with best/worst day highlighting + 7-day summary
- **Charts** — line chart of all stats over time (switch via Table/Chart tab)
- **CSV export** — download full history as a spreadsheet
- **JSON backup** — export and import your full save
- **Settings** — add/rename/reorder/delete stats, edit habit shortcuts, toggle Dark/Light theme
- **Missed day detection** — banner with backfill option if you skip a day

## Project Structure

```
src/
  data/statConfig.js          # Stats, levels, habits, achievements, chart colors
  utils/                      # storage, levels, streak, achievements, export
  components/                 # Dashboard, StatRow, ActionBar, HistoryView,
                              #   SettingsView, AchievementsView, HabitBar,
                              #   MissedDayBanner, Toast
  styles/                     # Per-component CSS using CSS custom properties
```

All data is stored in `localStorage`. Nothing is sent anywhere.

## License

MIT — see [LICENSE](LICENSE) for details.
