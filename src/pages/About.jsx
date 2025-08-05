import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const team = [
  {
    name: 'George Weed',
    role: 'Producer, Creative Director',
    photo: '/images/Frame15_Profiles_George.jpg',
    bio: 'As the founder of Frame 15, George sets the tone for every project with bold leadership and a sharp creative eye. He shapes stories from the seed of an idea to final delivery.',
  },
  {
    name: 'Henry Weed',
    role: 'DP, Director',
    photo: '/images/Frame15_Profiles_Henry.jpg',
    bio: 'Henry is the lens of the team, crafting precise, emotionally rich images that stay with you long after the cut.',
  },
  {
    name: 'Aiden Champeau',
    role: 'Producer, Editor',
    photo: '/images/Frame15_Profiles_Aidan.jpg', 
    bio: 'Aiden is the architectural mind behind our edits. He finds rhythm and resonance in every frame.',
  },
  {
    name: 'Jonas Spaulding',
    role: 'DP, Rigging Specialist',
    photo: '/images/Frame15_Profiles_Jonas.jpg',
    bio: 'Jonas makes the impossible possible, building the rigs that let us move like no one else.',
  },
  {
    name: 'Joel Rader',
    role: 'DP, Director',
    photo: '/images/Frame15_Profiles_Joel.jpg',
    bio: 'Joel brings an artful, intuitive eye to direction and cinematography. He tells visual stories that feel both classic and unexpected.',
  },
  {
    name: 'Matthew Bajor',
    role: 'Director of Marketing and Design',
    photo: '/images/placeholder.jpg',
    bio: 'Matthew builds the brand from the inside out, from visuals to voice, he makes Frame 15 unmistakable.',
  },
];

export default function About() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      {/* EXPANDED PROFILE */}
      <AnimatePresence>
        {selected && (
          <motion.section
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-[70vh] bg-black text-white overflow-hidden"
          >
            <img
              src={selected.photo}
              alt={selected.name}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-10" />

            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={() => setSelected(null)}
                className="text-white bg-black/60 hover:bg-black px-4 py-2 rounded-full border border-white"
              >
                ✕
              </button>
            </div>

            <div className="absolute bottom-10 left-6 md:left-16 z-20">
              <motion.h2
                className="text-4xl md:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {selected.name}
              </motion.h2>
              <p className="text-yellow-500 text-xl md:text-2xl mt-1">{selected.role}</p>
              <p className="mt-4 max-w-2xl text-gray-300">{selected.bio}</p>
            </div>

            {/* Quick-switch circles */}
            <div className="absolute bottom-6 right-6 md:right-16 flex gap-2 z-20">
              {team.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelected(m)}
                  className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                    m.name === selected.name ? 'border-yellow-500' : 'border-white'
                  }`}
                >
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* TEAM GRID */}
      {!selected && (
        <section id="about" className="bg-black text-white py-24">
          <h2 className="text-4xl font-bold text-center mb-12">Meet the Team</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
            {team.map((member) => (
              <button
                key={member.name}
                onClick={() => setSelected(member)}
                className="bg-white text-black rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
              >
                <div className="w-full h-64 bg-gray-200">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-2xl font-semibold">
                    <span className="text-yellow-500">{member.name}</span>
                  </h3>
                  <p className="text-gray-700">{member.role}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}