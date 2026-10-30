'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    document.documentElement.classList.add('js');
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('section h2, .card, .exp, .motto, .chips span, .hero-text, .hero-photo, .page-head').forEach((el) => {
      el.classList.add('reveal'); io.observe(el);
    });
    return () => io.disconnect();
  }, [path]);
  return null;
}
