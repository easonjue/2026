import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

interface AudioPlayerProps {
  isMuted: boolean;
  isPlaying: boolean;
  currentIndex: number;
}

export interface AudioPlayerRef {
  seekTo: (index: number) => void;
  playFireworkSound: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ isMuted, isPlaying, currentIndex }, ref) => {
    const bgmRef = useRef<HTMLAudioElement | null>(null);
    const fireworkSoundsRef = useRef<HTMLAudioElement[]>([]);
    const lastIndexRef = useRef<number>(-1);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      seekTo: (index: number) => {
        lastIndexRef.current = -1; // 重置索引
      },
      playFireworkSound: () => {
        if (isMuted) return;

        // 随机选择一个烟花音效播放
        const randomIndex = Math.floor(
          Math.random() * fireworkSoundsRef.current.length,
        );
        const sound = fireworkSoundsRef.current[randomIndex];

        if (sound) {
          sound.currentTime = 0;
          sound.volume = 0.4;
          sound.play().catch(() => {});
        }
      },
    }));

    // 初始化音频资源
    useEffect(() => {
      // 背景音乐 - 使用 sec.mp3
      const bgm = new Audio();
      bgm.src = "assets/sounds/sec.mp3";
      bgm.loop = true;
      bgm.volume = 0.25;
      
      // iOS Safari 兼容性修复
      bgm.preload = "metadata"; // 减少预加载，避免iOS限制
      bgm.playsInline = true; // 防止iOS全屏播放
      
      bgmRef.current = bgm;

      // 预加载烟花音效
      const fireworkUrls = [
        "assets/sounds/firework-display-16679.mp3",
      ];

      // 如果有音效文件，加载它们
      if (fireworkUrls.length > 0) {
        fireworkSoundsRef.current = fireworkUrls.map((url) => {
          const audio = new Audio(url);
          audio.preload = "metadata"; // iOS Safari 兼容性
          audio.playsInline = true; // 防止iOS全屏播放
          return audio;
        });
      }

      // 尝试自动播放背景音乐（需要用户交互）
      const playBGM = () => {
        if (bgm.src && !isMuted) {
          // iOS Safari 兼容性：添加更多错误处理
          bgm.play().catch((error) => {
            console.log("Background music autoplay blocked:", error);
            // 自动播放被阻止，等待用户交互
          });
        }
      };

      // 监听用户的首次点击 - iOS Safari 需要用户手势
      const handleFirstInteraction = () => {
        playBGM();
        // iOS Safari 可能需要多次尝试
        setTimeout(() => {
          if (bgm.paused && bgm.src && !isMuted) {
            bgm.play().catch(() => {});
          }
        }, 100);
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
      };
      
      document.addEventListener("click", handleFirstInteraction);
      document.addEventListener("touchstart", handleFirstInteraction); // iOS 触摸事件

      return () => {
        bgm.pause();
        fireworkSoundsRef.current.forEach((sound) => sound.pause());
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
      };
    }, []);

    // 控制背景音乐播放/暂停
    useEffect(() => {
      const bgm = bgmRef.current;
      if (!bgm || !bgm.src) return;

      if (isMuted || !isPlaying) {
        bgm.pause();
      } else {
        bgm.play().catch(() => {});
      }
    }, [isMuted, isPlaying]);

    return null;
  },
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
