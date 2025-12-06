'use client';

import { useRef, useCallback, useEffect } from 'react';
import { GAME_CONFIG } from '@/lib/gameConfig';
import type { MovementPattern } from '@/lib/gameConfig';

export interface BarState {
  x: number;
  y: number;
  speed: number;
  direction: 1 | -1;
  pattern: MovementPattern;
  time: number;
}

export function useGameLoop(
  isActive: boolean,
  round: number,
  canvasWidth: number,
  canvasHeight: number,
  onUpdate?: (bar: BarState) => void
) {
  const animationFrameRef = useRef<number>();
  const barStateRef = useRef<BarState>({
    x: 0,
    y: canvasHeight / 2 - GAME_CONFIG.bar.height / 2,
    speed: GAME_CONFIG.bar.initialSpeed,
    direction: 1,
    pattern: 'linear',
    time: 0,
  });

  const initializeBar = useCallback(() => {
    // Calculate speed based on round
    const speed = Math.min(
      GAME_CONFIG.bar.initialSpeed + (round - 1) * GAME_CONFIG.bar.speedIncrement,
      GAME_CONFIG.bar.maxSpeed
    );

    // Randomize starting position and direction after round 3
    let x = 0;
    let direction: 1 | -1 = 1;
    
    if (round > 3 && Math.random() > 0.5) {
      x = canvasWidth - GAME_CONFIG.bar.width;
      direction = -1;
    }

    // Randomize movement pattern after round 5
    let pattern: MovementPattern = 'linear';
    if (round > 5) {
      const patterns: MovementPattern[] = ['linear', 'ease', 'wave'];
      pattern = patterns[Math.floor(Math.random() * patterns.length)];
    }

    barStateRef.current = {
      x,
      y: canvasHeight / 2 - GAME_CONFIG.bar.height / 2,
      speed,
      direction,
      pattern,
      time: 0,
    };
  }, [round, canvasWidth, canvasHeight]);

  const updateBar = useCallback(() => {
    const bar = barStateRef.current;
    bar.time += 0.016; // ~60fps frame time

    let movement = bar.speed * bar.direction;

    // Apply movement pattern
    switch (bar.pattern) {
      case 'ease': {
        const progress =
          bar.direction === 1 ? bar.x / canvasWidth : 1 - bar.x / canvasWidth;
        const easedSpeed = bar.speed * (1 + Math.sin(progress * Math.PI) * 0.5);
        movement = easedSpeed * bar.direction;
        break;
      }
      case 'wave': {
        const wave = Math.sin(bar.time * 3) * 2;
        movement = (bar.speed + wave) * bar.direction;
        break;
      }
    }

    bar.x += movement;

    // Bounce at edges
    if (bar.x <= 0) {
      bar.x = 0;
      bar.direction = 1;
    } else if (bar.x >= canvasWidth - GAME_CONFIG.bar.width) {
      bar.x = canvasWidth - GAME_CONFIG.bar.width;
      bar.direction = -1;
    }

    onUpdate?.(bar);
  }, [canvasWidth, onUpdate]);

  useEffect(() => {
    if (!isActive) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      return;
    }

    initializeBar();

    const animate = () => {
      updateBar();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, initializeBar, updateBar]);

  const getBarCenterX = useCallback(() => {
    return barStateRef.current.x + GAME_CONFIG.bar.width / 2;
  }, []);

  return {
    barState: barStateRef.current,
    getBarCenterX,
  };
}
