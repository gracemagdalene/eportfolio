import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const S = await getSettings();
  if (!S.cv_url) return new Response('No CV has been uploaded yet.', { status: 404 });
  const r = await fetch(S.cv_url);
  if (!r.ok) return new Response('The CV is not available right now.', { status: 502 });
  const name = (S.name || 'CV').replace(/[^A-Za-z0-9]+/g, '_');
  return new Response(r.body, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${name}_CV.pdf"`, 'Cache-Control': 'no-store' } });
}
