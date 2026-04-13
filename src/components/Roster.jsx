export default function Roster({ members = [], me, isAdmin = false, onPromote, templateLineups = [], onCreateLineup, onEditLineup, rsvps = [], events = [] }) {
  const coaches = members.filter((m) => m.role === 'admin');
  const players = members.filter((m) => m.role === 'player');

  // Attendance: only count events from 2026-04-13 onwards. No RSVP = not attended.
  const cutoffDate = '2026-04-13'
  const trackedEvents = events.filter(e => e.date >= cutoffDate)
  const trackedEventIds = new Set(trackedEvents.map(e => e.id))
  const getAttendance = (memberId) => {
    if (trackedEvents.length === 0) return null
    const going = rsvps.filter(r =>
      r.member_id === memberId && r.status === 'going' && trackedEventIds.has(r.event_id)
    ).length
    return Math.round((going / trackedEvents.length) * 100)
  }

  const MemberRow = ({ member }) => {
    const isMe = member.id === me;
    const memberIsAdmin = member.role === 'admin';
    const attendance = getAttendance(member.id);

    return (
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-lg font-semibold text-stone-700 overflow-hidden">
            {member.avatar_url ? (
              <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              member.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900">{member.name}</span>
              {isMe && <span className="text-xs text-stone-500">(you)</span>}
              {memberIsAdmin && (
                <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <span>#{member.jersey_number}</span>
              <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-700 rounded">
                {member.position}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {attendance !== null && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
              attendance >= 75 ? 'bg-green-50 text-green-600' :
              attendance >= 50 ? 'bg-amber-50 text-amber-600' :
              'bg-red-50 text-red-600'
            }`}>
              {attendance}%
            </span>
          )}
          {isAdmin && !isMe && !memberIsAdmin && (
            <button
              onClick={() => onPromote(member.id)}
              className="text-xs px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 font-medium rounded transition-colors"
            >
              Make admin
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-stone-100 bg-stone-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900">Roster</h2>
            <span className="text-sm px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">
              {members.length}
            </span>
          </div>
          <span className="text-xs text-stone-400 font-medium">Attendance Record</span>
        </div>
      </div>

      {/* Coaches & Admins Section */}
      {coaches.length > 0 && (
        <div>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
              Coaches & Admins
            </h3>
          </div>
          <div>
            {coaches.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Players Section */}
      {players.length > 0 && (
        <div>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
              Players
            </h3>
          </div>
          <div>
            {players.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {members.length === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-stone-500">No members yet</p>
        </div>
      )}

      {/* Lineups Section */}
      {isAdmin && (
        <div className="border-t border-stone-100">
          <div className="px-4 py-4 bg-stone-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Lineups</h2>
            <button
              onClick={onCreateLineup}
              className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors text-lg font-bold"
              title="Create lineup"
            >
              +
            </button>
          </div>
          {templateLineups.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-stone-400">No saved lineups yet</p>
            </div>
          ) : (
            <div>
              {templateLineups.map(l => (
                <button
                  key={l.id}
                  onClick={() => onEditLineup(l)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b border-stone-100 hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                      {l.formation}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900">{l.name || 'Untitled'}</div>
                      <div className="text-xs text-stone-500">
                        {l.slots?.filter(s => s.memberId).length || 0}/11 players
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    l.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {l.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
