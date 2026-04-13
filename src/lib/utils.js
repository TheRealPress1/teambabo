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
  return d === new Date().toISOString().split('T')[0]
}

export function generateICS(ev) {
  const dtStart = ev.date.replace(/-/g, '') + (ev.time ? 'T' + ev.time.replace(/:/g, '') + '00' : '')
  const dtEnd = ev.date.replace(/-/g, '') + (ev.end_time ? 'T' + ev.end_time.replace(/:/g, '') + '00' : ev.time ? 'T' + ev.time.replace(/:/g, '') + '00' : '')
  const title = ev.type === 'game'
    ? `TeamBabo ${ev.home_away === 'home' ? 'vs' : '@'} ${ev.opponent || 'TBD'}`
    : `TeamBabo — ${ev.title}`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TeamBabo//Team Hub//EN',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `LOCATION:${ev.location || ''}`,
    `DESCRIPTION:${ev.notes || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `teambabo-${ev.date}.ics`
  a.click()
}

export const EMOJIS = ['⚽', '🏆', '🥅', '🦁', '💪', '🔥', '⭐', '🎯', '👑', '🐉', '🦅', '🐺', '🦈', '🎖️', '💎']
export const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF', 'LM', 'RM']
