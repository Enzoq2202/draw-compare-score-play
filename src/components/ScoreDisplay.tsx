import React from "react";
import { ScoreEntry } from "../types/game";
import { CATEGORY_LABELS } from "../types/game";

// Thresholds for each category to determine a tie
const CATEGORY_THRESHOLDS: { [key: string]: number } = {
	raposa: 0.007824,
	cavalo: 0.011552,
	estrela: 0.020191,
	gato: 0.056632,
	linus: 0.020571,
	luminaria: 0.020509,
	mack: 0.02405,
	nike: 0.031801,
};

interface ScoreDisplayProps {
	scores: ScoreEntry[];
	onResetGame: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scores, onResetGame }) => {
	// Group scores by category and handle ties
	const groupedScores = scores.reduce((acc, entry) => {
		const category = entry.category;
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(entry);
		return acc;
	}, {} as { [key: string]: ScoreEntry[] });

	// Sort scores within each category and handle ties
	const sortedScores = Object.values(groupedScores).flatMap((categoryScores) => {
		const sorted = [...categoryScores].sort((a, b) => b.score - a.score);
		const threshold = CATEGORY_THRESHOLDS[categoryScores[0].category] || 0;

		// Group scores that are within the threshold
		const groups: ScoreEntry[][] = [];
		let currentGroup: ScoreEntry[] = [sorted[0]];

		for (let i = 1; i < sorted.length; i++) {
			if (Math.abs(sorted[i].score - sorted[i - 1].score) <= threshold) {
				currentGroup.push(sorted[i]);
			} else {
				groups.push(currentGroup);
				currentGroup = [sorted[i]];
			}
		}
		groups.push(currentGroup);

		return groups;
	});

	const topGroup = sortedScores[0] || [];
	const isTie = topGroup.length > 1;
	const winner = topGroup[0];

	const getScoreColor = (score: number) => {
		if (score >= 0.8) return "text-green-600";
		if (score >= 0.6) return "text-yellow-600";
		return "text-red-600";
	};

	const getScoreLabel = (score: number) => {
		if (score >= 0.9) return "Excellent!";
		if (score >= 0.8) return "Great!";
		if (score >= 0.6) return "Good";
		if (score >= 0.4) return "Fair";
		return "";
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
				{/* Winner Announcement */}
				<div className="text-center mb-8">
					<div className="text-6xl mb-4">🏆</div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Game Complete!</h1>
					<div className="flex items-center justify-center space-x-3 mb-4">
						{isTie ? (
							<span className="text-xl font-medium text-gray-700">It's a tie! Multiple players achieved similar scores!</span>
						) : (
							<>
								<div className="w-6 h-6 rounded-full" style={{ backgroundColor: winner?.player.color }} />
								<span className="text-xl font-medium text-gray-700">
									{winner?.player.name} wins with {(winner?.score * 100).toFixed(1)}%
								</span>
							</>
						)}
					</div>
				</div>

				{/* Scores Table */}
				<div className="mb-8">
					<h2 className="text-xl font-bold text-gray-800 mb-4">Final Scores</h2>
					<div className="space-y-3">
						{scores.map((entry, index) => (
							<div key={entry.player.id} className={`flex items-center justify-between p-4 rounded-lg ${topGroup.includes(entry) ? "bg-yellow-50 border-2 border-yellow-200" : "bg-gray-50"}`}>
								<div className="flex items-center space-x-4">
									<div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
									<div className="w-5 h-5 rounded-full" style={{ backgroundColor: entry.player.color }} />
									<div>
										<div className="font-medium text-gray-800">{entry.player.name}</div>
										<div className="text-sm text-gray-600">Drew: {CATEGORY_LABELS[entry.category]}</div>
									</div>
								</div>

								<div className="text-right">
									<div className={`text-2xl font-bold ${getScoreColor(entry.score)}`}>{(entry.score * 100).toFixed(1)}%</div>
									<div className={`text-sm font-medium ${getScoreColor(entry.score)}`}>{getScoreLabel(entry.score)}</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Play Again Button */}
				<button onClick={onResetGame} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
					Play Again
				</button>
			</div>
		</div>
	);
};

export default ScoreDisplay;
