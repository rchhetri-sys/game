import React from 'react';

const GameOverScreen = ({ score, highScore }) => {
  const isNewHighScore = score === highScore && score > 0;
  
  return (
    <div className="overlay-dark">
      <div className="overlay-content">
        <h2 className="overlay-title-large">Game Over!</h2>
        <p className={`overlay-text-large ${isNewHighScore ? 'new-high-score-text' : ''}`}>
          Final Score: {score}
        </p>
        {isNewHighScore && (
          <p className="new-high-score-badge">🎉 New High Score! 🎉</p>
        )}
        {highScore > 0 && !isNewHighScore && (
          <p className="overlay-text">Best Score: {highScore}</p>
        )}
        <p className="overlay-text">Press R to Restart</p>
      </div>
    </div>
  );
};

export default GameOverScreen;