'use client';

import { useRef, useEffect, useCallback } from 'react';
import { GAME_CONFIG } from '@/lib/gameConfig';
import type { BarState } from '@/hooks/useGameLoop';
import type { Rating } from '@/lib/gameConfig';

interface GameCanvasProps {
  isActive: boolean;
  barState: BarState;
  lastRating: Rating | null;
}

export default function GameCanvas({ isActive, barState, lastRating }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ratingTimerRef = useRef<number>(0);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0F0F1E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw target zone
    const targetX = canvas.width / 2 - GAME_CONFIG.targetZone.width / 2;
    const targetY = 0;

    // Good zone
    ctx.fillStyle = GAME_CONFIG.targetZone.color + '40';
    ctx.fillRect(targetX, targetY, GAME_CONFIG.targetZone.width, canvas.height);

    // Great zone
    ctx.fillStyle = GAME_CONFIG.targetZone.color + '60';
    const greatZoneWidth = GAME_CONFIG.timing.greatThreshold * 2;
    ctx.fillRect(
      targetX + (GAME_CONFIG.targetZone.width - greatZoneWidth) / 2,
      targetY,
      greatZoneWidth,
      canvas.height
    );

    // Perfect zone
    ctx.fillStyle = GAME_CONFIG.targetZone.perfectColor;
    const perfectX = canvas.width / 2 - GAME_CONFIG.targetZone.perfectWidth / 2;
    ctx.fillRect(perfectX, targetY, GAME_CONFIG.targetZone.perfectWidth, canvas.height);

    // Draw borders
    ctx.strokeStyle = GAME_CONFIG.targetZone.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(targetX, targetY, GAME_CONFIG.targetZone.width, canvas.height);

    ctx.strokeStyle = GAME_CONFIG.targetZone.perfectColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(perfectX, targetY, GAME_CONFIG.targetZone.perfectWidth, canvas.height);

    // Draw bar
    if (isActive) {
      // Bar shadow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(
        barState.x + 2,
        barState.y + 2,
        GAME_CONFIG.bar.width,
        GAME_CONFIG.bar.height
      );

      // Bar
      ctx.fillStyle = GAME_CONFIG.bar.color;
      ctx.fillRect(barState.x, barState.y, GAME_CONFIG.bar.width, GAME_CONFIG.bar.height);

      // Bar glow
      const gradient = ctx.createRadialGradient(
        barState.x + GAME_CONFIG.bar.width / 2,
        barState.y + GAME_CONFIG.bar.height / 2,
        0,
        barState.x + GAME_CONFIG.bar.width / 2,
        barState.y + GAME_CONFIG.bar.height / 2,
        GAME_CONFIG.bar.height
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(
        barState.x - GAME_CONFIG.bar.height / 2,
        barState.y - GAME_CONFIG.bar.height / 2,
        GAME_CONFIG.bar.width + GAME_CONFIG.bar.height,
        GAME_CONFIG.bar.height * 2
      );
    }

    // Draw rating text
    if (lastRating && lastRating !== 'miss' && ratingTimerRef.current > 0) {
      const colors = {
        perfect: '#00FF9F',
        great: '#6C5CE7',
        good: '#FFD93D',
        miss: '#FF3B6D',
      };

      const sizes = {
        perfect: 60,
        great: 50,
        good: 40,
        miss: 50,
      };

      ctx.font = `900 ${sizes[lastRating]}px 'Segoe UI', sans-serif`;
      ctx.fillStyle = colors[lastRating];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowColor = colors[lastRating];
      ctx.shadowBlur = 20;

      ctx.fillText(lastRating.toUpperCase(), canvas.width / 2, 100);

      ctx.shadowBlur = 0;
      ratingTimerRef.current--;
    }
  }, [isActive, barState, lastRating]);

  useEffect(() => {
    if (lastRating && lastRating !== 'miss') {
      ratingTimerRef.current = 60; // Show for ~1 second
    }
  }, [lastRating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = () => {
      drawGame();
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [drawGame]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.canvas.width}
      height={GAME_CONFIG.canvas.height}
      className="game-canvas"
    />
  );
}
