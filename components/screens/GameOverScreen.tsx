'use client';

interface GameOverScreenProps {
  score: number;
  round: number;
  maxCombo: number;
  perfects: number;
  highScore: number;
  isNewRecord: boolean;
  onRetry: () => void;
  onMenu: () => void;
}

export default function GameOverScreen({
  score,
  round,
  maxCombo,
  perfects,
  highScore,
  isNewRecord,
  onRetry,
  onMenu,
}: GameOverScreenProps) {
  return (
    <div className="screen game-over-screen">
      <h2 className="game-over-title">GAME OVER</h2>

      <div className="final-score-container">
        <div className="final-score-label">FINAL SCORE</div>
        <div className="final-score">{score}</div>
      </div>

      {isNewRecord && score > 0 && (
        <div className="new-record">NEW RECORD!</div>
      )}

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{round}</div>
          <div className="stat-name">Rounds</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{maxCombo}x</div>
          <div className="stat-name">Max Combo</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{perfects}</div>
          <div className="stat-name">Perfects</div>
        </div>
      </div>

      <button onClick={onRetry} className="btn btn-primary">
        PLAY AGAIN
      </button>
      <button onClick={onMenu} className="btn btn-secondary">
        MAIN MENU
      </button>
    </div>
  );
}
