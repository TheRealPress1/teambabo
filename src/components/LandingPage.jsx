import { useEffect, useState } from 'react'

export default function LandingPage({ onGetStarted }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">TeamBabo</span>
          </div>
          <button
            onClick={onGetStarted}
            className="text-sm font-medium text-white/60 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className={`relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-violet-300 text-xs font-semibold mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Free forever for teams
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Your team hub.
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
            Built for soccer.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/40 max-w-xl mx-auto leading-relaxed">
          Schedule, RSVP, lineups, stats, and WhatsApp — everything your team needs in one place. Free.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-2xl hover:from-violet-500 hover:to-violet-400 active:scale-[0.97] transition-all shadow-2xl shadow-violet-600/25 text-base relative overflow-hidden"
          >
            <span className="relative z-10">Get Started — It's Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </section>

      {/* Glass Feature Cards */}
      <section className={`relative z-10 max-w-6xl mx-auto px-6 py-16 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard
            delay={0}
            icon={<CalendarIcon />}
            title="Schedule & RSVP"
            description="Create events. Players RSVP instantly. Real-time counts show who's in."
          />
          <GlassCard
            delay={100}
            icon={<UsersIcon />}
            title="Roster & Attendance"
            description="Track who shows up. Sort by position or attendance rate. Hold players accountable."
          />
          <GlassCard
            delay={200}
            icon={<FieldIcon />}
            title="Lineup Builder"
            description="Drag-and-drop formations. Save templates. Publish for game day."
          />
          <GlassCard
            delay={300}
            icon={<ChartIcon />}
            title="Stats & Results"
            description="Wins, draws, losses. Goal scorers and assists. Your season at a glance."
          />
          <GlassCard
            delay={400}
            icon={<PinIcon />}
            title="Smart Locations"
            description="Google Places search. One-tap directions from any event card."
          />
          <GlassCard
            delay={500}
            icon={<ChatIcon />}
            title="WhatsApp Built-In"
            description="Message your coach, chase non-responders, or text the whole squad."
          />
        </div>
      </section>

      {/* Comparison */}
      <section className={`relative z-10 max-w-6xl mx-auto px-6 py-16 transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-14">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Why pay for TeamSnap?
          </h2>
          <p className="text-white/40 text-center max-w-lg mx-auto mb-10">
            Everything your rec or club team needs. Zero cost.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <ComparisonItem label="Price" ours="Free" theirs="$15/mo" />
            <ComparisonItem label="RSVP" ours="Instant" theirs="Clunky" />
            <ComparisonItem label="Lineups" ours="Visual" theirs="None" />
            <ComparisonItem label="WhatsApp" ours="Built-in" theirs="None" />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`relative z-10 max-w-6xl mx-auto px-6 py-20 text-center transition-all duration-1000 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Ready to run your team
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> better</span>?
        </h2>
        <p className="text-white/40 mb-10 max-w-md mx-auto">
          Set up in under 2 minutes. No credit card. No catch.
        </p>
        <button
          onClick={onGetStarted}
          className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-2xl hover:from-violet-500 hover:to-violet-400 active:scale-[0.97] transition-all shadow-2xl shadow-violet-600/25 text-base relative overflow-hidden"
        >
          <span className="relative z-10">Get Started — It's Free</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white/60">TeamBabo</span>
          </div>
          <p className="text-xs text-white/20">Built for teams that play together.</p>
        </div>
      </footer>
    </div>
  )
}

function GlassCard({ icon, title, description, delay = 0 }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-violet-500/30 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glow on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-violet-400 group-hover:text-violet-300 group-hover:border-violet-500/20 transition-colors">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
        <p className="text-sm text-white/40 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function ComparisonItem({ label, ours, theirs }) {
  return (
    <div className="text-center">
      <div className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-3">{label}</div>
      <div className="text-base font-bold text-violet-400 mb-1">{ours}</div>
      <div className="text-xs text-white/20 line-through">{theirs}</div>
    </div>
  )
}

// Icons
function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}
function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
function FieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
  )
}
function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}
function ChatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  )
}
