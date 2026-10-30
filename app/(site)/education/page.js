import { getSettings, getQualifications } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Education' };

export default async function Education() {
  const [S, quals] = await Promise.all([getSettings(), getQualifications()]);
  return (
    <>
      <section className="page-head"><span className="tag">Education</span><h1>My <span className="grad">education</span></h1></section>
      <section><h2>My ICT course</h2><p>{S.education}</p></section>
      <section className="alt"><div className="wrap"><h2>Qualifications</h2>
        {quals.length === 0 && <p className="muted">Educational qualifications will appear here once they are added by the administrator.</p>}
        <div className="tl">
          {quals.map((q) => (
            <div className="exp" key={q.id}>
              <small>{q.period}</small><h3>{q.title}</h3>
              {q.institution && <p className="org">{q.institution}</p>}
              {q.details && <p style={{ whiteSpace: 'pre-line' }}>{q.details}</p>}
            </div>
          ))}
        </div>
      </div></section>
    </>
  );
}
