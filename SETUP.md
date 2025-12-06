# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   - Navigate to http://localhost:3000
   - Game should load immediately

4. **Build for production (optional)**
   ```bash
   npm run build
   npm start
   ```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process or use a different port
PORT=3001 npm run dev
```

### TypeScript errors
```bash
# Ensure all dependencies are installed
npm install
```

### Canvas not rendering
- Check browser console for errors
- Ensure JavaScript is enabled
- Try a different browser

## File Structure Verification

All files should be in place:
- ✅ package.json
- ✅ next.config.js
- ✅ tsconfig.json
- ✅ app/layout.tsx
- ✅ app/page.tsx
- ✅ app/globals.css
- ✅ components/ (GameContainer, GameCanvas, screens, ui)
- ✅ hooks/ (useGameState, useGameLoop, useScoring)
- ✅ lib/ (gameConfig, audio, storage)

## Testing the Game

1. Click "START GAME"
2. Wait for "TAP TO START" prompt
3. Click/tap to start the bar moving
4. Click/tap when bar is in green zone
5. Try to get a perfect hit (center zone)
6. Build your combo streak
7. See how many rounds you can survive!

## Mobile Testing

1. Open DevTools (F12)
2. Click device toolbar icon
3. Select a mobile device
4. Test touch interactions

Enjoy! 🎮
