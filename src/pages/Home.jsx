import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Home() {
  const numberControls = useAnimation();
  const [flickerActive, setFlickerActive] = useState(true);

  useEffect(() => {
    async function sequence() {
      await numberControls.start({
        filter: 'blur(0px)',
        opacity: 1,
        transition: { duration: 1.5 },
      });
      setFlickerActive(false);
    }
    sequence();
  }, [numberControls]);

  return (
    <section id="home" className="relative h-screen">
      {/* Fullscreen looping video */}
      <video
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover filter grayscale brightness-75"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Centered logo + tagline, nudged up slightly */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 space-y-6 transform -translate-y-12">
        <div className="flex items-baseline space-x-2">
          {['F','R','A','M','E'].map((letter, i) => (
            <span
              key={i}
              className={`text-6xl font-extrabold text-white ${
                flickerActive ? 'animate-flicker' : ''
              }`}
            >
              {letter}
            </span>
          ))}
          <motion.span
            className="text-2xl font-bold text-gold"
            style={{ filter: 'blur(8px)', opacity: 0.5 }}
            animate={numberControls}
          >
            15
          </motion.span>
        </div>

        <motion.p
          className="text-xl text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          Crafting cinematic experiences.
        </motion.p>
      </div>
    </section>
  );
}