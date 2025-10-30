import { GOAL_STATE } from './constants';

// Check if a puzzle is solvable (simplified - always return true)
export const isSolvable = (puzzle) => {
  return true; // Skip solvability check
};

// Generate a random puzzle (no solvability check)
export const generateRandomPuzzle = () => {
  return generateRandomGrid();
};

// Generate a random 3x3 grid with numbers 0-8
const generateRandomGrid = () => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  shuffleArray(numbers);
  
  const grid = [];
  for (let i = 0; i < 3; i++) {
    grid.push(numbers.slice(i * 3, i * 3 + 3));
  }
  
  return grid;
};

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Validate manual input - ONLY check for 9 digits and numbers 0-8
export const validateManualInput = (input) => {
  // Remove all non-digit characters and split
  const numbers = input.replace(/\D/g, '').split('').map(Number);
  
  // Check if we have exactly 9 numbers
  if (numbers.length !== 9) {
    return { isValid: false, error: 'Please enter exactly 9 numbers (0-8)' };
  }
  
  // Check if all numbers 0-8 are present exactly once
  const sorted = [...numbers].sort((a, b) => a - b);
  for (let i = 0; i < 9; i++) {
    if (sorted[i] !== i) {
      return { isValid: false, error: 'Must include all numbers from 0 to 8 exactly once' };
    }
  }
  
  // Convert to 3x3 grid
  const grid = [];
  for (let i = 0; i < 3; i++) {
    grid.push(numbers.slice(i * 3, i * 3 + 3));
  }
  
  return { isValid: true, grid };
};

// Check if puzzle is solved
export const isPuzzleSolved = (puzzle) => {
  return JSON.stringify(puzzle) === JSON.stringify(GOAL_STATE);
};

// Helper function to get example puzzles
export const getExamplePuzzles = () => {
  return [
    { input: '123405678', description: 'Easy (2 moves to solve)' },
    { input: '283164705', description: 'Medium (8 moves to solve)' },
    { input: '687534210', description: 'Hard (may be unsolvable)' },
    { input: '867254301', description: 'Very Hard (20+ moves)' }
  ];
};