import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCameraRetro, FaVideo, FaPaintBrush } from "react-icons/fa";
import { MdOutlineFlight } from "react-icons/md";

const services = [
  {
    id: 'photo',
    icon: <FaCameraRetro size={48} />,
    title: 'Photography',
    description: 'Professional photography services to capture your moments with precision and style.',
  },
  {
    id: 'Aerial photography',
    icon: <MdOutlineFlight className="text-5xl text-gold" />, // Place Holder Icon
    title: 'Aerial Photography and Video',
    description: "Capture breathtaking drone footage and aerial photography with stunning cinematic quality.",
  },
  {
    id: 'video',
    icon: <FaVideo size={48} />,
    title: 'Video Production',
    description: 'Cinematic video services for brands, products, and storytelling.',
  },
  {
    id: 'design',
    icon: <FaPaintBrush size={48} />,
    title: 'Design',
    description: 'Custom design work for visuals, branding, and digital products.',
  },
];

export default function Services() {
  const [selected, setSelected] = useState(null);

  return (
    <section
      id="services"
      className="bg-black text-white px-4 py-16 transition-all duration-700"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>

        <div
          className={`grid gap-8 transition-all duration-700 ${
            selected ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start' :
            'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${
                selected && selected.id !== service.id ? 'scale-75 opacity-50' : ''
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(service)}
            >
              <div className="text-gold mb-2">{service.icon}</div>
              <h3 className="text-lg font-semibold text-white">{service.title}</h3>
            </motion.div>
          ))}
        </div>

        {selected && (
          <motion.div
            key={selected.id}
            className="mt-12 bg-white text-black p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-black">{selected.title}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-sm font-medium text-yellow-500"
              >
                Close
              </button>
            </div>
            <p className="text-lg text-gray-700">{selected.description}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}