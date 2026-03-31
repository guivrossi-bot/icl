import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = url && key ? createClient(url, key) : null

export async function saveLead({ email, first_name, company, source, recommended_process, payload }) {
  if (!supabase) return
  try {
    await supabase.from('leads').insert([{ email, first_name, company, source, recommended_process, payload }])
  } catch (e) { console.warn('saveLead', e) }
}

export async function saveFeedback({ source, score, comment, recommended_process, payload }) {
  if (!supabase) return
  try {
    await supabase.from('feedback').insert([{ source, score, comment, recommended_process, payload }])
  } catch (e) { console.warn('saveFeedback', e) }
}

export async function saveMessage({ name, email, message }) {
  if (!supabase) return
  try {
    await supabase.from('messages').insert([{ name, email, message }])
  } catch (e) { console.warn('saveMessage', e) }
}
