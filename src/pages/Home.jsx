import React from 'react';
import Hero from "../components/Hero.jsx";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Optional: Studio Ethos below hero (keep or remove as you prefer) */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-yellow-500 mb-6 font-display">
          Studio Ethos
        </h2>
        <p className="text-lg md:text-xl max-w-5xl mx-auto text-gray-300 leading-relaxed">
          We create work that endures. At Frame 15, precision and emotion share the same frame—
          disciplined craft paired with risk-forward storytelling. We design for feeling first,
          then refine until every cut lands with intention. From commercial campaigns to narrative
          film and aerial work, our process is collaborative, lean, and relentlessly focused on
          clarity. The result is simple: images that move, stories that linger.
        </p>
      </section>
    </>
  );
}
