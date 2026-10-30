import { getSettings } from '@/lib/data';
import { lines, split2 } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Skills' };
const ICONS = { html: '🧱', css: '🎨', javascript: '⚡', php: '🐘', mysql: '🗄️', networking: '🌐', cybersecurity: '🔒', 'computer applications': '💻', 'problem-solving': '🧩', communication: '💬', teamwork: '🤝', 'time management': '⏱️' };

export default async function Skills() {
  const S = await getSettings();
  const raw = S.skills.trim();
  // One skill per line ("Skill | description"). An old comma-separated list also works.
  const items = !raw.includes('\n') && raw.includes(',') ? raw.split(',').map((s) => s.trim()) : lines(raw);
  return (
    <>
      <section className="page-head"><span className="tag">Skills</span><h1>My <span className="grad">skills</span></h1></section>
      <section><p>{S.skills_text}</p></section>
      <section className="alt"><div className="wrap"><h2>What I can do</h2>
        <div className="grid">
          {items.map((ln, i) => { const [t, d] = split2(ln); if (!t) return null; return (
            <div className="card" key={i}><span className="ico">{ICONS[t.toLowerCase()] || '⭐'}</span><h3>{t}</h3>{d && <p>{d}</p>}</div>
          ); })}
        </div>
      </div></section>
    </>
  );
}
