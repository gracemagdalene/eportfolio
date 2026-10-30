import { getAchievements } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Achievements' };

export default async function Achievements() {
  const items = await getAchievements();
  return (
    <>
      <section className="page-head"><span className="tag">Achievements</span><h1>My <span className="grad">achievements</span></h1></section>
      <section>
        {items.length === 0 && <p className="muted">Certificates, examination results and accomplishments will appear here once they are added by the administrator.</p>}
        <div className="tl">
          {items.map((x) => {
            const ev = x.evidence_url; const isPdf = ev && /\.pdf(\?|$)/i.test(ev);
            return (
              <div className="exp" key={x.id}>
                <small>{x.period}</small><h3>{x.title}</h3>
                {x.organization && <p className="org">{x.organization}</p>}
                {x.description && <p style={{ whiteSpace: 'pre-line' }}>{x.description}</p>}
                {ev && isPdf && <a className="btn alt sm" href={ev} target="_blank" rel="noopener noreferrer">View certificate (PDF)</a>}
                {ev && !isPdf && <a href={ev} target="_blank" rel="noopener noreferrer"><img className="evidence" src={ev} alt={`Evidence: ${x.title}`} /></a>}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
