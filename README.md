# 5-Second Reflex - Hyper-Casual Competitive Web Game

A hyper-addictive reflex game built with **Next.js 14+** (App Router), featuring smooth animations, progressive difficulty, and competitive scoring.

## 🎮 Game Concept

Test your reflexes by stopping a moving bar at the exact moment it aligns with the target zone. Each round lasts approximately 5 seconds. Perfect timing yields higher scores, while a miss ends the run immediately.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

## 📁 Project Architecture

### Directory Structure

```
5-sec-reflex/
├── app/
│   ├── layout.tsx          # Root layout (Server Component)
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles & animations
├── components/
│   ├── game/
│   │   ├── GameContainer.tsx   # Main game orchestrator (Client)
│   │   └── GameCanvas.tsx      # Canvas renderer (Client)
│   ├── screens/
│   │   ├── StartScreen.tsx     # Start menu
│   │   └── GameOverScreen.tsx  # Game over + stats
│   └── ui/
│       ├── HUD.tsx                  # Score/combo display
│       ├── FeedbackOverlay.tsx      # Flash animations
│       └── StreakNotification.tsx   # Streak popups
├── hooks/
│   ├── useGameState.ts     # State management
│   ├── useGameLoop.ts      # Animation loop & bar physics
│   └── useScoring.ts       # Hit detection & scoring
├── lib/
│   ├── gameConfig.ts       # Game constants & types
│   ├── audio.ts           # Sound effects manager
│   └── storage.ts         # localStorage utilities
├── package.json
├── next.config.js
└── tsconfig.json
```

## 🏗️ Architecture Deep Dive

### 1. **State Management** (`hooks/useGameState.ts`)

Clean, centralized game state using React hooks:

- **Game state**: score, round, combo, perfects, high score
- **Screen management**: start → playing → gameover
- **Score calculation**: base score + combo multipliers
- **Persistence**: automatic high score saving to localStorage

**Key Functions**:
- `resetGame()` - Initialize new game
- `startRound()` - Begin round
- `recordHit(rating)` - Process player input
- `nextRound()` - Advance to next round

### 2. **Game Loop** (`hooks/useGameLoop.ts`)

Performance-optimized animation loop using `requestAnimationFrame`:

- **Physics simulation**: Smooth bar movement with easing
- **Difficulty scaling**: Speed increases each round
- **Pattern randomization**: Linear, ease, and wave movements
- **No memory leaks**: Proper cleanup on unmount

**Movement Patterns**:
- **Linear**: Constant speed
- **Ease**: Sinusoidal acceleration
- **Wave**: Oscillating speed variation

### 3. **Canvas Rendering** (`components/game/GameCanvas.tsx`)

Dedicated Canvas rendering separated from game logic:

- **60fps rendering**: Independent render loop
- **Multi-zone target**: Perfect/Great/Good zones
- **Visual feedback**: Glows, shadows, grid
- **Rating display**: Animated text feedback

### 4. **Scoring System** (`hooks/useScoring.ts`)

Precision-based scoring with combo rewards:

```typescript
Perfect (±15px):  100 points + 20% combo bonus
Great (±40px):     60 points + 20% combo bonus
Good (±60px):      30 points + 20% combo bonus
Miss (>60px):      Game over + combo reset
```

### 5. **Audio System** (`lib/audio.ts`)

Simple procedural audio using Web Audio API:

- No external audio files required
- Different frequencies for each rating
- Graceful degradation if unsupported

## 🎨 Design Patterns Used

### Custom Hooks Pattern
Separation of concerns with specialized hooks:
- `useGameState` - State management
- `useGameLoop` - Animation & physics
- `useScoring` - Hit detection

### Component Composition
Small, focused components:
- Screens (Start, Playing, GameOver)
- UI elements (HUD, Feedback, Notifications)
- Game logic (Container, Canvas)

### Ref-based Optimization
Avoiding unnecessary re-renders:
- `useRef` for animation frame IDs
- `useCallback` for stable function references
- Memoized state updates

### CSS Animations
Hardware-accelerated animations:
- `transform` and `opacity` for smooth transitions
- `@keyframes` for complex animations
- Minimal JavaScript for performance

## 🎯 Core Game Systems

### Difficulty Progression

