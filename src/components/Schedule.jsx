import React, { useState } from 'react'
import EventCard from './EventCard'
import CalendarView from './CalendarView'

// List icon (three horizontal lines)
function ListIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

// Calendar icon (grid with header)
function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

export default function Schedule({
  events = [],
  rsvps = [],
  goals = [],
  me,
  members = [],
  isAdmin = false,
  onRsvp,
  onSelectEvent,
  onAddEvent,
}) {
  const [view, setView] = useState('list') // 'list' | 'calendar'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Partition events into upcoming and past
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const pastEvents = events
    .filter(e => new Date(e.date) < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const renderEventCards = (eventList, isPast = false) => {
    if (eventList.length === 0) return null

    return eventList.map(event => {
      const eventRsvps = rsvps.filter(r => r.event_id === event.id)
      const eventGoals = goals.filter(g => g.event_id === event.id)
      const myRsvp = eventRsvps.find(r => r.member_id === me)

      const eventDate = new Date(event.date)
      const isToday =
        eventDate.getFullYear() === today.getFullYear() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getDate() === today.getDate()

      return (
        <EventCard
          key={event.id}
          event={event}
          rsvps={eventRsvps}
          goals={eventGoals}
          myRsvp={myRsvp}
          members={members}
          isPast={isPast}
          isToday={isToday}
          onRsvp={onRsvp}
          onClick={() => onSelectEvent(event.id)}
        />
      )
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Upcoming Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Upcoming</h2>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="List view"
              title="List view"
            >
              <ListIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-md transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Calendar view"
              title="Calendar view"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {view === 'list' ? (
          upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base">No events scheduled yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {renderEventCards(upcomingEvents, false)}
            </div>
          )
        ) : (
          <CalendarView
            events={events}
            rsvps={rsvps}
            me={me}
            onRsvp={onRsvp}
            onSelectEvent={onSelectEvent}
          />
        )}
      </section>

      {/* Past Results Section - only in list view */}
      {view === 'list' && pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Past Results</h2>
          <div className="space-y-4">
            {renderEventCards(pastEvents, true)}
          </div>
        </section>
      )}
    </div>
  )
}
