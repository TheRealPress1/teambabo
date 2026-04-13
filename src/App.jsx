import { useState } from 'react'
import { useTeam } from './lib/useTeam'
import { isPast, isToday, openGoogleCalendar } from './lib/utils'
import AuthScreen from './components/AuthScreen'
import Schedule from './components/Schedule'
import Roster from './components/Roster'
import Stats from './components/Stats'
import EventDetail from './components/EventDetail'
import AddEvent from './components/AddEvent'
import AddResult from './components/AddResult'
import EditProfile from './components/EditProfile'

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#08090a' }}>
        <div className="text-center">
          <div className="text-lg font-semibold mb-3" style={{ color: '#f7f8f8', fontWeight: 590 }}>TB</div>
          <p style={{ color: '#8a8f98', fontSize: '14px' }}>Loading TeamBabo...</p>
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

  const handleSaveResult = async (eventId, teamScore, oppScore, goals) => {
    await team.saveResult(eventId, teamScore, oppScore, goals)
    setModal('eventDetail')
  }

  return (
    <div className="min-h-screen" style={{ background: '#08090a' }}>
      {/* Header */}
      <header className="sticky top-0 z-40" style={{ background: '#0f1011', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base tracking-tight" style={{ color: '#f7f8f8', fontWeight: 590, letterSpacing: '-0.24px' }}>TeamBabo</h1>
            <p className="text-xs" style={{ color: '#62666d' }}>Team Hub</p>
          </div>
          <div className="flex items-center gap-3">
            {team.isAdmin && (
              <button
                onClick={() => setModal('addEvent')}
                className="text-sm px-4 py-1.5 rounded-md text-white transition-colors"
                style={{ background: '#5e6ad2', fontWeight: 510, fontSize: '13px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#828fff'}
                onMouseLeave={e => e.currentTarget.style.background = '#5e6ad2'}
              >
                + Event
              </button>
            )}
            <button
              onClick={() => setModal('editProfile')}
              className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              title="Edit profile"
            >
              {team.myInfo?.avatar_url ? (
                <img src={team.myInfo.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span style={{ fontSize: '11px', fontWeight: 590, color: '#d0d6e0' }}>
                  {team.myInfo?.name?.charAt(0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 py-2.5 text-center border-b-2 transition-colors"
                style={{
                  fontSize: '13px',
                  fontWeight: 510,
                  borderBottomColor: tab === t.id ? '#7170ff' : 'transparent',
                  color: tab === t.id ? '#7170ff' : '#62666d',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

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
          onDelete={async (id) => {
            await team.deleteEvent(id)
            setModal(null)
            setSelectedEventId(null)
          }}
          onDownloadICS={() => openGoogleCalendar(selectedEvent)}
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
