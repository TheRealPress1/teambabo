import React from 'react'
import EventCard from './EventCard'

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
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base">No events scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {renderEventCards(upcomingEvents, false)}
          </div>
        )}
      </section>

      {/* Past Results Section */}
      {pastEvents.length > 0 && (
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
