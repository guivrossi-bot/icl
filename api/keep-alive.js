export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  try {
    const r = await fetch(`${url}/rest/v1/keep_alive?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });

    if (!r.ok) throw new Error(`Supabase respondeu ${r.status}`);

    const data = await r.json();
    return res.status(200).json({ ok: true, rows: data.length, at: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
