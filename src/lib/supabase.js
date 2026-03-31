import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Unified lead capture
export async function saveLead({ email, first_name, company, source, recommended_process, payload }) {
  try {
    await supabase.from('leads').insert([{ email, first_name, company, source, recommended_process, payload }])
  } catch (e) { console.warn('saveLead failed', e) }
}

// Unified feedback
export async function saveFeedback({ source, score, comment, recommended_process, payload }) {
  try {
    await supabase.from('feedback').insert([{ source, score, comment, recommended_process, payload }])
  } catch (e) { console.warn('saveFeedback failed', e) }
}

// Contact messages
export async function saveMessage({ name, email, message }) {
  try {
    await supabase.from('messages').insert([{ name, email, message }])
  } catch (e) { console.warn('saveMessage failed', e) }
}