| Round | Speed | Features |
|-------|-------|----------|
| 1-3   | 3-3.6 | Linear movement |
| 4+    | 3.9+  | Randomized start/direction |
| 6+    | 4.5+  | Non-linear patterns (ease, wave) |
| Max   | 15    | Speed cap for playability |

### Combo System

- **Combo**: Increments on any successful hit (Perfect/Great/Good)
- **Multiplier**: 20% of base score per combo level
- **Streak notifications**: Visual popup every 5 combos
- **Reset**: Miss immediately resets combo to 0

### Feedback System

**Visual**:
- Color flashes (Green/Blue/Yellow/Red)
- Screen shake on miss
- Rating text on canvas
- Streak notifications

**Audio**:
- Perfect: 880 Hz
- Great: 660 Hz
- Good: 440 Hz
- Miss: 200 Hz

## 🔧 Configuration

Edit `lib/gameConfig.ts` to customize:

```typescript
export const GAME_CONFIG = {
  bar: {
    initialSpeed: 3,        // Starting speed
    speedIncrement: 0.3,    // Speed increase per round
    maxSpeed: 15,           // Maximum speed cap
  },
  scoring: {
    perfect: 100,           // Base score for perfect
    comboMultiplier: 0.2,   // 20% bonus per combo
  },
  timing: {
    perfectThreshold: 15,   // ±15px for perfect
    greatThreshold: 40,     // ±40px for great
    goodThreshold: 60,      // ±60px for good
  },
};
```

## 🚀 Future Expansion Ideas

### Phase 1: Enhanced Experience
- **Multiple themes**: Dark mode, neon, minimal
- **Power-ups**: Slow-motion, freeze, double points
- **Sound packs**: Different audio themes
- **Visual effects**: Particle systems, trails

### Phase 2: Social Features
- **Online leaderboard**: Global rankings
- **Daily challenges**: Special objectives
- **Achievements**: Unlock badges
- **Share scores**: Social media integration

### Phase 3: Multiplayer
- **Real-time race mode**: Compete simultaneously
- **Turn-based challenges**: Async competition
- **Tournaments**: Bracket-style competitions
- **Spectator mode**: Watch top players

### Phase 4: Monetization
- **Premium themes**: Cosmetic purchases
- **Ad-free option**: One-time purchase
- **Battle pass**: Seasonal content
- **Custom challenges**: User-generated content

### Technical Improvements
- **WebGL renderer**: More complex visuals
- **Server-side leaderboard**: Supabase/Firebase
- **Progressive Web App**: Offline play, install
- **Mobile app**: React Native port
- **Analytics**: Player behavior tracking

## 🛠️ Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Rendering**: HTML5 Canvas
- **Animation**: RequestAnimationFrame
- **Audio**: Web Audio API
- **Storage**: LocalStorage
- **Styling**: CSS3 (Custom animations)

## 📊 Performance Considerations

### Optimizations Implemented

1. **Separate render loop**: Canvas rendering independent of React
2. **Ref-based state**: Avoid re-renders during animation
3. **Memoized callbacks**: Stable function references
4. **Hardware acceleration**: CSS transforms
5. **Proper cleanup**: No memory leaks

### Performance Metrics

- **Target FPS**: 60fps
- **Memory**: < 50MB
- **Load time**: < 1s (dev), < 500ms (prod)
- **Bundle size**: ~150KB gzipped

## 🧪 Testing Locally

```bash
# Test mobile responsiveness
# Open DevTools → Toggle device toolbar
# Test various screen sizes

# Test touch events
# Use touch simulation in DevTools

# Test audio
# Ensure browser allows autoplay
# Check different browsers
```

## 📱 Mobile Support

Fully optimized for mobile:
- Touch event handling
- Prevent default behaviors
- Responsive layout
- Optimized font sizes
- No viewport scaling

## 🐛 Known Issues & Solutions

**Issue**: Audio doesn't play on first tap
- **Solution**: Audio context requires user interaction - first tap initializes it

**Issue**: Canvas blurry on high-DPI displays
- **Solution**: Could implement devicePixelRatio scaling if needed

**Issue**: Game feels too fast/slow
- **Solution**: Adjust `GAME_CONFIG.bar.initialSpeed` and `speedIncrement`

## 📄 License

This project is open source. Feel free to use it for learning or personal projects.

## 🙌 Credits

Built as a demonstration of senior-level Next.js and game development patterns.

---

**Enjoy the game! Challenge yourself to beat your high score!** 🎮🏆
