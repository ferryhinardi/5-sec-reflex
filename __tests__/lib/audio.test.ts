import { AudioManager } from '@/lib/audio'

describe('AudioManager', () => {
  let audioManager: AudioManager

  beforeEach(() => {
    audioManager = new AudioManager()
    jest.clearAllMocks()
  })

  it('should play perfect sound with correct frequency', () => {
    audioManager.playSound('perfect')

    const audioContext = (global.AudioContext as jest.Mock).mock.results[0].value
    const oscillator = audioContext.createOscillator.mock.results[0].value

    expect(oscillator.frequency.value).toBe(880)
    expect(oscillator.type).toBe('sine')
    expect(oscillator.start).toHaveBeenCalled()
    expect(oscillator.stop).toHaveBeenCalled()
  })

  it('should play great sound with correct frequency', () => {
    audioManager.playSound('great')

    const audioContext = (global.AudioContext as jest.Mock).mock.results[0].value
    const oscillator = audioContext.createOscillator.mock.results[0].value

    expect(oscillator.frequency.value).toBe(660)
  })

  it('should play good sound with correct frequency', () => {
    audioManager.playSound('good')

    const audioContext = (global.AudioContext as jest.Mock).mock.results[0].value
    const oscillator = audioContext.createOscillator.mock.results[0].value

    expect(oscillator.frequency.value).toBe(440)
  })

  it('should play miss sound with correct frequency', () => {
    audioManager.playSound('miss')

    const audioContext = (global.AudioContext as jest.Mock).mock.results[0].value
    const oscillator = audioContext.createOscillator.mock.results[0].value

    expect(oscillator.frequency.value).toBe(200)
  })

  it('should connect oscillator to gain node', () => {
    audioManager.playSound('perfect')

    const audioContext = (global.AudioContext as jest.Mock).mock.results[0].value
    const oscillator = audioContext.createOscillator.mock.results[0].value
    const gainNode = audioContext.createGain.mock.results[0].value

    expect(oscillator.connect).toHaveBeenCalledWith(gainNode)
    expect(gainNode.connect).toHaveBeenCalledWith(audioContext.destination)
  })

  it('should set gain envelope', () => {
    audioManager.playSound('perfect')

    const audioContext = (global.AudioContext as jest.Mock).mock.results[0].value
    const gainNode = audioContext.createGain.mock.results[0].value

    expect(gainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.3, 0)
    expect(gainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.01, 0.2)
  })

  it('should handle missing audio context gracefully', () => {
    const originalAudioContext = global.AudioContext
    // @ts-ignore
    delete global.AudioContext

    expect(() => {
      const manager = new AudioManager()
      manager.playSound('perfect')
    }).not.toThrow()

    global.AudioContext = originalAudioContext
  })
})
