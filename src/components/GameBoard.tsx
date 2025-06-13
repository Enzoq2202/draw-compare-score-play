import React, { useState, useRef, useEffect } from "react";
import { Tldraw, Editor, useEditor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { Player, Category, CATEGORY_LABELS, CATEGORY_IMAGES, CATEGORIES } from "../types/game";
import { processImage } from "../utils/api";
import Timer from "./Timer";

interface GameBoardProps {
	players: Player[];
	currentPlayerIndex: number;
	onTurnComplete: (score: number, category: string) => void;
	gameCategory: Category;
}

const GameBoard: React.FC<GameBoardProps> = ({ players, currentPlayerIndex, onTurnComplete, gameCategory: initialGameCategory }) => {
	const [isDrawing, setIsDrawing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(60);
	const [timerActive, setTimerActive] = useState(false);
	const [showInstructions, setShowInstructions] = useState(true);
	const [imageError, setImageError] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category>(initialGameCategory);
	const editorRef = useRef<Editor | null>(null);

	const currentPlayer = players[currentPlayerIndex];
	const isFirstPlayer = currentPlayerIndex === 0;

	useEffect(() => {
		// Reset for new turn
		setIsDrawing(false);
		setIsSubmitting(false);
		setTimeRemaining(60);
		setTimerActive(false);
		setShowInstructions(true);
		setImageError(false);
		setImageLoaded(false);

		// Only reset selected category for the first player
		if (isFirstPlayer) {
			setSelectedCategory(initialGameCategory);
		}

		// Clear the canvas when editor is available
		if (editorRef.current) {
			editorRef.current.selectAll();
			editorRef.current.deleteShapes(editorRef.current.getSelectedShapeIds());
		}
	}, [currentPlayerIndex, initialGameCategory, isFirstPlayer]);

	const getRandomCategory = () => {
		const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
		setSelectedCategory(CATEGORIES[randomIndex]);
	};

	const startDrawing = () => {
		setIsDrawing(true);
		setShowInstructions(false);
		setTimerActive(true);
	};

	const handleTimeUp = async () => {
		setTimerActive(false);
		await submitDrawing();
	};

	const submitDrawing = async () => {
		if (!editorRef.current || isSubmitting) return;

		setIsSubmitting(true);
		setTimerActive(false);

		try {
			// Get all shapes on the canvas
			const shapeIds = editorRef.current.getCurrentPageShapeIds();

			if (shapeIds.size === 0) {
				throw new Error("No content to export");
			}

			// Export the drawing as PNG using the new tldraw API
			const { blob } = await editorRef.current.toImage([...shapeIds], {
				format: "png",
				background: false,
			});

			if (!blob) {
				throw new Error("Failed to export drawing");
			}

			// Submit to backend
			const result = await processImage(blob, selectedCategory);

			// Complete the turn with the score
			onTurnComplete(result.cosine_similarity, selectedCategory);
		} catch (error) {
			console.error("Failed to submit drawing:", error);
			// Complete the turn with a score of 0 if there's an error
			onTurnComplete(0, selectedCategory);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen p-4 bg-gray-50">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-xl shadow-lg p-6 mb-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-8 h-8 rounded-full" style={{ backgroundColor: currentPlayer.color }} />
							<div>
								<h2 className="text-2xl font-bold text-gray-800">{currentPlayer.name}'s Turn</h2>
								<p className="text-gray-600">
									Turn {currentPlayerIndex + 1} of {players.length}
								</p>
							</div>
						</div>

						{timerActive && <Timer timeRemaining={timeRemaining} onTimeUpdate={setTimeRemaining} onTimeUp={handleTimeUp} />}
					</div>
				</div>

				{/* Instructions and Reference Image */}
				{showInstructions && (
					<div className="bg-white rounded-xl shadow-lg p-8 mb-6">
						<div className="text-center mb-6">
							{isFirstPlayer ? (
								<>
									<h3 className="text-2xl font-bold text-gray-800 mb-2">Choose what to draw</h3>
									<p className="text-gray-600 mb-6">Select a category or get a random one. All players will draw the same thing!</p>
								</>
							) : (
								<>
									<h3 className="text-2xl font-bold text-gray-800 mb-2">Draw: {CATEGORY_LABELS[selectedCategory]}</h3>
									<p className="text-gray-600 mb-6">Use the reference image below as inspiration. You'll have 1 minute to draw!</p>
								</>
							)}
						</div>

						<div className="flex flex-col items-center space-y-6">
							{isFirstPlayer && (
								<>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
										{CATEGORIES.map((category) => (
											<button key={category} onClick={() => setSelectedCategory(category)} className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === category ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-purple-400"}`}>
												<div className="text-center">
													<div className="text-2xl mb-2">{CATEGORY_LABELS[category].split(" ")[0]}</div>
													<div className="text-sm text-gray-600">{CATEGORY_LABELS[category].split(" ")[1]}</div>
												</div>
											</button>
										))}
									</div>

									<button onClick={getRandomCategory} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
										🎲 Get Random Category
									</button>
								</>
							)}

							<div className="bg-gray-100 rounded-lg p-4 max-w-sm w-full">
								{imageError ? (
									<div className="w-full h-64 flex items-center justify-center text-gray-500">Failed to load reference image</div>
								) : (
									<div className="relative">
										{!imageLoaded && (
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
											</div>
										)}
										<img src={CATEGORY_IMAGES[selectedCategory]} alt={CATEGORY_LABELS[selectedCategory]} className={`w-full h-64 object-contain rounded-lg shadow-md transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
									</div>
								)}
							</div>

							<button onClick={startDrawing} disabled={!imageLoaded && !imageError} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
								Start Drawing!
							</button>
						</div>
					</div>
				)}

				{/* Drawing Canvas */}
				{isDrawing && (
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
						{/* Reference Image - Smaller on the side */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
								<h4 className="text-lg font-medium text-gray-700 mb-3 text-center">Reference: {CATEGORY_LABELS[selectedCategory]}</h4>
								{imageError ? <div className="w-full h-48 flex items-center justify-center text-gray-500">Failed to load reference image</div> : <img src={CATEGORY_IMAGES[selectedCategory]} alt={CATEGORY_LABELS[selectedCategory]} className="w-full h-48 object-contain rounded-lg shadow-sm" onError={() => setImageError(true)} />}
							</div>
						</div>

						{/* Drawing Canvas */}
						<div className="lg:col-span-3">
							<div className="bg-white rounded-xl shadow-lg overflow-hidden">
								<div className="p-4 bg-gray-50 border-b flex items-center justify-between">
									<span className="text-lg font-medium text-gray-700">Your Drawing</span>

									<div className="flex items-center space-x-4">
										{!isSubmitting && timerActive && (
											<button onClick={submitDrawing} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
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

								<div style={{ height: "600px" }}>
									<Tldraw
										onMount={(editor) => {
											editorRef.current = editor;
										}}
										hideUi={false}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default GameBoard;
