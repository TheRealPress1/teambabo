export default function Stats({ events = [], goals = [], rsvps = [], members = [] }) {
  // Season Record - count games with team_score != null
  const gamesPlayed = events.filter((e) => e.team_score != null);
  const wins = gamesPlayed.filter((e) => e.team_score > e.opponent_score).length;
  const draws = gamesPlayed.filter((e) => e.team_score === e.opponent_score).length;
  const losses = gamesPlayed.filter((e) => e.team_score < e.opponent_score).length;

  // Goals For and Against
  const goalsFor = goals.filter((g) => g.type === 'for').length;
  const goalsAgainst = goals.filter((g) => g.type === 'against').length;

  // Top Scorers - group by scorer_id and count
  const scorerMap = {};
  goals
    .filter((g) => g.type === 'for' && g.scorer_id)
    .forEach((g) => {
      scorerMap[g.scorer_id] = (scorerMap[g.scorer_id] || 0) + 1;
    });

  const topScorers = Object.entries(scorerMap)
    .map(([id, count]) => {
      const member = members.find((m) => m.id === id);
      return { id, name: member?.name || 'Unknown', initial: member?.name?.charAt(0).toUpperCase() || '?', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top Assists - group by assist_id and count
  const assistMap = {};
  goals
    .filter((g) => g.type === 'for' && g.assist_id)
    .forEach((g) => {
      assistMap[g.assist_id] = (assistMap[g.assist_id] || 0) + 1;
    });

  const topAssists = Object.entries(assistMap)
    .map(([id, count]) => {
      const member = members.find((m) => m.id === id);
      return { id, name: member?.name || 'Unknown', initial: member?.name?.charAt(0).toUpperCase() || '?', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Attendance Leaders - count rsvps with status='going'
  const attendanceMap = {};
  rsvps.forEach((rsvp) => {
    if (rsvp.status === 'going') {
      attendanceMap[rsvp.member_id] = (attendanceMap[rsvp.member_id] || 0) + 1;
    }
  });

  const totalEvents = events.length;

  const attendanceLeaders = Object.entries(attendanceMap)
    .map(([id, goingCount]) => {
      const member = members.find((m) => m.id === id);
      return {
        id,
        name: member?.name || 'Unknown',
        initial: member?.name?.charAt(0).toUpperCase() || '?',
        going: goingCount,
        total: totalEvents,
      };
    })
    .sort((a, b) => b.going - a.going)
    .slice(0, 10);

  // Stat Card Component
  const StatCard = ({ label, value, color = 'violet' }) => {
    const colorMap = {
      green: 'text-emerald-600',
      amber: 'text-amber-600',
      red: 'text-red-600',
      violet: 'text-violet-600',
    };

    return (
      <div className="bg-white rounded-xl border border-stone-100 p-4 text-center">
        <div className={`text-3xl font-bold ${colorMap[color]}`}>{value}</div>
        <div className="text-sm text-stone-600 mt-1">{label}</div>
      </div>
    );
  };

  // Leaderboard Component
  const Leaderboard = ({ title, items, emptyMessage, icon = null }) => (
    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
        <h3 className="font-semibold text-sm text-stone-900">{title}</h3>
      </div>
      {items.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-stone-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {items.map((item, idx) => (
            <div key={item.id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-400 w-5">{idx + 1}</span>
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-semibold text-stone-700">
                  {item.initial}
                </div>
                <span className="font-medium text-stone-900">{item.name}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-stone-900">
                {item.going !== undefined ? (
                  <span>
                    {item.going}/{item.total}
                  </span>
                ) : (
                  <>
                    <span>{item.count}</span>
                    <span className="text-lg">{icon}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Season Record */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Wins" value={wins} color="green" />
        <StatCard label="Draws" value={draws} color="amber" />
        <StatCard label="Losses" value={losses} color="red" />
      </div>

      {/* Goals Row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Goals For" value={goalsFor} color="violet" />
        <StatCard label="Goals Against" value={goalsAgainst} color="violet" />
      </div>

      {/* Top Scorers */}
      <Leaderboard
        title="Top Scorers"
        items={topScorers}
        emptyMessage="No goals recorded yet"
        icon={null}
      />

      {/* Top Assists */}
      <Leaderboard
        title="Top Assists"
        items={topAssists}
        emptyMessage="No assists recorded yet"
        icon={null}
      />

      {/* Attendance Leaders */}
      <Leaderboard
        title="Attendance Leaders"
        items={attendanceLeaders}
        emptyMessage="No attendance data yet"
      />
    </div>
  );
}
