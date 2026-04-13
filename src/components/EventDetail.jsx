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
  onGoogleCal,
  onOutlookCal,
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
          <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl space-y-3">
            {/* Calendar Row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Add to Calendar</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onGoogleCal}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-200"
                  title="Google Calendar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18.316 5.684H24v12.632h-5.684V5.684z" fill="#1967D2"/>
                    <path d="M0 18.316h5.684V5.684H0v12.632z" fill="#188038"/>
                    <path d="M18.316 24V18.316H5.684V24h12.632z" fill="#1967D2"/>
                    <path d="M5.684 18.316H0V24h5.684v-5.684z" fill="#1967D2"/>
                    <path d="M18.316 0H5.684v5.684h12.632V0z" fill="#EA4335"/>
                    <path d="M24 5.684V0h-5.684v5.684H24z" fill="#EA4335"/>
                    <path d="M5.684 0H0v5.684h5.684V0z" fill="#EA4335"/>
                    <path d="M18.316 5.684H5.684v12.632h12.632V5.684z" fill="#fff"/>
                    <path d="M9.2 15.348a3.06 3.06 0 01-1.272-.87l.87-.87c.24.35.66.66 1.2.66.54 0 .96-.3.96-.78 0-.48-.42-.78-.96-.78h-.6v-1.08h.54c.48 0 .84-.3.84-.72 0-.42-.36-.72-.84-.72-.42 0-.78.24-1.02.54l-.84-.84c.42-.48 1.02-.78 1.86-.78 1.14 0 1.92.66 1.92 1.62 0 .6-.36 1.08-.84 1.32.54.24.96.72.96 1.38 0 1.02-.84 1.74-2.04 1.74h-.18zm4.2-.12V9.828l-1.32.78-.54-.96 2.1-1.26h1.02v6.84h-1.26z" fill="#1967D2"/>
                  </svg>
                </button>
                <button
                  onClick={onOutlookCal}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-200"
                  title="Outlook Calendar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M24 7.387v10.478c0 .23-.08.424-.238.583a.793.793 0 01-.583.239h-8.696v-12.5h8.696c.23 0 .424.08.583.238.159.159.238.353.238.583v.379z" fill="#1490DF"/>
                    <path d="M24 7.008v.913l-9.283 5.348L14.483 6.187h8.696c.23 0 .424.08.583.238.159.159.238.353.238.583z" fill="#28A8EA"/>
                    <path d="M10.37 10.652a3.478 3.478 0 10-6.957 0 3.478 3.478 0 006.957 0z" fill="#0078D4"/>
                    <path d="M10.37 6.087H3.413a.793.793 0 00-.583.238.793.793 0 00-.239.583v7.826L14.483 6.087H10.37z" fill="#0078D4"/>
                    <path d="M14.483 6.187v12.5H2.591a.793.793 0 01-.583-.239.793.793 0 01-.239-.583V6.908c0-.23.08-.424.239-.583a.793.793 0 01.583-.238h11.892z" fill="#0078D4"/>
                    <path d="M10.37 10.652c0-1.446-.886-2.68-2.144-3.196a3.434 3.434 0 00-1.334-.269H2.57v7.478c0 .23.08.424.238.583a.793.793 0 00.583.239h7.826c-.503-.776-.848-1.775-.848-2.87v-1.965z" fill="url(#outlook_grad)" fillOpacity="0.5"/>
                    <path d="M6.891 7.174c-1.92 0-3.478 1.558-3.478 3.478s1.558 3.478 3.478 3.478 3.478-1.558 3.478-3.478-1.558-3.478-3.478-3.478zm0 5.652c-1.2 0-2.174-.974-2.174-2.174s.974-2.174 2.174-2.174 2.174.974 2.174 2.174-.974 2.174-2.174 2.174z" fill="#fff"/>
                    <defs>
                      <linearGradient id="outlook_grad" x1="2.57" y1="7.187" x2="10.37" y2="14.987" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#000" stopOpacity="0.3"/>
                        <stop offset="1" stopColor="#000" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center gap-3">
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
      </div>
    </>
  )
}
