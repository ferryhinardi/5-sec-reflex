'use client';

interface HUDProps {
  round: number;
  combo: number;
  score: number;
  highScore: number;
}

export default function HUD({ round, combo, score, highScore }: HUDProps) {
  return (
    <div className="hud">
      <div className="hud-left">
        <div className="stat">
          <span className="stat-label">ROUND</span>
          <span className="stat-value">{round}</span>
        </div>
        <div className="stat">
          <span className="stat-label">COMBO</span>
          <span className="stat-value">{combo}x</span>
        </div>
      </div>

      <div className="hud-center">
        <div className="score-large">{score}</div>
      </div>

      <div className="hud-right">
        <div className="stat">
          <span className="stat-label">BEST</span>
          <span className="stat-value">{highScore}</span>
        </div>
      </div>
    </div>
  );
}
