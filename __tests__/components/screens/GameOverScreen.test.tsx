import { render, screen } from '@testing-library/react'
import GameOverScreen from '@/components/screens/GameOverScreen'
import userEvent from '@testing-library/user-event'

describe('GameOverScreen', () => {
  const defaultProps = {
    score: 500,
    round: 10,
    maxCombo: 5,
    perfects: 3,
    highScore: 1000,
    isNewRecord: false,
    onRetry: jest.fn(),
    onMenu: jest.fn(),
  }

  it('should render game over title', () => {
    render(<GameOverScreen {...defaultProps} />)
    expect(screen.getByText('GAME OVER')).toBeInTheDocument()
  })

  it('should display final score', () => {
    render(<GameOverScreen {...defaultProps} />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('should display round count', () => {
    render(<GameOverScreen {...defaultProps} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Rounds')).toBeInTheDocument()
  })

  it('should display max combo', () => {
    render(<GameOverScreen {...defaultProps} />)
    expect(screen.getByText('5x')).toBeInTheDocument()
    expect(screen.getByText('Max Combo')).toBeInTheDocument()
  })

  it('should display perfects count', () => {
    render(<GameOverScreen {...defaultProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Perfects')).toBeInTheDocument()
  })

  it('should show new record badge when isNewRecord is true', () => {
    render(<GameOverScreen {...defaultProps} isNewRecord={true} />)
    expect(screen.getByText('NEW RECORD!')).toBeInTheDocument()
  })

  it('should not show new record badge when isNewRecord is false', () => {
    render(<GameOverScreen {...defaultProps} isNewRecord={false} />)
    expect(screen.queryByText('NEW RECORD!')).not.toBeInTheDocument()
  })

  it('should not show new record badge when score is zero', () => {
    render(
      <GameOverScreen {...defaultProps} score={0} isNewRecord={true} />
    )
    expect(screen.queryByText('NEW RECORD!')).not.toBeInTheDocument()
  })

  it('should call onRetry when play again button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()

    render(<GameOverScreen {...defaultProps} onRetry={onRetry} />)

    const retryButton = screen.getByRole('button', { name: /play again/i })
    await user.click(retryButton)

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should call onMenu when main menu button is clicked', async () => {
    const user = userEvent.setup()
    const onMenu = jest.fn()

    render(<GameOverScreen {...defaultProps} onMenu={onMenu} />)

    const menuButton = screen.getByRole('button', { name: /main menu/i })
    await user.click(menuButton)

    expect(onMenu).toHaveBeenCalledTimes(1)
  })

  it('should render both action buttons', () => {
    render(<GameOverScreen {...defaultProps} />)
    
    expect(
      screen.getByRole('button', { name: /play again/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /main menu/i })
    ).toBeInTheDocument()
  })
})
