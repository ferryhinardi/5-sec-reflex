import { loadHighScore, saveHighScore } from '@/lib/storage'

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  describe('loadHighScore', () => {
    it('should return 0 when no high score is stored', () => {
      const highScore = loadHighScore()
      expect(highScore).toBe(0)
    })

    it('should return stored high score', () => {
      window.localStorage.setItem('reflex_high_score', '500')
      const highScore = loadHighScore()
      expect(highScore).toBe(500)
    })

    it('should handle invalid stored values', () => {
      window.localStorage.setItem('reflex_high_score', 'invalid')
      const highScore = loadHighScore()
      expect(highScore).toBe(0) // Should return 0 for NaN
    })
  })

  describe('saveHighScore', () => {
    it('should save high score to localStorage', () => {
      saveHighScore(1000)
      expect(window.localStorage.getItem('reflex_high_score')).toBe('1000')
    })

    it('should overwrite existing high score', () => {
      window.localStorage.setItem('reflex_high_score', '500')
      saveHighScore(1000)
      expect(window.localStorage.getItem('reflex_high_score')).toBe('1000')
    })

    it('should handle zero score', () => {
      saveHighScore(0)
      expect(window.localStorage.getItem('reflex_high_score')).toBe('0')
    })
  })
})
