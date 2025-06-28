import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="pt-16"> {/* padding-top to offset fixed navbar */}
      {/* Hero Section */}
      <section className="h-screen relative">
        {/* Use placeholder video if you don’t have a hero-reel.mp4 */}
        <video
          src="/videos/placeholder.mp4"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
          <motion.h1
            className="text-6xl text-white font-extrabold mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to Frame Fifteen
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Frame 15 don't give a FUCK 
          </motion.p>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-lg shadow-lg"
              whileHover={{ scale: 1.03 }}
            >
              {/* Placeholder image if you don’t have project-i.jpg */}
              <img
                src="/images/placeholder.jpg"
                alt={`Project ${i}`}
                className="w-full h-64 object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}