import React from 'react';

const ScoreDisplay = ({ score, highScore, isNewHighScore = false }) => {
  return (
    <div className="score-container">
      <div className={`score-display ${isNewHighScore ? 'new-high-score' : ''}`}>
        <div className="score-label">Score</div>
        <div className="score-value">{score}</div>
      </div>
      {highScore > 0 && (
        <div className="high-score-display">
          <div className="score-label">Best</div>
          <div className="score-value">{highScore}</div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;