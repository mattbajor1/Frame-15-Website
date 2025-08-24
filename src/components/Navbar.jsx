import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // slow fade behavior
  const { scrollY } = useScroll();
  const brandOpacity = useTransform(scrollY, [0, 200, 600], [1, 1, 0]);
  const brandY       = useTransform(scrollY, [0, 600], [0, -10]);
  const logoOpacity  = useTransform(scrollY, [0, 200, 600], [0, 0.4, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Our Services', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  // reset any global <a> styles + make even, larger hit areas
  const linkBase =
    '!m-0 !border-0 !rounded-none !bg-transparent hover:!bg-transparent ' +
    'inline-flex items-center h-10 px-3 ' +
    'font-display uppercase tracking-wide text-white whitespace-nowrap leading-none ' +
    'text-base lg:text-lg ' +
    'relative after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:w-full after:bg-yellow-500 ' +
    'after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300 ' +
    'hover:text-yellow-500 transition-colors';

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 ${
        scrolled ? 'bg-black/80 backdrop-blur border-b border-white/10' : 'bg-black'
      }`}
      aria-label="Main navigation"
    >
      {/* FULL BLEED: no max-w container here */}
      <div className="px-6 lg:px-10 py-6">
        {/* true 3-col grid: left 1fr | brand auto | right 1fr (brand stays centered) */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          {/* LEFT: logo */}
          <a href="#home" className="justify-self-start flex items-center" title="Go to home">
            <motion.img
              src="/images/logo.png"
              alt="Frame 15"
              className="h-12 md:h-14 w-auto"
              style={{ opacity: logoOpacity }}
            />
          </a>

          {/* CENTER: brand */}
          <a href="#home" className="justify-self-center text-center" title="Go to home" aria-label="Frame 15">
            <motion.span
              style={{ opacity: brandOpacity, y: brandY }}
              className="font-display text-4xl md:text-6xl font-extrabold uppercase tracking-wide text-white select-none leading-none"
            >
              FRAME <span className="text-yellow-500">15</span>
            </motion.span>
          </a>

          {/* RIGHT: links + portfolio (now use the gutter space) */}
          <div className="hidden md:flex justify-self-end items-center gap-7 lg:gap-9">
            {links.map(({ label, href }) => (
              <a key={label} href={href} className={linkBase}>
                {label}
              </a>
            ))}
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.hash !== '#portfolio') window.location.hash = 'portfolio';
              }}
              className={`${linkBase} !px-4 !border !border-white/30 !rounded-full`}
            >
              Portfolio
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white justify-self-end"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle mobile menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer (still full-bleed padding) */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-black border-t border-white/10`}
      >
        <div className="px-6 lg:px-10 py-4 flex flex-col gap-3">
          {links.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setOpen(false)} className={`${linkBase} text-xl`}>
              {label}
            </a>
          ))}
          <a
            href="#portfolio"
            onClick={(e) => { e.preventDefault(); setOpen(false); window.location.hash = 'portfolio'; }}
            className="inline-flex items-center h-10 px-4 rounded-full border border-white/30 text-white text-xl hover:bg-white hover:text-black transition"
          >
            Portfolio
          </a>
        </div>
      </div>
    </nav>
  );
}
