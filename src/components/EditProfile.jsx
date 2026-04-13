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

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f7f8f8',
    fontSize: '14px',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 510,
    color: '#8a8f98',
    marginBottom: '6px',
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="w-full max-w-sm rounded-xl overflow-hidden"
          style={{ background: '#0f1011', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span style={{ fontSize: '15px', fontWeight: 590, color: '#f7f8f8', letterSpacing: '-0.24px' }}>
              Edit Profile
            </span>
            <button
              onClick={onClose}
              style={{ color: '#62666d', fontSize: '18px' }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden transition-colors relative"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '2px solid rgba(255,255,255,0.12)',
                }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ fontSize: '24px', fontWeight: 590, color: '#62666d' }}>
                    {myInfo?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 510, color: '#ffffff' }}>Change</span>
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <p className="mt-2" style={{ fontSize: '11px', color: '#62666d' }}>Tap to change photo</p>
            </div>

            {/* Name */}
            <div>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* Jersey & Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Jersey #</label>
                <input
                  type="number"
                  value={jerseyNumber}
                  onChange={e => setJerseyNumber(e.target.value)}
                  placeholder="99"
                  min="0"
                  max="99"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Position</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' }}
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
              className="w-full py-2.5 rounded-md transition-colors"
              style={{
                background: '#5e6ad2',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 510,
                opacity: (saving || !name.trim()) ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 rounded-md transition-colors"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
                fontSize: '14px',
                fontWeight: 510,
              }}
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
