import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'CV / Resume' };

export default async function CV() {
  const S = await getSettings();
  return (
    <>
      <section className="page-head"><span className="tag">CV / Resume</span><h1>My <span className="grad">CV</span></h1></section>
      <section>
        {S.cv_url ? (
          <>
            <p>View my CV online or download a copy.</p>
            <a className="btn" href={S.cv_url} target="_blank" rel="noopener noreferrer">View CV</a>
            <a className="btn alt" href="/cv/download">Download CV</a>
            <iframe className="cv-frame" src={S.cv_url} title="CV preview" />
          </>
        ) : <p className="muted">My CV will be available here soon.</p>}
      </section>
    </>
  );
}
