import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const ACTIVE_VOLUME = 0.8;
const MUTED_VOLUME = 0;

export default function Hero() {
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const mountedRef = useRef(false);

  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.2, 0]);
  const cueOpacity     = useTransform(scrollYProgress, [0, 0.25, 0.5], [1, 0.6, 0]);

  const loadVimeo = () =>
    new Promise((resolve) => {
      if (window.Vimeo?.Player) return resolve();
      const s = document.createElement('script');
      s.src = 'https://player.vimeo.com/api/player.js';
      s.async = true;
      s.onload = resolve;
      document.body.appendChild(s);
    });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mountedRef.current) return;
      mountedRef.current = true;

      await loadVimeo();
      if (!iframeRef.current || !window.Vimeo) return;

      const p = new window.Vimeo.Player(iframeRef.current);
      playerRef.current = p;

      try {
        await p.ready();
        if (!cancelled) {
          await p.setVolume(MUTED_VOLUME);
          await p.setMuted(true);
          setMuted(true);
          setVideoReady(true);
        }
      } catch { /* empty */ }
    })();

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.().catch(() => {});
      playerRef.current = null;
      mountedRef.current = false;
    };
  }, []);

  const toggleMute = async () => {
    const p = playerRef.current;
    if (!p) return;

    try {
      const isMuted = await p.getMuted();

      // Update UI immediately
      setMuted(!isMuted);

      if (isMuted) {
        await p.setMuted(false);
        await p.setVolume(ACTIVE_VOLUME);
        await p.play();
      } else {
        await p.setVolume(MUTED_VOLUME);
        await p.setMuted(true);
      }

      // Final sync (in case browser blocks anything)
      const finalMuted = await p.getMuted();
      if (finalMuted !== (!isMuted)) setMuted(finalMuted);
    } catch (e) {
      console.error('Mute toggle failed:', e);
    }
  };

  return (
    <section ref={sectionRef} id="home" className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video */}
      <div className="absolute inset-0 w-full h-full z-0">
        {!videoReady && (
          <img
            src="/images/hero-poster.jpg"
            alt="Frame 15 cinematic background"
            className="absolute top-1/2 left-1/2 min-w-[120vw] min-h-[120vh] -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        )}
        <iframe
          ref={iframeRef}
          src="https://player.vimeo.com/video/1102554785?h=25a4d4ba50&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&badge=0&autopause=0&dnt=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className={`absolute top-1/2 left-1/2 min-w-[120vw] min-h-[120vh] -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          title="Frame 15 Reel"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Overlay gradient */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-10"
      />

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white/80"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <span className="mt-1 inline-block h-6 w-px bg-white/70 animate-pulse" />
      </motion.div>

      {/* Volume toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        aria-pressed={!muted}
        className={`absolute bottom-6 right-6 z-30 p-3 rounded-full shadow transition
          ${muted ? 'bg-white/90 text-black hover:bg-white' : 'bg-yellow-400 text-black hover:bg-yellow-300'}
        `}
        title={muted ? 'Sound off' : 'Sound on'}
      >
        {muted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
      </button>
    </section>
  );
}
