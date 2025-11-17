# DATABASE CONNECTION AND SETUP

import psycopg2
from psycopg2.extras import RealDictCursor
import os

# This will hold our database connection
DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    """Creates and returns a database connection"""
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn

def init_db():
    """Creates all necessary database tables"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Users table - stores account information
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Learning profiles table - stores overall user stats
    cur.execute('''
        CREATE TABLE IF NOT EXISTS learning_profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            total_questions_answered INTEGER DEFAULT 0,
            total_correct INTEGER DEFAULT 0,
            average_score DECIMAL(5,2) DEFAULT 0,
            last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Skill performance table - tracks performance by skill
    cur.execute('''
        CREATE TABLE IF NOT EXISTS skill_performance (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            skill_name VARCHAR(100) NOT NULL,
            skill_type VARCHAR(50) NOT NULL,
            correct_count INTEGER DEFAULT 0,
            total_count INTEGER DEFAULT 0,
            UNIQUE(user_id, skill_name)
        )
    ''')
    
    # Quiz sessions table - stores individual quiz attempts
    cur.execute('''
        CREATE TABLE IF NOT EXISTS quiz_sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            difficulty_end VARCHAR(20),
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Question attempts table - stores each individual question answer
    cur.execute('''
        CREATE TABLE IF NOT EXISTS question_attempts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            session_id INTEGER REFERENCES quiz_sessions(id) ON DELETE CASCADE,
            question_text TEXT NOT NULL,
            primary_skill VARCHAR(100),
            difficulty VARCHAR(20),
            is_correct BOOLEAN NOT NULL,
            answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Questions table - stores all quiz questions
    cur.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id SERIAL PRIMARY KEY,
            question_text TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            option_e TEXT,
            correct_answer INTEGER NOT NULL,
            topic VARCHAR(100) NOT NULL,
            difficulty VARCHAR(20) NOT NULL,
            explanation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    cur.close()
    conn.close()
    
    print("Database tables created successfully!")