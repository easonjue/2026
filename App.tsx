import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "./components/Fireworks";
import GreetingOverlay from "./components/GreetingOverlay";
import Countdown from "./components/Countdown";
import { GREETINGS } from "./constants";

type AppState = "COUNTDOWN" | "SPLASH" | "MAIN";

const GREETING_DURATION = 4000; // 4 seconds per greeting

const App: React.FC = () => {
  const [state, setState] = useState<AppState>("COUNTDOWN");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);

  const totalTime = GREETINGS.length * GREETING_DURATION;

  // Calculate current greeting based on time
  const currentIndex = Math.min(
    Math.floor((elapsedTime % totalTime) / GREETING_DURATION),
    GREETINGS.length - 1,
  );

  // Playback timer effect
  useEffect(() => {
    if (state !== "MAIN") return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 50); // High frequency update for smooth progress bar

    return () => clearInterval(timer);
  }, [state]);

  // Handle animation variant changes when greeting changes
  useEffect(() => {
    setVariantIndex(Math.floor(Math.random() * 4));
  }, [currentIndex]);

  const handleCountdownComplete = () => {
    setState("SPLASH");
    setTimeout(() => setState("MAIN"), 2500);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = ((elapsedTime % totalTime) / totalTime) * 100;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0f0515] to-[#000000] z-[-1]"></div>

      <AnimatePresence mode="wait">
        {state === "COUNTDOWN" && (
          <Countdown key="countdown" onComplete={handleCountdownComplete} />
        )}

        {state === "SPLASH" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="font-brush text-8xl md:text-[12rem] text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.6)]">
                万事如意
              </h1>
              <p className="mt-8 font-serif-sc text-yellow-500/80 text-xl md:text-2xl tracking-[1.5em] md:tracking-[2em] uppercase">
                Happy New Year
              </p>
            </motion.div>
          </motion.div>
        )}

        {state === "MAIN" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Fireworks />
            <GreetingOverlay
              current={GREETINGS[currentIndex]}
              variantIndex={variantIndex}
            />

            {/* Artistic Vignette */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)] z-20" />

            {/* Synchronized Progress Indicator */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
              <div className="flex gap-4 items-center px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors group">
                  <svg
                    className="w-4 h-4 text-white/80 group-hover:text-white fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="h-[2px] w-48 bg-white/10 rounded-full overflow-hidden relative">
                  {/* Background track */}
                  <div className="absolute inset-0 bg-white/5" />
                  {/* Active progress */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 relative z-10"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-white/60 font-mono tracking-tighter min-w-[70px]">
                  {formatTime(elapsedTime % totalTime)} /{" "}
                  {formatTime(totalTime)}
                </span>
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] animate-pulse">
                Now Playing: 新年祝福语集
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
