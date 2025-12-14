import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import Heading from '../components/Heading';

// Staggered text reveal
const textContainer = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.12 },
  },
};
const textItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const team = [
  {
    name: 'George Weed',
    role: 'Founder & Creative Director',
    roleWord: 'DIRECTOR',
    photo: '/images/Frame15_Profiles_George.jpg',
    position: '20% 50%',
    bio: `George founded Frame 15 to chase stories with intent. He leads from the first spark to final delivery, shaping tone, tempo, and taste. Equal parts designer and director, he pushes for clarity in the concept and pressure in the frame, guiding teams, clients, and collaborators toward work that feels inevitable once you see it. His leadership blends meticulous planning with an openness to discovery on set, which keeps every project both crafted and alive. When the stakes are high and the timeline is tight, George turns constraints into creative fuel.`,
  },
  {
    name: 'Henry Weed',
    role: 'Lead Camera & Cinematographer',
    roleWord: 'CAMERA',
    photo: '/images/Frame15_Profiles_Henry.jpg',
    bio: `Henry owns the glass. He designs light, movement, and lens language that carry emotion without shouting. Whether it is a nimble handheld build or a precision move, he engineers camera systems that disappear into the story. His approach pairs technical mastery with instinctive composition, capturing moments that feel intentional and unforced. Henry anticipates how shots will cut together and how the visual rhythm will carry through the final edit. On set, he brings calm precision that lets creativity flow.`,
  },
  {
    name: 'Aidan Champeau',
    role: 'Director & Lead Editor',
    roleWord: 'EDITOR',
    photo: '/images/Frame15_Profiles_Aidan.jpg',
    bio: `Aidan architects the cut. From boards to timelines, he finds the rhythm that turns a moment into momentum. He balances structure with surprise, building sequences that land cleanly and linger. As a producer, Aidan keeps every moving piece aligned, from budget to delivery, while protecting the creative vision at every stage. In the edit, his pacing is deliberate, his transitions purposeful, and his storytelling layered. He knows when to push, when to refine, and when to let a moment breathe.`,
  },
  {
    name: 'Jonas Spaulding',
    role: 'Cinematographer & Rigging Engineer',
    roleWord: 'RIGGING',
    photo: '/images/Frame15_Profiles_Jonas.jpg',
    bio: `Jonas makes motion possible. If the shot seems impossible, he is already sketching the rig. From custom builds to safe and repeatable moves, Jonas engineers pathways for the camera to feel weightless. His approach on cinematography keeps the focus on the story, so every technical choice serves the creative goal. Whether he is designing a high speed tracking shot or rigging for an unconventional angle, Jonas blends innovation with safety and expands what is possible on set.`,
  },
  {
    name: 'Joel Rader',
    role: 'Director & Lead Gaffer',
    roleWord: 'DIRECTOR',
    photo: '/images/Frame15_Profiles_Joel.jpg',
    position: '100% 50%',
    bio: `Joel brings a painterly eye to pacing and light. His work threads classic composition with modern restraint, never loud and always precise. As a director, Joel builds an environment where performances feel authentic and camera movement feels motivated. As a cinematographer, he shapes mood and texture in every frame. His style carries quiet confidence that invites the audience to lean in. For Joel, every frame is a chance to create lasting resonance.`,
  },
  {
    name: 'Matthew Bajor',
    role: 'Director of Design',
    roleWord: 'DESIGN',
    photo: '/images/Frame15_Profiles_Matt.jpg',
    bio: `Matthew builds the brand voice out in the world. He shapes identity, campaigns, and collateral so the studio point of view is unmistakable across every touchpoint. With a foundation in visual arts and strategy, he connects concept to execution and keeps the work cohesive and intentional. Matthew approaches design with a storyteller mindset, understanding how each image, color, and word contributes to the larger narrative. His goal is simple, to make Frame 15 impossible to ignore.`,
  },
];

