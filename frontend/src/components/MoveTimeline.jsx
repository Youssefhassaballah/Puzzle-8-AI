import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, StepForward, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const MoveTimeline = ({ 
  moves, 
  currentMoveIndex, 
  isPlaying, 
  playbackSpeed,
  onPlayPause, 
  onStepBack, 
  onStepForward, 
  onSpeedChange,
  isDarkMode
}) => {
  const getMoveIcon = (move) => {
    switch (move) {
      case 'Up': return <ArrowUp className="w-3 h-3" />;
      case 'Down': return <ArrowDown className="w-3 h-3" />;
      case 'Left': return <ArrowLeft className="w-3 h-3" />;
      case 'Right': return <ArrowRight className="w-3 h-3" />;
      default: return null;
    }
  };

  const getMoveColor = (move) => {
    return move === 'Up' || move === 'Down' 
      ? 'from-green-400 to-green-600' 
      : 'from-blue-400 to-blue-600';
  };

  if (!moves || moves.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        📋 Move History
        <span className="text-sm font-normal opacity-70">
          ({currentMoveIndex+1} of {moves.length}) {/* CHANGED: Now starts from 0 */}
        </span>
      </h3>
      
      {/* Playback Controls */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayPause}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            isPlaying 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStepBack}
          disabled={currentMoveIndex === 0}
          className="p-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
        >
          <StepForward className="w-4 h-4 rotate-180" />
          <span className="text-sm">Back</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStepForward}
          disabled={currentMoveIndex === moves.length - 1}
          className="p-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
        >
          <StepForward className="w-4 h-4" />
          <span className="text-sm">Next</span>
        </motion.button>

        <select
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className={`px-2 py-1 rounded-lg border ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={4}>4x</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {moves.map((move, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-white font-semibold text-sm shadow-lg ${
              index === currentMoveIndex
                ? `bg-gradient-to-r ${getMoveColor(move)} ring-2 ring-white ring-opacity-50 scale-110`
                : index < currentMoveIndex
                ? `bg-gradient-to-r ${getMoveColor(move)} opacity-80`
                : 'bg-gray-400 dark:bg-gray-600 opacity-50'
            }`}
          >
            {getMoveIcon(move)}
            <span>Move {index+1}: {move}</span> {/* CHANGED: Show "Move 1: Up" etc. */}
            {index === currentMoveIndex && (
              <div className="w-2 h-2 bg-white rounded-full ml-1 animate-pulse" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoveTimeline;