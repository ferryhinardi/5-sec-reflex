'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useScoring } from '@/hooks/useScoring';
import { audioManager } from '@/lib/audio';
import { GAME_CONFIG } from '@/lib/gameConfig';
import GameCanvas from '@/components/game/GameCanvas';
import StartScreen from '@/components/screens/StartScreen';
import GameOverScreen from '@/components/screens/GameOverScreen';
import HUD from '@/components/ui/HUD';
import FeedbackOverlay from '@/components/ui/FeedbackOverlay';
import StreakNotification from '@/components/ui/StreakNotification';
import type { BarState } from '@/hooks/useGameLoop';

export default function GameContainer() {
  const {
    state,
    resetGame,
    startRound,
    recordHit,
    nextRound,
    setScreen,
  } = useGameState();

  const barStateRef = useRef<BarState>({
    x: 0,
    y: 0,
    speed: 0,
    direction: 1,
    pattern: 'linear',
    time: 0,
  });

  const { checkHit } = useScoring(GAME_CONFIG.canvas.width);

  const handleBarUpdate = useCallback((bar: BarState) => {
    barStateRef.current = bar;
  }, []);

  const { barState, getBarCenterX } = useGameLoop(
    state.isRoundActive,
    state.round,
    GAME_CONFIG.canvas.width,
    GAME_CONFIG.canvas.height,
    handleBarUpdate
  );

  const handleStartGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleCanvasClick = useCallback(() => {
    if (state.currentScreen !== 'playing') return;

    if (!state.isRoundActive) {
      // Start the round
      startRound();
    } else {
      // Check hit
      const barCenterX = getBarCenterX();
      const result = checkHit(barCenterX);
      
      recordHit(result.rating);
      audioManager.playSound(result.rating);

      if (result.rating !== 'miss') {
        // Continue to next round after delay
        setTimeout(() => {
          nextRound();
        }, 1000);
      }
    }
  }, [
    state.currentScreen,
    state.isRoundActive,
    startRound,
    getBarCenterX,
    checkHit,
    recordHit,
    nextRound,
  ]);

  const handleRetry = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleMenu = useCallback(() => {
    setScreen('start');
  }, [setScreen]);

  const isNewRecord = state.score > 0 && state.score >= state.highScore;

  return (
    <div className="game-container">
      {state.currentScreen === 'start' && (
        <StartScreen highScore={state.highScore} onStart={handleStartGame} />
      )}

      {state.currentScreen === 'playing' && (
        <div className="game-screen">
          <HUD
            round={state.round}
            combo={state.combo}
            score={state.score}
            highScore={state.highScore}
          />

          <div className="canvas-container">
            <GameCanvas
              isActive={state.isRoundActive}
              barState={barStateRef.current}
              lastRating={state.lastRating}
            />

            <FeedbackOverlay rating={state.lastRating} />
            <StreakNotification combo={state.combo} />

            {!state.isRoundActive && (
              <div className="ready-prompt">
                <div className="ready-text">TAP TO START</div>
              </div>
            )}

            <div 
              className="click-area" 
              onClick={handleCanvasClick}
              onTouchStart={(e) => {
                e.preventDefault();
                handleCanvasClick();
              }}
            />
          </div>
        </div>
      )}

      {state.currentScreen === 'gameover' && (
        <GameOverScreen
          score={state.score}
          round={state.round}
          maxCombo={state.maxCombo}
          perfects={state.perfects}
          highScore={state.highScore}
          isNewRecord={isNewRecord}
          onRetry={handleRetry}
          onMenu={handleMenu}
        />
      )}
    </div>
  );
}
