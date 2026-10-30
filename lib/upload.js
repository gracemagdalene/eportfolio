import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const MAX = 4 * 1024 * 1024; // 4 MB (Vercel functions accept about 4.5 MB per request)
const BUCKET = 'portfolio';

let sb;
let bucketReady;

function supabase() {
  if (!sb) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set in the Vercel project settings.');
    sb = createClient(url, key, { auth: { persistSession: false } });
  }
  return sb;
}

// Creates the public storage bucket the first time (ignored if it already exists)
function ensureBucket() {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { error } = await supabase().storage.createBucket(BUCKET, { public: true });
      if (error && !/already exists|duplicate/i.test(error.message)) throw new Error(error.message);
    })().catch((e) => { bucketReady = null; throw e; });
  }
  return bucketReady;
}

function sniff(b) {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { type: 'image/jpeg', ext: 'jpg' };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { type: 'image/png', ext: 'png' };
  if (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') return { type: 'image/webp', ext: 'webp' };
  if (b.slice(0, 4).toString() === '%PDF') return { type: 'application/pdf', ext: 'pdf' };
  return null;
}

// Checks the real file type (not just the name) and stores it in Supabase Storage. Returns the public URL.
export async function saveFile(file, allowedExts, folder) {
  if (!file || typeof file === 'string' || !file.size) return null;
  if (file.size > MAX) throw new Error('The file is larger than 4 MB.');
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind || !allowedExts.includes(kind.ext)) throw new Error('That file type is not allowed.');
  await ensureBucket();
  const path = `${folder}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${kind.ext}`;
  const store = supabase().storage.from(BUCKET);
  const { error } = await store.upload(path, buf, { contentType: kind.type, upsert: false });
  if (error) throw new Error(error.message);
  return store.getPublicUrl(path).data.publicUrl;
}

export async function removeFile(url) {
  if (!url) return;
  try {
    const rest = String(url).split(`/object/public/${BUCKET}/`)[1];
    if (rest) await supabase().storage.from(BUCKET).remove([decodeURIComponent(rest)]);
  } catch (e) { console.error(e); }
}
