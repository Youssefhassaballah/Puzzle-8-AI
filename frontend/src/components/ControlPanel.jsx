import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Moon, Sun, Shuffle, Keyboard, RotateCcw } from 'lucide-react';

const ControlPanel = ({
  selectedAlgorithm,
  onAlgorithmChange,
  onRunAlgorithm,
  onToggleDarkMode,
  onGenerateRandom,
  onResetPuzzle,
  onManualInput,
  isRunning,
  isDarkMode,
  algorithms
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [inputError, setInputError] = useState('');

  const handleManualInputSubmit = () => {
    const result = onManualInput(manualInput);
    if (result.success) {
      setShowManualInput(false);
      setManualInput('');
      setInputError('');
    } else {
      setInputError(result.error);
    }
  };

  const handleGenerateRandom = () => {
    onGenerateRandom();
    setInputError('');
  };

  const handleReset = () => {
    onResetPuzzle();
    setShowManualInput(false);
    setManualInput('');
    setInputError('');
  };

  return (
    <div className="space-y-4">
      {/* Algorithm Selection and Main Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isRunning}
          className={`px-4 py-2 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {algorithms.map(algo => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>

        <motion.button
          whileHover={!isRunning ? { scale: 1.05 } : {}}
          whileTap={!isRunning ? { scale: 0.95 } : {}}
          onClick={onRunAlgorithm}
          disabled={isRunning}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
        >
          <Play className="w-4 h-4" />
          {isRunning ? `Running ${selectedAlgorithm.toUpperCase()}...` : 'Run Algorithm'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleDarkMode}
          disabled={isRunning}
          className={`p-2 rounded-xl border-2 transition-all ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-yellow-400' 
              : 'bg-white border-gray-300 text-gray-600'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Puzzle Configuration Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateRandom}
          disabled={isRunning}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
        >
          <Shuffle className="w-4 h-4" />
          Random Puzzle
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowManualInput(!showManualInput)}
          disabled={isRunning}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
        >
          <Keyboard className="w-4 h-4" />
          Manual Input
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          disabled={isRunning}
          className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </motion.button>
      </div>

      {/* Manual Input Modal */}
      {showManualInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border-2 border-blue-200 dark:border-gray-600"
        >
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
            Enter Puzzle Manually
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Enter 9 numbers (0-8) in row-major order. Example: "123405678" for:<br />
            1 2 3<br />
            4 0 5<br />
            6 7 8
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => {
                setManualInput(e.target.value);
                setInputError('');
              }}
              placeholder="e.g., 123405678"
              className={`flex-1 px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } ${inputError ? 'border-red-500' : ''}`}
              maxLength={9}
            />
            
            <button
              onClick={handleManualInputSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Apply
            </button>
            
            <button
              onClick={() => {
                setShowManualInput(false);
                setInputError('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          {inputError && (
            <p className="text-red-500 text-sm mt-2">{inputError}</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ControlPanel;