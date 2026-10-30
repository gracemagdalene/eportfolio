'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { setSetting } from '@/lib/data';
import { FIELDS } from '@/lib/content';
import { isAdmin, setSession, clearSession, passwordOk } from '@/lib/auth';
import { saveFile, removeFile } from '@/lib/upload';

const str = (fd, k, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max);
const num = (fd, k) => parseInt(String(fd.get(k) ?? '0'), 10) || 0;

// Runs an admin action, then returns to the dashboard with a success or error message
async function run(tab, okMsg, fn) {
  if (!(await isAdmin())) redirect('/admin/login');
  let err = null;
  try { await fn(); } catch (e) { console.error(e); err = e.message || 'Something went wrong.'; }
  if (err) redirect(`/admin?tab=${tab}&err=${encodeURIComponent(err)}`);
  revalidatePath('/', 'layout');
  redirect(`/admin?tab=${tab}&ok=${encodeURIComponent(okMsg)}`);
}

export async function login(fd) {
  if (!process.env.ADMIN_PASSWORD) redirect('/admin/login?err=config');
  if (passwordOk(fd.get('password'))) { await setSession(); redirect('/admin'); }
  await new Promise((r) => setTimeout(r, 800));
  redirect('/admin/login?err=1');
}

export async function logout() {
  await clearSession();
  redirect('/admin/login');
}

export async function saveContent(fd) {
  return run('content', 'Page content saved.', async () => {
    for (const f of FIELDS) await setSetting(f.key, str(fd, f.key, 8000));
  });
}

export async function uploadPhoto(fd) {
  return run('photo', 'Profile photo updated.', async () => {
    const url = await saveFile(fd.get('photo'), ['jpg', 'png', 'webp'], 'profile');
    if (!url) throw new Error('Please choose a photo.');
    const sql = await db();
    const old = (await sql`SELECT svalue FROM settings WHERE skey = 'photo_url'`)[0]?.svalue;
    await setSetting('photo_url', url);
    await removeFile(old);
  });
}

export async function uploadCv(fd) {
  return run('cv', 'CV uploaded.', async () => {
    const url = await saveFile(fd.get('cv'), ['pdf'], 'cv');
    if (!url) throw new Error('Please choose a PDF file.');
    const sql = await db();
    const old = (await sql`SELECT svalue FROM settings WHERE skey = 'cv_url'`)[0]?.svalue;
    await setSetting('cv_url', url);
    await removeFile(old);
  });
}

export async function removeCv() {
  return run('cv', 'CV removed.', async () => {
    const sql = await db();
    const old = (await sql`SELECT svalue FROM settings WHERE skey = 'cv_url'`)[0]?.svalue;
    await setSetting('cv_url', '');
    await removeFile(old);
  });
}

export async function addQualification(fd) {
  return run('education', 'Qualification added.', async () => {
    const title = str(fd, 'title', 150);
    if (!title) throw new Error('Qualification title is required.');
    const sql = await db();
    await sql`INSERT INTO qualifications (title, institution, period, details) VALUES (${title}, ${str(fd, 'institution', 150)}, ${str(fd, 'period', 80)}, ${str(fd, 'details', 2000)})`;
  });
}
export async function deleteQualification(fd) {
  return run('education', 'Qualification deleted.', async () => {
    const sql = await db();
    await sql`DELETE FROM qualifications WHERE id = ${num(fd, 'id')}`;
  });
}

export async function addProject(fd) {
  return run('projects', 'Project added.', async () => {
    const title = str(fd, 'title', 150);
    const link = str(fd, 'link', 255);
    if (!title) throw new Error('Project title is required.');
    if (link && !/^https?:\/\//i.test(link)) throw new Error('The link must start with http:// or https://');
    const sql = await db();
    await sql`INSERT INTO projects (title, description, link) VALUES (${title}, ${str(fd, 'description', 2000)}, ${link})`;
  });
}
export async function deleteProject(fd) {
  return run('projects', 'Project deleted.', async () => {
    const sql = await db();
    await sql`DELETE FROM projects WHERE id = ${num(fd, 'id')}`;
  });
}

export async function addAchievement(fd) {
  return run('achievements', 'Achievement added.', async () => {
    const title = str(fd, 'title', 150);
    if (!title) throw new Error('Title is required.');
    const evidence = await saveFile(fd.get('evidence'), ['jpg', 'png', 'webp', 'pdf'], 'evidence');
    const sql = await db();
    await sql`INSERT INTO achievements (title, organization, period, description, evidence_url) VALUES (${title}, ${str(fd, 'organization', 150)}, ${str(fd, 'period', 80)}, ${str(fd, 'description', 2000)}, ${evidence})`;
  });
}
export async function deleteAchievement(fd) {
  return run('achievements', 'Achievement deleted.', async () => {
    const sql = await db();
    const id = num(fd, 'id');
    const old = (await sql`SELECT evidence_url FROM achievements WHERE id = ${id}`)[0]?.evidence_url;
    await sql`DELETE FROM achievements WHERE id = ${id}`;
    await removeFile(old);
  });
}

export async function deleteMessage(fd) {
  return run('messages', 'Message deleted.', async () => {
    const sql = await db();
    await sql`DELETE FROM messages WHERE id = ${num(fd, 'id')}`;
  });
}
