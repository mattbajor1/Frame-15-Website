import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const items = [
    { label: 'Home', href: '#home' },
    { label: 'Our Services', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50" aria-label="Main navigation">
      {/* solid base background to prevent flicker */}
      <div className="absolute inset-0 bg-black z-[-1]" />

      <div
        className={`w-full h-full transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur border-b border-white/10' : 'bg-black'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a
            href="#home"
            className="font-extrabold tracking-wide text-xl text-white font-display select-none"
            title="Go to home"
          >
            FRAME <span className="text-yellow-500">15</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {items.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="link-underline pb-1 text-sm uppercase tracking-wide text-white/90 hover:text-white"
                aria-current={window.location.hash === href ? 'page' : undefined}
              >
                {label}
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle mobile menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } bg-black/95 border-t border-white/10 backdrop-blur-sm`}
        >
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
            {items.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="py-2 text-white/90 hover:text-yellow-500 text-lg tracking-wide"
                aria-current={window.location.hash === href ? 'page' : undefined}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
