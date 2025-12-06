import { GAME_CONFIG } from '@/lib/gameConfig'

describe('GAME_CONFIG', () => {
  it('should have correct canvas dimensions', () => {
    expect(GAME_CONFIG.canvas.width).toBe(800)
    expect(GAME_CONFIG.canvas.height).toBe(500)
  })

  it('should have valid bar configuration', () => {
    expect(GAME_CONFIG.bar.width).toBeGreaterThan(0)
    expect(GAME_CONFIG.bar.height).toBeGreaterThan(0)
    expect(GAME_CONFIG.bar.initialSpeed).toBeGreaterThan(0)
    expect(GAME_CONFIG.bar.maxSpeed).toBeGreaterThan(GAME_CONFIG.bar.initialSpeed)
    expect(GAME_CONFIG.bar.speedIncrement).toBeGreaterThan(0)
  })

  it('should have valid target zone configuration', () => {
    expect(GAME_CONFIG.targetZone.width).toBeGreaterThan(0)
    expect(GAME_CONFIG.targetZone.perfectWidth).toBeGreaterThan(0)
    expect(GAME_CONFIG.targetZone.perfectWidth).toBeLessThan(
      GAME_CONFIG.targetZone.width
    )
  })

  it('should have valid scoring configuration', () => {
    expect(GAME_CONFIG.scoring.perfect).toBeGreaterThan(
      GAME_CONFIG.scoring.great
    )
    expect(GAME_CONFIG.scoring.great).toBeGreaterThan(GAME_CONFIG.scoring.good)
    expect(GAME_CONFIG.scoring.comboMultiplier).toBeGreaterThan(0)
    expect(GAME_CONFIG.scoring.comboMultiplier).toBeLessThanOrEqual(1)
  })

  it('should have valid timing thresholds', () => {
    expect(GAME_CONFIG.timing.perfectThreshold).toBeLessThan(
      GAME_CONFIG.timing.greatThreshold
    )
    expect(GAME_CONFIG.timing.greatThreshold).toBeLessThan(
      GAME_CONFIG.timing.goodThreshold
    )
  })

  it('should have timing thresholds that fit within target zone', () => {
    const halfTargetZone = GAME_CONFIG.targetZone.width / 2
    expect(GAME_CONFIG.timing.goodThreshold).toBeLessThanOrEqual(
      halfTargetZone
    )
  })
})
