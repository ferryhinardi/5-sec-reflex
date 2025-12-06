'use client';

import { useState, useCallback, useEffect } from 'react';
import { loadHighScore, saveHighScore } from '@/lib/storage';
import { GAME_CONFIG } from '@/lib/gameConfig';
import type { Rating, GameScreen } from '@/lib/gameConfig';

export interface GameState {
  score: number;
  round: number;
  combo: number;
  maxCombo: number;
  perfects: number;
  highScore: number;
  isRoundActive: boolean;
  currentScreen: GameScreen;
  lastRating: Rating | null;
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    score: 0,
    round: 1,
    combo: 0,
    maxCombo: 0,
    perfects: 0,
    highScore: 0,
    isRoundActive: false,
    currentScreen: 'start',
    lastRating: null,
  });

  // Load high score on mount
  useEffect(() => {
    setState(prev => ({ ...prev, highScore: loadHighScore() }));
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => ({
      score: 0,
      round: 1,
      combo: 0,
      maxCombo: 0,
      perfects: 0,
      highScore: prev.highScore,
      isRoundActive: false,
      currentScreen: 'playing',
      lastRating: null,
    }));
  }, []);

  const startRound = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRoundActive: true,
      lastRating: null,
    }));
  }, []);

  const recordHit = useCallback((rating: Rating) => {
    setState(prev => {
      if (rating === 'miss') {
        // Game over
        const isNewRecord = prev.score > prev.highScore;
        if (isNewRecord) {
          saveHighScore(prev.score);
        }
        
        return {
          ...prev,
          combo: 0,
          isRoundActive: false,
          currentScreen: 'gameover',
          lastRating: rating,
          highScore: isNewRecord ? prev.score : prev.highScore,
          maxCombo: Math.max(prev.maxCombo, prev.combo),
        };
      }

      // Calculate score
      let baseScore = GAME_CONFIG.scoring[rating];
      const newCombo = prev.combo + 1;
      // Combo bonus only applies from 2nd hit onwards
      const comboBonus = newCombo >= 2 
        ? Math.floor(baseScore * newCombo * GAME_CONFIG.scoring.comboMultiplier)
        : 0;
      const totalScore = baseScore + comboBonus;

      return {
        ...prev,
        score: prev.score + totalScore,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        perfects: rating === 'perfect' ? prev.perfects + 1 : prev.perfects,
        lastRating: rating,
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    setState(prev => ({
      ...prev,
      round: prev.round + 1,
      isRoundActive: false,
    }));
  }, []);

  const setScreen = useCallback((screen: GameScreen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  }, []);

  return {
    state,
    resetGame,
    startRound,
    recordHit,
    nextRound,
    setScreen,
  };
}
