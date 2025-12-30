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
  onGreetingChange?: (index: number) => void;
}

export interface AudioPlayerRef {
  seekTo: (index: number) => void;
  playFireworkSound: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ isMuted, isPlaying, currentIndex, onGreetingChange }, ref) => {
    const bgmRef = useRef<HTMLAudioElement | null>(null);
    const fireworkSoundsRef = useRef<HTMLAudioElement[]>([]);
    const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
    const lastSpokenIndexRef = useRef<number>(-1);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      seekTo: (index: number) => {
        lastSpokenIndexRef.current = -1; // 重置，允许重新朗读
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
      // 背景音乐
      const bgm = new Audio();
      bgm.loop = true;
      bgm.volume = 0.25;

      // 使用 freesound.org 或 YouTube Audio Library 的免费音乐
      // 这里使用一个占位符，你需要下载音乐文件放到 public 目录
      // bgm.src = "/2026/bgm.mp3";

      // 或者使用 Web Audio API 生成简单的背景音
      bgmRef.current = bgm;

      // 预加载多个烟花音效（使用不同频率模拟不同的烟花声音）
      const fireworkUrls = [
        "assets/sounds/firework-display-16679.mp3",
        // 你可以从这些免费音效网站下载：
        // https://freesound.org/search/?q=firework
        // https://www.zapsplat.com/sound-effect-category/fireworks/
        //
        // 暂时使用占位符，实际使用时替换成真实的音频文件路径
        // "/2026/sounds/firework1.mp3",
        // "/2026/sounds/firework2.mp3",
        // "/2026/sounds/firework3.mp3",
        // "/2026/sounds/firework4.mp3",
      ];

      // 如果有音效文件，加载它们
      if (fireworkUrls.length > 0) {
        fireworkSoundsRef.current = fireworkUrls.map((url) => {
          const audio = new Audio(url);
          audio.preload = "auto";
          return audio;
        });
      }

      // 加载语音列表
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }

      // 尝试自动播放背景音乐（需要用户交互）
      const playBGM = () => {
        if (bgm.src && !isMuted) {
          bgm.play().catch(() => {
            // 自动播放被阻止，等待用户交互
          });
        }
      };

      // 监听用户的首次点击
      const handleFirstInteraction = () => {
        playBGM();
        document.removeEventListener("click", handleFirstInteraction);
      };
      document.addEventListener("click", handleFirstInteraction);

      return () => {
        bgm.pause();
        window.speechSynthesis.cancel();
        fireworkSoundsRef.current.forEach((sound) => sound.pause());
        document.removeEventListener("click", handleFirstInteraction);
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

    // 当祝福语切换时，朗读新的祝福语
    useEffect(() => {
      if (isMuted || !isPlaying) {
        window.speechSynthesis.cancel();
        return;
      }

      // 避免重复朗读同一条
      if (lastSpokenIndexRef.current === currentIndex) {
        return;
      }

      lastSpokenIndexRef.current = currentIndex;

      // 停止之前的朗读
      window.speechSynthesis.cancel();

      // 延迟一点开始朗读，让动画先进入
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance();

        // 只读主文本，不读副标题
        utterance.text = window.GREETINGS?.[currentIndex]?.text || "";

        // 设置语音参数
        utterance.lang = "zh-CN";
        utterance.rate = 0.85; // 语速慢一点，更有韵味
        utterance.pitch = 1.05; // 音调稍高
        utterance.volume = isMuted ? 0 : 0.9;

        // 优先选择中文女声
        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = voices.filter(
          (voice) =>
            (voice.lang === "zh-CN" || voice.lang.startsWith("zh")) &&
            (voice.name.includes("Female") ||
              voice.name.includes("女") ||
              voice.name.includes("Ting") ||
              voice.name.includes("Huihui")),
        );

        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
        } else {
          const chineseVoice = voices.find((voice) =>
            voice.lang.startsWith("zh"),
          );
          if (chineseVoice) {
            utterance.voice = chineseVoice;
          }
        }

        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }, 300);
    }, [currentIndex, isMuted, isPlaying]);

    // 暂停时停止朗读
    useEffect(() => {
      if (!isPlaying) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }
    }, [isPlaying]);

    return null;
  },
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;

// 扩展 Window 接口以支持 GREETINGS
declare global {
  interface Window {
    GREETINGS?: Array<{ text: string; subText: string; artist: string }>;
  }
}
