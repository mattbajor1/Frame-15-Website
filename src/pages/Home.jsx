import React from 'react';
import Hero from "../components/Hero.jsx";
import Heading from "../components/Heading.jsx";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="relative bg-black text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center">
          <Heading
            title="The Frame of Mind"
            bgWord="MINDSET"
            className="text-4xl md:text-5xl text-yellow-500 mb-8"
          />

          {/* Text */}
          <p className="text-base md:text-lg text-white/80 leading-relaxed relative z-10 max-w-4xl mx-auto">
            At Frame 15 we believe every frame should carry weight. We build stories that live beyond the screen, combining precision with a restless curiosity for what has not been done before. Our process is collaborative and intentional, inviting clients into the creative space so that every decision feels true to the vision. We are directors, cinematographers, editors, and designers united by a single aim: to make work that resonates in the moment and stays in the mind long after. Every project is an opportunity to explore, to challenge, and to create something that could not exist anywhere else.
          </p>
        </div>
      </section>
    </>
  );
}
