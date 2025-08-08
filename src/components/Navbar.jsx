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
    <nav
      className={`fixed inset-x-0 top-0 z-50 ${
        scrolled ? 'bg-black/80 backdrop-blur border-b border-white/10' : 'bg-black'
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo PNG */}
        <a href="#home" className="flex items-center space-x-3" title="Go to home">
          <img
            src="/images/Logo.png" 
            alt="Frame 15 Logo"
            className="h-10 w-auto"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {items.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="relative pb-1 font-display uppercase tracking-wide text-white text-sm 
                         after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-yellow-500 
                         after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300
                         hover:text-yellow-500 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-black border-t border-white/10`}
      >
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
          {items.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="relative pb-1 font-display uppercase tracking-wide text-white text-lg 
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
