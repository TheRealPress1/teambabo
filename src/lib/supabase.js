import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jwsmgbnnffwubtuuxdzw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3c21nYm5uZmZ3dWJ0dXV4ZHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTE4MDksImV4cCI6MjA3OTU2NzgwOX0.5az4KVxZHW2P1JOISZIffTTIIu99t_bcofH7btVxPac'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
