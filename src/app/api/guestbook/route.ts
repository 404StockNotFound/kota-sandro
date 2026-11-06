import { NextResponse, connection } from 'next/server';

// Supabase via REST (tanpa library tambahan). Key cuma ada di server.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const endpoint = () => `${SUPABASE_URL}/rest/v1/guestbook`;
// key model baru (sb_publishable_...) cukup lewat header apikey
const headers = () => ({
  apikey: SUPABASE_KEY!,
  'Content-Type': 'application/json',
});
// rate limit sederhana: maks 3 pesan / 10 menit per IP
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;

const clean = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function GET() {
  await connection();
  if (!SUPABASE_URL || !SUPABASE_KEY) return NextResponse.json([]);
  const r = await fetch(`${endpoint()}?select=id,name,message,created_at&order=created_at.desc&limit=30`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!r.ok) return NextResponse.json([]);
  return NextResponse.json(await r.json());
}

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return fail('Buku tamu belum aktif.', 503);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= 3) return fail('Kebanyakan pesan, coba lagi nanti ya.', 429);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail('Format salah.'); }

  // honeypot: kolom tersembunyi yang cuma diisi bot
  if (body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name);
  const message = clean(body.message);
  if (name.length < 2 || name.length > 24) return fail('Nama 2–24 huruf ya.');
  if (message.length < 2 || message.length > 140) return fail('Pesan 2–140 huruf ya.');
  if (/https?:\/\/|www\.|\.(com|id|net|xyz)\b/i.test(name + ' ' + message)) return fail('Link nggak boleh ya 🙏');

  recent.push(now);
  hits.set(ip, recent);

  const r = await fetch(endpoint(), {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=representation' },
    body: JSON.stringify({ name, message }),
  });
  if (!r.ok) return fail('Gagal nyimpen, coba lagi.', 500);
  const [row] = await r.json();
  return NextResponse.json(row);
}