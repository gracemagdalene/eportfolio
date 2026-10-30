import { cache } from 'react';
import { db } from '@/lib/db';
import { DEFAULTS } from '@/lib/content';

async function safe(fn, fallback) {
  try { return await fn(); } catch (e) { console.error(e); return fallback; }
}

export const getSettings = cache(() => safe(async () => {
  const sql = await db();
  const s = { ...DEFAULTS };
  for (const r of await sql`SELECT skey, svalue FROM settings`) s[r.skey] = r.svalue ?? '';
  return s;
}, { ...DEFAULTS }));

export const getProjects = cache(() => safe(async () => (await db())`SELECT * FROM projects ORDER BY id ASC`, []));
export const getQualifications = cache(() => safe(async () => (await db())`SELECT * FROM qualifications ORDER BY id DESC`, []));
export const getAchievements = cache(() => safe(async () => (await db())`SELECT * FROM achievements ORDER BY id DESC`, []));
export const getMessages = cache(() => safe(async () => (await db())`SELECT * FROM messages ORDER BY created_at DESC`, []));

export async function setSetting(key, value) {
  const sql = await db();
  await sql`INSERT INTO settings (skey, svalue) VALUES (${key}, ${value}) ON CONFLICT (skey) DO UPDATE SET svalue = EXCLUDED.svalue`;
}
