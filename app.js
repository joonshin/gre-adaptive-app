// APPLICATION LOGIC FOR GRE ADAPTIVE PREP

const API_URL = 'http://127.0.0.1:5001/api';

// Check if user is logged in
const userId = localStorage.getItem('user_id');
const username = localStorage.getItem('username');

if (!userId) {
    // Not logged in - redirect to auth page
    window.location.href = 'auth.html';
}

// APPLICATION LOGIC FOR GRE ADAPTIVE PREP

// LEARNING PROFILE - Tracks detailed performance across all skills
let learningProfile = {
    // Primary skill categories
    algebra_basic: { correct: 0, total: 0, questions: [] },
    algebra_intermediate: { correct: 0, total: 0, questions: [] },
    algebra_substitution: { correct: 0, total: 0, questions: [] },
    algebra_exponents: { correct: 0, total: 0, questions: [] },
    algebra_quadratics: { correct: 0, total: 0, questions: [] },
    arithmetic_percentages: { correct: 0, total: 0, questions: [] },
    arithmetic_compound_percentages: { correct: 0, total: 0, questions: [] },
    arithmetic_ratios: { correct: 0, total: 0, questions: [] },
    arithmetic_rates: { correct: 0, total: 0, questions: [] },
    geometry_area: { correct: 0, total: 0, questions: [] },
    data_analysis_statistics: { correct: 0, total: 0, questions: [] },
    data_analysis_sets: { correct: 0, total: 0, questions: [] },
    vocabulary_synonyms: { correct: 0, total: 0, questions: [] },
    vocabulary_advanced: { correct: 0, total: 0, questions: [] },
    
    // Sub-skill tracking
    subSkills: {}
};

// QUIZ STATE VARIABLES
let currentDifficulty = 'easy';
let questionNumber = 0;
let correctAnswers = 0;
let askedQuestions = [];
let currentQuestion = null;
const totalQuestions = 15;

// ADAPTIVE DIFFICULTY ALGORITHM
let consecutiveCorrect = 0;
let consecutiveIncorrect = 0;

function adjustDifficulty(wasCorrect) {
    if (wasCorrect) {
        consecutiveCorrect++;
        consecutiveIncorrect = 0;
        
        // Move up after 2 consecutive correct answers
        if (consecutiveCorrect >= 2) {
            if (currentDifficulty === 'easy') {
                currentDifficulty = 'medium';
                consecutiveCorrect = 0;
            } else if (currentDifficulty === 'medium') {
                currentDifficulty = 'hard';
                consecutiveCorrect = 0;
            }
        }
    } else {
        consecutiveIncorrect++;
        consecutiveCorrect = 0;
        
        // Move down after 2 consecutive incorrect answers
        if (consecutiveIncorrect >= 2) {
            if (currentDifficulty === 'hard') {
                currentDifficulty = 'medium';
                consecutiveIncorrect = 0;
            } else if (currentDifficulty === 'medium') {
                currentDifficulty = 'easy';
                consecutiveIncorrect = 0;
            }
        }
    }
}

function getRandomQuestion(difficulty) {
    const questions = questionBank[difficulty];
    const availableQuestions = questions.filter(q => !askedQuestions.includes(q));
    
    if (availableQuestions.length === 0) {
        // If we've exhausted this difficulty, try adjacent difficulties
        const allQuestions = [...questionBank.easy, ...questionBank.medium, ...questionBank.hard];
        const available = allQuestions.filter(q => !askedQuestions.includes(q));
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    }
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
}

