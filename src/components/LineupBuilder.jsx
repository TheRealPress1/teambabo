import React, { useState, useRef } from 'react'
import { FORMATIONS, FORMATION_KEYS } from '../lib/formations'

export default function LineupBuilder({
  event,
  members = [],
  lineup = null,
  isAdmin = false,
  onSave,
  onClose,
}) {
  const [formation, setFormation] = useState(lineup?.formation || '4-4-2')
  const [slots, setSlots] = useState(() => {
    if (lineup?.slots) return lineup.slots
    return FORMATIONS[formation].positions.map(p => ({
      label: p.label,
      x: p.x,
      y: p.y,
      memberId: null,
    }))
  })
  const [status, setStatus] = useState(lineup?.status || 'draft')
  const [saving, setSaving] = useState(false)
  const [draggedMember, setDraggedMember] = useState(null)
  const fieldRef = useRef(null)

  const assignedMemberIds = slots.filter(s => s.memberId).map(s => s.memberId)
  const availablePlayers = members.filter(m => !assignedMemberIds.includes(m.id))

  const handleFormationChange = (newFormation) => {
    const newPositions = FORMATIONS[newFormation].positions
    const newSlots = newPositions.map((p, i) => ({
      label: p.label,
      x: p.x,
      y: p.y,
      memberId: slots[i]?.memberId || null,
    }))
    setFormation(newFormation)
    setSlots(newSlots)
  }

  const handleDragStart = (memberId) => {
    setDraggedMember(memberId)
  }

  const handleDropOnSlot = (slotIndex) => {
    if (!draggedMember) return
    setSlots(prev => {
      const next = prev.map((s, i) => {
        // Remove member from any existing slot
        if (s.memberId === draggedMember) return { ...s, memberId: null }
        // Assign to target slot
        if (i === slotIndex) return { ...s, memberId: draggedMember }
        return s
      })
      return next
    })
    setDraggedMember(null)
  }

  const handleRemoveFromSlot = (slotIndex) => {
    setSlots(prev => prev.map((s, i) => i === slotIndex ? { ...s, memberId: null } : s))
  }

  const handleSave = async (publishStatus) => {
    setSaving(true)
    await onSave({
      event_id: event.id,
      formation,
      slots,
      status: publishStatus,
    })
    setSaving(false)
  }

  const getMember = (id) => members.find(m => m.id === id)

  // Title
  let eventTitle = event.title
  if (event.type?.toLowerCase() === 'game' && event.opponent) {
    const prefix = event.home_away === 'home' ? 'vs' : '@'
    eventTitle = `${prefix} ${event.opponent}`
  }

  const readOnly = !isAdmin

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Lineup</h2>
              <p className="text-sm text-gray-500 mt-0.5">{eventTitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {lineup?.status === 'published' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  Published
                </span>
              )}
              {lineup?.status === 'draft' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  Draft
                </span>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left sidebar: Players & Formation */}
            <div className="md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 p-4 space-y-4">
              {/* Formation picker */}
              {!readOnly && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Formation</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FORMATION_KEYS.map(f => (
                      <button
                        key={f}
                        onClick={() => handleFormationChange(f)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          formation === f
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {readOnly && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Formation</label>
                  <span className="text-lg font-bold text-gray-900">{formation}</span>
                </div>
              )}

              {/* Available Players */}
              {!readOnly && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Players ({availablePlayers.length})
                  </label>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto">
                    {availablePlayers.map(m => (
                      <div
                        key={m.id}
                        draggable
                        onDragStart={() => handleDragStart(m.id)}
                        onDragEnd={() => setDraggedMember(null)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gray-50 hover:bg-violet-50 cursor-grab active:cursor-grabbing transition-colors border border-transparent hover:border-violet-200"
                      >
                        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700 flex-shrink-0">
                          {m.jersey_number || m.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{m.name}</div>
                          <div className="text-[10px] text-gray-500">{m.position || '—'}</div>
                        </div>
                      </div>
                    ))}
                    {availablePlayers.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-2">All players assigned</p>
                    )}
                  </div>
                </div>
              )}

              {/* Legend for read-only */}
              {readOnly && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Squad</label>
                  <div className="space-y-1">
                    {slots.filter(s => s.memberId).map((s, i) => {
                      const m = getMember(s.memberId)
                      if (!m) return null
                      return (
                        <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 text-sm">
                          <span className="text-xs font-semibold text-gray-500 w-8">{s.label}</span>
                          <span className="font-medium text-gray-900">{m.name}</span>
                          {m.jersey_number && <span className="text-xs text-gray-400">#{m.jersey_number}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Soccer Field */}
            <div className="flex-1 p-4">
              <div
                ref={fieldRef}
                className="relative w-full rounded-xl overflow-hidden mx-auto"
                style={{
                  aspectRatio: '68 / 105',
                  maxHeight: '60vh',
                  background: 'linear-gradient(to bottom, #2d8a4e, #34a853, #2d8a4e)',
                }}
              >
                {/* Field markings */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 68 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outline */}
                  <rect x="2" y="2" width="64" height="101" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  {/* Center line */}
                  <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" />
                  {/* Center circle */}
                  <circle cx="34" cy="52.5" r="9.15" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  <circle cx="34" cy="52.5" r="0.5" fill="white" fillOpacity="0.6" />
                  {/* Top penalty area */}
                  <rect x="13.84" y="2" width="40.32" height="16.5" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  <rect x="22.16" y="2" width="23.68" height="5.5" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  <circle cx="34" cy="13" r="0.5" fill="white" fillOpacity="0.6" />
                  {/* Bottom penalty area */}
                  <rect x="13.84" y="86.5" width="40.32" height="16.5" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  <rect x="22.16" y="97.5" width="23.68" height="5.5" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  <circle cx="34" cy="92" r="0.5" fill="white" fillOpacity="0.6" />
                  {/* Corner arcs */}
                  <path d="M2 4 A2 2 0 0 1 4 2" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  <path d="M64 2 A2 2 0 0 1 66 4" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  <path d="M2 101 A2 2 0 0 0 4 103" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                  <path d="M64 103 A2 2 0 0 0 66 101" stroke="white" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
                </svg>

                {/* Player positions */}
                {slots.map((slot, i) => {
                  const member = slot.memberId ? getMember(slot.memberId) : null
                  const isEmpty = !member

                  return (
                    <div
                      key={i}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `${slot.x}%`,
                        top: `${slot.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onDragOver={!readOnly ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' } : undefined}
                      onDrop={!readOnly ? () => handleDropOnSlot(i) : undefined}
                    >
                      {/* Jersey circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md border-2 transition-all ${
                          isEmpty
                            ? 'bg-white/20 border-white/40 text-white/60'
                            : 'bg-red-600 border-white text-white cursor-pointer'
                        } ${!readOnly && isEmpty ? 'hover:bg-white/30' : ''}`}
                        onClick={!readOnly && !isEmpty ? () => handleRemoveFromSlot(i) : undefined}
                        title={!readOnly && !isEmpty ? `Click to remove ${member.name}` : ''}
                      >
                        {member ? (member.jersey_number || member.name.charAt(0)) : '?'}
                      </div>
                      {/* Name label */}
                      <div className="mt-0.5 px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-semibold text-white whitespace-nowrap max-w-[70px] truncate text-center">
                        {member ? member.name.split(' ')[0] : slot.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          {!readOnly && (
            <div className="border-t border-gray-100 p-4 flex items-center justify-between bg-gray-50 rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Publishing...' : 'Publish Lineup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
