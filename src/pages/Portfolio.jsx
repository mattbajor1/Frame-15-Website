// src/pages/Portfolio.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useCloudinaryAssets from '../hooks/useCloudinaryAssets';
import JustifiedGallery from '../components/JustifiedGallery';

function useHashFlag(flag = '#portfolio') {
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === flag);
  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === flag);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [flag]);
  return [open, setOpen];
}

function clearHash() {
  if (typeof window === 'undefined') return;
  const url = window.location.pathname + window.location.search;
  window.history.replaceState(null, '', url);
}

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
function cldFull({ public_id, type = 'image', maxW = 3000 }) {
  const rt = type === 'video' ? 'video' : 'image';
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1600;
  const w = Math.min(maxW, Math.ceil(vw * 1.5));
  if (!CLOUD || !public_id) return '';
  return `https://res.cloudinary.com/${CLOUD}/${rt}/upload/f_auto,q_auto,c_limit,w_${w}/${public_id}`;
}

export default function Portfolio() {
  const [open, setOpen] = useHashFlag('#portfolio');
  const [lightbox, setLightbox] = useState(null);

  const { items, loading, error, hasMore, loadMore } = useCloudinaryAssets({
    folder: 'Frame 15 Photos',
    types: 'image',
    includeSubfolders: true, // include nested folders
    pageSize: 48,
  });

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        if (lightbox !== null) setLightbox(null);
        else { clearHash(); setOpen(false); }
      }
      if (lightbox !== null && items.length) {
        if (e.key === 'ArrowRight') setLightbox((i) => Math.min((i ?? 0) + 1, items.length - 1));
        if (e.key === 'ArrowLeft')  setLightbox((i) => Math.max((i ?? 0) - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lightbox, items.length, setOpen]);

  const close = useCallback(() => {
    if (lightbox !== null) setLightbox(null);
    else { clearHash(); setOpen(false); }
  }, [lightbox, setOpen]);

  // Infinite scroll: observe the actual scroll container
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const el = sentinelRef.current;
    const root = scrollRef.current;
    if (!el || !root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { root, rootMargin: '1000px 0px 1000px 0px', threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [open, hasMore, loading, loadMore]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          aria-modal="true" role="dialog"
          onClick={close}
        >
          <motion.div
            ref={scrollRef}
            className="absolute inset-0 bg-white text-black overflow-y-auto"
            initial={{ scale: 0.995, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.995, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-neutral-200">
              <div className="px-4 md:px-6 lg:px-8 py-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">PORTFOLIO</h1>
                  <p className="text-sm md:text-base text-neutral-600">A collection of our creative work</p>
                </div>
                <button
                  onClick={close}
                  aria-label="Close portfolio"
                  className="rounded-full p-2 hover:bg-neutral-100"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-6">
              {error && (
                <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Justified gallery */}
              <JustifiedGallery
                items={items}
                onItemClick={(i) => setLightbox(i)}
                targetRowHeight={320}
                gutter={16}
                heroEvery={0}
                heroHeight={520}
                className="relative"
              />

              {/* Initial skeletons */}
              {loading && items.length === 0 &&
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`ph-${i}`} className="h-56 rounded-xl bg-neutral-100 animate-pulse" />
                  ))}
                </div>
              }

              {/* Sentinel → auto-load next page */}
              <div ref={sentinelRef} className="h-10 w-full" />
            </div>
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightbox !== null && items[lightbox] && (
              <motion.div
                className="fixed inset-0 z-[90] bg-black/90 text-white flex items-center justify-center p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={close}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
                  className="absolute top-4 right-4 md:top-6 md:right-6 z-50 rounded-full p-2 bg-white/10 hover:bg-white/20"
                  aria-label="Close"
                >
                  <FiX className="h-6 w-6" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.max(0, (i ?? 0) - 1)); }}
                  disabled={lightbox === 0}
                  className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 rounded-full p-2 bg-white/10 hover:bg-white/20 disabled:opacity-40"
                  aria-label="Previous"
                >
                  <FiChevronLeft className="h-7 w-7" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.min(items.length - 1, (i ?? 0) + 1)); }}
                  disabled={lightbox === items.length - 1}
                  className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 rounded-full p-2 bg-white/10 hover:bg-white/20 disabled:opacity-40"
                  aria-label="Next"
                >
                  <FiChevronRight className="h-7 w-7" />
                </button>

                <motion.img
                  key={items[lightbox].public_id || items[lightbox].src}
                  src={
                    cldFull({ public_id: items[lightbox].public_id, type: items[lightbox].type }) ||
                    items[lightbox].src
                  }
                  alt={items[lightbox].alt || ''}
                  className="max-h-[88vh] w-auto rounded-xl shadow-2xl z-30"
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Large click areas */}
                <button
                  className="absolute left-0 top-16 md:top-20 bottom-0 w-1/3 md:w-1/4 z-20"
                  onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.max(0, (i ?? 0) - 1)); }}
                  aria-label="Previous"
                />
                <button
                  className="absolute right-0 top-16 md:top-20 bottom-0 w-1/3 md:w-1/4 z-20"
                  onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.min(items.length - 1, (i ?? 0) + 1)); }}
                  aria-label="Next"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
