/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(150);

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    setSpeed(150);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(70, prev - 2)); // Speed up
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, isPaused, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (time - lastUpdateRef.current > speed) {
      moveSnake();
      lastUpdateRef.current = time;
    }
    gameLoopRef.current = requestAnimationFrame(update);
  }, [moveSnake, speed]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(update);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  return (
    <div className="relative flex items-center justify-center bg-black w-full h-full">
      <div className="absolute top-10 right-10 text-right z-10">
        <div className="text-[12px] uppercase tracking-[3px] text-text-dim">Current Score</div>
        <div className="font-mono text-[48px] leading-tight text-neon-green neon-text-green">
          {score.toString().padStart(4, '0')}
        </div>
        <div className="text-[10px] uppercase tracking-[2px] text-text-dim mt-2">
          High Score: {highScore.toString().padStart(4, '0')}
        </div>
      </div>

      <div className="relative group">
        <div className="relative bg-black overflow-hidden border-2 border-zinc-900"
             style={{ 
               width: 480, 
               height: 480,
               display: 'grid',
               gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
               gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
               boxShadow: '0 0 40px rgba(57, 255, 20, 0.05)'
             }}>
          
          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className={`rounded-[2px] m-[1px] ${i === 0 ? 'bg-neon-green z-10' : 'bg-neon-green/80'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                boxShadow: '0 0 8px #39ff14'
              }}
            />
          ))}

          {/* Food */}
          <div
            className="bg-neon-pink rounded-full m-[4px]"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              boxShadow: '0 0 12px #ff007f'
            }}
          />

          <AnimatePresence>
            {(isPaused || isGameOver) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
              >
                {isGameOver ? (
                  <div className="text-center">
                    <h2 className="font-sans font-extrabold text-4xl mb-4 neon-text-pink text-neon-pink uppercase tracking-widest">GAME OVER</h2>
                    <button 
                      onClick={resetGame}
                      className="flex items-center gap-2 bg-text-main text-bg hover:scale-105 active:scale-95 px-8 py-3 rounded-full font-bold transition-all"
                    >
                      <RefreshCcw className="w-5 h-5" /> RESTART
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 bg-text-main text-bg hover:scale-105 active:scale-95 px-10 py-4 rounded-full font-bold transition-all"
                  >
                    <Play className="w-6 h-6 fill-current" /> PLAY
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
