import { useState, useMemo, useEffect } from 'react';
import { FiVideo, FiCamera, FiAperture, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Heading from '../components/Heading';

const bgUrl = (p) => `url('${p}')`;

const services = [
  {
    id: 'video',
    name: 'Video Production',
    icon: FiVideo,
    description:
      'From concept to final cut, we bring stories to life through cinematic visuals.',
    bgImage: '/images/MAD_COW_BTS.jpg',
    work: [
      { title: 'Benztown IEX', vimeoEmbed: 'https://player.vimeo.com/video/1107849616?h=5f03988a11&title=0&byline=0&portrait=0' },
      { title: 'Scout & Griffin', vimeoEmbed: 'https://player.vimeo.com/video/1107827897?title=0&byline=0&portrait=0' },
      { title: 'Trailside Museum and Zoo', vimeoEmbed: 'https://player.vimeo.com/video/1107829998?title=0&byline=0&portrait=0' },
      { title: 'Big Jay Preview', vimeoEmbed: 'https://player.vimeo.com/video/1097613407?h=1f7c7d8c30&title=0&byline=0&portrait=0' },
    ],
  },
  {
    id: 'drone',
    name: 'Aerial & Drone',
    icon: FiAperture,
    description:
      'Elevated perspective and dynamic movement to take your project to new heights.',
    bgImage: '/images/Wing&Wing-43.jpg',
    work: [
      { title: 'Lake Champlain', vimeoEmbed: 'https://player.vimeo.com/video/1109222906?h=a384f20fa0&title=0&byline=0&portrait=0' },
      { title: 'Sunset', vimeoEmbed: 'https://player.vimeo.com/video/1109220783?h=dc686fba43&title=0&byline=0&portrait=0' },
      { title: 'Burlington High School Demolition', vimeoEmbed: 'https://player.vimeo.com/video/1109214423?h=60a7107822&title=0&byline=0&portrait=0' },
      { title: 'S&D Mowing', vimeoEmbed: 'https://player.vimeo.com/video/1109223375?h=e4c296cffd&title=0&byline=0&portrait=0' },
    ],
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: FiCamera,
    description:
      'Capturing emotion, atmosphere, and light in every frame.',
    bgImage: '/images/15-IMG_4467-NGAlpsLandscapes2019 Weed.jpg',
    work: [
      { title: 'Title', img: '/images/15-IMG_4467-NGAlpsLandscapes2019 Weed.jpg' },
      { title: 'Title', img: '/images/13-IMG_4423-NGAlpsLandscapes2019 Weed.jpg' },
      { title: 'Title', img: '/images/01-IMG_1305-Weedfield2019 Weed.jpg' },
      { title: 'Title', img: '/images/17-IMG_4480-NGAlpsLandscapes2019 Weed.jpg' },
      { title: 'Title', img: '/images/123-IMG_7929-NGAlpsLandscapes2019 Weed.jpg' },
      { title: 'Title', img: '/images/manitou-10.jpg' },
      { title: 'Title', img: '/images/DSC07623_edited.jpg' },
      { title: 'Title', img: '/images/63848_HWE_001_07 (1).jpg' },
      { title: 'Title', img: '/images/63848_HWE_002_37.jpg' },
      { title: 'Title', img: '/images/IMG_2551 (1).jpeg' },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1];
const tCard = { duration: 0.28, ease, type: 'tween' };
const tContent = { duration: 0.28, ease, type: 'tween' };

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } };

export default function OurWork() {
  const [expanded, setExpanded] = useState(null);
  const active = useMemo(() => services.find((s) => s.id === expanded) ?? null, [expanded]);

  // mount heavy content (iframes) only after the expand layout animation completes
  const [contentReady, setContentReady] = useState(false);

  // closing flow to avoid "flash back to small card"
  const [closing, setClosing] = useState(false);
  const startClose = () => {
    if (!expanded) return;
    setClosing(true);
    setContentReady(false);
    // after fade-out, unmount expanded and show grid
    setTimeout(() => {
      setExpanded(null);
      setClosing(false);
    }, 300); // ~ tCard
  };

  useEffect(() => {
    // whenever we open a new one, content will mount after layout finishes
    if (expanded) setContentReady(false);
  }, [expanded]);

  // PHOTO LIGHTBOX
  const photoItems = useMemo(() => (active ? active.work.filter((w) => w.img) : []), [active]);
  const [lbIndex, setLbIndex] = useState(null);
  useEffect(() => { setLbIndex(null); }, [expanded]);

  useEffect(() => {
    if (lbIndex === null || photoItems.length === 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLbIndex(null);
      if (e.key === 'ArrowRight') setLbIndex((i) => (i + 1) % photoItems.length);
      if (e.key === 'ArrowLeft') setLbIndex((i) => (i - 1 + photoItems.length) % photoItems.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lbIndex, photoItems.length]);

  const photoIndexBySrc = useMemo(() => {
    const m = {};
    photoItems.forEach((p, i) => { m[p.img] = i; });
    return m;
  }, [photoItems]);

  return (
    <section id="projects" className="bg-black text-white py-24">
      <div className="max-w-6xl mx-auto px-4">
        <Heading title="Our Services" bgWord="SERVICES" className="text-4xl md:text-5xl text-yellow-500 mb-12" />
      </div>

      <LayoutGroup>
        <div className="mx-auto w-full px-4 md:px-6 max-w-[1700px]">
          <div className="flex gap-6 items-start">
            {/* LEFT: grid or expanded panel */}
            <div className="flex-1 min-w-0">
              <div className={expanded ? '' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {!expanded && services.map((s) => (
                  <motion.button
                    key={s.id}
                    layoutId={`card-${s.id}`}
                    onClick={() => setExpanded(s.id)}
                    className="relative rounded-xl overflow-hidden border border-white/10 text-left group transform-gpu transition-transform duration-300 hover:scale-[1.02]"
                    initial={false}
                    transition={tCard}
                    style={{
                      backgroundImage: bgUrl(s.bgImage),
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      willChange: 'transform',
                    }}
                  >
                    <div className="relative z-10 p-6">
                      <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-md">
                        <s.icon size={22} className="text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400" />
                        <span className="text-lg font-semibold font-display uppercase tracking-wide text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400">
                          {s.name}
                        </span>
                      </div>

                      {s.description && (
                        <div className="mt-3 inline-block rounded-md bg-black/60 backdrop-blur px-4 py-3">
                          <p className="text-sm text-white/90 max-w-[52ch]">{s.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                  </motion.button>
                ))}

                <AnimatePresence>
                  {(expanded && active) && (
                    <motion.div
                      key={active.id}
                      // Disable shared-layout on close so it fades instead of "shrinking back"
                      layoutId={closing ? undefined : `card-${active.id}`}
                      className="relative rounded-xl overflow-hidden border border-white/10"
                      transition={tCard}
                      style={{
                        // hide bg image during close to avoid any single-frame flash
                        backgroundImage: closing ? 'none' : bgUrl(active.bgImage),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        willChange: 'transform',
                        contain: 'layout paint',
                      }}
                      onLayoutAnimationComplete={() => {
                        if (!closing) setContentReady(true);
                      }}
                      initial={{ opacity: 0.98 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }} // fade the whole thing out on close
                    >
                      <motion.div
                        className="relative z-10 p-6 md:p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={tContent}
                      >
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur px-4 py-2 rounded-lg">
                            <active.icon size={28} className="text-yellow-500" />
                            <h3 className="text-2xl md:text-3xl font-bold font-display uppercase">{active.name}</h3>
                          </div>
                          <button
                            onClick={startClose}
                            className="hidden md:inline-block bg-white text-black px-4 py-2 rounded font-bold"
                          >
                            Close
                          </button>
                        </div>

                        {active.description && (
                          <div className="mt-4 inline-block rounded-md bg-black/60 backdrop-blur px-4 py-3">
                            <p className="text-sm text-white/90 max-w-[68ch]">{active.description}</p>
                          </div>
                        )}

                        <div className="mt-5 rounded-xl bg-black/55 backdrop-blur px-5 py-6">
                          <motion.div
                            className="grid md:grid-cols-2 gap-6"
                            initial="hidden"
                            animate="visible"
                            variants={gridVariants}
                          >
                            {contentReady ? (
                              active.work.map((item, i) => (
                                <motion.div key={i} variants={itemVariants}>
                                  {item.vimeoEmbed ? (
                                    <div className="aspect-video w-full">
                                      <iframe
                                        src={item.vimeoEmbed}
                                        className="w-full h-full rounded-md"
                                        title={item.title || 'Vimeo video'}
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="origin-when-cross-origin"
                                      />
                                      {item.title && (
                                        <h4 className="mt-2 text-lg font-semibold font-display">{item.title}</h4>
                                      )}
                                    </div>
                                  ) : item.img ? (
                                    <div
                                      className="relative overflow-hidden rounded-md cursor-zoom-in"
                                      role="button"
                                      tabIndex={0}
                                      onClick={() => setLbIndex(photoIndexBySrc[item.img] ?? 0)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') setLbIndex(photoIndexBySrc[item.img] ?? 0);
                                      }}
                                    >
                                      <img
                                        src={item.img}
                                        alt=""
                                        className="w-full h-auto object-cover"
                                        decoding="async"
                                        loading="lazy"
                                      />
                                    </div>
                                  ) : null}
                                </motion.div>
                              ))
                            ) : (
                              // light placeholders while expanding
                              Array.from({ length: 4 }).map((_, i) => (
                                <div key={`ph-${i}`} className="aspect-video w-full rounded-md bg-white/10 animate-pulse" />
                              ))
                            )}
                          </motion.div>
                        </div>

                        {/* CTA Buttons */}
                        {active.id === 'photography' && (
                          <div className="mt-8 flex justify-center">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                startClose();
                                window.location.hash = 'portfolio';
                              }}
                              className="px-8 py-3 rounded-full bg-white text-black font-display font-bold uppercase tracking-wide hover:bg-yellow-500 transition-colors shadow-lg hover:shadow-yellow-500/20"
                            >
                              View Full Portfolio
                            </button>
                          </div>
                        )}

                        {active.id === 'video' && (
                          <div className="mt-8 flex justify-center">
                            <a
                              href="https://vimeo.com/user242994295?fl=pp&fe=sh"
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-display font-bold uppercase tracking-wide hover:bg-yellow-500 transition-colors shadow-lg hover:shadow-yellow-500/20"
                            >
                              <FiVideo className="w-5 h-5" />
                              Visit Our Vimeo
                            </a>
                          </div>
                        )}

                        <button
                          onClick={startClose}
                          className="mt-6 md:hidden bg-white text-black px-4 py-2 rounded font-bold w-full"
                        >
                          Close
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: skinny switcher — only when expanded; include active (greyed out) */}
            <AnimatePresence>
              {expanded && (
                <motion.aside
                  key="switcher"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={tContent}
                  className="hidden md:flex w-[280px] shrink-0 flex-col gap-4"
                >
                  {services.map((s) => {
                    const isActive = s.id === expanded;
                    return (
                      <button
                        key={s.id}
                        onClick={() => !isActive && setExpanded(s.id)}
                        disabled={isActive || closing}
                        className={`relative rounded-lg overflow-hidden border text-left transform-gpu transition-transform duration-300 ${isActive
                          ? 'border-white/20 opacity-50 cursor-default'
                          : 'border-white/10 hover:scale-[1.02]'
                          }`}
                        style={{
                          backgroundImage: bgUrl(s.bgImage),
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          willChange: 'transform',
                        }}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <div className="p-4">
                          <div className="inline-flex items-center gap-2 bg-black/55 backdrop-blur px-3 py-2 rounded-md">
                            <s.icon size={18} className="text-yellow-500" />
                            <h4 className="text-sm font-semibold font-display uppercase tracking-wide text-yellow-500">
                              {s.name}
                            </h4>
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                      </button>
                    );
                  })}
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>

      {/* PHOTO LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {lbIndex !== null && photoItems.length > 0 && (
          <motion.div
            className="fixed inset-0 z-[140] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLbIndex(null)}
            aria-modal="true"
            role="dialog"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLbIndex(null); }}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white"
              aria-label="Close"
              title="Close"
            >
              <FiX className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setLbIndex((i) => (i - 1 + photoItems.length) % photoItems.length); }}
              className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 rounded-full p-2 bg:white/10 hover:bg-white/20 text-white"
              aria-label="Previous image"
              title="Previous"
            >
              <FiChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLbIndex((i) => (i + 1) % photoItems.length); }}
              className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 rounded-full p-2 bg:white/10 hover:bg-white/20 text-white"
              aria-label="Next image"
              title="Next"
            >
              <FiChevronRight className="h-7 w-7" />
            </button>

            <motion.img
              key={photoItems[lbIndex].img}
              src={photoItems[lbIndex].img}
              alt=""
              className="max-h-[88vh] w-auto rounded-xl shadow-2xl z-30"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
