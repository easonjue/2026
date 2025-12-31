import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { fixIOSAudio } from "../utils/iosCompatibility";

interface CountdownAudioProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume?: number;
}

export interface CountdownAudioRef {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

const CountdownAudio = forwardRef<CountdownAudioRef, CountdownAudioProps>(
  ({ isPlaying, isMuted, volume = 0.3 }, ref) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isInitializedRef = useRef(false);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      play: async () => {
        if (audioRef.current && !isMuted) {
          try {
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
          } catch (error) {
            console.log("Countdown audio play failed:", error);
          }
        }
      },
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      },
      stop: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      },
      setVolume: (newVolume: number) => {
        if (audioRef.current) {
          audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
        }
      },
    }));

    // 初始化音频
    useEffect(() => {
      const audio = new Audio();
      audio.src = "assets/sounds/frist.mp3"; // 使用实际存在的文件名
      audio.loop = true;
      audio.volume = volume;
      
      // iOS Safari 兼容性修复
      fixIOSAudio(audio);
      
      // 添加事件监听器
      audio.addEventListener('loadeddata', () => {
        console.log('Countdown audio loaded');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Countdown audio error:', e);
      });
      
      audio.addEventListener('canplaythrough', () => {
        console.log('Countdown audio can play through');
      });

      audioRef.current = audio;
      isInitializedRef.current = true;

      return () => {
        audio.pause();
        audio.src = '';
      };
    }, [volume]);

    // 控制播放/暂停
    useEffect(() => {
      if (!audioRef.current || !isInitializedRef.current) return;

      const audio = audioRef.current;

      if (isPlaying && !isMuted) {
        // 尝试播放
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Countdown audio autoplay blocked:", error);
            // 自动播放被阻止，等待用户交互
          });
        }
      } else {
        audio.pause();
      }
    }, [isPlaying, isMuted]);

    // 控制音量
    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
      }
    }, [isMuted, volume]);

    // 用户交互后尝试播放
    useEffect(() => {
      const handleUserInteraction = () => {
        if (audioRef.current && isPlaying && !isMuted) {
          audioRef.current.play().catch(() => {});
        }
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };

      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });

      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }, [isPlaying, isMuted]);

    return null; // 这个组件不渲染任何UI
  }
);

CountdownAudio.displayName = "CountdownAudio";

export default CountdownAudio;