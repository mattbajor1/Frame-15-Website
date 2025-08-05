import React from 'react';
import Hero from "../components/Hero.jsx";

export default function Home() {
  return (
    <>
      <Hero />

      {/* The Frame of Mind Section */}
      <section className="relative bg-black text-white py-24 px-6 overflow-hidden">
        {/* Background grain */}
        <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Layered title */}
          <h2 className="section-title mb-8">
            <span className="bg-word">MINDSET</span>
            <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-yellow-500 uppercase">
              The Frame of Mind
            </span>
          </h2>

          {/* Text */}
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            At Frame 15 we believe every frame should carry weight. We build stories that live beyond the screen, combining precision with a restless curiosity for what has not been done before. Our process is collaborative and intentional, inviting clients into the creative space so that every decision feels true to the vision. We are directors, cinematographers, editors, and designers united by a single aim: to make work that resonates in the moment and stays in the mind long after. Every project is an opportunity to explore, to challenge, and to create something that could not exist anywhere else.
          </p>
        </div>
      </section>
    </>
  );
}
