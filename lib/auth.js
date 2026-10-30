import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'admin_session';
const WEEK = 7 * 24 * 3600;

const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = (v) => crypto.createHmac('sha256', secret()).update(v).digest('hex');

function makeToken() { const v = String(Date.now() + WEEK * 1000); return v + '.' + sign(v); }
function checkToken(t) {
  if (!t || !secret()) return false;
  const [v, sig] = t.split('.');
  if (!v || !sig) return false;
  const good = sign(v);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return false;
  return Number(v) > Date.now();
}

export async function isAdmin() { return checkToken((await cookies()).get(COOKIE)?.value); }
export async function setSession() {
  (await cookies()).set(COOKIE, makeToken(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: WEEK });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export function passwordOk(p) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real) return false;
  const a = crypto.createHash('sha256').update(String(p || '')).digest();
  const b = crypto.createHash('sha256').update(real).digest();
  return crypto.timingSafeEqual(a, b);
}
