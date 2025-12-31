import React from "react";
import { motion } from "framer-motion";

const NeonLights: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 主背景渐变 - 深邃优雅 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />

      {/* 顶部柔和光晕 - 金色调 */}
      <motion.div
        className="absolute -top-1/4 left-1/4 w-[800px] h-[800px] rounded-full"
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.2) 30%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* 右侧光晕 - 红色调 */}
      <motion.div
        className="absolute top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full"
        animate={{
          opacity: [0.12, 0.22, 0.12],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(239, 68, 68, 0.15) 30%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* 底部中心光效 */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
        animate={{
          opacity: [0.1, 0.18, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          background:
            "radial-gradient(ellipse, rgba(234, 179, 8, 0.3) 0%, rgba(234, 179, 8, 0.1) 40%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* 精致的网格背景 - 增加科技感 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* 微妙的光束扫过效果 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.03) 50%, transparent 100%)",
            "linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.03) 50%, transparent 100%)",
            "linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.03) 50%, transparent 100%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* 稀疏的粒子效果 - 更加优雅 */}
      {[...Array(8)].map((_, i) => {
        const randomX = 15 + Math.random() * 70;
        const randomY = 15 + Math.random() * 70;
        const randomDelay = Math.random() * 5;
        const randomDuration = 4 + Math.random() * 3;

        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              width: i % 2 === 0 ? "3px" : "2px",
              height: i % 2 === 0 ? "3px" : "2px",
              background:
                i % 3 === 0
                  ? "rgba(251, 191, 36, 0.6)"
                  : i % 3 === 1
                    ? "rgba(239, 68, 68, 0.5)"
                    : "rgba(255, 255, 255, 0.4)",
              boxShadow:
                i % 3 === 0
                  ? "0 0 10px rgba(251, 191, 36, 0.8)"
                  : i % 3 === 1
                    ? "0 0 10px rgba(239, 68, 68, 0.6)"
                    : "0 0 8px rgba(255, 255, 255, 0.5)",
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* 中央聚焦光效 - 突出倒计时区域 */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px]"
        animate={{
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(ellipse, rgba(255, 255, 255, 0.1) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />

      {/* 顶部装饰性光带 */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3) 50%, transparent)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 底部装饰性光带 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.3) 50%, transparent)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default NeonLights;
