# Earth Online — Improvement Plan

This document lists potential improvements beyond the base implementation, grouped by category. Build the base plan first, then pick from these in any order.

---

## 1. Gamification

### 1.1 Level System
Each stat has a level derived from its value, with a title at each threshold.

| Range | Level | Example Title (Power) |
|---|---|---|
| 0–19 | Lv. 1 | Untrained |
| 20–39 | Lv. 2 | Novice |
| 40–59 | Lv. 3 | Apprentice |
| 60–79 | Lv. 4 | Adept |
| 80–99 | Lv. 5 | Expert |
| 100–119 | Lv. 6 | Master |
| 120+ | Lv. 7 | Legend |

Display the level + title beneath each stat value. Level-up triggers a brief animation/flash.

### 1.2 Overall Character Level
A single top-level number derived from the average (or sum) of all stats. Shown prominently in the header next to the day counter. Gives a "total power level" feel.

### 1.3 Achievement Badges
Unlockable one-time achievements stored in `localStorage`. Examples:

| Achievement | Condition |
|---|---|
| First Blood | Confirm Day 1 |
| Week Warrior | Confirm 7 days in a row |
| Century | Any single stat reaches 100 |
| Balanced | All stats within 10 points of each other |
| Iron Will | Discipline reaches 80 |
| Speed Demon | Speed reaches 90 |

Show unlocked badges on a dedicated Achievements screen or as toast popups.

### 1.4 Streaks
Track consecutive days confirmed without missing one. Display current streak and best-ever streak in the header. Breaking a streak resets the counter (but the record is kept).

---

## 2. Visual & UX

### 2.1 Stat Progress Bars
Add a horizontal bar beneath each stat value showing progress toward the next level threshold. Makes growth feel more visceral than a number alone.

### 2.2 Delta Indicators on the Dashboard
While editing today's stats, show the running change next to each value (e.g., `53 → 56 (+3)`). Makes it obvious what has been changed before confirming.

### 2.3 Change Animations
When a stat goes Up or Down, briefly animate the value box:
- **Up** → flash green, number slides up
- **Down** → flash red, number slides down

### 2.4 Trend Arrows
Next to each stat, show a small arrow (↑ ↓ →) based on the 7-day moving average. At a glance the user sees which stats are trending positively or stagnating.

### 2.5 Mobile-Responsive Layout
The base design is desktop-oriented. Add a responsive CSS breakpoint so the app works well on a phone (single-column layout, larger tap targets for Up/Down).

### 2.6 Theme Toggle
Offer at least a light/dark mode toggle. Store preference in `localStorage`. The current blue palette becomes the "dark" theme; a clean white/gray palette is the "light" theme.

---

## 3. Stats & Analytics

### 3.1 Per-Stat Line Charts
On the History screen, add a tab that switches from the table view to a line chart (one line per stat, or one chart per stat). Use a lightweight library like **Chart.js** or **Recharts**.

### 3.2 Weekly & Monthly Summaries
Aggregate history into 7-day and 30-day rollups:
- Net change per stat over the period
- Best single-day gains
- Most-improved stat of the week/month

Show these as a summary card above the full history table.

### 3.3 Best / Worst Day
Automatically tag the history entry with the highest total positive delta as "Best Day" and lowest as "Worst Day". Highlight these rows in the history table.

---

## 4. Customization

### 4.1 Custom Stats (Settings Screen)
Let the user add, rename, reorder, or remove stats through a Settings view. Changes are stored in `localStorage` alongside history. The `statConfig.js` pattern from the base plan already supports this — it just needs a UI.

### 4.2 Custom Increment Size
Instead of always +1/-1, let the user set a step size per stat (e.g., Power increments by 5 per workout, Cooking increments by 1). Configurable in Settings.

### 4.3 Day Notes / Journal
Add a free-text note field per day, saved alongside the stat snapshot on Confirm. Viewable in the History table as an expandable row. Turns the tracker into a lightweight daily journal.

### 4.4 Stat Icons
Assign an emoji or icon to each stat (e.g., 💪 Power, ⚡ Speed, 🧠 Intelligence). Shown to the left of the label. Configurable in Settings.

---

## 5. Data & Backup

### 5.1 Export / Import JSON
A button in Settings to export the full `localStorage` state as a `.json` file, and another to import from a file. Provides a manual backup/restore without needing a backend.

### 5.2 Export History as CSV
Export the history table as a `.csv` file, openable in Excel or Google Sheets for further analysis.

### 5.3 Multiple Profiles / Characters
Support more than one "character" (e.g., Work-Self vs Fitness-Self). Each profile has its own stats and history, stored under separate `localStorage` keys. A profile switcher appears in the header.

---

## 6. Habits & Goals

### 6.1 Preset Actions (Habit Shortcuts)
Define named actions that apply a fixed set of stat changes in one tap. Examples:

| Action | Effect |
|---|---|
| Morning Run | Speed +2, Discipline +1 |
| Cook Dinner | Cooking +1 |
| Read for 30 min | Intelligence +1 |
| Skipped Workout | Discipline -1 |

Shown as a grid of buttons above the stat rows. Tapping one applies its deltas to `pendingStats`.

### 6.2 Goals System
Set a target value for any stat by a chosen date. The Dashboard shows progress toward each active goal (e.g., "Power: 56/80 by 2026-06-01"). Completed goals are archived.

---

## 7. Notifications & Reminders

### 7.1 Browser Notifications
Use the Web Notifications API to remind the user to confirm their day at a chosen time (e.g., 9 PM). Requires the user to grant notification permission. No backend needed — a `setTimeout` or `setInterval` on page load handles the trigger.

### 7.2 Missed Day Detection
On load, check if the last confirmed day was more than 1 calendar day ago. Show a banner: "You missed X days — would you like to fill them in or skip?" Let the user choose to backfill (with zeroed deltas) or leave gaps.

---

## 8. Social / Sharing

### 8.1 Progress Snapshot Image
A "Share" button that renders the current stat card to a `<canvas>` and lets the user download or copy it as a PNG. No data leaves the browser.

### 8.2 Shareable Link (Requires Backend)
Generate a read-only URL that encodes the current stat snapshot (base64 in the URL hash for small payloads, or a backend for full history). Others can view but not edit.

---

## Suggested Build Order

| Priority | Improvement | Effort |
|---|---|---|
| High | 2.2 Delta indicators on Dashboard | Low |
| High | 2.3 Change animations | Low |
| High | 4.1 Custom stats (Settings screen) | Medium |
| High | 6.1 Preset habit shortcuts | Medium |
| Medium | 1.1 Level system + titles | Low |
| Medium | 1.4 Streaks | Low |
| Medium | 3.1 Per-stat line charts | Medium |
| Medium | 5.1 Export / Import JSON | Low |
| Medium | 4.3 Day notes / journal | Low |
| Low | 1.2 Overall character level | Low |
| Low | 1.3 Achievement badges | Medium |
| Low | 2.5 Mobile-responsive layout | Medium |
| Low | 6.2 Goals system | High |
| Low | 7.1 Browser notifications | Medium |
| Low | 5.3 Multiple profiles | High |
