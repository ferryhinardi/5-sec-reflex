# Testing Guide

## 📋 Overview

This project includes comprehensive test coverage using **Jest** and **React Testing Library**, with automated CI/CD pipelines via **GitHub Actions**.

## 🧪 Test Structure

```
__tests__/
├── hooks/
│   ├── useGameState.test.ts      # Game state management tests
│   ├── useGameLoop.test.ts       # Animation loop tests
│   └── useScoring.test.ts        # Hit detection tests
├── lib/
│   ├── storage.test.ts           # LocalStorage utility tests
│   ├── audio.test.ts             # Audio manager tests
│   └── gameConfig.test.ts        # Configuration validation tests
└── components/
    ├── screens/
    │   ├── StartScreen.test.tsx
    │   └── GameOverScreen.test.tsx
    ├── ui/
    │   └── HUD.test.tsx
    └── game/
        └── GameCanvas.test.tsx
```

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run tests in CI mode
```bash
npm run test:ci
```

## 📊 Coverage Requirements

Minimum coverage thresholds enforced by Jest:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Current coverage can be viewed after running:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🎯 Test Categories

### Unit Tests

#### Hooks Tests
- **useGameState**: State transitions, scoring, combo calculation
- **useGameLoop**: Animation loop, bar movement, difficulty scaling
- **useScoring**: Hit detection, rating calculation

#### Library Tests
- **storage**: localStorage operations, high score persistence
- **audio**: Web Audio API integration, sound playback
- **gameConfig**: Configuration validation, constant values

### Integration Tests

#### Component Tests
- **StartScreen**: UI rendering, button interactions
- **GameOverScreen**: Stats display, navigation actions
- **HUD**: Real-time stat updates
- **GameCanvas**: Canvas rendering, visual feedback

## 🔧 Test Configuration

### jest.config.js
Main Jest configuration with:
- Next.js integration
- Custom module mapping
- Coverage thresholds
- Test environment setup

### jest.setup.js
Global test setup including:
- Canvas API mocks
- requestAnimationFrame mocks
- Web Audio API mocks
- localStorage mocks
- Testing Library extensions

## 🤖 CI/CD Workflows

### Main CI Pipeline (.github/workflows/ci.yml)
Runs on every push and PR:
- ✅ Lint check
- ✅ Run all tests
- ✅ Upload coverage to Codecov
- ✅ Build application
- ✅ TypeScript type checking

**Tested on Node versions**: 18.x, 20.x

### Code Quality Check (.github/workflows/code-quality.yml)
Runs on PRs:
- ✅ Lint check
- ✅ Coverage threshold validation (70%)
- ✅ PR comment with coverage report

### Deployment (.github/workflows/deploy.yml)
Runs on main branch:
- ✅ Run tests
- ✅ Build application
- ✅ Deploy to Vercel (requires secrets)

## 📝 Writing New Tests

### Unit Test Example
```typescript
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '@/hooks/useGameState'

describe('useGameState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGameState())
    expect(result.current.state.score).toBe(0)
  })
})
```

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StartScreen from '@/components/screens/StartScreen'

describe('StartScreen', () => {
  it('should call onStart when button clicked', async () => {
    const user = userEvent.setup()
    const onStart = jest.fn()
    
    render(<StartScreen highScore={0} onStart={onStart} />)
    
    await user.click(screen.getByRole('button'))
    expect(onStart).toHaveBeenCalled()
  })
})
```

## 🐛 Debugging Tests

### Run specific test file
```bash
npm test useGameState
```

### Run with verbose output
```bash
npm test -- --verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## 📈 Coverage Reports

After running `npm run test:coverage`:

### Terminal Output
```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   85.23 |    78.45 |   82.11 |   85.67 |
 hooks/            |   92.31 |    85.71 |   90.00 |   93.75 |
 lib/              |   88.89 |    75.00 |   85.71 |   90.00 |
 components/       |   78.26 |    70.00 |   75.00 |   79.41 |
-------------------|---------|----------|---------|---------|-------------------
```

### HTML Report
Open `coverage/lcov-report/index.html` in browser for interactive report

## 🔐 GitHub Secrets Required

For full CI/CD pipeline:

```
CODECOV_TOKEN       # For coverage uploads
VERCEL_TOKEN        # For Vercel deployment
VERCEL_ORG_ID       # Your Vercel organization ID
VERCEL_PROJECT_ID   # Your Vercel project ID
```

Add these in: Repository Settings → Secrets and variables → Actions

## ✅ Pre-commit Checklist

Before committing:
```bash
npm run lint        # Check code style
npm test            # Run all tests
npm run build       # Verify build works
```

## 🎯 Test Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Test behavior, not implementation**: Focus on user interactions
3. **Mock external dependencies**: Keep tests isolated
4. **Use descriptive test names**: Make failures easy to understand
5. **Avoid test interdependencies**: Each test should be independent
6. **Clean up after tests**: Prevent side effects

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎉 Test Summary

Total test suites: **9**  
Total tests: **50+**  
Coverage: **70%+ target**  
CI/CD: **GitHub Actions**  
