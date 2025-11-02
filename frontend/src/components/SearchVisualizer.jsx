import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

// Hooks
import { useTheme } from '../hooks/useTheme';
import { usePuzzle } from '../hooks/usePuzzle';
import { useAlgorithm } from '../hooks/useAlgorithm';

// Components
import PuzzleGrid from './PuzzleGrid';
import ResultsPanel from './ResultsPanel';
import MoveTimeline from './MoveTimeline';
import ControlPanel from './ControlPanel';

// Utils
import { ALGORITHMS, INITIAL_PUZZLE } from '../utils/constants';
import { isPuzzleSolved } from '../utils/puzzleUtils';

const SearchVisualizer = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { 
    currentPuzzle, 
    moveHistory, 
    currentMoveIndex, 
    isCustomPuzzle,
    setCurrentMoveIndex,
    updatePuzzle,
    setPuzzleState,
    resetPuzzle,
    generateRandom,
    setManualInput
  } = usePuzzle();
  
  const { 
    isRunning, 
    progress, 
    results, 
    setResults, 
    error,
    executeAlgorithm 
  } = useAlgorithm();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dfs');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const runAlgorithmHandler = async () => {
    try {
      const result = await executeAlgorithm(selectedAlgorithm, currentPuzzle);
      
      // Update puzzle with results from backend
      if (result.found && result.path && result.path.length > 0) {
        updatePuzzle(currentPuzzle, result.moves);
        setResults(result); // ✅ store results
        console.log(`✅ ${selectedAlgorithm.toUpperCase()} found solution in ${result.cost} moves!`);
      } else {
        setResults(result); // ✅ even if not found
        console.log(`❌ ${selectedAlgorithm.toUpperCase()} could not find solution.`);
      }
    } catch (error) {
      console.error('Algorithm execution failed:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Auto-play moves when results are available
  useEffect(() => {
    if (!isPlaying || !results || !results.path) return;

    const timer = setInterval(() => {
      setCurrentMoveIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= results.path.length) {
          setIsPlaying(false);
          return prev;
        }
        setPuzzleState(results.path[nextIndex], nextIndex);
        return nextIndex;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, results, playbackSpeed, setCurrentMoveIndex, setPuzzleState]);

  // Update puzzle visualization when move index changes
  useEffect(() => {
    if (results && results.path && results.path.length > 0) {
      const targetState = results.path[currentMoveIndex];
      if (targetState && JSON.stringify(currentPuzzle) !== JSON.stringify(targetState)) {
        setPuzzleState(targetState, currentMoveIndex);
      }
    }
  }, [currentMoveIndex, results, currentPuzzle, setPuzzleState]);

  const handleStepBack = () => {
    if (results && results.path && currentMoveIndex > 0) {
      const newIndex = currentMoveIndex - 1;
      setPuzzleState(results.path[newIndex], newIndex);
      setCurrentMoveIndex(newIndex);
    }
  };

  const handleStepForward = () => {
    if (results && results.path && currentMoveIndex < results.path.length - 1) {
      const newIndex = currentMoveIndex + 1;
      setPuzzleState(results.path[newIndex], newIndex);
      setCurrentMoveIndex(newIndex);
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying && results && results.path && currentMoveIndex >= results.path.length - 1) {
      setPuzzleState(results.path[0], 0);
      setCurrentMoveIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleGenerateRandom = () => {
    generateRandom();
    setIsPlaying(false);
    setCurrentMoveIndex(0);
    setResults(null);
  };


  const handleResetPuzzle = () => {
    resetPuzzle();
    setIsPlaying(false);
    setCurrentMoveIndex(0);
    setResults(null); // ✅ clear old results
  };
  
  const handleManualInput = (input) => {
    const result = setManualInput(input);
    if (result.success) {
      setIsPlaying(false);
      setCurrentMoveIndex(0);
      setResults(null);
    }
    return result;
  };

  const exportResults = () => {
    if (!results) return;
    
    const exportData = {
      algorithm: selectedAlgorithm,
      startState: currentPuzzle,
      timestamp: new Date().toISOString(),
      ...results
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `search-results-${selectedAlgorithm}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-800';

  const isSolved = isPuzzleSolved(currentPuzzle);
  const totalMoves = results?.moves?.length || 0;
  const currentMoveDisplay = Math.min(currentMoveIndex, totalMoves - 1);

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-300`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <Brain className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">
            Search Algorithms Visualizer
          </h1>
        </motion.div>
        <p className="text-lg opacity-70">Generate random puzzles or input your own</p>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 mx-auto max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
          >
            <strong>Error: </strong>{error}
          </motion.div>
        )}
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Puzzle Grid & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className={`rounded-2xl shadow-lg p-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border-2`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  🧩 8-Puzzle Board
                  {isCustomPuzzle && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
                      Custom
                    </span>
                  )}
                </h2>
                
                <div className="flex gap-2">
                  {isSolved && (
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                      Solved! 🎉
                    </span>
                  )}
                  {results && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      results.found 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {results.found ? 'Solution Found' : 'No Solution'}
                    </span>
                  )}
                </div>
              </div>
              
              <PuzzleGrid puzzle={currentPuzzle} className="mb-6" />

              {results && results.path && (
                <div className="mb-4 text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    State {currentMoveIndex} of {results.path.length - 1}
                    {results.moves && currentMoveIndex > 0 && (
                      <span className="ml-2 font-semibold">
                        • Move {currentMoveDisplay}: {results.moves[currentMoveDisplay]}
                      </span>
                    )}
                  </span>
                </div>
              )}

              <ControlPanel
                selectedAlgorithm={selectedAlgorithm}
                onAlgorithmChange={setSelectedAlgorithm}
                onRunAlgorithm={runAlgorithmHandler}
                onToggleDarkMode={toggleDarkMode}
                onGenerateRandom={handleGenerateRandom}
                onResetPuzzle={handleResetPuzzle}
                onManualInput={handleManualInput}
                isRunning={isRunning}
                isDarkMode={isDarkMode}
                algorithms={ALGORITHMS}
              />

              {isRunning && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Running {selectedAlgorithm.toUpperCase()}...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {results && results.moves && results.moves.length > 0 && (
                <MoveTimeline
                  moves={results.moves}
                  currentMoveIndex={currentMoveDisplay}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  onPlayPause={handlePlayPause}
                  onStepBack={handleStepBack}
                  onStepForward={handleStepForward}
                  onSpeedChange={setPlaybackSpeed}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          </motion.div>

          <ResultsPanel
            results={results}
            algorithm={selectedAlgorithm}
            isDarkMode={isDarkMode}
            onExport={exportResults}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchVisualizer;
