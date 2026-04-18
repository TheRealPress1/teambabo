import React, { useState, useEffect } from 'react';

export default function AddResult({ event, members, existingGoals, onSubmit, onClose }) {
  const [teamScore, setTeamScore] = useState('');
  const [oppScore, setOppScore] = useState('');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (existingGoals && existingGoals.length > 0) {
      setGoals(existingGoals.map((goal) => ({
        scorer: goal.scorer_id || '',
        assist: goal.assist_id || '',
        minute: goal.minute || '',
      })));
    } else {
      setGoals([{ scorer: '', assist: '', minute: '' }]);
    }
  }, [existingGoals]);

  const handleAddGoal = () => setGoals([...goals, { scorer: '', assist: '', minute: '' }]);
  const handleDeleteGoal = (index) => setGoals(goals.filter((_, i) => i !== index));
  const handleGoalChange = (index, field, value) => {
    const updated = [...goals];
    updated[index][field] = value;
    setGoals(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validGoals = goals
      .filter((g) => g.scorer)
      .map((g) => ({ scorer: g.scorer, assist: g.assist || null, minute: g.minute ? parseInt(g.minute) : null }));
    onSubmit(event.id, parseInt(teamScore) || 0, parseInt(oppScore) || 0, validGoals);
  };

  const opponentName = event.opponent || event.title || 'Opponent';

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f7f8f8',
    fontSize: '13px',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 510,
    color: '#8a8f98',
    marginBottom: '5px',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-xl"
        style={{ background: '#0f1011', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 590, color: '#f7f8f8', letterSpacing: '-0.24px' }}>Game Result</h2>
            <p className="mt-0.5" style={{ fontSize: '12px', color: '#8a8f98' }}>vs {opponentName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8a8f98', fontSize: '18px' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Score */}
          <div className="rounded-xl p-5" style={{ background: '#191a1b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-center mb-4" style={{ fontSize: '11px', fontWeight: 510, color: '#62666d', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Final Score
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label style={{ ...labelStyle, textAlign: 'center' }}>Babson</label>
                <input
                  type="number"
                  min="0"
                  value={teamScore}
                  onChange={(e) => setTeamScore(e.target.value)}
                  style={{
                    ...inputStyle,
                    fontSize: '32px',
                    fontWeight: 590,
                    textAlign: 'center',
                    padding: '12px',
                    border: '1px solid rgba(94,106,210,0.3)',
                    color: '#7170ff',
                  }}
                />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 590, color: '#3e3e44' }}>–</div>
              <div className="flex-1">
                <label style={{ ...labelStyle, textAlign: 'center' }}>{opponentName}</label>
                <input
                  type="number"
                  min="0"
                  value={oppScore}
                  onChange={(e) => setOppScore(e.target.value)}
                  style={{ ...inputStyle, fontSize: '32px', fontWeight: 590, textAlign: 'center', padding: '12px' }}
                />
              </div>
            </div>
          </div>

          {/* Goal Scorers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: '12px', fontWeight: 510, color: '#8a8f98' }}>Goal Scorers</span>
              <button
                type="button"
                onClick={handleAddGoal}
                className="flex items-center gap-1"
                style={{ fontSize: '12px', fontWeight: 510, color: '#7170ff' }}
              >
                + Add Goal
              </button>
            </div>

            <div className="space-y-3">
              {goals.map((goal, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label style={labelStyle}>Scorer</label>
                    <select
                      value={goal.scorer}
                      onChange={(e) => handleGoalChange(index, 'scorer', e.target.value)}
                      style={{ ...inputStyle, appearance: 'none' }}
                    >
                      <option value="">Select player</option>
                      {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label style={labelStyle}>Assist (opt.)</label>
                    <select
                      value={goal.assist}
                      onChange={(e) => handleGoalChange(index, 'assist', e.target.value)}
                      style={{ ...inputStyle, appearance: 'none' }}
                    >
                      <option value="">None</option>
                      {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div className="w-16">
                    <label style={labelStyle}>Min.</label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={goal.minute}
                      onChange={(e) => handleGoalChange(index, 'minute', e.target.value)}
                      placeholder="90"
                      style={{ ...inputStyle, textAlign: 'center' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(index)}
                    style={{ color: '#62666d', fontSize: '20px', lineHeight: 1, paddingBottom: '6px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md"
              style={{
                fontSize: '13px',
                fontWeight: 510,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#8a8f98',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-md"
              style={{ fontSize: '13px', fontWeight: 510, background: '#5e6ad2', color: '#ffffff' }}
            >
              Save Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
