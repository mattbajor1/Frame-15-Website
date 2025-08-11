import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import itemsAll from '../data/portfolio';

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
  const url = window.location.pathname + window.location.search;
  window.history.replaceState(null, '', url);
}

export default function Portfolio() {
  const [open, setOpen] = useHashFlag('#portfolio');
  const [lightbox, setLightbox] = useState(null); 
  const items = useMemo(() => itemsAll, []);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        if (lightbox !== null) setLightbox(null);
        else { clearHash(); setOpen(false); }
      }
      if (lightbox !== null) {
        if (e.key === 'ArrowRight') setLightbox((i) => Math.min(i + 1, items.length - 1));
        if (e.key === 'ArrowLeft') setLightbox((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lightbox, items.length, setOpen]);

  const close = useCallback(() => {
    if (lightbox !== null) setLightbox(null);
    else { clearHash(); setOpen(false); }
  }, [lightbox, setOpen]);

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
            className="absolute inset-0 bg-white text-black overflow-y-auto"
            initial={{ scale: 0.995, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.995, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-6">
              <motion.div
                layout
                className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 [column-fill:_balance]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {items.map((item, i) => (
                  <motion.figure
                    key={item.id || item.src}
                    layout
                    className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm cursor-zoom-in"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setLightbox(i)}
                  >
                    <img
                      src={item.src}
                      srcSet={item.srcSet || undefined}
                      sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      alt={item.alt || ''}
                      decoding="async"
                      loading={i < 8 ? 'eager' : 'lazy'}
                      fetchpriority={i < 8 ? 'high' : 'low'}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </motion.figure>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence>
            {lightbox !== null && (
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
                  onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.max(0, i - 1)); }}
                  disabled={lightbox === 0}
                  className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 rounded-full p-2 bg-white/10 hover:bg-white/20 disabled:opacity-40"
                  aria-label="Previous"
                >
                  <FiChevronLeft className="h-7 w-7" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.min(items.length - 1, i + 1)); }}
                  disabled={lightbox === items.length - 1}
                  className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 rounded-full p-2 bg-white/10 hover:bg-white/20 disabled:opacity-40"
                  aria-label="Next"
                >
                  <FiChevronRight className="h-7 w-7" />
                </button>

                <motion.img
                  key={items[lightbox].src}
                  src={items[lightbox].src}
                  alt=""
                  className="max-h-[88vh] w-auto rounded-xl shadow-2xl z-30"
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  className="absolute left-0 top-16 md:top-20 bottom-0 w-1/3 md:w-1/4 z-20"
                  onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.max(0, i - 1)); }}
                  aria-label="Previous"
                />
                <button
                  className="absolute right-0 top-16 md:top-20 bottom-0 w-1/3 md:w-1/4 z-20"
                  onClick={(e) => { e.stopPropagation(); setLightbox((i) => Math.min(items.length - 1, i + 1)); }}
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
