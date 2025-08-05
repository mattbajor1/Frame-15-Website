import React, { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const items = [
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
    <nav className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'bg-black/70 backdrop-blur border-b border-white/10' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a
          href="#home"
          id="navbar-logo"
          className="font-extrabold tracking-wide text-xl text-white font-display select-none"
          title="Double-click me :)"
        >
          FRAME <span className="text-yellow-500">15</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {items.map(i => (
            <a key={i.label} href={i.href} className="link-underline pb-1 text-sm uppercase tracking-wide text-white/90 hover:text-white">
              {i.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile curtain */}
      <div className={`md:hidden overflow-hidden bg-black/95 border-t border-white/10 transition-all duration-500 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
          {items.map(i => (
            <a key={i.label} href={i.href} className="py-2 text-white/90 hover:text-yellow-500" onClick={() => setOpen(false)}>
              {i.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
