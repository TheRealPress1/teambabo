import { useState } from 'react'
import { useTeam } from './lib/useTeam'
import { isPast, isToday, openGoogleCalendar, openOutlookCalendar } from './lib/utils'
import AuthScreen from './components/AuthScreen'
import Schedule from './components/Schedule'
import Roster from './components/Roster'
import Stats from './components/Stats'
import EventDetail from './components/EventDetail'
import AddEvent from './components/AddEvent'
import AddResult from './components/AddResult'
import EditProfile from './components/EditProfile'
import LineupBuilder from './components/LineupBuilder'

const TABS = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'roster', label: 'Roster' },
  { id: 'stats', label: 'Stats' },
]

export default function App() {
  const team = useTeam()
  const [tab, setTab] = useState('schedule')
  const [modal, setModal] = useState(null)
  const [selectedEventId, setSelectedEventId] = useState(null)

  if (team.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-600 mb-4">BCS</div>
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!team.session || !team.hasProfile) {
    return (
      <AuthScreen
        onSignUp={team.signUp}
        onLogin={team.login}
      />
    )
  }

  const selectedEvent = team.events.find(e => e.id === selectedEventId)

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId)
    setModal('eventDetail')
  }

  const handleAddResult = () => {
    setModal('addResult')
  }

  const handleLineup = () => {
    setModal('lineup')
  }

  const handleSaveResult = async (eventId, teamScore, oppScore, goals) => {
    await team.saveResult(eventId, teamScore, oppScore, goals)
    setModal('eventDetail')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Babson Club Soccer</h1>
              <p className="text-xs text-gray-400">2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {team.isAdmin && (
              <button
                onClick={() => setModal('addEvent')}
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                + Event
              </button>
            )}
            <button
              onClick={() => setModal('editProfile')}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg hover:bg-gray-200 transition-colors overflow-hidden"
              title="Edit profile"
            >
              {team.myInfo?.avatar_url ? (
                <img src={team.myInfo.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-gray-500">{team.myInfo?.name?.charAt(0)}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-violet-600 text-violet-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {tab === 'schedule' && (
          <Schedule
            events={team.events}
            rsvps={team.rsvps}
            goals={team.goals}
            me={team.me}
            members={team.members}
            isAdmin={team.isAdmin}
            onRsvp={team.setRsvp}
            onSelectEvent={handleSelectEvent}
            onAddEvent={() => setModal('addEvent')}
          />
        )}
        {tab === 'roster' && (
          <Roster
            members={team.members}
            me={team.me}
            isAdmin={team.isAdmin}
            onPromote={team.promoteMember}
          />
        )}
        {tab === 'stats' && (
          <Stats
            events={team.events}
            goals={team.goals}
            rsvps={team.rsvps}
            members={team.members}
            isAdmin={team.isAdmin}
            onSaveResult={team.saveResult}
            onSelectEvent={handleSelectEvent}
          />
        )}
      </main>

      {/* Modals */}
      {modal === 'addEvent' && (
        <AddEvent
          onSubmit={async (data) => {
            await team.addEvent(data)
            setModal(null)
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'eventDetail' && selectedEvent && (
        <EventDetail
          event={selectedEvent}
          rsvps={team.getEventRsvps(selectedEvent.id)}
          goals={team.getEventGoals(selectedEvent.id)}
          members={team.members}
          myRsvp={team.getMyRsvp(selectedEvent.id)}
          isAdmin={team.isAdmin}
          isPast={isPast(selectedEvent.date)}
          onRsvp={team.setRsvp}
          onClose={() => { setModal(null); setSelectedEventId(null) }}
          onAddResult={handleAddResult}
          onUpdateEvent={team.updateEvent}
          onDelete={async (id) => {
            await team.deleteEvent(id)
            setModal(null)
            setSelectedEventId(null)
          }}
          onGoogleCal={() => openGoogleCalendar(selectedEvent)}
          onOutlookCal={() => openOutlookCalendar(selectedEvent)}
          onLineup={handleLineup}
          lineup={team.getEventLineup(selectedEvent.id)}
        />
      )}

      {modal === 'editProfile' && (
        <EditProfile
          myInfo={team.myInfo}
          onSave={team.updateProfile}
          onLogout={() => { setModal(null); team.logout() }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'lineup' && selectedEvent && (
        <LineupBuilder
          event={selectedEvent}
          members={team.members}
          lineup={team.getEventLineup(selectedEvent.id)}
          isAdmin={team.isAdmin}
          onSave={async (data) => {
            await team.saveLineup(data)
            setModal('eventDetail')
          }}
          onClose={() => setModal('eventDetail')}
        />
      )}

      {modal === 'addResult' && selectedEvent && (
        <AddResult
          event={selectedEvent}
          members={team.members}
          existingGoals={team.getEventGoals(selectedEvent.id)}
          onSubmit={handleSaveResult}
          onClose={() => setModal('eventDetail')}
        />
      )}
    </div>
  )
}
