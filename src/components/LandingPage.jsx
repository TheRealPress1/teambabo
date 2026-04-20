export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" fillOpacity="0.3"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">TeamBabo</span>
          </div>
          <button
            onClick={onGetStarted}
            className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold mb-6">
          Free forever for teams
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Your team hub.
          <br />
          <span className="text-violet-600">Built for soccer.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Schedule games, track attendance, manage lineups, and keep your whole squad connected. The free alternative to TeamSnap that your team actually wants to use.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 active:scale-[0.98] transition-all shadow-lg shadow-violet-200 text-base"
          >
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            }
            title="Schedule & RSVP"
            description="Create games and practices. Players RSVP instantly. See who's coming at a glance with real-time counts."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
            title="Roster & Attendance"
            description="Full team roster with attendance tracking. Know who shows up and who doesn't. Sort by position or attendance rate."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            }
            title="Lineup Builder"
            description="Drag-and-drop lineup creator with real formations. Save templates, publish for game day, and keep your squad organized."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
            }
            title="Stats & Results"
            description="Track wins, draws, losses. Record goal scorers and assists. See your team's season at a glance."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            }
            title="Location & Directions"
            description="Google Places autocomplete for venues. Players tap to get directions straight from the event card."
          />
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            }
            title="WhatsApp Integration"
            description="One-tap WhatsApp messaging. Text your coach, chase non-responders, or message the whole squad instantly."
          />
        </div>
      </section>

      {/* Social Proof / Comparison */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why pay $15/month for TeamSnap?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-8">
            TeamBabo gives you everything your rec or club soccer team needs — scheduling, RSVP, rosters, lineups, stats — completely free.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <ComparisonItem label="Price" ours="Free" theirs="$15/mo" />
            <ComparisonItem label="RSVP" ours="Instant" theirs="Clunky" />
            <ComparisonItem label="Lineups" ours="Visual" theirs="None" />
            <ComparisonItem label="WhatsApp" ours="Built-in" theirs="None" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to run your team better?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Set up your team in under 2 minutes. No credit card, no catch.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 active:scale-[0.98] transition-all shadow-lg shadow-violet-200 text-base"
        >
          Get Started — It's Free
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">TeamBabo</span>
          </div>
          <p className="text-xs text-gray-400">Built for teams that play together.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-xl border border-gray-100 hover:border-violet-200 hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  )
}

function ComparisonItem({ label, ours, theirs }) {
  return (
    <div className="text-center">
      <div className="text-xs font-semibold text-gray-400 uppercase mb-2">{label}</div>
      <div className="text-sm font-bold text-violet-600 mb-1">{ours}</div>
      <div className="text-xs text-gray-400 line-through">{theirs}</div>
    </div>
  )
}
