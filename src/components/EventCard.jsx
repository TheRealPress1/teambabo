import React, { useState } from 'react'
import { fmtDate, fmtTime } from '../lib/utils'

export default function EventCard({
  event,
  rsvps = [],
  goals = [],
  myRsvp = null,
  members = [],
  isPast = false,
  isToday = false,
  onRsvp,
  onClick,
}) {
  // Days until event
  let daysLabel = null
  if (!isPast) {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const eventDate = new Date(event.date + 'T00:00:00')
    const diffMs = eventDate - now
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) daysLabel = null // TODAY badge handles this
    else if (diffDays === 1) daysLabel = 'Tomorrow'
    else daysLabel = `In ${diffDays} days`
  }

  // Type badge colors
  const typeBadgeStyles = {
    Game: 'bg-violet-100 text-violet-700',
    Practice: 'bg-cyan-100 text-cyan-700',
    Other: 'bg-amber-100 text-amber-700',
  }

  const typeBg = typeBadgeStyles[event.type] || typeBadgeStyles.Other

  // RSVP counts
  const goingCount = rsvps.filter(r => r.status === 'going').length
  const maybeCount = rsvps.filter(r => r.status === 'maybe').length
  const cantCount = rsvps.filter(r => r.status === 'cant').length

  // Determine result display for games
  let resultDisplay = null
  if (isPast && event.type?.toLowerCase() === 'game' && event.team_score !== null && event.opponent_score !== null) {
    const teamScore = event.team_score
    const opponentScore = event.opponent_score
    let resultColor = 'text-amber-600' // draw
    if (teamScore > opponentScore) resultColor = 'text-green-600'
    else if (teamScore < opponentScore) resultColor = 'text-red-600'

    resultDisplay = (
      <div className={`text-2xl font-bold ${resultColor}`}>
        {teamScore} - {opponentScore}
      </div>
    )
  }

  // Title/Opponent display
  let titleDisplay = event.title
  if (event.type?.toLowerCase() === 'game' && event.opponent) {
    const prefix = event.home_away === 'home' ? 'vs' : '@'
    titleDisplay = `${prefix} ${event.opponent}`
  }

  // Members who haven't responded
  const respondedIds = new Set(rsvps.map(r => r.member_id))
  const notResponded = !isPast ? members.filter(m => !respondedIds.has(m.id)) : []

  const [shownName, setShownName] = useState(null)
  const handleAvatarTap = (name) => {
    setShownName(name)
    setTimeout(() => setShownName(null), 3000)
  }

  // Get member names for goal display
  const goalScorerNames = goals.map(g => {
    const member = members.find(m => m.id === g.scorer_id)
    return member?.name || 'Unknown'
  })

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 space-y-4"
    >
      {/* Top Row: Today badge and Score */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {isToday && (
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-blue-100 text-blue-700">
              TODAY
            </span>
          )}
        </div>

        {daysLabel && (
          <span className="text-xs font-medium text-gray-400">
            {daysLabel}
          </span>
        )}
        {resultDisplay && <div>{resultDisplay}</div>}
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{titleDisplay}</h3>
      </div>

      {/* Date, Time, Location */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>{fmtDate(event.date)}</span>
          {event.time && (
            <>
              <span>•</span>
              <span>{fmtTime(event.time)}</span>
              {event.end_time && (
                <>
                  <span>-</span>
                  <span>{fmtTime(event.end_time)}</span>
                </>
              )}
            </>
          )}
        </div>

        {event.location && (
          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-violet-600 hover:text-violet-800 underline underline-offset-2 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </a>
          </div>
        )}
      </div>

      {/* RSVP Section (Upcoming Events) */}
      {!isPast && (
        <div className="pt-4 border-t border-gray-100 relative z-10">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onRsvp(event.id, 'going')
              }}
              className={`py-2 px-2 rounded-lg font-medium text-sm transition-colors text-center ${
                myRsvp?.status === 'going'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Going ({goingCount})
            </button>
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onRsvp(event.id, 'maybe')
              }}
              className={`py-2 px-2 rounded-lg font-medium text-sm transition-colors text-center ${
                myRsvp?.status === 'maybe'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Maybe ({maybeCount})
            </button>
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onRsvp(event.id, 'cant')
              }}
              className={`py-2 px-2 rounded-lg font-medium text-sm transition-colors text-center ${
                myRsvp?.status === 'cant'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Can&apos;t ({cantCount})
            </button>
          </div>
        </div>
      )}

      {/* Not Responded Section (Upcoming Events) */}
      {!isPast && notResponded.length > 0 && (
        <div className="relative" onClick={e => e.stopPropagation()}>
          <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1.5">
            Not responded ({notResponded.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {notResponded.map(m => (
              <div
                key={m.id}
                className="relative group"
                onClick={() => handleAvatarTap(m.name)}
                onMouseEnter={() => setShownName(m.name)}
                onMouseLeave={() => setShownName(null)}
              >
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden cursor-pointer">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" className="w-full h-full object-cover opacity-50" />
                  ) : (
                    m.name.charAt(0)
                  )}
                </div>
                {shownName === m.name && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-800 text-white text-[10px] font-medium rounded whitespace-nowrap z-20">
                    {m.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Section (Past Events) */}
      {isPast && goalScorerNames.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {goalScorerNames.map((name, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-700"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes (optional) */}
      {event.notes && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">{event.notes}</p>
        </div>
      )}
    </div>
  )
}
