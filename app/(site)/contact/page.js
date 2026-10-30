import { getSettings } from '@/lib/data';
import { sendMessage } from '@/app/actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Contact Me' };

export default async function Contact({ searchParams }) {
  const [S, sp] = await Promise.all([getSettings(), searchParams]);
  const sent = sp?.sent;
  return (
    <>
      <section className="page-head"><span className="tag">Contact Me</span><h1>Get in <span className="grad">touch</span></h1></section>
      <section>
        {sent === '1' && <p className="notice ok">Thank you! Your message was sent.</p>}
        {sent === '0' && <p className="notice bad">Sorry, something went wrong. Please check your details and try again.</p>}
        <form action={sendMessage}>
          <input name="name" placeholder="Your name" required maxLength={100} />
          <input name="email" type="email" placeholder="Your email" required maxLength={150} />
          <input name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
          <textarea name="message" rows={5} placeholder="Message" required maxLength={3000} />
          <button className="btn" type="submit">Send message</button>
        </form>
        <p style={{ marginTop: 22 }}>
          {S.linkedin && <a className="btn alt" href={S.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {S.github && <a className="btn alt" href={S.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
          {S.email && <a className="btn alt" href={`mailto:${S.email}`}>{S.email}</a>}
        </p>
      </section>
    </>
  );
}
