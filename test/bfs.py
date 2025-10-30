from collections import deque
import time

class BFS:
    def __init__(self, start):
        self.start = self.state_to_tuple(start)
        self.Goal = (
            (0, 1, 2),
            (3, 4, 5),
            (6, 7, 8)
        )

        # Results
        self.path = []
        self.moves = []
        self.cost = 0
        self.expanded = 0
        self.depth = 0
        self.runtime = 0.0
        self.found = False

    # ========== Utility Functions ==========

    def state_to_tuple(self, state):
        """Converts list of lists to tuple of tuples."""
        return tuple(tuple(row) for row in state)

    def find_zero(self, state):
        """Finds the (i,j) position of the blank (0)."""
        for i in range(3):
            for j in range(3):
                if state[i][j] == 0:
                    return i, j

    def get_neighbors(self, state):
        """Generates valid neighbor states and their corresponding move."""
        neighbors = []
        i, j = self.find_zero(state)
        directions = [(-1, 0, "Up"), (1, 0, "Down"), (0, -1, "Left"), (0, 1, "Right")]

        for di, dj, action in directions:
            ni = i + di
            nj = j + dj
            if 0 <= ni < 3 and 0 <= nj < 3:
                new_state = [list(row) for row in state]
                new_state[i][j], new_state[ni][nj] = new_state[ni][nj], new_state[i][j]
                neighbors.append((self.state_to_tuple(new_state), action))
        return neighbors

    def reconstruct_path(self, parent, move_from, goal_state):
        """Reconstructs the path from the start to the goal."""
        path = []
        moves = []
        s = goal_state
        while s is not None:
            path.append(s)
            moves.append(move_from.get(s))
            s = parent.get(s)
        path.reverse()
        moves.reverse()
        moves = [m for m in moves if m is not None]
        return path, moves

    # ========== BFS Algorithm ==========

    def bfs(self):
        """Core BFS algorithm implementation."""
        start = self.start
        if start == self.Goal:
            return [start], [], 0, 0, 0.0

        start_time = time.time()
        frontier = deque([start])
        parent = {start: None}
        move_from = {start: None}
        visited = {start}
        expanded = 0

        while frontier:
            state = frontier.popleft()
            expanded += 1

            if state == self.Goal:
                self.found = True
                end_time = time.time()
                path, moves = self.reconstruct_path(parent, move_from, state)
                return path, moves, expanded, len(moves), end_time - start_time

            for neigh, action in self.get_neighbors(state):
                if neigh not in visited:
                    visited.add(neigh)
                    parent[neigh] = state
                    move_from[neigh] = action
                    frontier.append(neigh)

        end_time = time.time()
        return None, None, expanded, 0, end_time - start_time

    # ========== Run & Getters ==========

    def run(self):
        """Runs BFS and stores all results in instance variables."""
        path, moves, expanded, depth, runtime = self.bfs()
        self.path = path
        self.moves = moves
        self.cost = len(moves)
        self.expanded = expanded
        self.depth = depth
        self.runtime = runtime

    def get_path(self):
        return self.path

    def get_cost(self):
        return self.cost

    def get_expanded(self):
        return self.expanded

    def get_depth(self):
        return self.depth

    def get_runtime(self):
        return self.runtime




# ========== Example Run ==========
if __name__ == "__main__":
    start_state = [
        [1, 2, 5],
        [3, 4, 0],
        [6, 7, 8]
    ]

    solver = BFS(start_state)
    solver.run()

    print("=== BFS Results ===")
    print("Path length:", len(solver.get_path()))
    print("Cost:", solver.get_cost())
    print("Nodes expanded:", solver.get_expanded())
    print("Depth:", solver.get_depth())
    print("Runtime:", solver.get_runtime(), "seconds\n")

