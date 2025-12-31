import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumDigitCardProps {
  digit: string;
  label: string;
}

const PremiumDigitCard: React.FC<PremiumDigitCardProps> = ({
  digit,
  label,
}) => {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-3 md:gap-4">
      <div className="relative group">
        {/* 微妙的背景光晕 */}
        <motion.div
          className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* 主卡片容器 */}
        <motion.div
          className="relative w-12 h-16 sm:w-20 sm:h-28 md:w-28 md:h-36 lg:w-36 lg:h-48 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(251, 191, 36, 0.1)
            `,
          }}
        >
          {/* 顶部高光 */}
          <div
            className="absolute top-0 left-0 right-0 h-1/3 opacity-40"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)",
            }}
          />

          {/* 中间分隔线 - 更精致 */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* 底部微妙渐变 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/4 opacity-30"
            style={{
              background:
                "linear-gradient(0deg, rgba(251, 191, 36, 0.1) 0%, transparent 100%)",
            }}
          />

          {/* 数字 */}
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit}
                initial={{ y: -30, opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: 30, opacity: 0, rotateX: 90 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className="font-mono text-2xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #fbbf24 50%, #ef4444 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 8px rgba(251, 191, 36, 0.3))",
                }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* 边框光效 */}
          <motion.div
            className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0"
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              boxShadow: "inset 0 0 20px rgba(251, 191, 36, 0.3)",
            }}
          />
        </motion.div>
      </div>

      {/* 标签 */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[10px] sm:text-sm md:text-base text-amber-200/70 font-light tracking-[0.15em] uppercase"
        style={{
          textShadow: "0 2px 10px rgba(251, 191, 36, 0.2)",
        }}
      >
        {label}
      </motion.span>
    </div>
  );
};

export default PremiumDigitCard;
