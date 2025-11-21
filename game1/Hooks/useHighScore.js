import { useState, useEffect } from 'react';

const HIGH_SCORE_KEY = 'game_high_score';

export const useHighScore = () => {
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  const updateHighScore = (score) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      return true; // New high score!
    }
    return false;
  };

  return { highScore, updateHighScore };
};

