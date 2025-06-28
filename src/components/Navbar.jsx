import React from 'react';
import AnimatedLogo from './AnimatedLogo';

export default function Navbar() {
  const links = [
    ['Home', '#home'],
    ['Projects', '#projects'],
    ['About', '#about'],
    ['Contact', '#contact'],
  ];

  return (
    <header className="fixed top-0 w-full bg-transparent z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <a href="#home">
          <AnimatedLogo text="frame" number="15" />
        </a>
        <nav className="space-x-6">
          {links.map(([label, href]) => (
            <a key={label} href={href}
               className="text-white hover:text-gold transition-colors">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}