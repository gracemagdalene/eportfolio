import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { login } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Administrator login', robots: { index: false, follow: false } };

export default async function Login({ searchParams }) {
  if (await isAdmin()) redirect('/admin');
  const sp = await searchParams;
  return (
    <div className="login">
      <h1>Administrator login</h1>
      <p className="muted">Only the site owner can update the content.</p>
      {sp?.err === 'config' && <p className="notice bad">ADMIN_PASSWORD has not been set in the project settings yet.</p>}
      {sp?.err === '1' && <p className="notice bad">Wrong password. Please try again.</p>}
      <form action={login} className="panel">
        <input type="password" name="password" placeholder="Password" required autoFocus />
        <button className="btn">Log in</button>
      </form>
      <p><a href="/">&larr; Back to the website</a></p>
    </div>
  );
}
