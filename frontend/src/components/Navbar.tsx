'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Scissors } from 'lucide-react';
import clsx from 'clsx';

const links = [
  { href: '/', label: 'Головна' },
  { href: '/services', label: 'Послуги' },
  { href: '/masters', label: 'Майстри' },
  { href: '/portfolio', label: 'Портфоліо' },
  { href: '/booking', label: 'Запис' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-rose-600 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-gray-900">Beauty Studio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200',
                  pathname === href ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <Link href="/booking" className="btn-primary text-sm py-2.5">
              Записатися онлайн
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'block py-2.5 text-base font-medium transition-colors',
                  pathname === href ? 'text-rose-600' : 'text-gray-700'
                )}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link href="/booking" className="btn-primary block text-center text-sm mt-3" onClick={() => setIsOpen(false)}>
              Записатися онлайн
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
