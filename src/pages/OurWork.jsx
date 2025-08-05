import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Heading from '../components/Heading';

const categories = ['ALL', 'VIDEO', 'DESIGN', 'AERIAL'];

const projects = [
  { title: 'Film A', desc: 'Short film about ...', category: 'VIDEO', video: '/videos/placeholder.mp4' },
  { title: 'Doc B', desc: 'Exploring ...', category: 'VIDEO', video: '/videos/placeholder.mp4' },
  { title: 'Logo Work', desc: 'Brand visuals ...', category: 'DESIGN', video: '/videos/placeholder.mp4' },
  { title: 'Drone Reel', desc: 'Aerial showcase ...', category: 'AERIAL', video: '/videos/placeholder.mp4' },
];

export default function OurWork() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [open, setOpen] = useState(null);

  const filtered = selectedCategory === 'ALL' ? projects : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="bg-black text-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Heading title="Our Work" bgWord="WORK" className="text-4xl md:text-5xl text-yellow-500 mb-3" />
        <p className="text-center md:text-left text-gray-400 mb-8 text-lg">Curated storytelling across formats</p>

        {/* Tabs */}
        <div className="flex justify-center md:justify-start gap-3 flex-wrap mb-12">
          {categories.map(cat => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`tab px-5 py-2 rounded-full border text-sm uppercase tracking-wide
                  ${active ? 'tab-active bg-yellow-500 text-black border-yellow-500 font-bold'
                           : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={`${p.title}-${i}`}
                className="bg-white text-black rounded-lg overflow-hidden shadow-lg card-cinematic"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.12 }}
              >
                <HoverVideoCard project={p} onOpen={() => setOpen(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <CaseStudyModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function HoverVideoCard({ project, onOpen }) {
  const videoRef = useRef(null);
  const onEnter = () => { const v = videoRef.current; if (!v) return; v.muted = true; v.play().catch(() => {}); };
  const onLeave = () => { const v = videoRef.current; if (!v) return; v.pause(); v.currentTime = 0; };

  return (
    <>
      <div className="w-full h-48 bg-black overflow-hidden" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <video ref={videoRef} src={project.video} className="w-full h-full object-cover" playsInline preload="metadata" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-1 text-yellow-500 font-display uppercase tracking-wide">{project.title}</h3>
        <p className="text-gray-700">{project.desc}</p>
        <div className="mt-4">
          <button
            onClick={onOpen}
            className="btn-cinematic inline-block border border-yellow-500 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-black"
          >
            View
          </button>
        </div>
      </div>
    </>
  );
}

function CaseStudyModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="relative w-full h-[50vh] bg-black">
              <video src={project.video} className="w-full h-full object-cover" controls autoPlay playsInline />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full"
                aria-label="Close case study"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-black">
              <h3 className="font-display text-3xl uppercase tracking-wide text-yellow-600">{project.title}</h3>
              <p className="mt-2 text-gray-700">{project.desc}</p>
              <p className="mt-4 text-gray-700">
                Creative brief, process, and outcome go here—concept → production → result. Add BTS stills or notes
                that highlight decisions, constraints, and wins.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
