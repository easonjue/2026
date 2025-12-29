
import React, { useEffect, useRef, useCallback } from 'react';
import { FireworkParticle } from '../types';
import { COLORS } from '../constants';

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<(FireworkParticle & { flicker?: boolean; type?: string })[]>([]);

  const createFirework = useCallback((x: number, y: number) => {
    const types = ['burst', 'ring', 'glitter'];
    const type = types[Math.floor(Math.random() * types.length)];
    const particleCount = type === 'ring' ? 80 : 100 + Math.floor(Math.random() * 50);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const isGlitter = type === 'glitter';
    
    for (let i = 0; i < particleCount; i++) {
      let vx = 0;
      let vy = 0;
      let speed = 0;

      if (type === 'ring') {
        const angle = (i / particleCount) * Math.PI * 2;
        speed = 4 + Math.random() * 2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        const angle = Math.random() * Math.PI * 2;
        speed = 1 + Math.random() * (isGlitter ? 8 : 6);
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      particles.current.push({
        x,
        y,
        vx,
        vy,
        alpha: 1,
        color,
        decay: (isGlitter ? 0.005 : 0.01) + Math.random() * 0.02,
        size: (isGlitter ? 0.5 : 1) + Math.random() * 2,
        flicker: isGlitter,
        type
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const update = () => {
      // Darker clear for better trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.type === 'glitter' ? 0.02 : 0.06; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        // Glitter flickering effect
        if (p.flicker && Math.random() > 0.5) {
          ctx.globalAlpha = 0.2;
        } else {
          ctx.globalAlpha = p.alpha;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Dynamic glow based on type
        if (p.type !== 'glitter' || Math.random() > 0.8) {
           ctx.shadowBlur = p.type === 'ring' ? 15 : 8;
           ctx.shadowColor = p.color;
        }
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Spawn frequency and variety
      if (Math.random() < 0.06) {
        createFirework(
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.6
        );
      }

      animationFrameId = requestAnimationFrame(update);
    };

    window.addEventListener('resize', resize);
    resize();
    update();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [createFirework]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

export default Fireworks;
