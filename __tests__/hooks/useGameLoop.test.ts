import { renderHook } from '@testing-library/react'
import { useGameLoop } from '@/hooks/useGameLoop'

describe('useGameLoop', () => {
  const canvasWidth = 800
  const canvasHeight = 500

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize bar at starting position when inactive', () => {
    const { result } = renderHook(() =>
      useGameLoop(false, 1, canvasWidth, canvasHeight)
    )

    const centerX = result.current.getBarCenterX()
    expect(centerX).toBe(4) // x(0) + width(8)/2
  })

  it('should provide getBarCenterX function', () => {
    const { result } = renderHook(() =>
      useGameLoop(false, 1, canvasWidth, canvasHeight)
    )

    expect(typeof result.current.getBarCenterX).toBe('function')
    expect(result.current.getBarCenterX()).toBeGreaterThanOrEqual(0)
  })

  it('should not start animation loop when inactive', () => {
    const onUpdate = jest.fn()

    renderHook(() =>
      useGameLoop(false, 1, canvasWidth, canvasHeight, onUpdate)
    )

    // Should not call onUpdate when inactive
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('should request animation frame when active', () => {
    const onUpdate = jest.fn()

    renderHook(() =>
      useGameLoop(true, 1, canvasWidth, canvasHeight, onUpdate)
    )

    // Verify RAF was called when active
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('should request animation frame when active', () => {
    renderHook(() =>
      useGameLoop(true, 1, canvasWidth, canvasHeight)
    )

    // Verify RAF was scheduled when active
    expect(global.requestAnimationFrame).toHaveBeenCalled()
  })

  it('should reinitialize when isActive changes', () => {
    const onUpdate = jest.fn()

    const {rerender } = renderHook(
      ({ isActive }) => useGameLoop(isActive, 1, canvasWidth, canvasHeight, onUpdate),
      { initialProps: { isActive: false } }
    )

    const initialCalls = (global.requestAnimationFrame as jest.Mock).mock.calls.length

    rerender({ isActive: true })

    // Should have called RAF after becoming active
    expect((global.requestAnimationFrame as jest.Mock).mock.calls.length).toBeGreaterThan(initialCalls)
  })

  it('should reinitialize when round changes', () => {
    const onUpdate = jest.fn()

    const { rerender } = renderHook(
      ({ round }) => useGameLoop(false, round, canvasWidth, canvasHeight, onUpdate),
      { initialProps: { round: 1 } }
    )

    onUpdate.mockClear()

    rerender({ round: 2 })

    // Component should reinitialize with new round
    expect(onUpdate).not.toHaveBeenCalled() // Still inactive
  })

  it('should return barState object', () => {
    const { result } = renderHook(() =>
      useGameLoop(false, 1, canvasWidth, canvasHeight)
    )

    expect(result.current.barState).toBeDefined()
    expect(typeof result.current.barState.x).toBe('number')
    expect(typeof result.current.barState.y).toBe('number')
    expect(typeof result.current.barState.speed).toBe('number')
    expect(result.current.barState.direction).toBeOneOf([1, -1])
  })
})

// Custom Jest matcher
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received)
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of ${expected}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be one of ${expected}`,
        pass: false,
      }
    }
  },
})
