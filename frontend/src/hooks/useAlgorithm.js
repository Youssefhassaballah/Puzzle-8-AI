import { useState, useCallback } from 'react';
import { runAlgorithm } from '../utils/algorithms';

export const useAlgorithm = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const executeAlgorithm = useCallback(async (algorithm, startState) => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setError(null);

    // Simulate progress updates for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await runAlgorithm(algorithm, startState);
      setResults(result);
      setProgress(100);
      
      clearInterval(progressInterval);
      return result;
    } catch (err) {
      setError(err.message);
      setProgress(0);
      clearInterval(progressInterval);
      throw err;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setProgress(0);
    setResults(null);
    setError(null);
  }, []);

  return {
    isRunning,
    progress,
    results,
    error,
    executeAlgorithm,
    reset
  };
};