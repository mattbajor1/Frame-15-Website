import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function Hero() {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const mountedRef = useRef(false);
  const [muted, setMuted] = useState(true); // start muted for autoplay reliability

  // Load Vimeo API if needed
  const loadVimeo = () =>
    new Promise((resolve) => {
      if (window.Vimeo && window.Vimeo.Player) return resolve();
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });

  // Init player once (handles React StrictMode)
  const initPlayer = async () => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    await loadVimeo();
    if (!iframeRef.current || !window.Vimeo) return;

    const p = new window.Vimeo.Player(iframeRef.current);
    playerRef.current = p;

    try {
      await p.ready();
      await p.setMuted(true);
      const m = await p.getMuted();
      setMuted(Boolean(m));
    } catch {
      /* no-op */
    }
  };

  useEffect(() => {
    initPlayer();
    return () => {
      if (playerRef.current?.destroy) playerRef.current.destroy().catch(() => {});
      playerRef.current = null;
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = async () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      const isMuted = await p.getMuted();
      if (isMuted) {
        await p.setMuted(false);
        await p.play(); // user gesture → allow audio + resume
      } else {
        await p.setMuted(true);
      }
      const now = await p.getMuted();
      setMuted(Boolean(now));
    } catch (e) {
      console.error('Mute toggle failed:', e);
    }
  };

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Vimeo video (no background=1 so audio can be enabled) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute inset-0 animate-slow-zoom">
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/1102554785?h=25a4d4ba50&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&badge=0&autopause=0"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute top-1/2 left-1/2 min-w-[120vw] min-h-[120vh] -translate-x-1/2 -translate-y-1/2"
            title="Frame 15 Reel"
            allowFullScreen
          />
        </div>
      </div>

      {/* Letterbox bars */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="pointer-events-none absolute top-0 left-0 right-0 h-16 md:h-20 bg-black/95 z-20"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-black/95 z-20"
      />

      {/* Film grain + gradient overlays */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[.25] mix-blend-overlay grain-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 z-10" />

      {/* Hero content */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 text-center space-y-6">
        <motion.h1
          className="font-display text-6xl md:text-7xl font-extrabold uppercase text-white tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          Frame <span className="text-yellow-500">15</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: 'easeOut' }}
        >
          Cinematic storytelling through digital experiences.
        </motion.p>

        <motion.a
          href="#projects"
          className="btn-cinematic inline-block border border-yellow-500 px-8 py-3 text-yellow-500 font-semibold rounded hover:bg-yellow-500 hover:text-black transition"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: 'easeOut' }}
        >
          Explore Projects
        </motion.a>
      </div>

      {/* Volume toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-6 right-6 z-30 p-3 rounded-full bg-white/90 text-black hover:bg-white shadow"
      >
        {muted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
      </button>
    </section>
  );
}
