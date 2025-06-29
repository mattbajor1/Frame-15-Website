import React from 'react';

export default function Navbar() {
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full bg-black bg-opacity-80 text-white z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <a href="#home" className="font-bold text-2xl">Frame <span className="text-gold">15</span></a>
        <div className="space-x-6">
          {navItems.map(item => (
            <a key={item.label} href={item.href} className="hover:text-gold transition">{item.label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}