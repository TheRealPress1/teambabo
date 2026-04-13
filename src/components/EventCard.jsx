import React from 'react'
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
  if (isPast && event.type === 'Game' && event.team_score !== null && event.opponent_score !== null) {
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
  if (event.type === 'Game' && event.opponent) {
    const prefix = event.home_away === 'home' ? 'vs' : '@'
    titleDisplay = `${prefix} ${event.opponent}`
  }

  // Get member names for goal display
  const goalScorerNames = goals.map(g => {
    const member = members.find(m => m.id === g.userId)
    return member?.name || 'Unknown'
  })

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 space-y-4"
    >
      {/* Top Row: Badges and Score */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${typeBg}`}>
            {event.type}
          </span>
          {isToday && (
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-blue-100 text-blue-700">
              TODAY
            </span>
          )}
        </div>

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
            <span>{event.location}</span>
          </div>
        )}
      </div>

      {/* RSVP Section (Upcoming Events) */}
      {!isPast && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={e => {
                e.stopPropagation()
                onRsvp(event.id, 'going')
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                myRsvp?.status === 'going'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Going ({goingCount})
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                onRsvp(event.id, 'maybe')
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                myRsvp?.status === 'maybe'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Maybe ({maybeCount})
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                onRsvp(event.id, 'cant')
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
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
