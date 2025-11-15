from dotenv import load_dotenv
load_dotenv()

# FLASK SERVER - HANDLES API REQUESTS

from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import os
from database import get_db_connection, init_db

app = Flask(__name__)
CORS(app)  # Allows front-end to communicate with back-end

# Helper function to hash passwords
def hash_password(password):
    """Converts password to secure hash"""
    return hashlib.sha256(password.encode()).hexdigest()

# ===== USER AUTHENTICATION ROUTES =====

@app.route('/api/register', methods=['POST'])
def register():
    """Creates a new user account"""
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Insert new user
        password_hash = hash_password(password)
        cur.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id',
            (username, email, password_hash)
        )
        user_id = cur.fetchone()['id']
        
        # Create learning profile for user
        cur.execute(
            'INSERT INTO learning_profiles (user_id) VALUES (%s)',
            (user_id,)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'message': 'User created successfully', 'user_id': user_id}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Authenticates user and returns their ID"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Missing credentials'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        password_hash = hash_password(password)
        cur.execute(
            'SELECT id, username FROM users WHERE username = %s AND password_hash = %s',
            (username, password_hash)
        )
        user = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if user:
            return jsonify({'message': 'Login successful', 'user_id': user['id'], 'username': user['username']}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== LEARNING PROFILE ROUTES =====

@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    """Gets user's overall learning profile"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get overall stats
        cur.execute(
            'SELECT * FROM learning_profiles WHERE user_id = %s',
            (user_id,)
        )
        profile = cur.fetchone()
        
        # Get skill breakdown
        cur.execute(
            'SELECT * FROM skill_performance WHERE user_id = %s ORDER BY skill_name',
            (user_id,)
        )
        skills = cur.fetchall()
        
        # Get recent sessions
        cur.execute(
            'SELECT * FROM quiz_sessions WHERE user_id = %s ORDER BY completed_at DESC LIMIT 10',
            (user_id,)
        )
        sessions = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'profile': profile,
            'skills': skills,
            'recent_sessions': sessions
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== QUIZ SESSION ROUTES =====

@app.route('/api/session/start', methods=['POST'])
def start_session():
    """Creates a new quiz session"""
    data = request.json
    user_id = data.get('user_id')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # We'll update this session when quiz completes
        # For now, just create a placeholder
        return jsonify({'message': 'Session ready', 'user_id': user_id}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/session/save', methods=['POST'])
def save_session():
    """Saves completed quiz session and all answers"""
    data = request.json
    user_id = data.get('user_id')
    score = data.get('score')
    total_questions = data.get('total_questions')
    difficulty_end = data.get('difficulty_end')
    learning_profile = data.get('learning_profile')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Create quiz session record
        cur.execute(
            '''INSERT INTO quiz_sessions (user_id, score, total_questions, difficulty_end) 
               VALUES (%s, %s, %s, %s) RETURNING id''',
            (user_id, score, total_questions, difficulty_end)
        )
        session_id = cur.fetchone()['id']
        
        # Update overall learning profile
        cur.execute(
            '''UPDATE learning_profiles 
               SET total_questions_answered = total_questions_answered + %s,
                   total_correct = total_correct + %s,
                   average_score = (total_correct + %s) * 100.0 / (total_questions_answered + %s),
                   last_active = CURRENT_TIMESTAMP
               WHERE user_id = %s''',
            (total_questions, score, score, total_questions, user_id)
        )
        
        # Update skill performance for each skill
        for skill_name, skill_data in learning_profile.items():
            if skill_name == 'subSkills' or skill_data['total'] == 0:
                continue
            
            # Check if skill record exists
            cur.execute(
                'SELECT id FROM skill_performance WHERE user_id = %s AND skill_name = %s',
                (user_id, skill_name)
            )
            existing = cur.fetchone()
            
            if existing:
                # Update existing record
                cur.execute(
                    '''UPDATE skill_performance 
                       SET correct_count = correct_count + %s,
                           total_count = total_count + %s
                       WHERE user_id = %s AND skill_name = %s''',
                    (skill_data['correct'], skill_data['total'], user_id, skill_name)
                )
            else:
                # Create new record
                skill_type = 'verbal' if 'vocabulary' in skill_name else 'quantitative'
                cur.execute(
                    '''INSERT INTO skill_performance (user_id, skill_name, skill_type, correct_count, total_count)
                       VALUES (%s, %s, %s, %s, %s)''',
                    (user_id, skill_name, skill_type, skill_data['correct'], skill_data['total'])
                )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'message': 'Session saved successfully', 'session_id': session_id}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== HEALTH CHECK =====

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple endpoint to check if server is running"""
    return jsonify({'status': 'Server is running!'}), 200

# ===== RUN SERVER =====

if __name__ == '__main__':
    # Initialize database tables on first run
    if os.environ.get('DATABASE_URL'):
        init_db()
    
    # Start server
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)