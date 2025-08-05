import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Our Work', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition
      ${scrolled ? 'bg-black/70 backdrop-blur border-b border-white/10' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="#home" className="font-extrabold tracking-wide text-xl text-white">
          FRAME <span className="text-yellow-500">15</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="text-sm uppercase tracking-wide text-white/90 hover:text-yellow-500 transition"
            >
              {n.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
            {navItems.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="py-2 text-white/90 hover:text-yellow-500 transition"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}