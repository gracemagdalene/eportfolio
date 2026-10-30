import { redirect } from 'next/navigation';
import Link from 'next/link';
import ConfirmButton from '@/components/ConfirmButton';
import { isAdmin } from '@/lib/auth';
import { getSettings, getProjects, getQualifications, getAchievements, getMessages } from '@/lib/data';
import { FIELDS } from '@/lib/content';
import * as A from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

const TABS = [['content', 'Page content'], ['photo', 'Profile photo'], ['education', 'Education'], ['projects', 'Projects'], ['achievements', 'Achievements'], ['cv', 'CV'], ['messages', 'Messages']];

function Delete({ action, id, label = 'Delete' }) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <ConfirmButton>{label}</ConfirmButton>
    </form>
  );
}

export default async function Admin({ searchParams }) {
  if (!(await isAdmin())) redirect('/admin/login');
  const sp = await searchParams;
  const tab = TABS.some(([k]) => k === sp?.tab) ? sp.tab : 'content';
  const S = await getSettings();

  return (
    <main>
      <div className="bar">
        <h1>Admin dashboard</h1>
        <span>
          <a href="/" target="_blank" rel="noopener noreferrer">View website</a> &middot;{' '}
          <form action={A.logout} className="inline"><button className="btn alt sm">Log out</button></form>
        </span>
      </div>
      <div className="tabs">{TABS.map(([k, label]) => <Link key={k} href={`/admin?tab=${k}`} className={k === tab ? 'on' : ''}>{label}</Link>)}</div>
      {sp?.ok && <p className="notice ok">{sp.ok}</p>}
      {sp?.err && <p className="notice bad">{sp.err}</p>}

      {tab === 'content' && (
        <>
          <p className="muted">Edit the text of the website pages here, then press Save. Changes show on the site straight away.</p>
          <form action={A.saveContent} className="panel stack">
            {FIELDS.map((f) => (
              <label key={f.key}>{f.label}
                {f.type === 'input'
                  ? <input name={f.key} defaultValue={S[f.key]} />
                  : <textarea name={f.key} rows={f.rows} defaultValue={S[f.key]} />}
              </label>
            ))}
            <button className="btn">Save changes</button>
          </form>
        </>
      )}

      {tab === 'photo' && (
        <form action={A.uploadPhoto} className="panel stack">
          {S.photo_url && <img className="avatar-sm" src={S.photo_url} alt="Profile photo" />}
          <label>Choose a photo (JPG, PNG or WEBP, up to 4 MB)<input type="file" name="photo" accept="image/*" required /></label>
          <button className="btn">Upload photo</button>
        </form>
      )}

      {tab === 'education' && (
        <>
          <p className="muted">Your ICT course description is edited under <b>Page content</b>. Add each qualification here (for example Diploma in ICT, KCSE).</p>
          <h2>Add a qualification</h2>
          <form action={A.addQualification} className="panel stack">
            <input name="title" placeholder="Qualification (e.g. Diploma in Information and Communication Technology)" required />
            <input name="institution" placeholder="Institution / school" />
            <input name="period" placeholder="Period (e.g. 2024 - Present)" />
            <textarea name="details" rows={3} placeholder="Details, units studied, grade" />
            <button className="btn">Add qualification</button>
          </form>
          {await (async () => { const rows = await getQualifications(); return (<>
            <h2>Your qualifications ({rows.length})</h2>
            {rows.map((q) => (
              <div className="panel row" key={q.id}>
                <div><b>{q.title}</b><br /><small>{q.institution} {q.period}</small></div>
                <Delete action={A.deleteQualification} id={q.id} />
              </div>
            ))}
            {rows.length === 0 && <p>None yet.</p>}
          </>); })()}
        </>
      )}

      {tab === 'projects' && (
        <>
          <h2>Add a project</h2>
          <form action={A.addProject} className="panel stack">
            <input name="title" placeholder="Project title" required />
            <textarea name="description" rows={3} placeholder="What it is and the tools you used" />
            <input name="link" placeholder="Link (optional, starts with https://)" />
            <button className="btn">Add project</button>
          </form>
          {await (async () => { const rows = await getProjects(); return (<>
            <h2>Your projects ({rows.length})</h2>
            {rows.map((p) => (
              <div className="panel row" key={p.id}>
                <div><b>{p.title}</b><br /><small>{(p.description || '').slice(0, 90)}</small></div>
                <Delete action={A.deleteProject} id={p.id} />
              </div>
            ))}
            {rows.length === 0 && <p>None yet.</p>}
          </>); })()}
        </>
      )}

      {tab === 'achievements' && (
        <>
          <h2>Add an achievement</h2>
          <form action={A.addAchievement} className="panel stack">
            <input name="title" placeholder="Title (e.g. Certificate in Networking, KCSE results, Award)" required />
            <input name="organization" placeholder="Awarded by / institution" />
            <input name="period" placeholder="Date or period (e.g. 2025)" />
            <textarea name="description" rows={3} placeholder="Details, grade or what you achieved" />
            <label>Evidence: certificate, result slip or photo (JPG, PNG, WEBP or PDF, up to 4 MB)<input type="file" name="evidence" accept="image/*,application/pdf" /></label>
            <button className="btn">Add achievement</button>
          </form>
          {await (async () => { const rows = await getAchievements(); return (<>
            <h2>Your achievements ({rows.length})</h2>
            {rows.map((x) => (
              <div className="panel row" key={x.id}>
                <div><b>{x.title}</b><br /><small>{x.organization} {x.period}{x.evidence_url ? ' · evidence attached' : ''}</small></div>
                <Delete action={A.deleteAchievement} id={x.id} />
              </div>
            ))}
            {rows.length === 0 && <p>None yet.</p>}
          </>); })()}
        </>
      )}

      {tab === 'cv' && (
        <>
          <form action={A.uploadCv} className="panel stack">
            {S.cv_url && <p>A CV is uploaded. <a href={S.cv_url} target="_blank" rel="noopener noreferrer">View it</a>. Uploading a new one replaces it.</p>}
            <label>Upload your CV (PDF only, up to 4 MB)<input type="file" name="cv" accept="application/pdf" required /></label>
            <button className="btn">Upload CV</button>
          </form>
          {S.cv_url && <form action={A.removeCv}><ConfirmButton message="Remove the CV?">Remove CV</ConfirmButton></form>}
        </>
      )}

      {tab === 'messages' && (
        <>
          {await (async () => { const rows = await getMessages(); return (<>
            <h2>Messages ({rows.length})</h2>
            {rows.map((m) => (
              <div className="panel" key={m.id}>
                <div className="row"><div><b>{m.name}</b> &lt;{m.email}&gt;</div><Delete action={A.deleteMessage} id={m.id} /></div>
                <p style={{ whiteSpace: 'pre-line' }}>{m.message}</p>
                <small>{new Date(m.created_at).toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })}</small>
              </div>
            ))}
            {rows.length === 0 && <p>No messages yet.</p>}
          </>); })()}
        </>
      )}
    </main>
  );
}
