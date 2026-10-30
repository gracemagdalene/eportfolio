'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [['/', 'Home'], ['/about', 'About Me'], ['/education', 'Education'], ['/skills', 'Skills'], ['/projects', 'Projects'], ['/achievements', 'Achievements'], ['/cv', 'CV'], ['/contact', 'Contact Me']];

export default function Nav({ name }) {
  const path = usePathname();
  return (
    <nav>
      <Link className="brand" href="/">{name}</Link>
      <div>{ITEMS.map(([href, label]) => <Link key={href} href={href} className={path === href ? 'active' : ''}>{label}</Link>)}</div>
    </nav>
  );
}
