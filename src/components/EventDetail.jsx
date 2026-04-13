import React from 'react'
import { fmtDateLong, fmtTime } from '../lib/utils'

export default function EventDetail({
  event,
  rsvps = [],
  goals = [],
  members = [],
  myRsvp = null,
  isAdmin = false,
  isPast = false,
  onRsvp,
  onClose,
  onAddResult,
  onDelete,
  onDownloadICS,
}) {
  // Type badge styling
  const typeBadgeStyles = {
    Game: 'bg-violet-100 text-violet-700',
    Practice: 'bg-cyan-100 text-cyan-700',
    Other: 'bg-amber-100 text-amber-700',
  }
  const typeBg = typeBadgeStyles[event.type] || typeBadgeStyles.Other

  // RSVP counts and grouping
  const goingRsvps = rsvps.filter(r => r.status === 'going')
  const maybeRsvps = rsvps.filter(r => r.status === 'maybe')
  const cantRsvps = rsvps.filter(r => r.status === 'cant')

  // Get member name from ID
  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId)
    return member?.name || 'Unknown'
  }

  // Result display
  let resultLabel = null
  if (event.team_score !== null && event.opponent_score !== null) {
    const ts = event.team_score
    const os = event.opponent_score
    if (ts > os) resultLabel = 'WIN'
    else if (ts < os) resultLabel = 'LOSS'
    else resultLabel = 'DRAW'
  }

  const resultLabelColor = {
    WIN: 'text-green-600',
    LOSS: 'text-red-600',
    DRAW: 'text-amber-600',
  }[resultLabel] || ''

  // Goal scorers with details
  const goalDetails = goals.map(g => ({
    name: getMemberName(g.scorer_id),
    minute: g.minute,
    assist: g.assist_id ? getMemberName(g.assist_id) : null,
  }))

  // Title display logic
  let mainTitle = event.title
  let subtitle = null
  if (event.type === 'Game' && event.opponent) {
    const prefix = event.home_away === 'home' ? 'vs' : '@'
    mainTitle = `${prefix} ${event.opponent}`
    if (event.title && event.title !== mainTitle) {
      subtitle = event.title
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-2xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{mainTitle}</h2>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Info Section */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <span>{fmtDateLong(event.date)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span>
                  {fmtTime(event.time)}
                  {event.end_time && ` - ${fmtTime(event.end_time)}`}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {event.notes && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">{event.notes}</p>
              </div>
            )}

            {/* Result Display (Past Games with Score) */}
            {isPast && event.type === 'Game' && event.team_score !== null && event.opponent_score !== null && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {event.team_score} - {event.opponent_score}
                  </div>
                  <div className={`text-lg font-semibold ${resultLabelColor}`}>
                    {resultLabel}
                  </div>
                </div>

                {/* Goal Scorers */}
                {goalDetails.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Goal Scorers</div>
                    <div className="space-y-2">
                      {goalDetails.map((goal, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-900">{goal.name}</span>
                          {goal.minute && (
                            <span className="text-gray-500">{goal.minute}&apos;</span>
                          )}
                          {goal.assist && (
                            <span className="text-gray-500">— assist {goal.assist}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RSVP Section (Future Events Only) */}
            {!isPast && (
              <div className="pt-2 border-t border-gray-100">
                <div className="text-sm font-semibold text-gray-700 mb-3">Your Availability</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onRsvp(event.id, 'going')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      myRsvp?.status === 'going'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Going
                  </button>
                  <button
                    onClick={() => onRsvp(event.id, 'maybe')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      myRsvp?.status === 'maybe'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Maybe
                  </button>
                  <button
                    onClick={() => onRsvp(event.id, 'cant')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      myRsvp?.status === 'cant'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Can&apos;t Make It
                  </button>
                </div>
              </div>
            )}

            {/* Attendee Lists */}
            <div className="pt-2 border-t border-gray-100 space-y-4">
              {goingRsvps.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Going ({goingRsvps.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {goingRsvps.map(rsvp => (
                      <span
                        key={rsvp.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700"
                      >
                        {getMemberName(rsvp.member_id)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {maybeRsvps.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Maybe ({maybeRsvps.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {maybeRsvps.map(rsvp => (
                      <span
                        key={rsvp.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700"
                      >
                        {getMemberName(rsvp.member_id)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cantRsvps.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Not Going ({cantRsvps.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cantRsvps.map(rsvp => (
                      <span
                        key={rsvp.id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700"
                      >
                        {getMemberName(rsvp.member_id)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex items-center justify-between gap-3">
            <button
              onClick={onDownloadICS}
              className="flex-1 py-2 px-4 rounded-lg font-medium text-sm bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              Add to Calendar
            </button>

            {isAdmin && event.type === 'Game' && (
              <button
                onClick={onAddResult}
                className="flex-1 py-2 px-4 rounded-lg font-medium text-sm bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
              >
                {event.team_score !== null ? 'Edit Result' : 'Add Result'}
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onDelete(event.id)}
                className="py-2 px-4 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
