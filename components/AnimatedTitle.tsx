import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTitleProps {
  onSkip?: () => void;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ onSkip }) => {
  const [leftText, setLeftText] = useState("2025年");
  const [leftDisplayText, setLeftDisplayText] = useState("");
  const [rightDisplayText, setRightDisplayText] = useState("");
  const [showTransition, setShowTransition] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const rightText = "你好";

  useEffect(() => {
    // 阶段1: 左侧打字效果 "2025年" (0-1.2s)
    const leftTypingInterval = setInterval(() => {
      setLeftDisplayText((prev) => {
        if (prev.length < leftText.length) {
          return leftText.slice(0, prev.length + 1);
        }
        clearInterval(leftTypingInterval);
        return prev;
      });
    }, 200); // 每个字200ms

    // 阶段2: 右侧打字效果 "你好" (1.5-2.1s)
    const rightTypingTimeout = setTimeout(() => {
      const rightTypingInterval = setInterval(() => {
        setRightDisplayText((prev) => {
          if (prev.length < rightText.length) {
            return rightText.slice(0, prev.length + 1);
          }
          clearInterval(rightTypingInterval);
          return prev;
        });
      }, 300); // 每个字300ms
    }, 1500);

    // 阶段3: 年份变化 2025→2026 (2.5s)
    const transitionTimeout = setTimeout(() => {
      setShowTransition(true);
      // 先隐藏旧文字
      setTimeout(() => {
        setLeftText("2026年");
        setLeftDisplayText("");
        // 重新打字显示新年份
        let index = 0;
        const newYearInterval = setInterval(() => {
          if (index < "2026年".length) {
            setLeftDisplayText("2026年".slice(0, index + 1));
            index++;
          } else {
            clearInterval(newYearInterval);
            setShowTransition(false);
            setAnimationComplete(true);
          }
        }, 150);
      }, 300);
    }, 2500);

    return () => {
      clearInterval(leftTypingInterval);
      clearTimeout(rightTypingTimeout);
      clearTimeout(transitionTimeout);
    };
  }, []);

  return (
    <div className="relative mb-6 sm:mb-12 text-center px-4 overflow-hidden">
      <div className="relative flex items-center justify-center gap-2 sm:gap-4 min-h-[60px] sm:min-h-[80px]">
        {/* 左侧文字 - 2025年 → 2026年 */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8,
          }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={leftText}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.5 }}
              className="font-brush text-3xl sm:text-5xl inline-block cursor-default"
              onClick={onSkip}
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #fbbf24 50%, #ef4444 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 20px rgba(251, 191, 36, 0.3))",
              }}
            >
              {leftDisplayText.split("").map((char, index) => (
                <motion.span
                  key={`${leftText}-${index}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>

          {/* 光标闪烁效果 - 只在打字时显示 */}
          {!animationComplete && leftDisplayText.length < leftText.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-8 sm:h-12 bg-amber-400 ml-1"
              style={{
                boxShadow: "0 0 10px rgba(251, 191, 36, 0.8)",
              }}
            />
          )}

          {/* 年份变化时的光效 */}
          {showTransition && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: [0, 1, 0] }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
          )}
        </motion.div>

        {/* 右侧文字 - 你好 */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8,
            delay: 1.5,
          }}
          className="relative"
        >
          <motion.h1
            className="font-brush text-3xl sm:text-5xl inline-block"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #fbbf24 50%, #ef4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 4px 20px rgba(251, 191, 36, 0.3))",
            }}
          >
            {rightDisplayText.split("").map((char, index) => (
              <motion.span
                key={`right-${index}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.5 + index * 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* 光标闪烁效果 */}
          {rightDisplayText.length > 0 &&
            rightDisplayText.length < rightText.length && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-8 sm:h-12 bg-amber-400 ml-1"
                style={{
                  boxShadow: "0 0 10px rgba(251, 191, 36, 0.8)",
                }}
              />
            )}
        </motion.div>
      </div>

      {/* 副标题 - 延迟出现 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.8 }}
        className="text-[10px] sm:text-xs text-amber-200/50 tracking-[0.2em] sm:tracking-[0.3em] uppercase font-light mt-2"
      >
        Countdown to 2026
      </motion.p>

      {/* 背景装饰 - 开幕帷幕效果 */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5) 50%, transparent)",
          transformOrigin: "center",
        }}
      />

      {/* 左侧帷幕 */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-0 left-0 w-1/2 h-full z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
        }}
      />

      {/* 右侧帷幕 */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-0 right-0 w-1/2 h-full z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      />

      {/* 粒子爆发效果 - 年份变化时 */}
      {showTransition && (
        <>
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12;
            const distance = 100;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;

            return (
              <motion.div
                key={`particle-${i}`}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, x],
                  y: [0, y],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, #fbbf24 0%, #ef4444 100%)",
                  boxShadow: "0 0 10px rgba(251, 191, 36, 0.8)",
                }}
              />
            );
          })}
        </>
      )}

      {/* 完成后的微妙光效 */}
      {animationComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      )}
    </div>
  );
};

export default AnimatedTitle;
