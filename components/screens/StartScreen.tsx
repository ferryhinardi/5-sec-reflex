'use client';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export default function StartScreen({ highScore, onStart }: StartScreenProps) {
  return (
    <div className="screen start-screen">
      <h1 className="game-title">5-SECOND REFLEX</h1>
      <p className="subtitle">Stop the bar in the target zone!</p>

      <div className="score-display">
        <div className="high-score">
          <span className="label">BEST</span>
          <span className="high-score-value">{highScore}</span>
        </div>
      </div>

      <button onClick={onStart} className="btn btn-primary">
        START GAME
      </button>

      <div className="instructions">
        <p>TAP when the bar enters the green zone</p>
        <p className="small">Perfect timing = higher score</p>
      </div>
    </div>
  );
}
