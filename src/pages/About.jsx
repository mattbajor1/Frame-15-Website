import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Heading from '../components/Heading';

const team = [
  {
    name: 'George Weed',
    role: 'Founder & Creative Director',
    roleWord: 'DIRECTOR',
    photo: '/images/Frame15_Profiles_George.jpg',
    bio: `George founded Frame 15 to chase stories with intent. He leads from the first spark to final delivery, shaping tone, tempo, and taste. Equal parts designer and director, he pushes for clarity in the concept and pressure in the frame—guiding teams, clients, and collaborators toward work that feels inevitable once you see it.`,
  },
  {
    name: 'Henry Weed',
    role: 'Lead Camera & Cinematography',
    roleWord: 'CAMERA',
    photo: '/images/Frame15_Profiles_Henry.jpg',
    bio: `Henry owns the glass. He designs light, movement, and lens language that carry emotion without shouting. Whether it’s a nimble handheld build or a precision move, he engineers camera systems that disappear into the story.`,
  },
  {
    name: 'Aiden Champeau',
    role: 'Producer & Lead Editor',
    roleWord: 'EDITOR',
    photo: '/images/Frame15_Profiles_Aidan.jpg',
    bio: `Aiden architects the cut. From boards to timelines, he finds the rhythm that turns a moment into momentum. He balances structure with surprise—building sequences that land cleanly and linger.`,
  },
  {
    name: 'Jonas Spaulding',
    role: 'Cinematographer & Rigging Engineer',
    roleWord: 'RIGGING',
    photo: '/images/Frame15_Profiles_Jonas.jpg',
    bio: `Jonas makes motion possible. If the shot seems impossible, he’s already sketching the rig. From custom builds to safe, repeatable moves, Jonas engineers pathways for the camera to feel weightless.`,
  },
  {
    name: 'Joel Rader',
    role: 'Director & Cinematographer',
    roleWord: 'DIRECTOR',
    photo: '/images/Frame15_Profiles_Joel.jpg',
    bio: `Joel brings a painter’s eye to pacing and light. His work threads classic composition with modern restraint—never loud, always precise.`,
  },
  {
    name: 'Matthew Bajor',
    role: 'Marketing & Design Director',
    roleWord: 'DESIGN',
    photo: '/images/placeholder.jpg',
    bio: `Matthew builds the brand’s outer voice. He shapes identity, campaigns, and collateral so the studio’s point of view is unmistakable across every touchpoint.`,
  },
];

export default function About() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section id="about" className="bg-black text-white py-24">
        {!selected && (
          <div className="max-w-6xl mx-auto px-4">
            <Heading title="Meet the Team" bgWord="TEAM" className="text-4xl md:text-5xl text-yellow-500 mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {team.map(m => (
                <button
                  key={m.name}
                  onClick={() => setSelected(m)}
                  className="bg-white text-black rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform card-cinematic"
                  aria-label={`Expand profile for ${m.name}`}
                >
                  <div className="w-full aspect-square bg-gray-200">
                    <img src={m.photo} alt={m.name} className="object-cover w-full h-full team-photo" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-2xl font-semibold font-display uppercase tracking-wide">
                      <span className="text-yellow-500">{m.name}</span>
                    </h3>
                    <p className="text-gray-700">{m.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {selected && (
          <motion.section
            key="expanded"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative h-[80vh] bg-black text-white overflow-hidden"
          >
            <div className="absolute inset-0">
              <img src={selected.photo} alt={selected.name} className="w-full h-full object-cover brightness-75 kenburns" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/10 z-10" />

            <div className="absolute top-6 right-6 z-20">
              <button onClick={() => setSelected(null)} className="text-white bg-black/60 hover:bg-black px-4 py-2 rounded-full border border-white/60" aria-label="Close profile">✕</button>
            </div>

            <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 z-20 max-w-2xl pr-6">
              <div className="relative">
                <span className="absolute -top-10 -left-6 font-display uppercase tracking-[.2em] text-white/5 text-7xl md:text-8xl pointer-events-none select-none">
                  {selected.roleWord}
                </span>
                <motion.h2 className="text-4xl md:text-6xl font-extrabold leading-tight font-display uppercase"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  {selected.name}
                </motion.h2>
              </div>
              <p className="text-yellow-500 text-xl md:text-2xl mt-3 font-semibold">{selected.role}</p>
              <p className="mt-5 text-base md:text-lg text-gray-200 leading-relaxed">{selected.bio}</p>
            </div>

            <div className="absolute bottom-6 right-6 md:right-16 flex gap-2 z-20">
              {team.map(m => (
                <button
                  key={m.name}
                  onClick={() => setSelected(m)}
                  className={`w-12 h-12 rounded-full border-2 overflow-hidden transition ${m.name === selected.name ? 'border-yellow-500' : 'border-white/70'}`}
                  aria-label={`Open profile for ${m.name}`}
                >
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover team-photo" />
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
