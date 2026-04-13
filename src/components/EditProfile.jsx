import { useState, useRef } from 'react'
import { POSITIONS } from '../lib/utils'

export default function EditProfile({ myInfo, onSave, onLogout, onClose }) {
  const [name, setName] = useState(myInfo?.name || '')
  const [jerseyNumber, setJerseyNumber] = useState(myInfo?.jersey_number?.toString() || '')
  const [position, setPosition] = useState(myInfo?.position || '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(myInfo?.avatar_url || null)
  const [saving, setSaving] = useState(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      name: name.trim(),
      jerseyNumber,
      position,
      avatarFile,
    })
    setSaving(false)
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-2xl shadow-lg w-full max-w-sm max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden transition-colors relative hover:bg-gray-200"
                style={{ border: '2px dashed #d1d5db' }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {myInfo?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                  <span className="text-xs font-medium text-white">Change</span>
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <p className="mt-2 text-xs text-gray-400">Tap to change photo</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Jersey & Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Jersey #</label>
                <input
                  type="number"
                  value={jerseyNumber}
                  onChange={e => setJerseyNumber(e.target.value)}
                  placeholder="99"
                  min="0"
                  max="99"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Position</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="">Select</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full py-2.5 rounded-lg font-semibold text-sm bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 rounded-lg font-semibold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
