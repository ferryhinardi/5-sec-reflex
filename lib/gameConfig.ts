// Game configuration constants
export const GAME_CONFIG = {
  canvas: {
    width: 800,
    height: 500,
  },
  bar: {
    width: 8,
    height: 80,
    color: '#FFFFFF',
    initialSpeed: 3,
    speedIncrement: 0.3,
    maxSpeed: 15,
  },
  targetZone: {
    width: 120,
    perfectWidth: 30,
    color: '#00D9A3',
    perfectColor: '#00FF9F',
  },
  scoring: {
    perfect: 100,
    great: 60,
    good: 30,
    comboMultiplier: 0.2,
  },
  timing: {
    perfectThreshold: 15,
    greatThreshold: 40,
    goodThreshold: 60,
  },
} as const;

export type Rating = 'perfect' | 'great' | 'good' | 'miss';
export type GameScreen = 'start' | 'playing' | 'gameover';
export type MovementPattern = 'linear' | 'ease' | 'wave';
