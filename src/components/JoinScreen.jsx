import { useState } from 'react';

export default function JoinScreen({ members = [], onLogin, onJoin }) {
  const [name, setName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [position, setPosition] = useState('');
  const [emoji, setEmoji] = useState('⚽');
  const [submitted, setSubmitted] = useState(false);

  const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF', 'LM', 'RM'];
  const emojis = ['⚽', '🏆', '🥅', '🦁', '💪', '🔥', '⭐', '🎯', '👑', '🐉', '🦅', '🐺', '🦈', '🎖️', '💎'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onJoin({
      name: name.trim(),
      jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : null,
      position: position || null,
      emoji: emoji,
    });

    setSubmitted(true);
    setName('');
    setJerseyNumber('');
    setPosition('');
    setEmoji('⚽');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-slate-800">TeamBabo</h1>
            <span className="text-4xl">⚽</span>
          </div>
          <p className="text-sm text-slate-500">Your squad, your game, your rules</p>
        </div>

        {/* Existing Members Section */}
        {members.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-700 mb-4 text-center">
                Already on the roster?
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => onLogin(member.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all duration-200 hover:bg-violet-50"
                  >
                    <div className="text-3xl">{member.avatar_emoji}</div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">
                        {member.name.split(' ')[0]}
                      </p>
                      <p className="text-xs text-slate-500">#{member.jersey_number}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-gray-200" />
              <p className="text-xs text-slate-400 font-medium">OR</p>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </>
        )}

        {/* Join Form Section */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-6 text-center">
            New here? Join the team
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-600 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all"
                required
              />
            </div>

            {/* Jersey Number & Position Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="jersey" className="block text-xs font-medium text-slate-600 mb-2">
                  Jersey #
                </label>
                <input
                  id="jersey"
                  type="number"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(e.target.value)}
                  placeholder="99"
                  min="1"
                  max="99"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-xs font-medium text-slate-600 mb-2">
                  Position
                </label>
                <select
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-800 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Emoji Picker */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Pick your vibe
              </label>
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`p-3 rounded-xl text-xl transition-all ${
                      emoji === e
                        ? 'bg-violet-600 shadow-md scale-105'
                        : 'bg-white border border-gray-200 hover:border-violet-300 hover:shadow-sm'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-sm hover:shadow-md"
            >
              Join the Squad
            </button>
          </form>

          {submitted && (
            <p className="text-xs text-green-600 text-center mt-4 font-medium">
              ✓ Welcome to the team!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
