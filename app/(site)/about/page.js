import { getSettings } from '@/lib/data';
import { lines, paras, split2 } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About Me' };
const ICONS = ['💻', '🔒', '🌐', '🗄️', '🛠️', '⭐'];

export default async function About() {
  const S = await getSettings();
  return (
    <>
      <section className="page-head"><span className="tag">About Me</span><h1>About <span className="grad">me</span></h1></section>
      <section><h2>My background</h2>{paras(S.about).map((p, i) => <p key={i}>{p}</p>)}</section>
      <section className="alt"><div className="wrap"><h2>My ICT interests</h2>
        <div className="grid">
          {lines(S.interests).map((ln, i) => { const [t, d] = split2(ln); return (
            <div className="card" key={i}><span className="ico">{ICONS[Math.min(i, 5)]}</span><h3>{t}</h3><p>{d}</p></div>
          ); })}
        </div>
      </div></section>
      <section><h2>My professional objectives</h2>
        {paras(S.goals).map((g, i) => <p key={i}>{g}</p>)}
        <blockquote className="motto"><span className="tag">My personal motto</span><br />&ldquo;{S.motto}&rdquo;</blockquote>
      </section>
    </>
  );
}
