import React from 'react';
import { motion } from 'framer-motion';

const PuzzleGrid = ({ puzzle, className = '', onTileClick }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-inner">
        {puzzle.flat().map((value, index) => (
          <motion.div
            key={index}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold shadow-md cursor-pointer transition-transform hover:scale-105 ${
              value === 0 
                ? 'bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500' 
                : 'bg-gradient-to-br from-white to-blue-50 dark:from-gray-600 dark:to-gray-700 border border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-300 hover:shadow-lg'
            }`}
            onClick={() => onTileClick && onTileClick(value, index)}
          >
            {value !== 0 && value}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleGrid;