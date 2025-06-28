import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-black/80 text-white fixed w-full z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">MyBrand</Link>
        <div className="space-x-6">
          {['Home','Projects','About','Contact'].map((name, idx) => {
            const path = idx === 0 ? '/' : `/${name.toLowerCase()}`;
            return (
              <Link key={name} to={path} className="hover:text-gray-400">
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}