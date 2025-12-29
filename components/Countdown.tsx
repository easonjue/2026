
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: [0, 1.5, 1], opacity: 1, rotate: 0 }}
            exit={{ scale: 4, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="text-[15rem] md:text-[25rem] font-brush text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.8)]"
          >
            {count}
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="text-8xl md:text-[12rem] font-brush text-yellow-400 drop-shadow-[0_0_60px_rgba(250,204,21,0.8)]"
          >
            盛世长歌
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background shockwaves */}
      <AnimatePresence>
        <motion.div
          key={`bg-${count}`}
          initial={{ scale: 0.5, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute w-[500px] h-[500px] border-4 border-red-500/30 rounded-full"
        />
      </AnimatePresence>
    </div>
  );
};

export default Countdown;
