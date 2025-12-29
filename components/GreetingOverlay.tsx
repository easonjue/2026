
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Greeting } from '../types';

const animationVariants = [
  {
    initial: { opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -50, scale: 1.1, filter: "blur(10px)" }
  },
  {
    initial: { opacity: 0, scale: 0.5, rotate: -5 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 1.5, rotate: 5 }
  },
  {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  },
  {
    initial: { opacity: 0, y: -100, scale: 1.2 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  }
];

interface GreetingOverlayProps {
  current: Greeting;
  variantIndex: number;
}

const GreetingOverlay: React.FC<GreetingOverlayProps> = ({ current, variantIndex }) => {
  const activeVariant = animationVariants[variantIndex];

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none px-4 text-center">
      {/* Top Left Label */}
      <div className="absolute top-8 left-8 text-left opacity-80 scale-75 md:scale-100">
        <p className="font-serif-sc text-sm tracking-widest text-red-100 mb-1 uppercase">Happy New Year</p>
        <p className="font-serif-sc text-xs text-white/60">岁月悠长 · 山河无恙</p>
      </div>

      {/* Top Right Label */}
      <div className="absolute top-8 right-8 text-right opacity-80 scale-75 md:scale-100">
        <p className="font-brush text-xl text-yellow-200">二〇二六 · 丙午年</p>
      </div>

      {/* Center Animated Greeting */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={activeVariant.initial}
          animate={activeVariant.animate}
          exit={activeVariant.exit}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <motion.h1 
            className="text-5xl md:text-8xl lg:text-9xl font-brush text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] mb-8"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {current.text}
          </motion.h1>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mb-6" />
          <p className="text-xl md:text-3xl font-serif-sc text-yellow-100/90 tracking-[0.2em]">
            {current.subText} <span className="opacity-40 mx-2">|</span> {current.artist}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom UI Decoration */}
      <div className="absolute bottom-12 left-8 text-left max-w-xs scale-75 md:scale-100">
        <div className="mb-4">
          <h2 className="text-3xl md:text-4xl font-brush text-red-600 mb-1 drop-shadow-md">新年大吉</h2>
          <p className="text-[10px] md:text-xs text-white/40 leading-tight uppercase tracking-widest">
            Celestial Harmony<br />
            Lunar Cycle 2026
          </p>
        </div>
        <p className="text-[9px] md:text-[11px] text-white/30 uppercase tracking-tighter leading-relaxed font-sans border-l border-red-900/50 pl-3">
          May the fireworks illuminate your path and the cheers of the new year 
          bring endless joy to your heart. We celebrate the beauty of life.
        </p>
      </div>
      
      <div className="absolute bottom-12 right-8 flex flex-col items-end scale-75 md:scale-100">
         <div className="w-16 h-1 w-16 mb-4 bg-gradient-to-l from-red-600 to-transparent" />
         <p className="text-sm text-white/60 font-serif-sc tracking-widest">不 负 韶 华</p>
         <p className="text-[10px] text-white/20 mt-1 uppercase font-sans">Dreams ignite the future</p>
      </div>
    </div>
  );
};

export default GreetingOverlay;
