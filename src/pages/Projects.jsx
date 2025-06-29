import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  { title: 'Film A', desc: 'Short film about ...', video: '/videos/placeholder.mp4' },
  { title: 'Doc B', desc: 'Exploring ...', video: '/videos/placeholder.mp4' },
  // …add more
];

export default function Projects() {
  return (
    <section id="projects" className="bg-white text-black py-24">
      <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
        {projects.map((p, i) => (
          <motion.div
            key={i}
            className="bg-black text-white rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
          >
            <video
              src={p.video}
              controls
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2">{p.title}</h3>
              <p className="text-gray-300">{p.desc}</p>
            </div>
            <div className="p-4 border-t border-gray-800 text-right">
              <a
                href="#"
                className="text-gold hover:underline"
              >
                View
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}