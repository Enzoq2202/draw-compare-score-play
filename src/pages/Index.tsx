
import React, { useState, useEffect } from 'react';
import PlayerSetup from '../components/PlayerSetup';
import GameBoard from '../components/GameBoard';
import ScoreDisplay from '../components/ScoreDisplay';
import { checkBackendHealth } from '../utils/api';
import { Player, GameState, Category, CATEGORIES } from '../types/game';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [scores, setScores] = useState<Array<{ player: Player; score: number; category: string }>>([]);
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const [gameCategory, setGameCategory] = useState<Category | null>(null);

  useEffect(() => {
    // Check backend health on load
    const checkHealth = async () => {
      try {
        const healthy = await checkBackendHealth();
        setBackendHealthy(healthy);
      } catch (error) {
        console.error('Failed to check backend health:', error);
        setBackendHealthy(false);
      }
    };
    
    checkHealth();
  }, []);

  const handlePlayersSetup = (playerList: Player[]) => {
    setPlayers(playerList);
    // Choose random category for the entire game
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setGameCategory(randomCategory);
    setGameState('playing');
  };

  const handleTurnComplete = (score: number, category: string) => {
    const currentPlayer = players[currentPlayerIndex];
    setScores(prev => [...prev, { player: currentPlayer, score, category }]);
    
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
    } else {
      setGameState('results');
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setScores([]);
    setGameCategory(null);
  };

  if (backendHealthy === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Backend Unavailable</h1>
          <p className="text-gray-600 mb-6">
            Unable to connect to the VisComp backend. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (backendHealthy === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to VisComp backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {gameState === 'setup' && (
        <PlayerSetup onPlayersSetup={handlePlayersSetup} />
      )}
      
      {gameState === 'playing' && gameCategory && (
        <GameBoard
          players={players}
          currentPlayerIndex={currentPlayerIndex}
          onTurnComplete={handleTurnComplete}
          gameCategory={gameCategory}
        />
      )}
      
      {gameState === 'results' && (
        <ScoreDisplay
          scores={scores}
          onResetGame={resetGame}
        />
      )}
    </div>
  );
};

export default Index;
