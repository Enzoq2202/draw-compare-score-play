import React, { useState } from "react";
import PlayerSetup from "../components/PlayerSetup";
import GameBoard from "../components/GameBoard";
import ScoreDisplay from "../components/ScoreDisplay";
import { getRandomCategory } from "../utils/gameUtils";
import { Player, GameState, Category } from "../types/game";

const Index = () => {
	const [gameState, setGameState] = useState<GameState>("setup");
	const [players, setPlayers] = useState<Player[]>([]);
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [scores, setScores] = useState<Array<{ player: Player; score: number; category: string }>>([]);
	const [gameCategory, setGameCategory] = useState<Category | null>(null);
	const [lastUsedCategory, setLastUsedCategory] = useState<Category | null>(null);

	const handlePlayersSetup = (playerList: Player[]) => {
		setPlayers(playerList);
		// Choose random category avoiding the last used one
		const randomCategory = getRandomCategory(lastUsedCategory);
		setGameCategory(randomCategory);
		setLastUsedCategory(randomCategory);
		setGameState("playing");
	};

	const handleTurnComplete = (score: number, category: string) => {
		const currentPlayer = players[currentPlayerIndex];
		setScores((prev) => [...prev, { player: currentPlayer, score, category }]);

		if (currentPlayerIndex < players.length - 1) {
			setCurrentPlayerIndex((prev) => prev + 1);
		} else {
			setGameState("results");
		}
	};

	const resetGame = () => {
		setGameState("setup");
		setPlayers([]);
		setCurrentPlayerIndex(0);
		setScores([]);
		setGameCategory(null);
		// Don't reset lastUsedCategory to avoid repetition in next game
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
			{gameState === "setup" && <PlayerSetup onPlayersSetup={handlePlayersSetup} />}

			{gameState === "playing" && gameCategory && <GameBoard players={players} currentPlayerIndex={currentPlayerIndex} onTurnComplete={handleTurnComplete} gameCategory={gameCategory} />}

			{gameState === "results" && <ScoreDisplay scores={scores} onResetGame={resetGame} />}
		</div>
	);
};

export default Index;
