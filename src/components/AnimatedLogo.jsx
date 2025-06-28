import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function AnimatedLogo({ text = 'frame', number = '15' }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      filter: 'blur(0px)',
      opacity: 1,
      transition: { duration: 1.5 },
    });
  }, [controls]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-extrabold uppercase text-white">
        {text}
      </span>
      <motion.span
        className="text-xl font-bold mt-1 text-gold"
        style={{ filter: 'blur(8px)', opacity: 0.6 }}
        animate={controls}
      >
        {number}
      </motion.span>
    </div>
  );
}