import { renderHook } from '@testing-library/react'
import { useScoring } from '@/hooks/useScoring'

describe('useScoring', () => {
  const canvasWidth = 800

  it('should return perfect rating when bar is in perfect zone', () => {
    const { result } = renderHook(() => useScoring(canvasWidth))
    
    const centerX = canvasWidth / 2
    const hitResult = result.current.checkHit(centerX)

    expect(hitResult.rating).toBe('perfect')
    expect(hitResult.distance).toBe(0)
  })

  it('should return perfect rating within perfect threshold', () => {
    const { result } = renderHook(() => useScoring(canvasWidth))
    
    const centerX = canvasWidth / 2
    const hitResult = result.current.checkHit(centerX + 10) // Within ±15px

    expect(hitResult.rating).toBe('perfect')
    expect(hitResult.distance).toBe(10)
  })

  it('should return great rating when bar is in great zone', () => {
    const { result } = renderHook(() => useScoring(canvasWidth))
    
    const centerX = canvasWidth / 2
    const hitResult = result.current.checkHit(centerX + 30) // Within ±40px but outside ±15px

    expect(hitResult.rating).toBe('great')
    expect(hitResult.distance).toBe(30)
  })

  it('should return good rating when bar is in good zone', () => {
    const { result } = renderHook(() => useScoring(canvasWidth))
    
    const centerX = canvasWidth / 2
    const hitResult = result.current.checkHit(centerX + 50) // Within ±60px but outside ±40px

    expect(hitResult.rating).toBe('good')
    expect(hitResult.distance).toBe(50)
  })

  it('should return miss rating when bar is outside good zone', () => {
    const { result } = renderHook(() => useScoring(canvasWidth))
    
    const centerX = canvasWidth / 2
    const hitResult = result.current.checkHit(centerX + 100) // Outside ±60px

    expect(hitResult.rating).toBe('miss')
    expect(hitResult.distance).toBe(100)
  })

  it('should handle hits on the left side of center', () => {
    const { result } = renderHook(() => useScoring(canvasWidth))
    
    const centerX = canvasWidth / 2
    const hitResult = result.current.checkHit(centerX - 10)

    expect(hitResult.rating).toBe('perfect')
    expect(hitResult.distance).toBe(10) // Absolute distance
  })

  it('should correctly categorize edge cases', () => {
    const { result } = renderHook(() => useScoring(canvasWidth))
    
    const centerX = canvasWidth / 2

    // Exactly at perfect threshold
    expect(result.current.checkHit(centerX + 15).rating).toBe('perfect')
    
    // Just outside perfect threshold
    expect(result.current.checkHit(centerX + 16).rating).toBe('great')
    
    // Exactly at great threshold
    expect(result.current.checkHit(centerX + 40).rating).toBe('great')
    
    // Just outside great threshold
    expect(result.current.checkHit(centerX + 41).rating).toBe('good')
    
    // Exactly at good threshold
    expect(result.current.checkHit(centerX + 60).rating).toBe('good')
    
    // Just outside good threshold
    expect(result.current.checkHit(centerX + 61).rating).toBe('miss')
  })
})
