import Link from 'next/link';
import { getSettings } from '@/lib/data';
import { initials } from '@/lib/content';

export const dynamic = 'force-dynamic';

const CARDS = [
  ['/about', '👩‍💻', 'About me', 'My background, interests and professional objectives.'],
  ['/education', '🎓', 'Education', 'My ICT course and qualifications.'],
  ['/skills', '🧰', 'Skills', 'HTML, CSS, PHP, MySQL, networking and cybersecurity.'],
  ['/projects', '🚀', 'Projects', 'My ePortfolio, FreshBite website and other ICT projects.'],
  ['/achievements', '🏆', 'Achievements', 'Certificates, examination results and accomplishments.'],
  ['/cv', '📄', 'CV / Resume', 'View or download my CV.'],
  ['/contact', '✉️', 'Contact me', 'My email and professional links.'],
];

export default async function Home() {
  const S = await getSettings();
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <span className="tag">{S.profession}</span>
          <h1>Hi, I&apos;m <span className="grad">{S.name}</span></h1>
          <p className="lead">{S.tagline}</p>
          <Link className="btn" href="/projects">View my projects</Link>
          <Link className="btn alt" href="/contact">Contact me</Link>
        </div>
        <div className="hero-photo">
          {S.photo_url ? <img src={S.photo_url} alt={S.name} /> : <div className="initials">{initials(S.name)}</div>}
        </div>
      </section>

      <section className="alt"><div className="wrap">
        <h2>Vision &amp; Mission</h2>
        <div className="grid two">
          <div className="card vm"><span className="ico">🔭</span><h3>My Vision</h3><p>{S.vision}</p></div>
          <div className="card vm"><span className="ico">🎯</span><h3>My Mission</h3><p>{S.mission}</p></div>
        </div>
      </div></section>

      <section>
        <h2>Explore my portfolio</h2>
        <div className="grid">
          {CARDS.map(([href, ico, title, text]) => (
            <Link key={href} className="card link" href={href}><span className="ico">{ico}</span><h3>{title}</h3><p>{text}</p></Link>
          ))}
        </div>
      </section>
    </>
  );
}
