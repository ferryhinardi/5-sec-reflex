'use client';

import { useCallback } from 'react';
import { GAME_CONFIG } from '@/lib/gameConfig';
import type { Rating } from '@/lib/gameConfig';

export function useScoring(canvasWidth: number) {
  const checkHit = useCallback(
    (barCenterX: number): { rating: Rating; distance: number } => {
      const targetCenterX = canvasWidth / 2;
      const distance = Math.abs(barCenterX - targetCenterX);

      if (distance <= GAME_CONFIG.timing.perfectThreshold) {
        return { rating: 'perfect', distance };
      } else if (distance <= GAME_CONFIG.timing.greatThreshold) {
        return { rating: 'great', distance };
      } else if (distance <= GAME_CONFIG.timing.goodThreshold) {
        return { rating: 'good', distance };
      }

      return { rating: 'miss', distance };
    },
    [canvasWidth]
  );

  return { checkHit };
}
