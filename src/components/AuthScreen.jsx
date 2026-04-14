import { useState, useRef } from 'react'
import { POSITIONS } from '../lib/utils'
import { supabase } from '../lib/supabase'

export default function AuthScreen({ onSignUp, onLogin }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [position, setPosition] = useState('')
  const emoji = '⚽'
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setAvatarPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const [resetEmail, setResetEmail] = useState('')

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin,
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Password reset email sent! Check your inbox.')
    }
    setSubmitting(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await onLogin({ email: loginEmail, password: loginPassword })
    if (result?.error) setError(result.error)
    setSubmitting(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (!jerseyNumber) {
      setError('Please enter your jersey number')
      return
    }
    if (!avatarFile) {
      setError('Please upload a profile photo')
      return
    }
    setSubmitting(true)
    const result = await onSignUp({
      email, password, name: name.trim(),
      jerseyNumber, position, emoji, avatarFile,
    })
    if (result?.error) setError(result.error)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Babson Club Soccer</h1>
          </div>
          <p className="text-gray-500 text-sm">Your squad, your game, your hub</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setMode('signup'); setError('') }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60"
            >
              {submitting ? 'Logging in...' : 'Log In'}
            </button>
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess('') }} className="text-violet-600 font-medium hover:underline">
                Forgot password?
              </button>
              <p className="text-gray-400">
                <button type="button" onClick={() => { setMode('signup'); setError('') }} className="text-violet-600 font-medium hover:underline">
                  Sign up
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p className="text-center text-sm text-gray-400">
              <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }} className="text-violet-600 font-medium hover:underline">
                Back to login
              </button>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-violet-400 flex items-center justify-center overflow-hidden transition-colors"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-gray-400">+</span>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-xs text-gray-400 mt-2">Tap to upload a photo *</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password *</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Jersey # *</label>
                <input
                  type="number"
                  value={jerseyNumber}
                  onChange={e => setJerseyNumber(e.target.value)}
                  placeholder="99"
                  min="0"
                  max="99"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Position</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 appearance-none"
                >
                  <option value="">Select</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60"
            >
              {submitting ? 'Creating account...' : 'Join the Squad'}
            </button>
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('login'); setError('') }} className="text-violet-600 font-medium hover:underline">
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
