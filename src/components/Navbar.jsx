// src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // MUCH slower fade window
  // Brand fully visible until ~200px, fades out by ~600px
  // Logo fades in over the same extended distance
  const { scrollY } = useScroll();
  const brandOpacity = useTransform(scrollY, [0, 200, 600], [1, 1, 0]);
  const brandY       = useTransform(scrollY, [0, 600], [0, -10]);
  const logoOpacity  = useTransform(scrollY, [0, 200, 600], [0, 0.4, 1]);

  const items = [
    { label: 'Home', href: '#home' },
    { label: 'Our Services', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 ${
        scrolled ? 'bg-black/80 backdrop-blur border-b border-white/10' : 'bg-black'
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between relative">
        {/* LEFT: Logo fades in slowly */}
        <a href="#home" className="flex items-center gap-3" title="Go to home">
          <motion.img
            src="/images/Logo.png"
            alt="Frame 15"
            className="h-12 md:h-14 w-auto"
            style={{ opacity: logoOpacity }}
          />
        </a>

        {/* CENTER: Massive brand text fades out slowly */}
        <a
          href="#home"
          className="absolute left-1/2 -translate-x-1/2"
          title="Go to home"
          aria-label="Frame 15"
        >
          <motion.span
            style={{ opacity: brandOpacity, y: brandY }}
            className="font-display text-4xl md:text-6xl font-extrabold uppercase tracking-wide text-white select-none"
          >
            Frame <span className="text-yellow-500">15</span>
          </motion.span>
        </a>

        {/* RIGHT: Desktop nav links */}
        <div className="hidden md:flex items-center gap-12 ml-auto">
          {items.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="relative pb-1 font-display uppercase tracking-wide text-white text-lg md:text-xl
                         after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-yellow-500
                         after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300
                         hover:text-yellow-500 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white ml-auto"
          onClick={() => setOpen(!open)}
          aria-label="Toggle mobile menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-black border-t border-white/10`}
      >
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4">
          {items.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="relative pb-1 font-display uppercase tracking-wide text-white text-xl
                         after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-yellow-500
                         after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300
                         hover:text-yellow-500 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
