
import React from 'react';
import { ScoreEntry } from '../types/game';
import { CATEGORY_LABELS } from '../types/game';

interface ScoreDisplayProps {
  scores: ScoreEntry[];
  onResetGame: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scores, onResetGame }) => {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const winner = sortedScores[0];

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent!';
    if (score >= 0.8) return 'Great!';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Try Again';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Winner Announcement */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Game Complete!
          </h1>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div 
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: winner.player.color }}
            />
            <span className="text-xl font-medium text-gray-700">
              {winner.player.name} wins with {(winner.score * 100).toFixed(1)}%!
            </span>
          </div>
        </div>

        {/* Scores Table */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Final Scores</h2>
          <div className="space-y-3">
            {sortedScores.map((entry, index) => (
              <div 
                key={entry.player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-gray-400">
                    #{index + 1}
                  </div>
                  <div 
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: entry.player.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      {entry.player.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Drew: {CATEGORY_LABELS[entry.category]}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(entry.score)}`}>
                    {(entry.score * 100).toFixed(1)}%
                  </div>
                  <div className={`text-sm font-medium ${getScoreColor(entry.score)}`}>
                    {getScoreLabel(entry.score)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onResetGame}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ScoreDisplay;
