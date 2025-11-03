import heapq
import math
import time

class AStarM:
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
            (0, -1, "Left"),
            (1, 0, "Down"),
            (0, 1, "Right")
        ]
        for di, dj, action in directions:
            ni, nj = i + di, j + dj
            if 0 <= ni < 3 and 0 <= nj < 3:
                new_state = [list(row) for row in state]
                new_state[i][j], new_state[ni][nj] = new_state[ni][nj], new_state[i][j]
                neighbors.append((self.state_to_tuple(new_state), action))
        return neighbors

    def manhattan_distance(self, state):
        distance = 0
        goal_positions = {
            0: (0, 0), 1: (0, 1), 2: (0, 2),
            3: (1, 0), 4: (1, 1), 5: (1, 2),
            6: (2, 0), 7: (2, 1), 8: (2, 2)
        }
        
        for i in range(3):
            for j in range(3):
                tile = state[i][j]
                if tile != 0:
                    goal_i, goal_j = goal_positions[tile]
                    distance += abs(i - goal_i) + abs(j - goal_j)
        return distance

    def a_star(self):
        start_time = time.time()
        open_set = []
        heapq.heappush(open_set, (0, 0, self.start, [], []))  # (f, g, state, path, moves)
        
        g_scores = {self.start: 0}
        came_from = {}
        self.expanded = 0
        self.max_depth = 0

        while open_set:
            f, g, state, path, moves = heapq.heappop(open_set)
            self.expanded += 1
            
            current_depth = len(moves)
            if current_depth > self.max_depth:
                self.max_depth = current_depth

            if state == self.Goal:
                self.path = path + [state]
                self.moves = moves
                self.found = True
                self.runtime = time.time() - start_time
                return

            for neighbor, action in self.get_neighbors(state):
                tentative_g = g + 1
                
                if neighbor not in g_scores or tentative_g < g_scores[neighbor]:
                    g_scores[neighbor] = tentative_g
                    h = self.manhattan_distance(neighbor)
                    f = tentative_g + h
                    
                    heapq.heappush(open_set, (f, tentative_g, neighbor, path + [state], moves + [action]))

        self.runtime = time.time() - start_time
        self.found = False

    def run(self):
        self.a_star()
        
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
    



class AStarE:
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
            (0, -1, "Left"),
            (1, 0, "Down"),
            (0, 1, "Right")
        ]
        for di, dj, action in directions:
            ni, nj = i + di, j + dj
            if 0 <= ni < 3 and 0 <= nj < 3:
                new_state = [list(row) for row in state]
                new_state[i][j], new_state[ni][nj] = new_state[ni][nj], new_state[i][j]
                neighbors.append((self.state_to_tuple(new_state), action))
        return neighbors

    # === Heuristic: Euclidean Distance ===
    def euclidean_distance(self, state):
        distance = 0
        goal_positions = {
            0: (0, 0), 1: (0, 1), 2: (0, 2),
            3: (1, 0), 4: (1, 1), 5: (1, 2),
            6: (2, 0), 7: (2, 1), 8: (2, 2)
        }

        for i in range(3):
            for j in range(3):
                tile = state[i][j]
                if tile != 0:
                    goal_i, goal_j = goal_positions[tile]
                    distance += math.sqrt((i - goal_i)**2 + (j - goal_j)**2)
        return distance

    def a_star(self):
        start_time = time.time()
        open_set = []
        heapq.heappush(open_set, (0, 0, self.start, [], []))  # (f, g, state, path, moves)
        
        g_scores = {self.start: 0}
        self.expanded = 0
        self.max_depth = 0

        while open_set:
            f, g, state, path, moves = heapq.heappop(open_set)
            self.expanded += 1
            
            current_depth = len(moves)
            if current_depth > self.max_depth:
                self.max_depth = current_depth

            if state == self.Goal:
                self.path = path + [state]
                self.moves = moves
                self.found = True
                self.runtime = time.time() - start_time
                return

            for neighbor, action in self.get_neighbors(state):
                tentative_g = g + 1
                
                if neighbor not in g_scores or tentative_g < g_scores[neighbor]:
                    g_scores[neighbor] = tentative_g
                    h = self.euclidean_distance(neighbor)
                    f = tentative_g + h
                    
                    heapq.heappush(open_set, (f, tentative_g, neighbor, path + [state], moves + [action]))

        self.runtime = time.time() - start_time
        self.found = False

    def run(self):
        self.a_star()

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
        [1, 5, 2],
        [3, 4, 0],
        [6, 7, 8]
    ]

    solver = AStarM(start_state)
    solver.run()
    print("=== A* manhattan_distance Results ===")
    print("Solution found:", solver.found)
    print("Path length:", len(solver.get_path()))
    print("Cost:", solver.get_cost())
    print("Nodes expanded:", solver.get_expanded())
    print("Max depth reached:", solver.get_depth())
    print("Runtime:", solver.get_runtime(), "seconds")
    
    if solver.found:
        print("Moves:", solver.get_moves())
    solver = AStarE(start_state)
    solver.run()
    print("=== A* Euclidean Distance Results ===")
    print("Solution found:", solver.found)
    print("Path length:", len(solver.get_path()))
    print("Cost:", solver.get_cost())
    print("Nodes expanded:", solver.get_expanded())
    print("Max depth reached:", solver.get_depth())
    print("Runtime:", solver.get_runtime(), "seconds")
    if solver.found:
        print("Moves:", solver.get_moves())