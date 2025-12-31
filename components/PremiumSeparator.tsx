import React from "react";
import { motion } from "framer-motion";

const PremiumSeparator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 sm:gap-3 px-1 sm:px-3 md:px-4 pb-2 sm:pb-6 md:pb-8">
      <motion.div
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-0.5 h-0.5 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full"
        style={{
          background: "radial-gradient(circle, #fbbf24 0%, #ef4444 100%)",
          boxShadow: "0 0 10px rgba(251, 191, 36, 0.6)",
        }}
      />
      <motion.div
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="w-0.5 h-0.5 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full"
        style={{
          background: "radial-gradient(circle, #ef4444 0%, #fbbf24 100%)",
          boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)",
        }}
      />
    </div>
  );
};

export default PremiumSeparator;
