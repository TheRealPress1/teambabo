import React, { useState, useEffect } from 'react';

export default function AddResult({
  event,
  members,
  existingGoals,
  onSubmit,
  onClose,
}) {
  const [teamScore, setTeamScore] = useState('');
  const [oppScore, setOppScore] = useState('');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Initialize goals from existingGoals
    if (existingGoals && existingGoals.length > 0) {
      setGoals(
        existingGoals.map((goal) => ({
          scorer: goal.scorer_id || '',
          assist: goal.assist_id || '',
          minute: goal.minute || '',
        }))
      );
    } else {
      setGoals([{ scorer: '', assist: '', minute: '' }]);
    }
  }, [existingGoals]);

  const handleAddGoal = () => {
    setGoals([...goals, { scorer: '', assist: '', minute: '' }]);
  };

  const handleDeleteGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out goals without a scorer
    const validGoals = goals
      .filter((goal) => goal.scorer)
      .map((goal) => ({
        scorer: goal.scorer,
        assist: goal.assist || null,
        minute: goal.minute || null,
      }));

    onSubmit(event.id, parseInt(teamScore) || 0, parseInt(oppScore) || 0, validGoals);
  };

  const opponentName = event.opponent || event.title || 'Opponent';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Game Result</h2>
            <p className="text-sm text-gray-500 mt-1">vs {opponentName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Score Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Final Score
            </label>
            <div className="flex items-center justify-between gap-4">
              {/* Team Score */}
              <div className="flex-1">
                <label htmlFor="teamScore" className="block text-xs font-medium text-gray-600 text-center mb-2">
                  TeamBabo
                </label>
                <input
                  id="teamScore"
                  type="number"
                  min="0"
                  value={teamScore}
                  onChange={(e) => setTeamScore(e.target.value)}
                  className="w-full text-4xl font-bold text-center text-violet-600 bg-white border-2 border-violet-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Dash */}
              <div className="text-2xl font-bold text-gray-400">–</div>

              {/* Opponent Score */}
              <div className="flex-1">
                <label htmlFor="oppScore" className="block text-xs font-medium text-gray-600 text-center mb-2">
                  {opponentName}
                </label>
                <input
                  id="oppScore"
                  type="number"
                  min="0"
                  value={oppScore}
                  onChange={(e) => setOppScore(e.target.value)}
                  className="w-full text-4xl font-bold text-center text-gray-700 bg-white border-2 border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Goal Scorers Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-900">
                Goal Scorers
              </label>
              <button
                type="button"
                onClick={handleAddGoal}
                className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 font-medium transition"
              >
                <span className="text-lg">+</span>
                Add Goal
              </button>
            </div>

            <div className="space-y-3">
              {goals.map((goal, index) => (
                <div key={index} className="flex gap-3 items-end">
                  {/* Scorer Dropdown */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Scorer
                    </label>
                    <select
                      value={goal.scorer}
                      onChange={(e) => handleGoalChange(index, 'scorer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Select player</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assist Dropdown */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Assist (opt.)
                    </label>
                    <select
                      value={goal.assist}
                      onChange={(e) => handleGoalChange(index, 'assist', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">None</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Minute Input */}
                  <div className="w-20">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Min. (opt.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={goal.minute}
                      onChange={(e) => handleGoalChange(index, 'minute', e.target.value)}
                      placeholder="90"
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(index)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition"
            >
              Save Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