export default function About() {
  const [selected, setSelected] = useState(null);

  // Convenience: current index + helpers
  const currentIndex = useMemo(
    () => (selected ? team.findIndex((m) => m.name === selected.name) : -1),
    [selected]
  );
  const hasSelection = selected != null;

  const prevPerson = () => {
    if (!hasSelection) return;
    const i = (currentIndex - 1 + team.length) % team.length;
    setSelected(team[i]);
  };
  const nextPerson = () => {
    if (!hasSelection) return;
    const i = (currentIndex + 1) % team.length;
    setSelected(team[i]);
  };

  // Keyboard nav only when expanded
  useEffect(() => {
    if (!hasSelection) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'ArrowLeft') prevPerson();
      if (e.key === 'ArrowRight') nextPerson();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasSelection, currentIndex]);

  return (
    <>
      <section id="about" className="bg-black text-white py-24">
        {!selected && (
          <div className="max-w-6xl mx-auto px-4">
            <Heading
              title="Meet the Team"
              bgWord="TEAM"
              className="text-4xl md:text-5xl text-yellow-500 mb-12"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {team.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelected(m)}
                  className="bg-white text-black rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform card-cinematic"
                  aria-label={`Expand profile for ${m.name}`}
                >
                  <div className="w-full aspect-square bg-gray-200">
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="object-cover w-full h-full team-photo"
                      style={{ objectPosition: m.position || '50% 50%' }}
                    />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-[80vh] bg-black text-white overflow-hidden"
          >
            {/* Background image with gentle Ken Burns */}
            <div className="absolute inset-0">
              <img
                src={selected.photo}
                alt={selected.name}
                className="w-full h-full object-cover brightness-75"
                style={{
                  objectPosition: selected.position || '50% 50%',
                  animation: 'kenburns-scale 18s ease-in-out infinite alternate',
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/10 z-10" />

            {/* Close */}
            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={() => setSelected(null)}
                className="text-white bg-black/60 hover:bg-black px-4 py-2 rounded-full border border-white/60"
                aria-label="Close profile"
                title="Close"
              >
                <FiX className="inline-block w-5 h-5" />
              </button>
            </div>

            {/* Left/Right arrows */}
            <button
              onClick={prevPerson}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 bg-white/10 hover:bg-white/20 border border-white/20"
              aria-label="Previous team member"
              title="Previous"
            >
              <FiChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={nextPerson}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-2 bg-white/10 hover:bg-white/20 border border-white/20"
              aria-label="Next team member"
              title="Next"
            >
              <FiChevronRight className="h-7 w-7" />
            </button>

            {/* Text with staggered reveal */}
            <motion.div
              className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 z-20 max-w-2xl pr-6"
              variants={textContainer}
              initial="hidden"
              animate="show"
            >
              <div className="relative">
                <span className="absolute -top-10 -left-6 font-display uppercase tracking-[.2em] text-white/5 text-7xl md:text-8xl pointer-events-none select-none">
                  {selected.roleWord}
                </span>

                <motion.h2
                  className="text-4xl md:text-6xl font-extrabold leading-tight font-display uppercase"
                  variants={textItem}
                >
                  {selected.name}
                </motion.h2>
              </div>

              <motion.p
                className="text-yellow-500 text-xl md:text-2xl mt-3 font-semibold"
                variants={textItem}
              >
                {selected.role}
              </motion.p>

              <motion.p
                className="mt-5 text-base md:text-lg text-gray-200 leading-relaxed"
                variants={textItem}
              >
                {selected.bio}
              </motion.p>
            </motion.div>

            {/* Quick switch avatars */}
            <div className="absolute bottom-6 right-6 md:right-16 flex gap-2 z-20">
              {team.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelected(m)}
                  className={`w-12 h-12 rounded-full border-2 overflow-hidden transition ${
                    m.name === selected.name ? 'border-yellow-500' : 'border-white/70'
                  }`}
                  aria-label={`Open profile for ${m.name}`}
                  title={m.name}
                >
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-full h-full object-cover team-photo"
                    style={{ objectPosition: m.position || '50% 50%' }}
                  />
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
