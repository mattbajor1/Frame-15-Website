// src/components/Services.jsx
import { useState, useMemo } from 'react';
import { FiVideo, FiCamera, FiAperture } from 'react-icons/fi';
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
      { title: 'GW Trailside', vimeoEmbed: 'https://player.vimeo.com/video/1107829998?title=0&byline=0&portrait=0' },
      { title: 'Big Jay Preview Cut', vimeoEmbed: 'https://player.vimeo.com/video/1097613407?h=1f7c7d8c30&title=0&byline=0&portrait=0' },
    ],
  },
  {
    id: 'drone',
    name: 'Aerial & Drone',
    icon: FiAperture,
    description:
      'High-altitude shots and dynamic movement that elevate every project.',
    bgImage: '/images/Wing&Wing-43.jpg',
    work: [],
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

// motion settings
const ease = [0.22, 1, 0.36, 1];
const tCard = { duration: 0.5, ease };
const tContent = { duration: 0.35, ease };
const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } };

export default function Services() {
  const [expanded, setExpanded] = useState(null);
  const active = useMemo(() => services.find((s) => s.id === expanded) ?? null, [expanded]);

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
                    }}
                  >
                    <div className="relative z-10 p-6">
                      {/* Title chip — no scale on hover (prevents text shift) */}
                      <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-md">
                        <s.icon size={22} className="text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400" />
                        <span className="text-lg font-semibold font-display uppercase tracking-wide text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400">
                          {s.name}
                        </span>
                      </div>

                      {/* Service description (opaque box), not full-cover */}
                      {s.description && (
                        <div className="mt-3 inline-block rounded-md bg-black/60 backdrop-blur px-4 py-3">
                          <p className="text-sm text-white/85 max-w-[52ch]">{s.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                  </motion.button>
                ))}

                <AnimatePresence>
                  {expanded && active && (
                    <motion.div
                      key={active.id}
                      layoutId={`card-${active.id}`}
                      className="relative rounded-xl overflow-hidden border border-white/10"
                      transition={tCard}
                      style={{
                        backgroundImage: bgUrl(active.bgImage),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
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
                            onClick={() => setExpanded(null)}
                            className="hidden md:inline-block bg-white text-black px-4 py-2 rounded font-bold"
                          >
                            Close
                          </button>
                        </div>

                        {/* Category description (only if present) */}
                        {active.description && (
                          <div className="mt-4 inline-block rounded-md bg-black/60 backdrop-blur px-4 py-3">
                            <p className="text-sm text-white/85 max-w-[68ch]">{active.description}</p>
                          </div>
                        )}

                        {/* Work grid with fade+stagger */}
                        <div className="mt-5 rounded-xl bg-black/55 backdrop-blur px-5 py-6">
                          <motion.div
                            className="grid md:grid-cols-2 gap-6"
                            initial="hidden"
                            animate="visible"
                            variants={gridVariants}
                          >
                            {active.work.map((item, i) => (
                              <motion.div key={i} variants={itemVariants}>
                                {item.vimeoEmbed ? (
                                  <div className="aspect-video w-full">
                                    <iframe
                                      src={item.vimeoEmbed}
                                      className="w-full h-full rounded-md"
                                      frameBorder="0"
                                      allow="autoplay; fullscreen; picture-in-picture"
                                      allowFullScreen
                                    ></iframe>
                                    <h4 className="mt-2 text-lg font-semibold font-display">{item.title}</h4>
                                  </div>
                                ) : item.img ? (
                                  <div className="relative group overflow-hidden rounded-md">
                                    <img src={item.img} alt={item.title} className="w-full h-auto object-cover" />
                                    <div className="absolute bottom-0 left-0 p-4 bg-black/70 text-white w-full opacity-0 group-hover:opacity-100 transition-opacity">
                                      <h4 className="text-lg font-bold font-display">Title</h4>
                                    </div>
                                  </div>
                                ) : null}
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>

                        <button
                          onClick={() => setExpanded(null)}
                          className="mt-6 md:hidden bg-white text-black px-4 py-2 rounded font-bold w-full"
                        >
                          Close
                        </button>
                      </motion.div>

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: skinny switcher */}
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
                  {services.filter((s) => s.id !== expanded).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setExpanded(s.id)}
                      className="relative rounded-lg overflow-hidden border border-white/10 text-left transform-gpu transition-transform duration-300 hover:scale-[1.02]"
                      style={{
                        backgroundImage: bgUrl(s.bgImage),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="p-4">
                        <div className="inline-flex items-center gap-2 rounded-md bg-black/55 backdrop-blur px-3 py-2">
                          <s.icon size={18} className="text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400" />
                          <h4 className="text-sm font-semibold font-display uppercase tracking-wide text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400">
                            {s.name}
                          </h4>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                    </button>
                  ))}
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
    </section>
  );
}
