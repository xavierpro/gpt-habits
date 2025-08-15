export function weekdayIndex(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.getDay() // 0-6
}
