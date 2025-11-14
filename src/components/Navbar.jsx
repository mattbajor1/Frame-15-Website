// src/components/Navbar.jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Gentle scroll behavior
  const { scrollY } = useScroll();
  const brandOpacity = useTransform(scrollY, [0, 200, 600], [1, 1, 0]);
  const brandY       = useTransform(scrollY, [0, 600], [0, -10]);
  const logoOpacity  = useTransform(scrollY, [0, 200, 600], [0, 0.4, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Links
  const links = [
    { label: 'Home',         href: '#home' },
    { label: 'Our Services', href: '#projects' },
    { label: 'About',        href: '#about' },
    { label: 'Contact',      href: '#contact' },
  ];
  const allDesktopLinks = [...links, { label: 'Portfolio', href: '#portfolio', portfolio: true }];

  // Mobile/tablet links (keep their own underline)
  const linkBase =
    '!m-0 !border-0 !rounded-none !bg-transparent hover:!bg-transparent ' +
    'relative z-[2] inline-flex items-center h-10 px-3 ' +
    'font-display uppercase tracking-wide text-white whitespace-nowrap leading-none ' +
    'text-base lg:text-lg ' +
    'after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:w-full after:bg-yellow-500 ' +
    'after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300 ' +
    'hover:text-yellow-500 transition-colors';

  // Desktop links — NO per-link underline (we use the shared moving line)
  const linkDesktop =
    '!m-0 !border-0 !rounded-none !bg-transparent hover:!bg-transparent ' +
    'relative z-[2] inline-flex items-center ' +
    'font-display uppercase tracking-wide whitespace-nowrap leading-none ' +
    'text-white hover:text-yellow-500 transition-colors ' +
    // hard-kill any global underline on desktop
    'after:content-[""] after:absolute after:left-0 after:-bottom-0.5 after:h-[3px] after:w-full ' +
    'after:scale-x-0 hover:after:scale-x-0 after:bg-transparent after:transition-none';

  // --- Desktop moving underline marker ---
  const desktopWrapRef = useRef(null);
  const linkRefs = useRef([]);
  const [marker, setMarker] = useState({ left: 0, width: 0, visible: false });

  // Active tab from hash (fallback to #home)
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const setByHash = () => {
      const h = window.location.hash || '#home';
      const i = allDesktopLinks.findIndex(l => l.href === h);
      setActiveIndex(i >= 0 ? i : 0);
    };
    setByHash();
    window.addEventListener('hashchange', setByHash);
    return () => window.removeEventListener('hashchange', setByHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const updateMarker = (idx) => {
    const el = (idx != null) ? linkRefs.current[idx] : null;
    if (!el) {
      setMarker(m => ({ ...m, visible: false, width: 0 }));
      return;
    }
    setMarker({ left: el.offsetLeft, width: el.offsetWidth, visible: el.offsetWidth > 0 });
  };

  useLayoutEffect(() => {
    updateMarker(hoveredIndex != null ? hoveredIndex : activeIndex);
    const onResize = () => updateMarker(hoveredIndex != null ? hoveredIndex : activeIndex);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredIndex, activeIndex]);

  // Hamburger spring (unchanged)
  const spring = { type: 'spring', stiffness: 900, damping: 22, mass: 0.7 };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 ${scrolled ? 'bg-black/80 backdrop-blur border-b border-white/10' : 'bg-black'}`}
      aria-label="Main navigation"
    >
      <div className="px-6 lg:px-10 py-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          {/* LEFT: logo */}
          <a href="#home" className="justify-self-start flex items-center" title="Go to home">
            <motion.img
              src="/images/Logo.png"
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

          {/* RIGHT: desktop tabs — fluid compaction (lg→2xl), collapse <lg */}
          <div
            className="hidden lg:flex justify-self-end items-center relative pb-2 gap-[var(--gap)]"
            ref={desktopWrapRef}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              // t=0 at 1024px (lg), t=1 at 1536px (2xl)
              '--t':  'clamp(0, (100vw - 1024px) / 512, 1)',
              '--gap':'calc(16px + (36px - 16px) * var(--t))',             // 16 → 36
              '--h':  'calc(32px + (40px - 32px) * var(--t))',             // 32 → 40
              '--px': 'calc(8px  + (12px - 8px)  * var(--t))',             // 8  → 12
              '--fs': 'calc(0.875rem + (1.125rem - 0.875rem) * var(--t))', // 14 → 18
            }}
          >
            {/* Single moving underline (calm, no bounce) */}
            <motion.div
              className="pointer-events-none absolute bg-yellow-500"
              style={{ height: 2, bottom: 2, zIndex: 1 }}
              animate={{
                left: marker.left,
                width: marker.width,
                opacity: marker.visible ? 1 : 0,
              }}
              transition={{
                left:  { type: 'spring', stiffness: 220, damping: 48, mass: 1.2 },
                width: { type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                opacity:{ duration: 0.12 }
              }}
            />

            {allDesktopLinks.map(({ label, href, portfolio }, i) => (
              <a
                key={label}
                href={href}
                className={`${linkDesktop} ${portfolio ? '!rounded-full !border !border-white/30' : ''}`}
                style={{ height: 'var(--h)', paddingLeft: 'var(--px)', paddingRight: 'var(--px)', fontSize: 'var(--fs)' }}
                ref={(el) => (linkRefs.current[i] = el)}
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={(e) => {
                  if (href === '#home') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // absolute top
                  } else if (href === '#portfolio') {
                    e.preventDefault();
                    if (window.location.hash !== '#portfolio') window.location.hash = 'portfolio';
                  }
                  setActiveIndex(i);
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Hamburger — visible below lg */}
          <button
            className="lg:hidden text-white justify-self-end w-10 h-10 relative"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-6 h-5" aria-hidden>
                <motion.span
                  className="absolute left-0 top-1/2 -translate-y-1/2 block h-[2px] w-6 bg-white rounded-full origin-center"
                  animate={open ? { y: 0, rotate: 45 } : { y: -6, rotate: 0 }}
                  transition={spring}
                />
                <motion.span
                  className="absolute left-0 top-1/2 -translate-y-1/2 block h-[2px] w-6 bg-white rounded-full origin-center"
                  animate={open ? { opacity: 0, scaleX: 0.2 } : { opacity: 1, scaleX: 1 }}
                  transition={spring}
                />
                <motion.span
                  className="absolute left-0 top-1/2 -translate-y-1/2 block h-[2px] w-6 bg-white rounded-full origin-center"
                  animate={open ? { y: 0, rotate: -45 } : { y: 6, rotate: 0 }}
                  transition={spring}
                />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer (< lg) */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-black border-t border-white/10`}
      >
        <div className="px-6 lg:px-10 py-4 flex flex-col gap-3">
          {links.map(({ label, href }, i) => (
            <motion.a
              key={label}
              href={href}
              onClick={(e) => {
                if (href === '#home') {
                  e.preventDefault();
                  setOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                setOpen(false);
              }}
              className={`${linkBase} text-xl`}
              initial={false}
              animate={open ? { y: 0, opacity: 1, scale: 1 } : { y: -8, opacity: 0.2, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 600, damping: 28, mass: 0.7, delay: open ? i * 0.03 : 0 }}
            >
              {label}
            </motion.a>
          ))}
          <motion.a
            href="#portfolio"
            onClick={(e) => { e.preventDefault(); setOpen(false); window.location.hash = 'portfolio'; }}
            className="inline-flex items-center h-10 px-4 rounded-full border border-white/30 text-white text-xl hover:bg-white hover:text-black transition"
            initial={false}
            animate={open ? { y: 0, opacity: 1, scale: 1 } : { y: -8, opacity: 0.2, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 600, damping: 28, mass: 0.7, delay: links.length * 0.03 }}
          >
            Portfolio
          </motion.a>
        </div>
      </div>
    </nav>
  );
}
