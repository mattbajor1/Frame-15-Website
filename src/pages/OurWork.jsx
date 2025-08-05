import React, { useState } from 'react';
import { motion } from 'framer-motion';

const categories = ['ALL', 'VIDEO', 'DESIGN', 'AERIAL'];

const projects = [
  {
    title: 'Film A',
    desc: 'Short film about ...',
    category: 'VIDEO',
    video: '/videos/placeholder.mp4',
  },
  {
    title: 'Doc B',
    desc: 'Exploring ...',
    category: 'VIDEO',
    video: '/videos/placeholder.mp4',
  },
  {
    title: 'Logo Work',
    desc: 'Brand visuals ...',
    category: 'DESIGN',
    video: '/videos/placeholder.mp4',
  },
  {
    title: 'Drone Reel',
    desc: 'Aerial showcase ...',
    category: 'AERIAL',
    video: '/videos/placeholder.mp4',
  },
];

export default function OurWork() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filtered = selectedCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="bg-black text-white py-24 px-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white uppercase tracking-wide">
        Our Work
      </h2>
      <p className="text-center text-gray-400 mb-8 text-lg">
        Curated storytelling across formats
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-4 flex-wrap mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full border transition 
              ${
                selectedCategory === cat
                  ? 'bg-yellow-500 text-black font-bold'
                  : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.div
            key={i}
            className="bg-white text-black rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <video
              src={p.video}
              controls
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-1 text-yellow-500">
                {p.title}
              </h3>
              <p className="text-gray-700">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
