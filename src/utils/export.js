function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportJSON(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  triggerDownload(blob, 'earth-online-backup.json')
}

export function importJSON(file, onSuccess, onError) {
  const reader = new FileReader()
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result)
      if (!data.currentDay || !Array.isArray(data.history)) throw new Error()
      onSuccess(data)
    } catch {
      onError('Invalid backup file.')
    }
  }
  reader.readAsText(file)
}

export function exportCSV(history, stats) {
  const headers = ['Day', ...stats.map(s => s.label), 'Note', 'Date']
  const rows = history.map(e => [
    e.day,
    ...stats.map(s => e.stats[s.key] ?? ''),
    `"${(e.note || '').replace(/"/g, '""')}"`,
    new Date(e.confirmedAt).toLocaleDateString(),
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  triggerDownload(new Blob([csv], { type: 'text/csv' }), 'earth-online-history.csv')
}
