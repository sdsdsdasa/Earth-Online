# Earth Online

An RPG-style life tracker where your daily actions level up your real-world stats.

## Overview

Track personal stats (Power, Speed, Intelligence, etc.) day by day. Log actions that raise or lower each stat, confirm the day, and build a history of your progress over time.

## Setup

Requires [Node.js](https://nodejs.org/) (v18 or later).

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Project Structure

```
Earth-Online/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx                  # Top-level state + view routing
│   ├── data/
│   │   └── statConfig.js        # Add/rename/remove stats here
│   ├── utils/
│   │   └── storage.js           # localStorage load/save
│   ├── components/
│   │   ├── Dashboard.jsx        # Main stat-tracker screen
│   │   ├── StatRow.jsx          # Single stat row (label + value + Up/Down)
│   │   ├── ActionBar.jsx        # Reset / History / Confirm buttons
│   │   └── HistoryView.jsx      # Day-by-day history table
│   └── styles/
│       ├── global.css
│       ├── Dashboard.css
│       ├── StatRow.css
│       ├── ActionBar.css
│       └── HistoryView.css
├── document/
│   ├── implementation-plan.md         # Base build plan
│   └── implementation-plan-improvement.md  # Future improvements
└── .gitignore
```

## How It Works

- **Up / Down** — adjust any stat for today
- **Reset** — revert today's changes back to yesterday's confirmed values
- **Confirm** — lock in the day, advance to Day N+1, save to history
- **History** — view every confirmed day with per-stat deltas

All data is stored locally in your browser's `localStorage`. Nothing is sent anywhere.

## License

MIT — see [LICENSE](LICENSE) for details.
