// Small date helpers for celebrations. Dates are local, compared at midnight.
const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const today = () => midnight(new Date())

// Next occurrence of a month-day ("MM-DD"), today included.
export function nextOccurrence(mmdd, from = today()) {
  const [m, d] = mmdd.split('-').map(Number)
  const thisYear = new Date(from.getFullYear(), m - 1, d)
  return thisYear >= from ? thisYear : new Date(from.getFullYear() + 1, m - 1, d)
}

export const daysUntil = (date, from = today()) => Math.round((midnight(date) - from) / 86400000)

export const whenLabel = (days) => (days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`)

export const shortDate = (d) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
