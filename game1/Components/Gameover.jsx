import React from 'react';

const GameOverScreen = ({ score }) => {
  return (
    <div className="overlay-dark">
      <div className="overlay-content">
        <h2 className="overlay-title-large">Game Over!</h2>
        <p className="overlay-text-large">Final Score: {score}</p>
        <p className="overlay-text">Press R to Restart</p>
      </div>
    </div>
  );
};

export default GameOverScreen;