export default function Roster({ members = [], me, isAdmin = false, onPromote, templateLineups = [], onCreateLineup, onEditLineup, rsvps = [], events = [] }) {
  const coaches = members.filter((m) => m.role === 'coach');
  const admins = members.filter((m) => m.role === 'admin');
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
    const memberIsAdmin = member.role === 'admin' || member.role === 'coach';
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
              {member.role === 'admin' && (
                <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">
                  Admin
                </span>
              )}
              {member.role === 'coach' && (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                  Coach
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              {member.role !== 'coach' && (
                <>
                  <span>#{member.jersey_number}</span>
                  <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-700 rounded">
                    {member.position}
                  </span>
                </>
              )}
              {isAdmin && member.phone && (
                <a
                  href={`https://wa.me/${member.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700"
                  title={`WhatsApp ${member.name}`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}
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

      {/* Coaches Section */}
      {coaches.length > 0 && (
        <div>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
              Coaches
            </h3>
          </div>
          <div>
            {coaches.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Admins Section */}
      {admins.length > 0 && (
        <div>
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
              Admins
            </h3>
          </div>
          <div>
            {admins.map((member) => (
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
