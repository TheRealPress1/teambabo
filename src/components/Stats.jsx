import { useState } from 'react'
import { fmtDate, fmtTime } from '../lib/utils'

export default function Stats({ events = [], goals = [], rsvps = [], members = [], isAdmin = false, onSaveResult }) {
  const games = events
    .filter(e => e.type?.toLowerCase() === 'game')
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const pastGames = games.filter(g => new Date(g.date) < today)
  const upcomingGames = games.filter(g => new Date(g.date) >= today)

  // Season Record
  const gamesPlayed = pastGames.filter(e => e.team_score != null)
  const wins = gamesPlayed.filter(e => e.team_score > e.opponent_score).length
  const draws = gamesPlayed.filter(e => e.team_score === e.opponent_score).length
  const losses = gamesPlayed.filter(e => e.team_score < e.opponent_score).length

  // Goals
  const goalsFor = gamesPlayed.reduce((sum, g) => sum + (g.team_score || 0), 0)
  const goalsAgainst = gamesPlayed.reduce((sum, g) => sum + (g.opponent_score || 0), 0)

  // Top Scorers
  const scorerMap = {}
  goals.filter(g => g.scorer_id).forEach(g => {
    scorerMap[g.scorer_id] = (scorerMap[g.scorer_id] || 0) + 1
  })
  const topScorers = Object.entries(scorerMap)
    .map(([id, count]) => {
      const member = members.find(m => m.id === id)
      return { id, name: member?.name || 'Unknown', initial: member?.name?.charAt(0)?.toUpperCase() || '?', count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top Assists
  const assistMap = {}
  goals.filter(g => g.assist_id).forEach(g => {
    assistMap[g.assist_id] = (assistMap[g.assist_id] || 0) + 1
  })
  const topAssists = Object.entries(assistMap)
    .map(([id, count]) => {
      const member = members.find(m => m.id === id)
      return { id, name: member?.name || 'Unknown', initial: member?.name?.charAt(0)?.toUpperCase() || '?', count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const getMemberName = (id) => members.find(m => m.id === id)?.name || 'Unknown'

  const getGameTitle = (ev) => {
    if (ev.opponent) {
      const prefix = ev.home_away === 'home' ? 'vs' : '@'
      return `${prefix} ${ev.opponent}`
    }
    return ev.title
  }

  return (
    <div className="space-y-6">
      {/* Season Record */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Wins" value={wins} color="green" />
        <StatCard label="Draws" value={draws} color="amber" />
        <StatCard label="Losses" value={losses} color="red" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Goals For" value={goalsFor} color="violet" />
        <StatCard label="Goals Against" value={goalsAgainst} color="violet" />
      </div>

      {/* Games List */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
          <h3 className="font-semibold text-sm text-stone-900">Games ({games.length})</h3>
        </div>

        {upcomingGames.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-stone-50/50">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Upcoming</span>
            </div>
            {upcomingGames.map(game => (
              <GameRow key={game.id} game={game} goals={goals} members={members} getMemberName={getMemberName} getGameTitle={getGameTitle} isPast={false} isAdmin={false} />
            ))}
          </div>
        )}

        {pastGames.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-stone-50/50">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Results</span>
            </div>
            {pastGames.map(game => (
              <GameRow
                key={game.id}
                game={game}
                goals={goals.filter(g => g.event_id === game.id)}
                members={members}
                getMemberName={getMemberName}
                getGameTitle={getGameTitle}
                isPast={true}
                isAdmin={isAdmin}
                onSaveResult={onSaveResult}
              />
            ))}
          </div>
        )}

        {games.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-stone-500">No games scheduled yet</p>
          </div>
        )}
      </div>

      {/* Top Scorers */}
      <Leaderboard title="Top Scorers" items={topScorers} emptyMessage="No goals recorded yet" />
      <Leaderboard title="Top Assists" items={topAssists} emptyMessage="No assists recorded yet" />
    </div>
  )
}

function StatCard({ label, value, color = 'violet' }) {
  const colorMap = {
    green: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    violet: 'text-violet-600',
  }
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-4 text-center">
      <div className={`text-3xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-sm text-stone-600 mt-1">{label}</div>
    </div>
  )
}

function Leaderboard({ title, items, emptyMessage }) {
  return (
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
              <span className="font-semibold text-stone-900">{item.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GameRow({ game, goals, members, getMemberName, getGameTitle, isPast, isAdmin, onSaveResult }) {
  const [editing, setEditing] = useState(false)
  const [teamScore, setTeamScore] = useState(game.team_score?.toString() || '')
  const [oppScore, setOppScore] = useState(game.opponent_score?.toString() || '')
  const [goalsList, setGoalsList] = useState(
    goals.map(g => ({ scorer: g.scorer_id, assist: g.assist_id || '', minute: g.minute?.toString() || '' }))
  )
  const [saving, setSaving] = useState(false)

  const hasScore = game.team_score !== null && game.opponent_score !== null
  let resultColor = 'text-stone-400'
  let resultBg = 'bg-stone-50'
  if (hasScore) {
    if (game.team_score > game.opponent_score) { resultColor = 'text-emerald-600'; resultBg = 'bg-emerald-50' }
    else if (game.team_score < game.opponent_score) { resultColor = 'text-red-600'; resultBg = 'bg-red-50' }
    else { resultColor = 'text-amber-600'; resultBg = 'bg-amber-50' }
  }

  const addGoal = () => {
    setGoalsList([...goalsList, { scorer: '', assist: '', minute: '' }])
  }

  const removeGoal = (idx) => {
    setGoalsList(goalsList.filter((_, i) => i !== idx))
  }

  const updateGoal = (idx, field, value) => {
    const updated = [...goalsList]
    updated[idx] = { ...updated[idx], [field]: value }
    setGoalsList(updated)
  }

  const handleSave = async () => {
    if (!teamScore || !oppScore) return
    setSaving(true)
    await onSaveResult(
      game.id,
      teamScore,
      oppScore,
      goalsList.filter(g => g.scorer)
    )
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="border-b border-stone-100 last:border-b-0">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-stone-900 text-sm">{getGameTitle(game)}</div>
          <div className="text-xs text-stone-500 mt-0.5">
            {fmtDate(game.date)}
            {game.time && ` · ${fmtTime(game.time)}`}
            {game.location && ` · ${game.location}`}
          </div>
          {/* Show goal scorers in view mode */}
          {hasScore && goals.length > 0 && !editing && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {goals.map((g, i) => (
                <span key={i} className="text-xs text-stone-500">
                  {getMemberName(g.scorer_id)}{g.minute ? ` ${g.minute}'` : ''}
                  {g.assist_id ? ` (${getMemberName(g.assist_id)})` : ''}
                  {i < goals.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          {hasScore ? (
            <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${resultColor} ${resultBg}`}>
              {game.team_score} - {game.opponent_score}
            </span>
          ) : isPast ? (
            <span className="text-xs text-stone-400 px-2 py-1 rounded-lg bg-stone-50">No score</span>
          ) : (
            <span className="text-xs text-violet-600 px-2 py-1 rounded-lg bg-violet-50 font-medium">Upcoming</span>
          )}
          {isAdmin && isPast && (
            <button
              onClick={() => setEditing(!editing)}
              className="text-stone-400 hover:text-violet-600 transition-colors p-1"
              title={hasScore ? 'Edit result' : 'Add result'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Edit Mode */}
      {editing && (
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Babson</label>
              <input
                type="number"
                value={teamScore}
                onChange={e => setTeamScore(e.target.value)}
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">{game.opponent || 'Opponent'}</label>
              <input
                type="number"
                value={oppScore}
                onChange={e => setOppScore(e.target.value)}
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Goal Scorers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-500">Goal Scorers</label>
              <button
                type="button"
                onClick={addGoal}
                className="text-xs text-violet-600 font-medium hover:text-violet-700"
              >
                + Add Goal
              </button>
            </div>
            <div className="space-y-2">
              {goalsList.map((goal, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={goal.scorer}
                    onChange={e => updateGoal(idx, 'scorer', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Scorer</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <select
                    value={goal.assist}
                    onChange={e => updateGoal(idx, 'assist', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Assist (optional)</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <input
                    type="number"
                    value={goal.minute}
                    onChange={e => updateGoal(idx, 'minute', e.target.value)}
                    placeholder="Min"
                    min="0"
                    className="w-14 px-2 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    onClick={() => removeGoal(idx)}
                    className="text-red-400 hover:text-red-600 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setEditing(false)}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !teamScore || !oppScore}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
