import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function About() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -100]);
  return (
    <section className="pt-24 pb-16 bg-white">
      <h2 className="text-4xl font-bold text-center mb-12">About Us</h2>
      <div className="relative max-w-4xl mx-auto">
        <motion.img
          src="/images/placeholder.jpg"
          style={{ y: y1 }}
          className="w-full h-96 object-cover rounded-lg shadow-lg"
        />
        <p className="mt-8 text-gray-700 text-lg">
          We are a team of filmmakers and developers dedicated to crafting immersive digital experiences...
        </p>
      </div>
    </section>
  );
}