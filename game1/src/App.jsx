import React, { useState, useEffect, useRef, useCallback } from 'react';
import Player from '../Components/player';
import Obstacle from '../Components/obstacles';
import Ground from '../Components/ground';
import ScoreDisplay from '../Components/Score';
import ControlsInfo from '../Components/controls';
import StartScreen from '../Components/screen';
import GameOverScreen from '../Components/Gameover';
import Particles from '../Components/Particles';
import Trail from '../Components/Trail';
import Clouds from '../Components/Clouds';
import Stars from '../Components/Stars';
import Collectibles from '../Components/Collectibles';
import FloatingText, { useFloatingText } from '../Components/FloatingText';
import BackgroundElements from '../Components/BackgroundElements';
import { useParticles } from '../Hooks/useParticles';
import { useScreenShake } from '../Hooks/useScreenShake';
import { useTrail } from '../Hooks/useTrail';
import { useHighScore } from '../Hooks/useHighScore';
import { useParallax } from '../Hooks/useParallax';
import './App.css';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 40;
const PLAYER_START_X = 100;
const PLAYER_START_Y = GAME_HEIGHT / 2;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -12;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_SPEED = 3;
const GAP_SIZE = 220;
const OBSTACLE_SPACING = 300;
const HORIZONTAL_SPEED = 5;
const GROUND_HEIGHT = 20;

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
  const [playerY, setPlayerY] = useState(PLAYER_START_Y);
  const [playerX, setPlayerX] = useState(PLAYER_START_X);
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [passedObstacles, setPassedObstacles] = useState(new Set());
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [collectibleScore, setCollectibleScore] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  
  const gameLoopRef = useRef(null);
  const obstacleIdRef = useRef(0);
  const keysPressed = useRef(new Set());
  const lastScoreRef = useRef(0);
  const comboTimeoutRef = useRef(null);

  // Custom hooks
  const { particles, addParticles } = useParticles();
  const { shake, triggerShake } = useScreenShake();
  const trail = useTrail(playerX + PLAYER_SIZE / 2, playerY + PLAYER_SIZE / 2, gameState === 'playing');
  const { highScore, updateHighScore } = useHighScore();
  const parallaxOffset = useParallax(0.3, gameState);
  const { texts: floatingTexts, addText: addFloatingText } = useFloatingText();

  // Initialize obstacles
  useEffect(() => {
    if (gameState === 'playing') {
      const initialObstacles = [];
      for (let i = 0; i < 3; i++) {
        const gapY = Math.random() * (GAME_HEIGHT - GAP_SIZE - GROUND_HEIGHT - 50) + 25;
        initialObstacles.push({
          id: obstacleIdRef.current++,
          x: GAME_WIDTH + i * OBSTACLE_SPACING,
          gapY: gapY
        });
      }
      setObstacles(initialObstacles);
    }
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      // Update player position (gravity and jump)
      setPlayerY(prevY => {
        const newY = prevY + playerVelocity;
        const maxY = GAME_HEIGHT - GROUND_HEIGHT - PLAYER_SIZE;
        return Math.max(0, Math.min(newY, maxY));
      });

      setPlayerVelocity(prev => prev + GRAVITY);

      // Handle horizontal movement
      if (keysPressed.current.has('ArrowLeft')) {
        setPlayerX(prevX => Math.max(0, prevX - HORIZONTAL_SPEED));
      }
      if (keysPressed.current.has('ArrowRight')) {
        setPlayerX(prevX => Math.min(GAME_WIDTH - PLAYER_SIZE, prevX + HORIZONTAL_SPEED));
      }

      // Update obstacles
      setObstacles(prevObstacles => {
        const updated = prevObstacles.map(obs => ({
          ...obs,
          x: obs.x - OBSTACLE_SPEED
        })).filter(obs => obs.x + OBSTACLE_WIDTH > -100);

        // Add new obstacle when needed
        const lastObstacle = updated[updated.length - 1];
        if (!lastObstacle || lastObstacle.x < GAME_WIDTH - OBSTACLE_SPACING) {
          const gapY = Math.random() * (GAME_HEIGHT - GAP_SIZE - GROUND_HEIGHT - 50) + 25;
          updated.push({
            id: obstacleIdRef.current++,
            x: GAME_WIDTH,
            gapY: gapY
          });
        }

        return updated;
      });

      // Check collisions
      const playerRect = {
        x: playerX,
        y: playerY,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE
      };

      const collision = obstacles.some(obs => {
        const topObstacle = {
          x: obs.x,
          y: 0,
          width: OBSTACLE_WIDTH,
          height: obs.gapY
        };
        const bottomObstacle = {
          x: obs.x,
          y: obs.gapY + GAP_SIZE,
          width: OBSTACLE_WIDTH,
          height: GAME_HEIGHT - (obs.gapY + GAP_SIZE)
        };

        return (
          playerRect.x < topObstacle.x + topObstacle.width &&
          playerRect.x + playerRect.width > topObstacle.x &&
          playerRect.y < topObstacle.y + topObstacle.height &&
          playerRect.y + playerRect.height > topObstacle.y
        ) || (
          playerRect.x < bottomObstacle.x + bottomObstacle.width &&
          playerRect.x + playerRect.width > bottomObstacle.x &&
          playerRect.y < bottomObstacle.y + bottomObstacle.height &&
          playerRect.y + playerRect.height > bottomObstacle.y
        );
      });

      // Check ground collision
      if (playerY + PLAYER_SIZE >= GAME_HEIGHT - GROUND_HEIGHT) {
        triggerShake(15, 400);
        setTimeout(() => {
          updateHighScore(score);
          setGameState('gameover');
        }, 200);
        return;
      }

      if (collision) {
        triggerShake(15, 400);
        setTimeout(() => {
          updateHighScore(score);
          setGameState('gameover');
        }, 200);
        return;
      }

      // Update score when passing obstacles
      setPassedObstacles(prevPassed => {
        const newPassed = new Set(prevPassed);
        obstacles.forEach(obs => {
          if (!newPassed.has(obs.id) && obs.x + OBSTACLE_WIDTH < playerX) {
            newPassed.add(obs.id);
            setScore(prev => {
              const newScore = prev + 1;
              // Add particles when scoring
              addParticles(
                playerX + PLAYER_SIZE / 2,
                playerY + PLAYER_SIZE / 2,
                15,
                '#ffd700'
              );
              // Add floating text
              addFloatingText(
                playerX + PLAYER_SIZE / 2,
                playerY,
                '+1',
                '#ffd700',
                20
              );
              return newScore;
            });
          }
        });
        return newPassed;
      });

      // Check collectible collisions
      if (window.gameCollectibles && window.gameCollectibles.length > 0) {
        window.gameCollectibles.forEach((collectible, index) => {
          const distance = Math.sqrt(
            Math.pow(collectible.x - (playerX + PLAYER_SIZE / 2), 2) +
            Math.pow(collectible.y - (playerY + PLAYER_SIZE / 2), 2)
          );
          
          if (distance < PLAYER_SIZE / 2 + 15) {
            const points = collectible.type === 'gold' ? 5 : 2;
            setCollectibleScore(prev => prev + points);
            setScore(prev => prev + points);
            addParticles(
              playerX + PLAYER_SIZE / 2,
              playerY + PLAYER_SIZE / 2,
              collectible.type === 'gold' ? 20 : 10,
              collectible.type === 'gold' ? '#ffd700' : '#c0c0c0'
            );
            addFloatingText(
              playerX + PLAYER_SIZE / 2,
              playerY,
              `+${points}`,
              collectible.type === 'gold' ? '#ffd700' : '#c0c0c0',
              24
            );
            // Remove from array
            window.gameCollectibles = window.gameCollectibles.filter((_, i) => i !== index);
          }
        });
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, playerVelocity, playerX, playerY, obstacles]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (gameState === 'start' && (e.key === ' ' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setGameState('playing');
      setPlayerY(PLAYER_START_Y);
      setPlayerX(PLAYER_START_X);
      setPlayerVelocity(0);
      setObstacles([]);
      setScore(0);
      setPassedObstacles(new Set());
      keysPressed.current.clear();
      return;
    }

    if (gameState === 'gameover' && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      const wasNewHigh = updateHighScore(score);
      setIsNewHighScore(false);
      setGameState('start');
      setPlayerY(PLAYER_START_Y);
      setPlayerX(PLAYER_START_X);
      setPlayerVelocity(0);
      setObstacles([]);
      setScore(0);
      setPassedObstacles(new Set());
      keysPressed.current.clear();
      lastScoreRef.current = 0;
      return;
    }

    if (gameState === 'playing') {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        setPlayerVelocity(JUMP_STRENGTH);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        keysPressed.current.add(e.key);
      }
    }
  }, [gameState]);

  const handleKeyUp = useCallback((e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      keysPressed.current.delete(e.key);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Update high score when score changes
  useEffect(() => {
    if (score > lastScoreRef.current && score > 0) {
      const isNewHigh = updateHighScore(score);
      setIsNewHighScore(isNewHigh);
      lastScoreRef.current = score;
    }
  }, [score, updateHighScore]);

  return (
    <div className="app">
      <div className="game-container">
        <div 
          className="game-box"
          style={{
            width: `${GAME_WIDTH}px`,
            height: `${GAME_HEIGHT}px`,
            transform: `translate(${shake.x}px, ${shake.y}px)`,
            transition: shake.intensity > 0 ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Parallax Background */}
          <div 
            className="parallax-background"
            style={{
              backgroundPosition: `${parallaxOffset}% 0%`
            }}
          />
          
          {/* Background Elements */}
          <BackgroundElements 
            gameWidth={GAME_WIDTH} 
            gameHeight={GAME_HEIGHT}
            gameState={gameState}
          />
          
          {/* Stars */}
          <Stars 
            gameWidth={GAME_WIDTH} 
            gameHeight={GAME_HEIGHT}
            gameState={gameState}
          />
          
          {/* Clouds */}
          <Clouds 
            gameState={gameState}
            gameWidth={GAME_WIDTH}
            gameHeight={GAME_HEIGHT}
          />
          
          <Ground />
          
          {/* Player Trail */}
          {gameState === 'playing' && (
            <Trail trail={trail} playerSize={PLAYER_SIZE} />
          )}
          
          {obstacles.map(obs => (
            <Obstacle
              key={obs.id}
              x={obs.x}
              gapY={obs.gapY}
              width={OBSTACLE_WIDTH}
              gameHeight={GAME_HEIGHT}
              gapSize={GAP_SIZE}
            />
          ))}
          
          {/* Collectibles */}
          <Collectibles
            gameState={gameState}
            gameWidth={GAME_WIDTH}
            gameHeight={GAME_HEIGHT}
          />
          
          {/* Particles */}
          <Particles particles={particles} />
          
          {/* Floating Text */}
          <FloatingText texts={floatingTexts} />
          
          <Player 
            x={playerX} 
            y={playerY} 
            size={PLAYER_SIZE} 
          />
          
          {gameState === 'start' && <StartScreen />}
          {gameState === 'gameover' && <GameOverScreen score={score} highScore={highScore} />}
        </div>
        
        <div className="game-ui">
          <ScoreDisplay 
            score={score} 
            highScore={highScore}
            isNewHighScore={isNewHighScore}
          />
          <ControlsInfo />
        </div>
      </div>
    </div>
  );
}

export default App;

