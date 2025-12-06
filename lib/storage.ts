const STORAGE_KEY = 'reflex_high_score';

export const loadHighScore = (): number => {
  if (typeof window === 'undefined') return 0;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

export const saveHighScore = (score: number): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, score.toString());
  } catch {
    console.warn('Failed to save high score');
  }
};
