import { render, screen } from '@testing-library/react'
import StartScreen from '@/components/screens/StartScreen'
import userEvent from '@testing-library/user-event'

describe('StartScreen', () => {
  it('should render game title', () => {
    render(<StartScreen highScore={0} onStart={jest.fn()} />)
    expect(screen.getByText('5-SECOND REFLEX')).toBeInTheDocument()
  })

  it('should render instructions', () => {
    render(<StartScreen highScore={0} onStart={jest.fn()} />)
    expect(
      screen.getByText('Stop the bar in the target zone!')
    ).toBeInTheDocument()
    expect(
      screen.getByText('TAP when the bar enters the green zone')
    ).toBeInTheDocument()
  })

  it('should display high score', () => {
    render(<StartScreen highScore={1000} onStart={jest.fn()} />)
    expect(screen.getByText('1000')).toBeInTheDocument()
  })

  it('should display zero when no high score', () => {
    render(<StartScreen highScore={0} onStart={jest.fn()} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should call onStart when start button is clicked', async () => {
    const user = userEvent.setup()
    const onStart = jest.fn()

    render(<StartScreen highScore={0} onStart={onStart} />)

    const startButton = screen.getByRole('button', { name: /start game/i })
    await user.click(startButton)

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('should render start button', () => {
    render(<StartScreen highScore={0} onStart={jest.fn()} />)
    const startButton = screen.getByRole('button', { name: /start game/i })
    expect(startButton).toBeInTheDocument()
  })
})
