import time

class IDS:
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
    
    # ========= Getters =========
    def get_path(self):
        return self.path
    
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
    
    
    # ========= Utilities =========
    def state_to_tuple(self, state):
        return tuple(tuple(row) for row in state)

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

    # ========= Depth-Limited DFS =========
    def dls(self, state, path, moves, visited, limit):
        """Depth-Limited Search helper function"""
        self.expanded += 1
        
        # Track maximum depth
        current_depth = len(moves)
        if current_depth > self.max_depth:
            self.max_depth = current_depth
        
        # Goal test
        if state == self.Goal:
            self.path = path
            self.moves = moves
            return True
        
        # Depth limit reached
        if len(moves) >= limit:
            return False
        
        # Explore neighbors
        for neighbor, action in self.get_neighbors(state):
            if neighbor not in visited:
                visited.add(neighbor)
                if self.dls(neighbor, path + [neighbor], moves + [action], visited, limit):
                    return True
                visited.remove(neighbor)
        
        return False

    # ========= Iterative Deepening Search =========
    def ids(self, max_depth=50):
        """Iterative Deepening Search - tries DFS with increasing depth limits"""
        start_time = time.time()
        self.expanded = 0
        self.max_depth = 0

        # Try increasing depth limits
        for depth_limit in range(max_depth + 1):
            visited = set([self.start])
            
            if self.dls(self.start, [self.start], [], visited, depth_limit):
                self.found = True
                self.runtime = time.time() - start_time
                return

        # No solution found within max_depth
        self.runtime = time.time() - start_time
        self.found = False

    def run(self, max_depth=50):
        self.ids(max_depth)




# ========= Example Run =========
if __name__ == "__main__":
    start_state = [
        [1, 2, 5],
        [3, 4, 0],
        [6, 7, 8]
    ]

    solver = IDS(start_state)
    solver.run()
    print("=== IDS Results ===")
    print("Solution found:", solver.found)
    print("Path length:", len(solver.get_path()))
    print("Cost:", solver.get_cost())
    print("Nodes expanded:", solver.get_expanded())
    print("Max depth reached:", solver.get_depth())
    print("Runtime:", solver.get_runtime(), "seconds")
    if solver.found:
        print("Moves:", solver.get_moves())