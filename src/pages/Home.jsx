import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const iframeRef = useRef(null);
  const [canUnmute, setCanUnmute] = useState(true); // shows the button over hero

  useEffect(() => {
    // Load Vimeo API
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUnmute = async () => {
    try {
      // Ensure Vimeo API is available
      if (!window.Vimeo || !iframeRef.current) return;
      const player = new window.Vimeo.Player(iframeRef.current);
      await player.setMuted(false); // requires user gesture
      await player.play();
      setCanUnmute(false);
    } catch {
      // Ignore if blocked
    }
  };

  return (
    <>
      <section id="home" className="relative h-screen w-full overflow-hidden">
        {/* Vimeo iframe video; autoplay reliably with muted=1 */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/1102554785?h=25a4d4ba50&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&badge=0&autopause=0&background=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute top-1/2 left-1/2 min-w-[120vw] min-h-[120vh] -translate-x-1/2 -translate-y-1/2"
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
            transition={{ duration: 1.4 }}
          >
            Frame <span className="text-yellow-500">15</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Cinematic storytelling through digital experiences.
          </motion.p>

          <motion.a
            href="#projects"
            className="inline-block border border-yellow-500 px-8 py-3 text-yellow-500 font-semibold rounded hover:bg-yellow-500 hover:text-black transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Explore Projects
          </motion.a>
        </div>

        {/* Unmute CTA (appears over hero; disappears after click) */}
        {canUnmute && (
          <button
            onClick={handleUnmute}
            className="absolute bottom-6 right-6 z-30 px-4 py-2 rounded-full bg-white/90 text-black font-semibold hover:bg-white"
          >
            Unmute
          </button>
        )}
      </section>

      {/* "Mission" moved under hero — renamed & lengthened */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-yellow-500 mb-6">
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