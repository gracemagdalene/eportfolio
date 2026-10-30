'use server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

// Contact form on the public site
export async function sendMessage(fd) {
  const name = String(fd.get('name') ?? '').trim().slice(0, 100);
  const email = String(fd.get('email') ?? '').trim().slice(0, 150);
  const message = String(fd.get('message') ?? '').trim().slice(0, 3000);
  if (String(fd.get('website') ?? '')) redirect('/contact?sent=1'); // hidden spam trap
  const valid = name && message && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  let ok = false;
  if (valid) {
    try { const sql = await db(); await sql`INSERT INTO messages (name, email, message) VALUES (${name}, ${email}, ${message})`; ok = true; }
    catch (e) { console.error(e); }
  }
  redirect(`/contact?sent=${ok ? 1 : 0}`);
}
