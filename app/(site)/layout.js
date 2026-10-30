import Nav from '@/components/Nav';
import ScrollReveal from '@/components/ScrollReveal';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const S = await getSettings();
  return { title: { default: `${S.name} - E-Portfolio`, template: `%s - ${S.name}` }, description: S.tagline };
}

export default async function SiteLayout({ children }) {
  const S = await getSettings();
  return (
    <>
      <header className="nav"><Nav name={S.name} /></header>
      <main>{children}</main>
      <footer>&copy; {new Date().getFullYear()} {S.name}</footer>
      <ScrollReveal />
    </>
  );
}
