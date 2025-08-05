import React, { useEffect } from 'react';
import { motion } from 'framer-motion';


export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <section id="home" className="relative h-screen w-full overflow-hidden">
        {/* Vimeo iframe video - using scale to mimic object-cover */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <iframe
            src="https://player.vimeo.com/video/1102554785?h=25a4d4ba50&autoplay=1&muted=0&loop=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479&background=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute top-1/2 left-1/2 min-w-[120vw] min-h-[120vh] -translate-x-1/2 -translate-y-1/2 scale-110"
            title="Frame 15 Reel"
            allowFullScreen
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-10" />

        {/* Hero content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center space-y-6">
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold uppercase text-white tracking-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
          >
            Frame <span className="text-gold">15</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            Cinematic storytelling through digital experiences.
          </motion.p>

          <motion.a
            href="#projects"
            className="inline-block border border-gold px-8 py-3 text-gold font-semibold rounded hover:bg-gold hover:text-black transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            Explore Projects
          </motion.a>
        </div>
      </section>


    </>
  );
}
