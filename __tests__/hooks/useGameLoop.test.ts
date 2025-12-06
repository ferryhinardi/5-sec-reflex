import { renderHook, waitFor } from '@testing-library/react'
import { useGameLoop } from '@/hooks/useGameLoop'

describe('useGameLoop', () => {
  const canvasWidth = 800
  const canvasHeight = 500

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize bar at starting position', () => {
    const { result } = renderHook(() =>
      useGameLoop(false, 1, canvasWidth, canvasHeight)
    )

    expect(result.current.barState.x).toBe(0)
    expect(result.current.barState.direction).toBe(1)
    expect(result.current.barState.pattern).toBe('linear')
  })

  it('should calculate bar center X correctly', () => {
    const { result } = renderHook(() =>
      useGameLoop(false, 1, canvasWidth, canvasHeight)
    )

    const centerX = result.current.getBarCenterX()
    expect(centerX).toBe(4) // x(0) + width(8)/2
  })

  it('should increase speed with round progression', async () => {
    const { result: result1 } = renderHook(() =>
      useGameLoop(true, 1, canvasWidth, canvasHeight)
    )

    const { result: result2 } = renderHook(() =>
      useGameLoop(true, 5, canvasWidth, canvasHeight)
    )

    await waitFor(() => {
      expect(result2.current.barState.speed).toBeGreaterThan(
        result1.current.barState.speed
      )
    })
  })

  it('should cap speed at maximum', async () => {
    const { result } = renderHook(() =>
      useGameLoop(true, 100, canvasWidth, canvasHeight)
    )

    await waitFor(() => {
      expect(result.current.barState.speed).toBeLessThanOrEqual(15) // Max speed
    })
  })

  it('should use linear pattern for early rounds', async () => {
    const { result } = renderHook(() =>
      useGameLoop(true, 1, canvasWidth, canvasHeight)
    )

    await waitFor(() => {
      expect(result.current.barState.pattern).toBe('linear')
    })
  })

  it('should randomize pattern after round 5', async () => {
    const patterns = ['linear', 'ease', 'wave']
    
    const { result } = renderHook(() =>
      useGameLoop(true, 6, canvasWidth, canvasHeight)
    )

    await waitFor(() => {
      expect(patterns).toContain(result.current.barState.pattern)
    })
  })

  it('should update bar position when active', async () => {
    const onUpdate = jest.fn()

    renderHook(() =>
      useGameLoop(true, 1, canvasWidth, canvasHeight, onUpdate)
    )

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled()
    })
  })

  it('should not update bar position when inactive', async () => {
    const onUpdate = jest.fn()

    renderHook(() =>
      useGameLoop(false, 1, canvasWidth, canvasHeight, onUpdate)
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('should cleanup animation frame on unmount', () => {
    const { unmount } = renderHook(() =>
      useGameLoop(true, 1, canvasWidth, canvasHeight)
    )

    unmount()

    expect(global.cancelAnimationFrame).toHaveBeenCalled()
  })

  it('should reinitialize bar when round changes', async () => {
    const { result, rerender } = renderHook(
      ({ round }) => useGameLoop(true, round, canvasWidth, canvasHeight),
      { initialProps: { round: 1 } }
    )

    const initialSpeed = result.current.barState.speed

    rerender({ round: 2 })

    await waitFor(() => {
      expect(result.current.barState.speed).toBeGreaterThan(initialSpeed)
    })
  })
})
