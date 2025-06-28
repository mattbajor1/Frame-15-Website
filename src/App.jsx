import React from 'react';
import { motion } from 'framer-motion';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <motion.h1 
        className="text-5xl font-bold mb-2"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Hello World
      </motion.h1>

      <motion.p
        className="text-xl opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Welcome to my cinematic portfolio website!
      </motion.p>

      <motion.button 
        className="mt-8 px-6 py-3 bg-white text-black text-lg font-semibold rounded"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Explore More
      </motion.button>
    </div>
  );
}