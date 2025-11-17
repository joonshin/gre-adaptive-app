from dotenv import load_dotenv
load_dotenv()

from database import get_db_connection

def add_sample_questions():
    """Add sample questions for testing"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Sample questions for Number Theory
    sample_questions = [
        {
            'question_text': 'What is the greatest common divisor (GCD) of 48 and 18?',
            'option_a': '2',
            'option_b': '3',
            'option_c': '6',
            'option_d': '9',
            'option_e': '12',
            'correct_answer': 2,  # Index 2 = option_c = 6
            'topic': 'number_theory',
            'difficulty': 'easy',
            'explanation': 'The factors of 48 are 1, 2, 3, 4, 6, 8, 12, 16, 24, 48. The factors of 18 are 1, 2, 3, 6, 9, 18. The greatest common factor is 6.'
        },
        {
            'question_text': 'If n is a prime number greater than 3, which of the following must be true?',
            'option_a': 'n is odd',
            'option_b': 'n + 1 is even',
            'option_c': 'n - 1 is divisible by 2',
            'option_d': 'All of the above',
            'option_e': 'None of the above',
            'correct_answer': 3,  # Index 3 = option_d
            'topic': 'number_theory',
            'difficulty': 'medium',
            'explanation': 'All prime numbers greater than 3 are odd, which means n+1 is even and n-1 is divisible by 2.'
        },
        {
            'question_text': 'How many positive divisors does 72 have?',
            'option_a': '8',
            'option_b': '10',
            'option_c': '12',
            'option_d': '14',
            'option_e': '16',
            'correct_answer': 2,  # Index 2 = option_c = 12
            'topic': 'number_theory',
            'difficulty': 'medium',
            'explanation': '72 = 2³ × 3². Number of divisors = (3+1)(2+1) = 12. The divisors are: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72.'
        }
    ]
    
    # Insert questions
    for q in sample_questions:
        cur.execute('''
            INSERT INTO questions 
            (question_text, option_a, option_b, option_c, option_d, option_e, 
             correct_answer, topic, difficulty, explanation)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (q['question_text'], q['option_a'], q['option_b'], q['option_c'], 
              q['option_d'], q['option_e'], q['correct_answer'], q['topic'], 
              q['difficulty'], q['explanation']))
    
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"✅ Added {len(sample_questions)} sample questions to database!")

if __name__ == '__main__':
    add_sample_questions()