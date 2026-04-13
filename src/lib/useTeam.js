import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

export function useTeam() {
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [rsvps, setRsvps] = useState([])
  const [goals, setGoals] = useState([])
  const [lineups, setLineups] = useState([])
  const [session, setSession] = useState(null)
  const [myMember, setMyMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)

  // Listen to auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadAll = useCallback(async () => {
    const [m, e, r, g, l] = await Promise.all([
      supabase.from('soccer_members').select('*').order('jersey_number'),
      supabase.from('soccer_events').select('*').order('date', { ascending: true }),
      supabase.from('soccer_rsvps').select('*'),
      supabase.from('soccer_goals').select('*'),
      supabase.from('soccer_lineups').select('*'),
    ])
    setMembers(m.data || [])
    setEvents(e.data || [])
    setRsvps(r.data || [])
    setGoals(g.data || [])
    setLineups(l.data || [])

    // Find the member profile linked to the current auth user
    if (session?.user) {
      const member = (m.data || []).find(x => x.user_id === session.user.id)
      setMyMember(member || null)
    } else {
      setMyMember(null)
    }
    setLoading(false)
  }, [session])

  useEffect(() => {
    if (!authLoading) loadAll()
  }, [authLoading, loadAll])

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('teambabo-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'soccer_members' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'soccer_events' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'soccer_rsvps' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'soccer_goals' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'soccer_lineups' }, loadAll)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [loadAll])

  // Auth actions
  const signUp = async ({ email, password, name, jerseyNumber, position, emoji, avatarFile }) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) return { error: authError.message }
    if (!authData.user) return { error: 'Sign up failed' }

    let avatarUrl = ''
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${authData.user.id}.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
        avatarUrl = urlData.publicUrl
      }
    }

    const { error: memberError } = await supabase.from('soccer_members').insert({
      user_id: authData.user.id,
      name,
      email,
      jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
      position: position || '',
      avatar_emoji: emoji || '⚽',
      avatar_url: avatarUrl,
      role: 'player',
    })
    if (memberError) return { error: memberError.message }

    await loadAll()
    return { error: null }
  }

  const login = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    await loadAll()
    return { error: null }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setMyMember(null)
  }

  // Team actions
  const addEvent = async (eventData) => {
    await supabase.from('soccer_events').insert({
      ...eventData,
      created_by: myMember?.id,
    })
    await loadAll()
  }

  const updateEvent = async (eventId, updates) => {
    await supabase.from('soccer_events').update(updates).eq('id', eventId)
    await loadAll()
  }

  const deleteEvent = async (eventId) => {
    await supabase.from('soccer_events').delete().eq('id', eventId)
    await loadAll()
  }

  const setRsvp = async (eventId, status) => {
    if (!myMember) return
    const existing = rsvps.find(r => r.event_id === eventId && r.member_id === myMember.id)
    if (existing) {
      await supabase.from('soccer_rsvps').update({ status, updated_at: new Date().toISOString() }).eq('id', existing.id)
    } else {
      await supabase.from('soccer_rsvps').insert({ event_id: eventId, member_id: myMember.id, status })
    }
    await loadAll()
  }

  const saveResult = async (eventId, teamScore, oppScore, goalsList) => {
    await supabase.from('soccer_events').update({
      team_score: parseInt(teamScore),
      opponent_score: parseInt(oppScore),
    }).eq('id', eventId)
    await supabase.from('soccer_goals').delete().eq('event_id', eventId)
    if (goalsList.length > 0) {
      await supabase.from('soccer_goals').insert(
        goalsList.map(g => ({
          event_id: eventId,
          scorer_id: g.scorer,
          assist_id: g.assist || null,
          minute: g.minute || null,
        }))
      )
    }
    await loadAll()
  }

  const saveLineup = async ({ event_id, formation, slots, status }) => {
    const existing = lineups.find(l => l.event_id === event_id)
    if (existing) {
      await supabase.from('soccer_lineups').update({
        formation,
        slots,
        status,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('soccer_lineups').insert({
        event_id,
        formation,
        slots,
        status,
        created_by: myMember?.id,
      })
    }
    await loadAll()
  }

  const promoteMember = async (memberId) => {
    await supabase.from('soccer_members').update({ role: 'admin' }).eq('id', memberId)
    await loadAll()
  }

  const updateProfile = async ({ name, jerseyNumber, position, emoji, avatarFile }) => {
    if (!myMember) return
    const updates = {
      name,
      jersey_number: jerseyNumber ? parseInt(jerseyNumber) : null,
      position: position || '',
      avatar_emoji: emoji || myMember.avatar_emoji,
    }
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${session.user.id}.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
        updates.avatar_url = urlData.publicUrl
      }
    }
    await supabase.from('soccer_members').update(updates).eq('id', myMember.id)
    await loadAll()
  }

  const isAdmin = myMember?.role === 'admin'
  const me = myMember?.id || null

  return {
    members, events, rsvps, goals, lineups,
    me, myInfo: myMember, isAdmin,
    loading: loading || authLoading,
    session,
    hasProfile: !!myMember,
    signUp, login, logout, updateProfile,
    addEvent, updateEvent, deleteEvent, setRsvp, saveResult, saveLineup, promoteMember,
    getMemberName: (id) => members.find(m => m.id === id)?.name || '?',
    getMemberEmoji: (id) => members.find(m => m.id === id)?.avatar_emoji || '⚽',
    getMemberAvatar: (id) => {
      const m = members.find(m => m.id === id)
      return m?.avatar_url || null
    },
    getEventRsvps: (eid) => rsvps.filter(r => r.event_id === eid),
    getMyRsvp: (eid) => myMember ? rsvps.find(r => r.event_id === eid && r.member_id === myMember.id) : null,
    getEventGoals: (eid) => goals.filter(g => g.event_id === eid),
    getEventLineup: (eid) => lineups.find(l => l.event_id === eid) || null,
  }
}
