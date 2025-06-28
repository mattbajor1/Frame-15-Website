import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  { title: 'Film A', desc: 'Short film about ...', video: '/videos/placeholder.mp4' },
  { title: 'Doc B', desc: 'Exploring ...', video: '/videos/placeholder.mp4' },
];

export default function Projects() {
  return (
    <section className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8">Projects</h2>
      <div className="space-y-12">
        {projects.map((p, idx) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <video
              src={p.video}
              controls className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2">{p.title}</h3>
              <p className="text-gray-700">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}