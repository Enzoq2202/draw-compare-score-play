
import React, { useState } from 'react';
import { Player } from '../types/game';

interface PlayerSetupProps {
  onPlayersSetup: (players: Player[]) => void;
}

const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onPlayersSetup }) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);

  const updatePlayerCount = (count: number) => {
    setNumPlayers(count);
    const newNames = Array.from({ length: count }, (_, i) => 
      playerNames[i] || `Player ${i + 1}`
    );
    setPlayerNames(newNames);
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const startGame = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name: name.trim() || `Player ${index + 1}`,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length]
    }));
    
    onPlayersSetup(players);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            VisComp
          </h1>
          <p className="text-gray-600">Computer Vision Drawing Game</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Number of Players
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4].map(count => (
              <button
                key={count}
                onClick={() => updatePlayerCount(count)}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  numPlayers === count
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count} Players
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Player Names
          </label>
          <div className="space-y-3">
            {Array.from({ length: numPlayers }, (_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: PLAYER_COLORS[i] }}
                />
                <input
                  type="text"
                  value={playerNames[i] || ''}
                  onChange={(e) => updatePlayerName(i, e.target.value)}
                  placeholder={`Player ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;
