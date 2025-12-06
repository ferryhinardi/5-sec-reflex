import { renderHook, act } from '@testing-library/react'
import { useGameState } from '@/hooks/useGameState'

// Mock storage functions
jest.mock('@/lib/storage', () => ({
  loadHighScore: jest.fn(() => 100),
  saveHighScore: jest.fn(),
}))

describe('useGameState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGameState())

    expect(result.current.state).toEqual({
      score: 0,
      round: 1,
      combo: 0,
      maxCombo: 0,
      perfects: 0,
      highScore: 100, // From mocked loadHighScore
      isRoundActive: false,
      currentScreen: 'start',
      lastRating: null,
    })
  })

  it('should reset game state', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.resetGame()
    })

    expect(result.current.state.score).toBe(0)
    expect(result.current.state.round).toBe(1)
    expect(result.current.state.combo).toBe(0)
    expect(result.current.state.currentScreen).toBe('playing')
  })

  it('should start a round', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startRound()
    })

    expect(result.current.state.isRoundActive).toBe(true)
    expect(result.current.state.lastRating).toBe(null)
  })

  it('should record perfect hit correctly', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.recordHit('perfect')
    })

    expect(result.current.state.score).toBe(100) // Base score
    expect(result.current.state.combo).toBe(1)
    expect(result.current.state.perfects).toBe(1)
    expect(result.current.state.lastRating).toBe('perfect')
  })

  it('should record great hit correctly', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.recordHit('great')
    })

    expect(result.current.state.score).toBe(60) // Base score
    expect(result.current.state.combo).toBe(1)
    expect(result.current.state.perfects).toBe(0)
  })

  it('should calculate combo bonus correctly', () => {
    const { result } = renderHook(() => useGameState())

    // First hit: 100 + (100 * 1 * 0.2) = 120
    act(() => {
      result.current.recordHit('perfect')
    })
    expect(result.current.state.score).toBe(100)

    // Second hit: 100 + (100 * 2 * 0.2) = 140
    act(() => {
      result.current.recordHit('perfect')
    })
    expect(result.current.state.score).toBe(240)

    // Third hit: 100 + (100 * 3 * 0.2) = 160
    act(() => {
      result.current.recordHit('perfect')
    })
    expect(result.current.state.score).toBe(400)
  })

  it('should handle miss and trigger game over', () => {
    const { result } = renderHook(() => useGameState())

    // Build combo first
    act(() => {
      result.current.recordHit('perfect')
      result.current.recordHit('perfect')
    })

    const comboBeforeMiss = result.current.state.combo

    act(() => {
      result.current.recordHit('miss')
    })

    expect(result.current.state.isRoundActive).toBe(false)
    expect(result.current.state.currentScreen).toBe('gameover')
    expect(result.current.state.lastRating).toBe('miss')
    expect(result.current.state.maxCombo).toBe(comboBeforeMiss)
  })

  it('should track max combo', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.recordHit('perfect')
      result.current.recordHit('perfect')
      result.current.recordHit('perfect')
    })

    expect(result.current.state.combo).toBe(3)
    expect(result.current.state.maxCombo).toBe(3)

    act(() => {
      result.current.recordHit('miss')
    })

    expect(result.current.state.combo).toBe(0)
    expect(result.current.state.maxCombo).toBe(3) // Should preserve max
  })

  it('should advance to next round', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.resetGame()
      result.current.nextRound()
    })

    expect(result.current.state.round).toBe(2)
    expect(result.current.state.isRoundActive).toBe(false)
  })

  it('should change screen', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.setScreen('playing')
    })

    expect(result.current.state.currentScreen).toBe('playing')

    act(() => {
      result.current.setScreen('gameover')
    })

    expect(result.current.state.currentScreen).toBe('gameover')
  })

  it('should save high score when new record is achieved', () => {
    const { saveHighScore } = require('@/lib/storage')
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.recordHit('perfect')
      result.current.recordHit('perfect')
      result.current.recordHit('perfect')
      result.current.recordHit('perfect')
      result.current.recordHit('perfect')
    })

    const newScore = result.current.state.score

    act(() => {
      result.current.recordHit('miss') // Trigger game over
    })

    expect(saveHighScore).toHaveBeenCalledWith(newScore)
    expect(result.current.state.highScore).toBe(newScore)
  })
})
