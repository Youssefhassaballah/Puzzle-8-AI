from flask import Flask, request, jsonify
from flask_cors import CORS
from algorithms.dfs import DFS
from algorithms.bfs import BFS
from algorithms.ids import IDS
from algorithms.a_star import AStar

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/algorithms', methods=['GET'])
def get_algorithms():
    """Return list of available algorithms"""
    algorithms = [
        {'value': 'dfs', 'label': 'Depth-First Search (DFS)'},
        {'value': 'bfs', 'label': 'Breadth-First Search (BFS)'},
        {'value': 'ids', 'label': 'Iterative DFS (IDS)'},
        {'value': 'a_star', 'label': 'A* Search'}
    ]
    return jsonify(algorithms)

def is_solvable( state):
    flat = [num for row in state for num in row if num != 0]
    inv = sum(1 for i in range(len(flat)) for j in range(i+1, len(flat)) if flat[i] > flat[j])
    return inv % 2 == 0


@app.route('/api/run-algorithm', methods=['POST'])
def run_algorithm():
    """Run the specified algorithm on the given puzzle state"""
    try:
        data = request.get_json()
        algorithm = data.get('algorithm')
        start_state = data.get('start_state')
        
        if not algorithm or not start_state:
            return jsonify({'error': 'Missing algorithm or start_state'}), 400
        
        # Validate start_state is a 3x3 grid
        if len(start_state) != 3 or any(len(row) != 3 for row in start_state):
            return jsonify({'error': 'Invalid start_state format. Must be 3x3 grid.'}), 400
        
        # Initialize the appropriate solver
        if algorithm == 'dfs':
            solver = DFS(start_state)
        elif algorithm == 'bfs':
            solver = BFS(start_state)
        elif algorithm == 'ids':
            solver = IDS(start_state)
        elif algorithm == 'a_star':
            solver = AStar(start_state)
        else:
            return jsonify({'error': f'Unknown algorithm: {algorithm}'}), 400
        
        # Run the algorithm
        solver.run()
        
        # Return results in EXACT format expected by frontend
        return jsonify({
            'path': solver.get_path(),
            'moves': solver.get_moves(),
            'cost': solver.get_cost(),
            'expanded': solver.get_expanded(),
            'depth': solver.get_depth(),
            'runtime': solver.get_runtime(),
            'found': solver.found
        })
        
    except Exception as e:
        return jsonify({'error': f'Algorithm execution failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Flask backend is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)