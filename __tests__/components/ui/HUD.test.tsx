import { render, screen } from '@testing-library/react'
import HUD from '@/components/ui/HUD'

describe('HUD', () => {
  const defaultProps = {
    round: 5,
    combo: 3,
    score: 500,
    highScore: 1000,
  }

  it('should display round number', () => {
    render(<HUD {...defaultProps} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('ROUND')).toBeInTheDocument()
  })

  it('should display combo with multiplier', () => {
    render(<HUD {...defaultProps} />)
    expect(screen.getByText('3x')).toBeInTheDocument()
    expect(screen.getByText('COMBO')).toBeInTheDocument()
  })

  it('should display current score', () => {
    render(<HUD {...defaultProps} />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('should display high score', () => {
    render(<HUD {...defaultProps} />)
    expect(screen.getByText('1000')).toBeInTheDocument()
    expect(screen.getByText('BEST')).toBeInTheDocument()
  })

  it('should display zero combo correctly', () => {
    render(<HUD {...defaultProps} combo={0} />)
    expect(screen.getByText('0x')).toBeInTheDocument()
  })

  it('should display zero score correctly', () => {
    render(<HUD {...defaultProps} score={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should update when props change', () => {
    const { rerender } = render(<HUD {...defaultProps} />)
    
    expect(screen.getByText('5')).toBeInTheDocument()
    
    rerender(<HUD {...defaultProps} round={10} />)
    
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('should display large combo numbers correctly', () => {
    render(<HUD {...defaultProps} combo={25} />)
    expect(screen.getByText('25x')).toBeInTheDocument()
  })

  it('should display large score numbers correctly', () => {
    render(<HUD {...defaultProps} score={99999} />)
    expect(screen.getByText('99999')).toBeInTheDocument()
  })
})
