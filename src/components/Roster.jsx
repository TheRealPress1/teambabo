export default function Roster({ members = [], me, isAdmin = false, onPromote }) {
  const coaches = members.filter((m) => m.role === 'admin');
  const players = members.filter((m) => m.role === 'player');

  const MemberRow = ({ member }) => {
    const isMe = member.id === me;
    const isAdmin = member.role === 'admin';

    return (
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-lg font-semibold text-stone-700">
            {member.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900">{member.name}</span>
              {isMe && <span className="text-xs text-stone-500">(you)</span>}
              {isAdmin && (
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

        {/* Promote button */}
        {isAdmin && !isMe && !isAdmin && (
          <button
            onClick={() => onPromote(member.id)}
            className="text-xs px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 font-medium rounded transition-colors"
          >
            Make admin
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-stone-100 bg-stone-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Roster</h2>
          <span className="text-sm px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">
            {members.length}
          </span>
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
    </div>
  );
}
