
import React, { useState, useRef, useEffect } from 'react';
import { Tldraw, Editor, exportAs } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { Player, Category, CATEGORIES, CATEGORY_LABELS } from '../types/game';
import { processImage, dataURLToBlob } from '../utils/api';
import Timer from './Timer';
import CategorySelector from './CategorySelector';

interface GameBoardProps {
  players: Player[];
  currentPlayerIndex: number;
  onTurnComplete: (score: number, category: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  players,
  currentPlayerIndex,
  onTurnComplete
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    // Reset for new turn
    setSelectedCategory(null);
    setIsDrawing(false);
    setIsSubmitting(false);
    setTimeRemaining(60);
    setTimerActive(false);
    
    // Clear the canvas when editor is available
    if (editorRef.current) {
      editorRef.current.selectAll();
      editorRef.current.deleteShapes(editorRef.current.getSelectedShapeIds());
    }
  }, [currentPlayerIndex]);

  const startDrawing = (category: Category) => {
    setSelectedCategory(category);
    setIsDrawing(true);
    setTimerActive(true);
  };

  const handleTimeUp = async () => {
    setTimerActive(false);
    await submitDrawing();
  };

  const submitDrawing = async () => {
    if (!selectedCategory || !editorRef.current || isSubmitting) return;

    setIsSubmitting(true);
    setTimerActive(false);

    try {
      // Export the drawing as SVG first, then convert to PNG
      const svg = await exportAs(editorRef.current, editorRef.current.getShapeIds(), 'svg');
      
      // Create a canvas to convert SVG to PNG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = 512;
          canvas.height = 512;
          
          // Fill with white background
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          resolve(undefined);
        };
        img.onerror = reject;
        img.src = 'data:image/svg+xml;base64,' + btoa(svg);
      });

      // Convert canvas to blob
      const dataURL = canvas.toDataURL('image/png');
      const imageBlob = dataURLToBlob(dataURL);

      // Submit to backend
      const result = await processImage(imageBlob, selectedCategory);
      
      // Complete the turn with the score
      onTurnComplete(result.cosine_similarity, selectedCategory);
      
    } catch (error) {
      console.error('Failed to submit drawing:', error);
      // Still complete the turn with a score of 0 if there's an error
      onTurnComplete(0, selectedCategory);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: currentPlayer.color }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentPlayer.name}'s Turn
                </h2>
                <p className="text-gray-600">
                  Turn {currentPlayerIndex + 1} of {players.length}
                </p>
              </div>
            </div>
            
            {timerActive && (
              <Timer
                timeRemaining={timeRemaining}
                onTimeUpdate={setTimeRemaining}
                onTimeUp={handleTimeUp}
              />
            )}
          </div>
        </div>

        {/* Category Selection */}
        {!isDrawing && (
          <CategorySelector
            categories={CATEGORIES}
            categoryLabels={CATEGORY_LABELS}
            onCategorySelect={startDrawing}
          />
        )}

        {/* Drawing Canvas */}
        {isDrawing && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium text-gray-700">
                  Drawing: {CATEGORY_LABELS[selectedCategory!]}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {!isSubmitting && timerActive && (
                  <button
                    onClick={submitDrawing}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit Early
                  </button>
                )}
                
                {isSubmitting && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ height: '600px' }}>
              <Tldraw
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
                hideUi={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
