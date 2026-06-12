'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarClient() {
  const pathname = usePathname();

  // Mobile nav toggle & scroll effect — runs after mount
  useEffect(() => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');

    function toggleMenu() {
      hamburger?.classList.toggle('open');
      mobileMenu?.classList.toggle('open');
      hamburger?.setAttribute('aria-expanded', String(hamburger?.classList.contains('open')));
    }

    hamburger?.addEventListener('click', toggleMenu);
    mobileMenu?.querySelectorAll('.mobile-nav-link').forEach(l =>
      l.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        mobileMenu?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
      })
    );

    function onScroll() {
      navbar?.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      hamburger?.removeEventListener('click', toggleMenu);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Hide shared navbar on dashboard (dashboard has its own nav)
  if (pathname.startsWith('/dashboard')) return null;

  // Map pathname to activePage prop for highlighting
  const active = '/' + (pathname.split('/')[1] || '');

  return <Navbar activePage={active === '/' ? undefined : active} />;
}
