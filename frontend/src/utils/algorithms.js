import { api } from './api';

export const runAlgorithm = async (algorithm, startState) => {
  try {
    const result = await api.runAlgorithm(algorithm, startState);
    return {
      path: result.path || [],
      moves: result.moves || [],
      cost: result.cost || 0,
      expanded: result.expanded || 0,
      depth: result.depth || 0,
      runtime: result.runtime || 0,
      found: result.found || false
    };
  } catch (error) {
    console.error('API call failed:', error);
    throw new Error(`Failed to run ${algorithm}: ${error.message}`);
  }
};