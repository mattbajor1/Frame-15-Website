import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      <iframe
        title="vimeo-player"
        src="https://player.vimeo.com/video/375468729?h=d063a6fe74&autoplay=1&loop=1&muted=1&background=1"
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 space-y-6 text-center">
        <motion.h1
          className="text-7xl font-bold uppercase text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          Frame <span className="text-gold">15</span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Cinematic storytelling through digital experiences.
        </motion.p>

        <motion.a
          href="#projects"
          className="mt-4 inline-block border border-gold px-8 py-3 text-gold font-semibold rounded hover:bg-gold hover:text-black transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Explore Projects
        </motion.a>
      </div>
    </section>
  );
}
