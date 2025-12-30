<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎆 新年倒计时 2026 - Lunar New Year Countdown

一个精美的新年倒计时网页应用，包含烟花效果、古诗词祝福语、背景音乐和语音朗读。

## ✨ 功能特性

- 🎯 **智能倒计时** - 根据当前时间自动显示大倒计时或3秒倒计时
- 🎆 **烟花特效** - 精美的烟花动画效果，支持多种爆炸类型
- 📜 **古诗词祝福** - 16条精选古诗词和新年祝福语
- 🎨 **多样式字体** - 草书、狂草、行书、行楷轮换显示
- 🎬 **丰富动画** - 8种不同的入场/退场动画效果
- 🎵 **背景音乐** - 支持循环播放背景音乐
- 🔊 **语音朗读** - 使用 TTS 自动朗读祝福语
- 💥 **烟花音效** - 烟花爆炸时播放音效
- 🎮 **进度控制** - 可播放/暂停、跳转、显示/隐藏（双击屏幕）

## 🚀 快速开始

### 本地运行

**前置要求:** Node.js 和 pnpm

1. 安装依赖:
   ```bash
   pnpm install
   ```

2. 运行开发服务器:
   ```bash
   pnpm run dev
   ```

3. 在浏览器打开 `http://localhost:3000`

### 构建部署

```bash
pnpm run build
```

构建产物在 `dist` 目录，可部署到任何静态网站托管服务。

## 🎵 添加音频文件

### 背景音乐

1. 下载新年主题音乐（推荐网站）：
   - [YouTube Audio Library](https://www.youtube.com/audiolibrary)
   - [Freesound](https://freesound.org/)
   - [Free Music Archive](https://freemusicarchive.org/)

2. 将音乐文件重命名为 `bgm.mp3`

3. 放置到 `public` 目录（如果没有则创建）

4. 在 `components/AudioPlayer.tsx` 中取消注释：
   ```typescript
   bgm.src = "/2026/bgm.mp3";
   ```

### 烟花音效

1. 下载烟花音效（推荐网站）：
   - [Freesound - Firework](https://freesound.org/search/?q=firework)
   - [Zapsplat - Fireworks](https://www.zapsplat.com/sound-effect-category/fireworks/)

2. 下载 4-5 个不同的烟花音效，重命名为：
   - `firework1.mp3`
   - `firework2.mp3`
   - `firework3.mp3`
   - `firework4.mp3`

3. 在 `public` 目录创建 `sounds` 文件夹

4. 将音效文件放入 `public/sounds/`

5. 在 `components/AudioPlayer.tsx` 中取消注释并更新路径：
   ```typescript
   const fireworkUrls = [
     "/2026/sounds/firework1.mp3",
     "/2026/sounds/firework2.mp3",
     "/2026/sounds/firework3.mp3",
     "/2026/sounds/firework4.mp3",
   ];
   ```

## 🎮 使用说明

- **隐藏入口** - 在大倒计时页面，点击"新"字可直接跳转到主页面（用于预览）
- **显示控制** - 双击屏幕显示/隐藏进度控制栏
- **播放控制** - 使用底部控制栏播放、暂停、跳转
- **音量控制** - 点击音量图标静音/取消静音

## 🛠️ 技术栈

- **React 18** + **TypeScript**
- **Vite** - 构建工具
- **Framer Motion** - 动画库
- **Tailwind CSS** - 样式框架
- **Canvas API** - 烟花特效
- **Web Speech API** - 语音合成

## 📦 项目结构

```
newyear2026/
├── components/          # React 组件
│   ├── AudioPlayer.tsx  # 音频播放器
│   ├── BigCountdown.tsx # 大倒计时
│   ├── Countdown.tsx    # 3秒倒计时
│   ├── Fireworks.tsx    # 烟花效果
│   └── GreetingOverlay.tsx # 祝福语叠加层
├── constants.ts         # 祝福语配置
├── types.ts            # TypeScript 类型定义
├── App.tsx             # 主应用组件
└── index.tsx           # 入口文件
```

## 🎨 自定义祝福语

在 `constants.ts` 中修改 `GREETINGS` 数组：

```typescript
{
  id: 1,
  text: "爆竹声中一岁除",      // 主文本（会被朗读）
  subText: "《元日》王安石",    // 副标题
  artist: "苏唱",               // 角色名
  color: "#FF6B6B",            // 文字颜色
  glowColor: "rgba(255, 107, 107, 0.6)", // 发光颜色
  fontStyle: "brush",          // 字体：brush/cao/xing/kai
  animation: "fadeUp",         // 动画：fadeUp/fadeDown/scaleIn等
}
```

## 📄 License

MIT License

## 🙏 致谢

- 字体来自 Google Fonts
- 动画效果由 Framer Motion 提供
