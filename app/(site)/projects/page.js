import { getProjects } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Projects' };

export default async function Projects() {
  const projects = await getProjects();
  return (
    <>
      <section className="page-head"><span className="tag">Projects</span><h1>My <span className="grad">projects</span></h1></section>
      <section>
        {projects.length === 0 && <p className="muted">Projects will appear here once they are added by the administrator.</p>}
        <div className="grid">
          {projects.map((p) => (
            <div className="card" key={p.id}>
              <span className="ico">🚀</span><h3>{p.title}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{p.description}</p>
              {p.link && <a className="btn alt sm" href={p.link} target="_blank" rel="noopener noreferrer">View project</a>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
