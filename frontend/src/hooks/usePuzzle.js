import { useState, useCallback } from 'react';
import { INITIAL_PUZZLE } from '../utils/constants';
import { generateRandomPuzzle, validateManualInput } from '../utils/puzzleUtils';

export const usePuzzle = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState(INITIAL_PUZZLE);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isCustomPuzzle, setIsCustomPuzzle] = useState(false);

  const resetPuzzle = useCallback(() => {
    setCurrentPuzzle(INITIAL_PUZZLE);
    setMoveHistory([]);
    setCurrentMoveIndex(0);
    setIsCustomPuzzle(false);
  }, []);

  const updatePuzzle = useCallback((newPuzzle, moves = []) => {
    setCurrentPuzzle(newPuzzle);
    setMoveHistory(moves);
    setCurrentMoveIndex(0);
  }, []);

  const setPuzzleState = useCallback((puzzleState, moveIndex = 0) => {
    setCurrentPuzzle(puzzleState);
    setCurrentMoveIndex(moveIndex);
  }, []);

  const generateRandom = useCallback(() => {
    const randomPuzzle = generateRandomPuzzle();
    setCurrentPuzzle(randomPuzzle);
    setMoveHistory([]);
    setCurrentMoveIndex(0);
    setIsCustomPuzzle(true);
    return randomPuzzle;
  }, []);

  const setCustomPuzzle = useCallback((puzzle) => {
    setCurrentPuzzle(puzzle);
    setMoveHistory([]);
    setCurrentMoveIndex(0);
    setIsCustomPuzzle(true);
  }, []);

  const setManualInput = useCallback((input) => {
    const validation = validateManualInput(input);
    if (validation.isValid) {
      setCurrentPuzzle(validation.grid);
      setMoveHistory([]);
      setCurrentMoveIndex(0);
      setIsCustomPuzzle(true);
      return { success: true };
    } else {
      return { success: false, error: validation.error };
    }
  }, []);

  return {
    currentPuzzle,
    moveHistory,
    currentMoveIndex,
    isCustomPuzzle,
    setCurrentMoveIndex,
    resetPuzzle,
    updatePuzzle,
    setPuzzleState,
    generateRandom,
    setCustomPuzzle,
    setManualInput
  };
};