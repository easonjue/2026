import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import NeonLights from "./NeonLights";
import PremiumTimeUnit from "./PremiumTimeUnit";
import PremiumSeparator from "./PremiumSeparator";
import AnimatedTitle from "./AnimatedTitle";

interface BigCountdownProps {
  targetDate: Date;
  onLastThreeSeconds: () => void;
  onSkip?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = targetDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
};

const BigCountdown: React.FC<BigCountdownProps> = ({
  targetDate,
  onLastThreeSeconds,
  onSkip,
}) => {
  const { isMobile, isTablet } = useMediaQuery();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(targetDate),
  );
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);

      // 当剩余时间小于等于3秒时，触发最后3秒倒计时
      if (newTimeLeft.total <= 3000 && newTimeLeft.total > 0 && !hasTriggered) {
        setHasTriggered(true);
        clearInterval(timer);
        onLastThreeSeconds();
      }

      // 时间到了
      if (newTimeLeft.total <= 0) {
        clearInterval(timer);
        if (!hasTriggered) {
          setHasTriggered(true);
          onLastThreeSeconds();
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [targetDate, onLastThreeSeconds, hasTriggered]);

  // 移动端专用设计
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden px-4"
      >
        {/* 霓虹灯背景效果 */}
        <NeonLights />

        {/* 背景渐变叠加 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

        {/* 标题 - 使用动画标题组件 */}
        <AnimatedTitle onSkip={onSkip} />

        {/* 倒计时 - 移动端超大显示 */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative flex flex-col gap-4 sm:gap-6 items-center w-full max-w-sm px-2"
        >
          {/* 时:分:秒 - 横向排列 */}
          <div className="flex gap-1 sm:gap-2 items-center justify-center w-full">
            <PremiumTimeUnit value={timeLeft.hours} label="时" />
            <PremiumSeparator />
            <PremiumTimeUnit value={timeLeft.minutes} label="分" />
            <PremiumSeparator />
            <PremiumTimeUnit value={timeLeft.seconds} label="秒" />
          </div>
        </motion.div>

        {/* 底部文字 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 sm:bottom-10 text-center px-4"
        >
          <p className="text-xs sm:text-sm text-amber-100/30 tracking-[0.2em] sm:tracking-[0.3em] font-serif-sc mb-2 font-light">
            马年将至 · 万象更新
          </p>
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[10px] sm:text-xs text-amber-200/30 uppercase tracking-wider sm:tracking-widest font-light"
          >
            The Year of the Horse
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // 桌面端设计
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* 霓虹灯背景效果 */}
      <NeonLights />

      {/* 背景渐变叠加 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* 粒子装饰 */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-500/50 rounded-full"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 标题 - 使用动画标题组件 */}
      <AnimatedTitle onSkip={onSkip} />

      {/* 倒计时主体 */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 px-2 sm:px-4"
      >
        <PremiumTimeUnit value={timeLeft.hours} label="时" />
        <PremiumSeparator />
        <PremiumTimeUnit value={timeLeft.minutes} label="分" />
        <PremiumSeparator />
        <PremiumTimeUnit value={timeLeft.seconds} label="秒" />
      </motion.div>

      {/* 底部装饰文字 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 sm:bottom-8 md:bottom-12 text-center px-4"
      >
        <p className="text-[10px] sm:text-xs md:text-sm text-amber-100/25 tracking-[0.2em] sm:tracking-[0.3em] font-serif-sc font-light">
          马年将至 · 万象更新
        </p>
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-2 sm:mt-4 text-[9px] sm:text-[10px] text-amber-200/25 uppercase tracking-wider sm:tracking-widest font-light"
        >
          The Year of the Horse
        </motion.div>
      </motion.div>

      {/* 四角装饰 - 优雅的边框 */}
      <motion.div
        className="absolute top-2 sm:top-4 left-2 sm:left-4 w-8 h-8 sm:w-16 sm:h-16 border-l border-t"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          borderColor: [
            "rgba(251, 191, 36, 0.3)",
            "rgba(239, 68, 68, 0.3)",
            "rgba(251, 191, 36, 0.3)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-16 sm:h-16 border-r border-t"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          borderColor: [
            "rgba(239, 68, 68, 0.3)",
            "rgba(251, 191, 36, 0.3)",
            "rgba(239, 68, 68, 0.3)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
      <motion.div
        className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-8 h-8 sm:w-16 sm:h-16 border-l border-b"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          borderColor: [
            "rgba(251, 191, 36, 0.3)",
            "rgba(239, 68, 68, 0.3)",
            "rgba(251, 191, 36, 0.3)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
      <motion.div
        className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-8 h-8 sm:w-16 sm:h-16 border-r border-b"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          borderColor: [
            "rgba(239, 68, 68, 0.3)",
            "rgba(251, 191, 36, 0.3)",
            "rgba(239, 68, 68, 0.3)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4.5,
        }}
      />
    </motion.div>
  );
};

export default BigCountdown;
