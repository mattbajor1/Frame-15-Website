import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-black/80 text-white fixed w-full z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <a href="/" className="text-2xl font-bold">FOF</a>
        <div className="space-x-6">
          {['Home','Projects','About','Contact'].map((name, idx) => {
            const path = idx === 0 ? '/' : `/${name.toLowerCase()}`;
            return (
              <a key={name} href={path} className="hover:text-gray-400">
                {name}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
