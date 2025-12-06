import { render, screen } from '@testing-library/react'
import GameCanvas from '@/components/game/GameCanvas'

describe('GameCanvas', () => {
  const mockBarState = {
    x: 100,
    y: 200,
    speed: 5,
    direction: 1 as const,
    pattern: 'linear' as const,
    time: 0,
  }

  it('should render canvas element', () => {
    render(
      <GameCanvas
        isActive={false}
        barState={mockBarState}
        lastRating={null}
      />
    )

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should have correct canvas dimensions', () => {
    render(
      <GameCanvas
        isActive={false}
        barState={mockBarState}
        lastRating={null}
      />
    )

    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    expect(canvas.width).toBe(800)
    expect(canvas.height).toBe(500)
  })

  it('should have game-canvas class', () => {
    render(
      <GameCanvas
        isActive={false}
        barState={mockBarState}
        lastRating={null}
      />
    )

    const canvas = document.querySelector('canvas')
    expect(canvas).toHaveClass('game-canvas')
  })

  it('should call getContext with 2d', () => {
    const mockGetContext = jest.fn()
    HTMLCanvasElement.prototype.getContext = mockGetContext

    render(
      <GameCanvas
        isActive={false}
        barState={mockBarState}
        lastRating={null}
      />
    )

    expect(mockGetContext).toHaveBeenCalledWith('2d')
  })

  it('should render when active', () => {
    render(
      <GameCanvas
        isActive={true}
        barState={mockBarState}
        lastRating={null}
      />
    )

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should render when inactive', () => {
    render(
      <GameCanvas
        isActive={false}
        barState={mockBarState}
        lastRating={null}
      />
    )

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should render with different bar positions', () => {
    const { rerender } = render(
      <GameCanvas
        isActive={true}
        barState={mockBarState}
        lastRating={null}
      />
    )

    rerender(
      <GameCanvas
        isActive={true}
        barState={{ ...mockBarState, x: 500 }}
        lastRating={null}
      />
    )

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should render with rating feedback', () => {
    render(
      <GameCanvas
        isActive={true}
        barState={mockBarState}
        lastRating="perfect"
      />
    )

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })
})
