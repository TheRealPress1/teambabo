import React, { useState } from 'react'
import { fmtDateLong, fmtTime } from '../lib/utils'
import LocationInput from './LocationInput'

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
  onUpdateEvent,
  onGoogleCal,
  onOutlookCal,
  onLineup,
  lineup,
}) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(event.title || '')
  const [editDate, setEditDate] = useState(event.date || '')
  const [editTime, setEditTime] = useState(event.time || '')
  const [editEndTime, setEditEndTime] = useState(event.end_time || '')
  const [editLocation, setEditLocation] = useState(event.location || '')
  const [editNotes, setEditNotes] = useState(event.notes || '')
  const [editOpponent, setEditOpponent] = useState(event.opponent || '')
  const [editHomeAway, setEditHomeAway] = useState(event.home_away || 'home')
  const [editTeamScore, setEditTeamScore] = useState(event.team_score?.toString() || '')
  const [editOppScore, setEditOppScore] = useState(event.opponent_score?.toString() || '')
  const [saving, setSaving] = useState(false)
  const [excusePopup, setExcusePopup] = useState(null)

  const COACH_WHATSAPP = 'https://wa.me/19788094516?text=Hey%20Coach%2C%20I%20have%20an%20excuse%20for%20'

  // RSVP counts and grouping
  const goingRsvps = rsvps.filter(r => r.status === 'going')
  const maybeRsvps = rsvps.filter(r => r.status === 'maybe')
  const cantRsvps = rsvps.filter(r => r.status === 'cant')

  const getMember = (memberId) => members.find(m => m.id === memberId)

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
  if (event.type?.toLowerCase() === 'game' && event.opponent) {
    const prefix = event.home_away === 'home' ? 'vs' : '@'
    mainTitle = `${prefix} ${event.opponent}`
    if (event.title && event.title !== mainTitle) {
      subtitle = event.title
    }
  }

  const handleSaveEdit = async () => {
    setSaving(true)
    const updates = {
      title: editTitle,
      date: editDate,
      time: editTime || null,
      end_time: editEndTime || null,
      location: editLocation || null,
      notes: editNotes || null,
    }
    if (event.type?.toLowerCase() === 'game') {
      updates.opponent = editOpponent || null
      updates.home_away = editHomeAway
      if (isPast && editTeamScore !== '' && editOppScore !== '') {
        updates.team_score = parseInt(editTeamScore)
        updates.opponent_score = parseInt(editOppScore)
      }
    }
    await onUpdateEvent(event.id, updates)
    setSaving(false)
    setEditing(false)
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"

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
              {editing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className={`${inputClass} text-xl font-bold`}
                />
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{mainTitle}</h2>
                  {subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              {isAdmin && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-gray-400 hover:text-violet-600 transition-colors"
                  title="Edit event"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {editing ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                  <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                    <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
                    <input type="time" value={editEndTime} onChange={e => setEditEndTime(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
                  <LocationInput
                    value={editLocation}
                    onChange={setEditLocation}
                    placeholder="Location"
                    className={inputClass}
                  />
                </div>

                {event.type?.toLowerCase() === 'game' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Opponent</label>
                      <input type="text" value={editOpponent} onChange={e => setEditOpponent(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Home / Away</label>
                      <select value={editHomeAway} onChange={e => setEditHomeAway(e.target.value)} className={inputClass}>
                        <option value="home">Home</option>
                        <option value="away">Away</option>
                        <option value="neutral">Neutral</option>
                      </select>
                    </div>
                    {isPast && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Score</label>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="number" value={editTeamScore} onChange={e => setEditTeamScore(e.target.value)} placeholder="Team" min="0" className={inputClass} />
                          <input type="number" value={editOppScore} onChange={e => setEditOppScore(e.target.value)} placeholder="Opponent" min="0" className={inputClass} />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label>
                  <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                </div>
              </div>
            ) : (
              /* View Mode */
              <>
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
                    <div className="flex items-center gap-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-600 hover:text-violet-800 underline underline-offset-2 flex items-center gap-1.5 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </a>
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
                {isPast && event.type?.toLowerCase() === 'game' && event.team_score !== null && event.opponent_score !== null && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl font-bold text-gray-900">
                        {event.team_score} - {event.opponent_score}
                      </div>
                      <div className={`text-lg font-semibold ${resultLabelColor}`}>
                        {resultLabel}
                      </div>
                    </div>

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
                        type="button"
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
                        type="button"
                        onClick={() => setExcusePopup('maybe')}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                          myRsvp?.status === 'maybe'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Maybe
                      </button>
                      <button
                        type="button"
                        onClick={() => setExcusePopup('cant')}
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
                        {goingRsvps.map(rsvp => {
                          const m = getMember(rsvp.member_id)
                          return (
                            <span key={rsvp.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                              {m?.avatar_url ? (
                                <img src={m.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-[10px] font-bold">{m?.name?.charAt(0)}</span>
                              )}
                              {m?.name || 'Unknown'}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {maybeRsvps.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Maybe ({maybeRsvps.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {maybeRsvps.map(rsvp => {
                          const m = getMember(rsvp.member_id)
                          return (
                            <span key={rsvp.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                              {m?.avatar_url ? (
                                <img src={m.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-bold">{m?.name?.charAt(0)}</span>
                              )}
                              {m?.name || 'Unknown'}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {cantRsvps.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Not Going ({cantRsvps.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cantRsvps.map(rsvp => {
                          const m = getMember(rsvp.member_id)
                          return (
                            <span key={rsvp.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                              {m?.avatar_url ? (
                                <img src={m.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-[10px] font-bold">{m?.name?.charAt(0)}</span>
                              )}
                              {m?.name || 'Unknown'}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl space-y-3">
            {editing ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2 px-4 rounded-lg font-medium text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 py-2 px-4 rounded-lg font-medium text-sm bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="py-2 px-4 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            ) : (
              <>
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
                        <path d="M6.891 7.174c-1.92 0-3.478 1.558-3.478 3.478s1.558 3.478 3.478 3.478 3.478-1.558 3.478-3.478-1.558-3.478-3.478-3.478zm0 5.652c-1.2 0-2.174-.974-2.174-2.174s.974-2.174 2.174-2.174 2.174.974 2.174 2.174-.974 2.174-2.174 2.174z" fill="#fff"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && event.type?.toLowerCase() === 'game' && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onAddResult}
                      className="flex-1 py-2 px-4 rounded-lg font-medium text-sm bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
                    >
                      {event.team_score !== null ? 'Edit Result' : 'Add Result'}
                    </button>
                  </div>
                )}

                {/* Lineup Button */}
                {event.type?.toLowerCase() === 'game' && (lineup?.status === 'published' || isAdmin) && (
                  <div>
                    <button
                      onClick={onLineup}
                      className="w-full py-2.5 px-4 rounded-lg font-medium text-sm bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {lineup ? (isAdmin ? 'Edit Lineup' : 'View Lineup') : 'Create Lineup'}
                      {lineup?.status === 'draft' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">Draft</span>
                      )}
                    </button>
                  </div>
                )}

              </>
            )}
          </div>
        </div>
      </div>
      {/* Excuse Popup */}
      {excusePopup && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={() => setExcusePopup(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4" onClick={e => e.stopPropagation()}>
              <div className="text-4xl">📱</div>
              <h3 className="text-lg font-bold text-gray-900">Got an excuse?</h3>
              <p className="text-sm text-gray-500">Text Coach Juan to let him know why you can&apos;t make it.</p>
              <a
                href={`${COACH_WHATSAPP}${encodeURIComponent(mainTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { onRsvp(event.id, excusePopup); setExcusePopup(null) }}
                className="block w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                Text Coach on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setExcusePopup(null)}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
