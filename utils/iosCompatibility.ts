// iOS Safari 兼容性工具函数

/**
 * 检测是否为iOS设备
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * 检测是否为iOS Safari浏览器
 */
export const isIOSSafari = (): boolean => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
  return isIOS && isSafari;
};

/**
 * 获取iOS版本
 */
export const getIOSVersion = (): number | null => {
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

/**
 * 检测是否支持语音合成
 */
export const supportsSpeechSynthesis = (): boolean => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

/**
 * 检测是否支持Web Audio API
 */
export const supportsWebAudio = (): boolean => {
  return 'AudioContext' in window || 'webkitAudioContext' in window;
};

/**
 * iOS Safari 音频播放修复
 */
export const fixIOSAudio = (audio: HTMLAudioElement): void => {
  if (isIOSSafari()) {
    // 设置iOS Safari特定属性
    audio.playsInline = true;
    audio.preload = 'metadata';
    
    // 添加iOS Safari特定的事件监听
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio can play through on iOS Safari');
    });
    
    audio.addEventListener('error', (e) => {
      console.error('iOS Safari audio error:', e);
    });
  }
};

/**
 * iOS Safari 语音合成修复
 */
export const fixIOSSpeechSynthesis = (): void => {
  if (isIOSSafari() && supportsSpeechSynthesis()) {
    // iOS Safari 需要在用户交互后初始化语音
    const initSpeech = () => {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      speechSynthesis.speak(utterance);
      
      document.removeEventListener('touchstart', initSpeech);
      document.removeEventListener('click', initSpeech);
    };
    
    document.addEventListener('touchstart', initSpeech, { once: true });
    document.addEventListener('click', initSpeech, { once: true });
  }
};

/**
 * iOS Safari Canvas 性能优化
 */
export const optimizeCanvasForIOS = (canvas: HTMLCanvasElement): void => {
  if (isIOSSafari()) {
    // 启用硬件加速
    canvas.style.transform = 'translateZ(0)';
    canvas.style.backfaceVisibility = 'hidden';
    
    // 设置合适的像素比
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      
      ctx.scale(devicePixelRatio, devicePixelRatio);
      
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }
  }
};

/**
 * 防止iOS Safari页面滚动
 */
export const preventIOSScroll = (): void => {
  if (isIOS()) {
    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // 防止双指缩放
      }
    }, { passive: false });
  }
};

/**
 * iOS Safari 兼容性初始化
 */
export const initIOSCompatibility = (): void => {
  if (isIOSSafari()) {
    console.log('Initializing iOS Safari compatibility fixes...');
    
    // 修复语音合成
    fixIOSSpeechSynthesis();
    
    // 防止页面滚动
    preventIOSScroll();
    
    // 设置视口元标签（如果不存在）
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    
    console.log('iOS Safari compatibility fixes applied');
  }
};

/**
 * 获取iOS Safari兼容性信息
 */
export const getIOSCompatibilityInfo = () => {
  return {
    isIOS: isIOS(),
    isIOSSafari: isIOSSafari(),
    iosVersion: getIOSVersion(),
    supportsSpeechSynthesis: supportsSpeechSynthesis(),
    supportsWebAudio: supportsWebAudio(),
    devicePixelRatio: window.devicePixelRatio || 1,
    screenSize: {
      width: window.screen.width,
      height: window.screen.height,
    },
    viewportSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
};