function updateProgressBar() {
    const progress = (questionNumber / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

function displayQuestion() {
    questionNumber++;
    
    if (questionNumber > totalQuestions) {
        showResults();
        return;
    }
    
    currentQuestion = getRandomQuestion(currentDifficulty);
    if (!currentQuestion) {
        showResults();
        return;
    }
    
    askedQuestions.push(currentQuestion);
    
    // Update progress
    updateProgressBar();
    document.getElementById('current-question').textContent = questionNumber;
    document.getElementById('total-questions').textContent = totalQuestions;
    
    // Update question display
    document.getElementById('category-badge').textContent = currentQuestion.category;
    
    const diffIndicator = document.getElementById('difficulty-indicator');
    diffIndicator.textContent = currentQuestion.difficulty.toUpperCase();
    diffIndicator.className = 'difficulty-indicator diff-' + currentQuestion.difficulty;
    
    document.getElementById('question-text').textContent = currentQuestion.question;
    
    // Display options
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    // Hide feedback and next button
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
}

function checkAnswer(selectedIndex) {
    const isCorrect = selectedIndex === currentQuestion.correct;
    
    // Update primary skill tracking
    const primarySkill = currentQuestion.primarySkill;
    if (!learningProfile[primarySkill]) {
        learningProfile[primarySkill] = { correct: 0, total: 0, questions: [] };
    }
    learningProfile[primarySkill].total++;
    learningProfile[primarySkill].questions.push({
        question: currentQuestion.question,
        correct: isCorrect
    });
    
    // Update sub-skills tracking
    currentQuestion.subSkills.forEach(subSkill => {
        if (!learningProfile.subSkills[subSkill]) {
            learningProfile.subSkills[subSkill] = { correct: 0, total: 0 };
        }
        learningProfile.subSkills[subSkill].total++;
        if (isCorrect) {
            learningProfile.subSkills[subSkill].correct++;
        }
    });
    
    // Visual feedback on selected button
    const buttons = document.querySelectorAll('.option-btn');
    buttons[selectedIndex].classList.add(isCorrect ? 'selected-correct' : 'selected-incorrect');
    if (!isCorrect) {
        buttons[currentQuestion.correct].classList.add('selected-correct');
    }
    
    // Update stats and difficulty
    if (isCorrect) {
        correctAnswers++;
        learningProfile[primarySkill].correct++;
    }
    
    adjustDifficulty(isCorrect);
    
    // Show feedback
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
    
    let feedbackHTML = isCorrect ? 
        '<strong>✓ Correct!</strong>' : 
        `<strong>✗ Incorrect.</strong> The correct answer was: ${currentQuestion.options[currentQuestion.correct]}`;
    
    feedbackHTML += `<div class="explanation"><strong>Explanation:</strong> ${currentQuestion.explanation}</div>`;
    
    feedbackDiv.innerHTML = feedbackHTML;
    feedbackDiv.classList.remove('hidden');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Show next button
    document.getElementById('next-btn').classList.remove('hidden');
}

function showResults() {
    document.getElementById('quiz-section').classList.add('hidden');
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('hidden');
    
    // Display score
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    document.getElementById('final-score').textContent = `${percentage}%`;
    
    saveSessionToDatabase();
    
    // Analyze performance
    let analysisHTML = '<h3>📊 Detailed Performance Analysis</h3>';
    
    // Group skills by category
    const quantSkills = {};
    const verbalSkills = {};
    
    for (const [skill, data] of Object.entries(learningProfile)) {
        if (skill === 'subSkills' || data.total === 0) continue;
        
        if (skill.startsWith('vocabulary')) {
            verbalSkills[skill] = data;
        } else {
            quantSkills[skill] = data;
        }
    }
    
    // Display Quantitative skills
    if (Object.keys(quantSkills).length > 0) {
        analysisHTML += '<h4 style="color: #3498db; margin-top: 25px;">Quantitative Skills</h4>';
        for (const [skill, data] of Object.entries(quantSkills)) {
            const percent = Math.round((data.correct / data.total) * 100);
            const skillClass = percent >= 70 ? 'skill-strong' : (percent >= 50 ? 'skill-neutral' : 'skill-weak');
            const skillName = skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            analysisHTML += `
                <div class="skill-item ${skillClass}">
                    <div class="skill-name">${skillName}</div>
                    <div class="skill-stats">${data.correct}/${data.total} correct (${percent}%)</div>
                </div>
            `;
        }
    }
    
    // Display Verbal skills
    if (Object.keys(verbalSkills).length > 0) {
        analysisHTML += '<h4 style="color: #9b59b6; margin-top: 25px;">Verbal Skills</h4>';
        for (const [skill, data] of Object.entries(verbalSkills)) {
            const percent = Math.round((data.correct / data.total) * 100);
            const skillClass = percent >= 70 ? 'skill-strong' : (percent >= 50 ? 'skill-neutral' : 'skill-weak');
            const skillName = skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            analysisHTML += `
                <div class="skill-item ${skillClass}">
                    <div class="skill-name">${skillName}</div>
                    <div class="skill-stats">${data.correct}/${data.total} correct (${percent}%)</div>
                </div>
            `;
        }
    }
    
    document.getElementById('analysis').innerHTML = analysisHTML;
    
    // Generate personalized insights
    generateInsights();
}

function generateInsights() {
    let insightsHTML = '<h4>💡 Personalized Learning Insights</h4><ul>';
    
    // Find strongest and weakest areas
    let strengths = [];
    let weaknesses = [];
    
    for (const [skill, data] of Object.entries(learningProfile)) {
        if (skill === 'subSkills' || data.total === 0) continue;
        
        const percent = (data.correct / data.total) * 100;
        const skillName = skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (percent >= 75) {
            strengths.push(skillName);
        } else if (percent < 50) {
            weaknesses.push(skillName);
        }
    }
    
    // Provide insights
    if (strengths.length > 0) {
        insightsHTML += `<li><strong>Your strengths:</strong> You're performing well in ${strengths.join(', ')}. These are solid foundations to build on.</li>`;
    }
    
    if (weaknesses.length > 0) {
        insightsHTML += `<li><strong>Focus areas:</strong> Consider dedicating more study time to ${weaknesses.join(', ')}. Targeted practice in these areas will significantly improve your score.</li>`;
    }
    
    // Check for patterns in sub-skills
    let wordProblemIssues = false;
    let vocabularyIssues = false;
    
    for (const [subSkill, data] of Object.entries(learningProfile.subSkills)) {
        if (data.total >= 2) {
            const percent = (data.correct / data.total) * 100;
            
            if (subSkill.includes('word_problem') && percent < 50) {
                wordProblemIssues = true;
            }
            if (subSkill.includes('vocabulary') && percent < 50) {
                vocabularyIssues = true;
            }
        }
    }
    
    if (wordProblemIssues) {
        insightsHTML += '<li><strong>Word problem translation:</strong> You may benefit from practicing how to convert word problems into mathematical equations. Try breaking down problems into smaller steps.</li>';
    }
    
    if (vocabularyIssues) {
        insightsHTML += '<li><strong>Vocabulary building:</strong> Consider using flashcards or reading challenging material to expand your vocabulary. Context-based learning tends to be most effective.</li>';
    }
    
    // Difficulty progression insight
    const finalDiff = currentDifficulty;
    if (finalDiff === 'hard') {
        insightsHTML += '<li><strong>Challenge level:</strong> You finished on hard difficulty questions, which shows strong adaptive learning. Keep challenging yourself with advanced material.</li>';
    } else if (finalDiff === 'easy') {
        insightsHTML += '<li><strong>Foundation building:</strong> Focus on mastering fundamental concepts before moving to more complex problems. Consistency is key.</li>';
    }
    
    insightsHTML += '</ul>';
    
    document.getElementById('insights').innerHTML = insightsHTML;
}

async function saveSessionToDatabase() {
    try {
        const response = await fetch(`${API_URL}/session/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                score: correctAnswers,
                total_questions: totalQuestions,
                difficulty_end: currentDifficulty,
                learning_profile: learningProfile
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('Progress saved successfully!');
        } else {
            console.error('Failed to save progress:', data.error);
        }
    } catch (error) {
        console.error('Could not connect to server:', error);
    }
}

function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    window.location.href = 'auth.html';
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('next-btn').onclick = displayQuestion;
    document.getElementById('total-questions').textContent = totalQuestions;
    displayQuestion();
});