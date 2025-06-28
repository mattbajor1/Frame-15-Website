import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black text-white text-center py-4 mt-auto">
      © {new Date().getFullYear()} F15. All rights reserved.
    </footer>
  );
}
