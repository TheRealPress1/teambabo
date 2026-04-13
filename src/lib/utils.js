export function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function fmtDateLong(d) {
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function fmtTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  const ampm = hr >= 12 ? 'PM' : 'AM'
  const h12 = hr % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export function isPast(d) {
  return new Date(d + 'T23:59:59') < new Date()
}

export function isToday(d) {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return d === `${year}-${month}-${day}`
}

export function openGoogleCalendar(ev) {
  const title = ev.type === 'Game'
    ? `${ev.home_away === 'home' ? 'vs' : '@'} ${ev.opponent || 'TBD'}`
    : ev.title

  // Google Calendar expects YYYYMMDDTHHmmss format
  const fmtDt = (date, time) => {
    const d = date.replace(/-/g, '')
    if (!time) return d
    return d + 'T' + time.replace(/:/g, '') + '00'
  }

  const start = fmtDt(ev.date, ev.time)
  const end = fmtDt(ev.date, ev.end_time || ev.time)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    location: ev.location || '',
    details: ev.notes || '',
  })

  window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank')
}

export function openOutlookCalendar(ev) {
  const title = ev.type === 'Game'
    ? `${ev.home_away === 'home' ? 'vs' : '@'} ${ev.opponent || 'TBD'}`
    : ev.title

  const fmtDt = (date, time) => {
    if (!time) return `${date}T00:00:00`
    return `${date}T${time}:00`
  }

  const start = fmtDt(ev.date, ev.time)
  const end = fmtDt(ev.date, ev.end_time || ev.time)

  const params = new URLSearchParams({
    rru: 'addevent',
    subject: title,
    startdt: start,
    enddt: end,
    location: ev.location || '',
    body: ev.notes || '',
    path: '/calendar/action/compose',
  })

  window.open(`https://outlook.live.com/calendar/0/action/compose?${params}`, '_blank')
}

export const EMOJIS = ['⚽', '🏆', '🥅', '🦁', '💪', '🔥', '⭐', '🎯', '👑', '🐉', '🦅', '🐺', '🦈', '🎖️', '💎']
export const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF', 'LM', 'RM']
