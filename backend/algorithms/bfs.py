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

        self.path = []
        self.moves = []
        self.expanded = 0
        self.max_depth = 0
        self.runtime = 0.0
        self.found = False
    
    def state_to_tuple(self, state):
        return tuple(tuple(row) for row in state)
    
    def tuple_to_list(self, state_tuple):
        return [list(row) for row in state_tuple]

    def find_zero(self, state):
        for i in range(3):
            for j in range(3):
                if state[i][j] == 0:
                    return i, j

    def get_neighbors(self, state):
        neighbors = []
        i, j = self.find_zero(state)
        directions = [
            (-1, 0, "Up"),
            (1, 0, "Down"),
            (0, -1, "Left"),
            (0, 1, "Right")
        ]
        for di, dj, action in directions:
            ni, nj = i + di, j + dj
            if 0 <= ni < 3 and 0 <= nj < 3:
                new_state = [list(row) for row in state]
                new_state[i][j], new_state[ni][nj] = new_state[ni][nj], new_state[i][j]
                neighbors.append((self.state_to_tuple(new_state), action))
        return neighbors

    def bfs(self):
        start_time = time.time()
        queue = deque()
        visited = set()
        
        queue.append((self.start, [self.start], []))
        visited.add(self.start)
        self.expanded = 0
        self.max_depth = 0

        while queue:
            state, path, moves = queue.popleft()
            self.expanded += 1
            
            current_depth = len(moves)
            if current_depth > self.max_depth:
                self.max_depth = current_depth

            if state == self.Goal:
                self.path = path
                self.moves = moves
                self.found = True
                self.runtime = time.time() - start_time
                return

            for neighbor, action in self.get_neighbors(state):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor], moves + [action]))

        self.runtime = time.time() - start_time
        self.found = False

    def run(self):
        self.bfs()
        
    def get_path(self):
        return [self.tuple_to_list(state) for state in self.path]
    
    def get_moves(self):
        return self.moves
    
    def get_cost(self):
        return len(self.moves)
    
    def get_expanded(self):
        return self.expanded
    
    def get_runtime(self):
        return self.runtime
    
    def get_depth(self):
        return self.max_depth
    
    
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