// COMPREHENSIVE QUESTION BANK WITH DETAILED SKILL TAGGING
const questionBank = {
    easy: [
        {
            question: "If x + 8 = 15, what is the value of x?",
            options: ["7", "8", "23", "15"],
            correct: 0,
            category: "Quantitative",
            primarySkill: "algebra_basic",
            subSkills: ["linear_equations", "single_variable", "arithmetic_operations"],
            difficulty: "easy",
            explanation: "Subtract 8 from both sides: x = 15 - 8 = 7"
        },
        {
            question: "Choose the word closest in meaning to BRIEF:",
            options: ["Long", "Short", "Detailed", "Complex"],
            correct: 1,
            category: "Verbal",
            primarySkill: "vocabulary_synonyms",
            subSkills: ["common_words", "single_meaning"],
            difficulty: "easy",
            explanation: "Brief means short in duration or length."
        },
        {
            question: "What is 25% of 80?",
            options: ["15", "20", "25", "30"],
            correct: 1,
            category: "Quantitative",
            primarySkill: "arithmetic_percentages",
            subSkills: ["percentage_calculation", "basic_multiplication"],
            difficulty: "easy",
            explanation: "25% = 1/4, so 80 ÷ 4 = 20"
        },
        {
            question: "If a rectangle has length 10 and width 5, what is its area?",
            options: ["15", "30", "50", "25"],
            correct: 2,
            category: "Quantitative",
            primarySkill: "geometry_area",
            subSkills: ["rectangle_formulas", "basic_multiplication"],
            difficulty: "easy",
            explanation: "Area = length × width = 10 × 5 = 50"
        },
        {
            question: "Choose the word closest in meaning to HAPPY:",
            options: ["Sad", "Joyful", "Angry", "Tired"],
            correct: 1,
            category: "Verbal",
            primarySkill: "vocabulary_synonyms",
            subSkills: ["emotion_words", "common_words"],
            difficulty: "easy",
            explanation: "Joyful is a synonym for happy, expressing positive emotion."
        }
    ],
    
    medium: [
        {
            question: "If 3x - 7 = 14, what is the value of x?",
            options: ["3", "7", "21", "5"],
            correct: 1,
            category: "Quantitative",
            primarySkill: "algebra_intermediate",
            subSkills: ["linear_equations", "multi_step_solving", "arithmetic_operations"],
            difficulty: "medium",
            explanation: "Add 7 to both sides: 3x = 21, then divide by 3: x = 7"
        },
        {
            question: "A store marks up the price of a jacket by 40% from its cost of $50. What is the selling price?",
            options: ["$60", "$65", "$70", "$75"],
            correct: 2,
            category: "Quantitative",
            primarySkill: "arithmetic_percentages",
            subSkills: ["percentage_increase", "word_problem_translation", "real_world_application"],
            difficulty: "medium",
            explanation: "40% of $50 = $20, so selling price = $50 + $20 = $70"
        },
        {
            question: "Choose the word closest in meaning to ELOQUENT:",
            options: ["Silent", "Articulate", "Confused", "Brief"],
            correct: 1,
            category: "Verbal",
            primarySkill: "vocabulary_advanced",
            subSkills: ["abstract_concepts", "nuanced_meaning"],
            difficulty: "medium",
            explanation: "Eloquent means fluent and articulate in speech or writing."
        },
        {
            question: "If the average of three numbers is 24, and two of the numbers are 20 and 22, what is the third number?",
            options: ["26", "28", "30", "32"],
            correct: 1,
            category: "Quantitative",
            primarySkill: "data_analysis_statistics",
            subSkills: ["mean_calculation", "algebraic_reasoning", "problem_solving"],
            difficulty: "medium",
            explanation: "Total = 24 × 3 = 72. Third number = 72 - 20 - 22 = 28"
        },
        {
            question: "A train travels 180 miles in 3 hours. What is its average speed in miles per hour?",
            options: ["50 mph", "55 mph", "60 mph", "65 mph"],
            correct: 2,
            category: "Quantitative",
            primarySkill: "arithmetic_rates",
            subSkills: ["rate_calculation", "division", "word_problem_translation"],
            difficulty: "medium",
            explanation: "Speed = Distance ÷ Time = 180 ÷ 3 = 60 mph"
        },
        {
            question: "Choose the word closest in meaning to METICULOUS:",
            options: ["Careless", "Thorough", "Quick", "Simple"],
            correct: 1,
            category: "Verbal",
            primarySkill: "vocabulary_advanced",
            subSkills: ["precision_words", "character_traits"],
            difficulty: "medium",
            explanation: "Meticulous means showing great attention to detail; very careful and thorough."
        },
        {
            question: "If y = 2x + 5 and x = 3, what is the value of y?",
            options: ["8", "9", "10", "11"],
            correct: 3,
            category: "Quantitative",
            primarySkill: "algebra_substitution",
            subSkills: ["variable_substitution", "order_of_operations", "linear_expressions"],
            difficulty: "medium",
            explanation: "Substitute x = 3: y = 2(3) + 5 = 6 + 5 = 11"
        },
        {
            question: "In a class of 40 students, 60% are female. How many male students are there?",
            options: ["12", "14", "16", "18"],
            correct: 2,
            category: "Quantitative",
            primarySkill: "arithmetic_percentages",
            subSkills: ["percentage_calculation", "complementary_percentages", "word_problem_translation"],
            difficulty: "medium",
            explanation: "If 60% are female, 40% are male. 40% of 40 = 0.40 × 40 = 16"
        }
    ],
    
    hard: [
        {
            question: "If 2^x = 32, what is the value of x?",
            options: ["4", "5", "6", "16"],
            correct: 1,
            category: "Quantitative",
            primarySkill: "algebra_exponents",
            subSkills: ["exponential_equations", "powers_of_two", "logarithmic_thinking"],
            difficulty: "hard",
            explanation: "2^5 = 32, so x = 5. (2×2×2×2×2 = 32)"
        },
        {
            question: "Choose the word closest in meaning to EPHEMERAL:",
            options: ["Permanent", "Fleeting", "Ancient", "Heavy"],
            correct: 1,
            category: "Verbal",
            primarySkill: "vocabulary_advanced",
            subSkills: ["rare_words", "temporal_concepts", "abstract_meaning"],
            difficulty: "hard",
            explanation: "Ephemeral means lasting for a very short time; transient or fleeting."
        },
        {
            question: "If the ratio of boys to girls in a class is 3:5 and there are 24 boys, how many total students are in the class?",
            options: ["40", "48", "56", "64"],
            correct: 3,
            category: "Quantitative",
            primarySkill: "arithmetic_ratios",
            subSkills: ["ratio_problems", "proportional_reasoning", "multi_step_solving", "word_problem_translation"],
            difficulty: "hard",
            explanation: "If 3 parts = 24 boys, then 1 part = 8. Total = 8 parts = 8 × 8 = 64 students"
        },
        {
            question: "A car's value depreciates by 15% each year. If it's worth $20,000 today, what will it be worth in 2 years?",
            options: ["$14,450", "$15,300", "$16,150", "$17,000"],
            correct: 0,
            category: "Quantitative",
            primarySkill: "arithmetic_compound_percentages",
            subSkills: ["exponential_decay", "multi_step_percentages", "real_world_application"],
            difficulty: "hard",
            explanation: "After year 1: $20,000 × 0.85 = $17,000. After year 2: $17,000 × 0.85 = $14,450"
        },
        {
            question: "Choose the word closest in meaning to UBIQUITOUS:",
            options: ["Rare", "Omnipresent", "Ancient", "Valuable"],
            correct: 1,
            category: "Verbal",
            primarySkill: "vocabulary_advanced",
            subSkills: ["rare_words", "spatial_concepts", "latin_roots"],
            difficulty: "hard",
            explanation: "Ubiquitous means existing or being everywhere at the same time; omnipresent."
        },
        {
            question: "If x² - 5x + 6 = 0, what are the possible values of x?",
            options: ["2 and 3", "1 and 6", "-2 and -3", "2 and -3"],
            correct: 0,
            category: "Quantitative",
            primarySkill: "algebra_quadratics",
            subSkills: ["factoring", "quadratic_equations", "multiple_solutions"],
            difficulty: "hard",
            explanation: "Factor: (x-2)(x-3) = 0, so x = 2 or x = 3"
        },
        {
            question: "In a survey, 40% of respondents like coffee, 50% like tea, and 20% like both. What percentage like neither?",
            options: ["10%", "20%", "30%", "40%"],
            correct: 2,
            category: "Quantitative",
            primarySkill: "data_analysis_sets",
            subSkills: ["set_theory", "venn_diagrams", "logical_reasoning", "percentage_operations"],
            difficulty: "hard",
            explanation: "Coffee or Tea = 40% + 50% - 20% = 70%. Neither = 100% - 70% = 30%"
        },
        {
            question: "Choose the word closest in meaning to PRAGMATIC:",
            options: ["Idealistic", "Practical", "Pessimistic", "Artistic"],
            correct: 1,
            category: "Verbal",
            primarySkill: "vocabulary_advanced",
            subSkills: ["philosophy_terms", "approach_words", "nuanced_meaning"],
            difficulty: "hard",
            explanation: "Pragmatic means dealing with things in a practical, realistic way rather than theoretically."
        }
    ]
};