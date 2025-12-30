import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fireworks from "./components/Fireworks";
import GreetingOverlay from "./components/GreetingOverlay";
import Countdown from "./components/Countdown";
import BigCountdown from "./components/BigCountdown";
import AudioPlayer, { AudioPlayerRef } from "./components/AudioPlayer";
import { GREETINGS } from "./constants";

// 将 GREETINGS 暴露给全局，供 AudioPlayer 使用
if (typeof window !== "undefined") {
  window.GREETINGS = GREETINGS;
}

// 2026年1月1日 00:00:00
const NEW_YEAR_2026 = new Date("2026-01-01T00:00:00");

type AppState = "BIG_COUNTDOWN" | "COUNTDOWN" | "SPLASH" | "MAIN";

const GREETING_DURATION = 4000; // 4 seconds per greeting

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const now = new Date();
    const diff = NEW_YEAR_2026.getTime() - now.getTime();

    if (diff <= 0) {
      return "SPLASH";
    } else if (diff <= 3000) {
      return "COUNTDOWN";
    } else {
      return "BIG_COUNTDOWN";
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 当前祝福语的进度 0-100
  const [showControls, setShowControls] = useState(false); // 控制进度条显示/隐藏
  const [isMuted, setIsMuted] = useState(false); // 音量控制
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<AudioPlayerRef | null>(null);
  const hideControlsTimerRef = useRef<number | null>(null);

  const totalTime = GREETINGS.length * GREETING_DURATION;

  // 播放计时器
  useEffect(() => {
    if (state !== "MAIN" || !isPlaying) return;

    const startTime = Date.now() - (progress / 100) * GREETING_DURATION;

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / GREETING_DURATION) * 100;

      if (newProgress >= 100) {
        // 切换到下一个祝福语
        setCurrentIndex((prev) => (prev + 1) % GREETINGS.length);
        setProgress(0);
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state, isPlaying, currentIndex]);

  // 大倒计时结束，进入最后3秒倒计时
  const handleLastThreeSeconds = () => {
    setState("COUNTDOWN");
  };

  // 跳过直接进入主页面（测试用）
  const handleSkip = () => {
    setState("SPLASH");
    setTimeout(() => setState("MAIN"), 2500);
  };

  // 3-2-1倒计时结束
  const handleCountdownComplete = () => {
    setState("SPLASH");
    setTimeout(() => setState("MAIN"), 2500);
  };

  // 播放/暂停切换
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // 点击进度条跳转到对应祝福语
  const handleProgressClick = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    // 通知音频播放器跳转
    if (audioPlayerRef.current) {
      audioPlayerRef.current.seekTo(index);
    }
  };

  // 上一个
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GREETINGS.length) % GREETINGS.length);
    setProgress(0);
  };

  // 下一个
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GREETINGS.length);
    setProgress(0);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // 计算总进度
  const totalProgress =
    ((currentIndex * GREETING_DURATION + (progress / 100) * GREETING_DURATION) /
      totalTime) *
    100;

  // 计算当前播放时间
  const currentTime =
    currentIndex * GREETING_DURATION + (progress / 100) * GREETING_DURATION;

  // 双击/双触摸切换进度条显示/隐藏
  const lastTapRef = useRef<number>(0);

  // 显示控制栏并启动自动隐藏计时器
  const showControlsWithTimer = () => {
    setShowControls(true);

    // 清除之前的计时器
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }

    // 2秒后自动隐藏
    hideControlsTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handleDoubleClick = () => {
    if (showControls) {
      // 如果已显示，立即隐藏
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
      setShowControls(false);
    } else {
      // 如果未显示，显示并启动计时器
      showControlsWithTimer();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;

    // 双击检测（300ms内两次触摸）
    if (tapLength < 300 && tapLength > 0) {
      if (showControls) {
        // 如果已显示，立即隐藏
        if (hideControlsTimerRef.current) {
          clearTimeout(hideControlsTimerRef.current);
        }
        setShowControls(false);
      } else {
        // 如果未显示，显示并启动计时器
        showControlsWithTimer();
      }
      e.preventDefault();
    }

    lastTapRef.current = currentTime;
  };

  // 当用户与控制栏交互时，重置自动隐藏计时器
  const resetHideTimer = () => {
    if (showControls) {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
      hideControlsTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  // 清理计时器
  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, []);

  // 切换静音
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0f0515] to-[#000000] z-[-1]"></div>

      <AnimatePresence mode="wait">
        {state === "BIG_COUNTDOWN" && (
          <BigCountdown
            key="big-countdown"
            targetDate={NEW_YEAR_2026}
            onLastThreeSeconds={handleLastThreeSeconds}
            onSkip={handleSkip}
          />
        )}

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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center"
            >
              {/* 移动端竖排，桌面端横排 */}
              <h1 className="font-brush text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.6)]">
                <span className="hidden md:inline text-[12rem]">万事如意</span>
                <span className="md:hidden flex flex-col items-center gap-3 text-7xl">
                  <span>万</span>
                  <span>事</span>
                  <span>如</span>
                  <span>意</span>
                </span>
              </h1>
              <p className="mt-8 font-serif-sc text-yellow-500/80 text-base md:text-2xl tracking-[0.8em] md:tracking-[2em] uppercase">
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
            onDoubleClick={handleDoubleClick}
            onTouchEnd={handleTouchEnd}
            className="cursor-default"
          >
            <Fireworks
              onFireworkExplode={() => {
                if (audioPlayerRef.current) {
                  audioPlayerRef.current.playFireworkSound();
                }
              }}
            />
            <GreetingOverlay current={GREETINGS[currentIndex]} />

            {/* 音频播放器 */}
            <AudioPlayer
              ref={audioPlayerRef}
              isMuted={isMuted}
              isPlaying={isPlaying}
              currentIndex={currentIndex}
            />

            {/* Artistic Vignette */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.6)_100%)] z-20" />

            {/* Progress Indicator */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 md:gap-3 px-2"
                >
                  <div
                    className="flex flex-wrap gap-2 md:gap-3 items-center justify-center px-3 md:px-5 py-2 md:py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl max-w-[95vw]"
                    onClick={resetHideTimer}
                    onTouchStart={resetHideTimer}
                  >
                    {/* 上一个按钮 */}
                    <button
                      onClick={() => {
                        handlePrev();
                        resetHideTimer();
                      }}
                      className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors touch-none"
                    >
                      <svg
                        className="w-4 h-4 text-white/70 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                      </svg>
                    </button>

                    {/* 播放/暂停按钮 */}
                    <button
                      onClick={() => {
                        togglePlay();
                        resetHideTimer();
                      }}
                      className="w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors touch-none"
                    >
                      {isPlaying ? (
                        <svg
                          className="w-5 h-5 text-white/80 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-white/80 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* 下一个按钮 */}
                    <button
                      onClick={() => {
                        handleNext();
                        resetHideTimer();
                      }}
                      className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors touch-none"
                    >
                      <svg
                        className="w-4 h-4 text-white/70 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                      </svg>
                    </button>

                    {/* 分隔线 */}
                    <div className="hidden md:block w-px h-6 bg-white/20" />

                    {/* 祝福语进度指示器 */}
                    <div className="flex gap-1 md:gap-1.5 items-center flex-wrap justify-center max-w-[200px] md:max-w-none">
                      {GREETINGS.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleProgressClick(index);
                            resetHideTimer();
                          }}
                          className="relative group w-6 h-6 md:w-4 md:h-4 flex items-center justify-center touch-none"
                        >
                          <div
                            className={`w-2.5 h-2.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                              index === currentIndex
                                ? "bg-red-500 scale-125"
                                : index < currentIndex
                                  ? "bg-yellow-500/80"
                                  : "bg-white/30 hover:bg-white/50 active:bg-white/70"
                            }`}
                          />
                          {/* 当前播放的进度环 */}
                          {index === currentIndex && (
                            <svg
                              className="absolute inset-0 w-full h-full -rotate-90"
                              viewBox="0 0 16 16"
                            >
                              <circle
                                cx="8"
                                cy="8"
                                r="6"
                                fill="none"
                                stroke="rgba(239, 68, 68, 0.3)"
                                strokeWidth="2"
                              />
                              <circle
                                cx="8"
                                cy="8"
                                r="6"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2"
                                strokeDasharray={`${(progress / 100) * 37.7} 37.7`}
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                          {/* 悬停提示 */}
                          <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 rounded text-[10px] text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {GREETINGS[index].artist}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* 分隔线 */}
                    <div className="hidden md:block w-px h-6 bg-white/20" />

                    {/* 时间和序号 */}
                    <div className="flex flex-col items-end text-right">
                      <span className="text-[10px] md:text-xs text-white/60 font-mono">
                        {formatTime(currentTime)} / {formatTime(totalTime)}
                      </span>
                      <span className="text-[9px] md:text-[10px] text-white/40">
                        {currentIndex + 1} / {GREETINGS.length}
                      </span>
                    </div>

                    {/* 分隔线 */}
                    <div className="hidden md:block w-px h-6 bg-white/20" />

                    {/* 音量按钮 */}
                    <button
                      onClick={() => {
                        toggleMute();
                        resetHideTimer();
                      }}
                      className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors touch-none"
                      title={isMuted ? "开启声音" : "静音"}
                    >
                      {isMuted ? (
                        <svg
                          className="w-4 h-4 text-white/70 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-white/70 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* 当前祝福语信息 */}
                  <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] text-center">
                    {isPlaying ? (
                      <span className="animate-pulse">
                        ♪ {GREETINGS[currentIndex].subText} -{" "}
                        {GREETINGS[currentIndex].artist}
                      </span>
                    ) : (
                      <span>已暂停</span>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 双击提示（仅在进度条隐藏时显示） */}
            {!showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/30 text-[10px] md:text-xs tracking-widest text-center px-4"
              >
                双击屏幕显示控制
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
