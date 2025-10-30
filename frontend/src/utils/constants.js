export const ALGORITHMS = [
  { value: 'dfs', label: 'Depth-First Search (DFS)' },
  { value: 'bfs', label: 'Breadth-First Search (BFS)' },
  { value: 'ids', label: 'Iterative DFS (IDS)' },
  { value: 'a_star', label: 'A* Search' }
];

export const INITIAL_PUZZLE = [
        [1, 2, 5],
        [3, 4, 0],
        [6, 7, 8]
];

export const GOAL_STATE = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

export const MOVE_DIRECTIONS = {
  Up: { icon: '⬆️', color: 'from-green-400 to-green-600' },
  Down: { icon: '⬇️', color: 'from-green-400 to-green-600' },
  Left: { icon: '⬅️', color: 'from-blue-400 to-blue-600' },
  Right: { icon: '➡️', color: 'from-blue-400 to-blue-600' }
};