// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const quizMode = document.getElementById('quizMode');
const gameMode = document.getElementById('gameMode');
const translateMode = document.getElementById('translateMode');
const resultsScreen = document.getElementById('resultsScreen');
const feedback = document.getElementById('feedback');
const feedbackText = document.getElementById('feedbackText');
const gameFeedback = document.getElementById('gameFeedback');
const gameFeedbackText = document.getElementById('gameFeedbackText');
const translateFeedback = document.getElementById('translateFeedback');
const translateFeedbackText = document.getElementById('translateFeedbackText');
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');
const scoreEl = document.getElementById('score');
const gameScoreEl = document.getElementById('gameScore');
const translateScoreEl = document.getElementById('translateScore');
const finalScoreEl = document.getElementById('finalScore');
const accuracyRateEl = document.getElementById('accuracyRate');
const encouragementEl = document.getElementById('encouragement');
const infinitiveEl = document.getElementById('infinitive');
const translationEl = document.getElementById('translation');
const preteritInput = document.getElementById('preterit');
const participleInput = document.getElementById('participle');
const quizForm = document.getElementById('quizForm');
const nextQuestionBtn = document.getElementById('nextQuestion');
const backToMenuQuizBtn = document.getElementById('backToMenuQuiz');
const backToMenuGameBtn = document.getElementById('backToMenuGame');
const playAgainBtn = document.getElementById('playAgain');
const quizModeBtn = document.getElementById('quizModeBtn');
const gameModeBtn = document.getElementById('gameModeBtn');
const gameVerb = document.getElementById('gameVerb');
const gameTranslation = document.getElementById('gameTranslation');
const answerOptions = document.getElementById('answerOptions');
const timeLeft = document.getElementById('timeLeft');
const progressBar = document.getElementById('progressBar');
const translateText = document.getElementById('translateText');
const translateDirection = document.getElementById('translateDirection');
const translateOptions = document.getElementById('translateOptions');
const translateTimeLeft = document.getElementById('translateTimeLeft');
const translateProgressBar = document.getElementById('translateProgressBar');
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

// Game variables
let verbs = [];
let currentQuizQuestion = 0;
let totalQuestions = 10;
let score = 0;
let correctAnswers = 0;
let currentGameLevel = 1;
let gameScore = 0;
let currentTranslateLevel = 1;
let translateScore = 0;
let timer;
let timeRemaining = 15;
let currentGameVerb = null;
let currentGameOptions = [];
let currentTranslateWord = null;
let currentTranslateOptions = [];
let isDarkMode = false;
let recentlyUsedVerbs = [];

// Initialize the application
async function init() {
    try {
        const response = await fetch('verbs.json');
        verbs = await response.json();
        setupEventListeners();
        checkDarkModePreference();
    } catch (error) {
        console.error('Error loading verbs:', error);
        alert('Erreur lors du chargement des verbes. Veuillez rafraîchir la page.');
    }
}

// Set up event listeners
function setupEventListeners() {
    quizModeBtn.addEventListener('click', startQuizMode);
    gameModeBtn.addEventListener('click', startGameMode);
    translateModeBtn.addEventListener('click', startTranslateMode);
    quizForm.addEventListener('submit', checkQuizAnswer);
    nextQuestionBtn.addEventListener('click', loadNextQuizQuestion);
    backToMenuQuizBtn.addEventListener('click', goToMainMenu);
    backToMenuGameBtn.addEventListener('click', goToMainMenu);
    backToMenuTranslateBtn.addEventListener('click', goToMainMenu);
    playAgainBtn.addEventListener('click', goToMainMenu);
    themeToggle.addEventListener('click', toggleDarkMode);
}

// Check user's dark mode preference
function checkDarkModePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Toggle dark mode
function toggleDarkMode() {
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Enable dark mode
function enableDarkMode() {
    document.body.classList.add('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
    isDarkMode = true;
    localStorage.setItem('darkMode', 'enabled');
}

// Disable dark mode
function disableDarkMode() {
    document.body.classList.remove('dark');
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
    isDarkMode = false;
    localStorage.setItem('darkMode', 'disabled');
}

// Go to main menu
function goToMainMenu() {
    clearInterval(timer);
    welcomeScreen.classList.remove('hidden');
    quizMode.classList.add('hidden');
    gameMode.classList.add('hidden');
    translateMode.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    feedback.classList.add('hidden');
    gameFeedback.classList.add('hidden');
    translateFeedback.classList.add('hidden');
    resetGame();
}

// Reset game state
function resetGame() {
    currentQuizQuestion = 0;
    score = 0;
    correctAnswers = 0;
    scoreEl.textContent = '0';
    gameScoreEl.textContent = '0';
    translateScoreEl.textContent = '0';
    currentGameLevel = 1;
    currentTranslateLevel = 1;
    gameScore = 0;
    translateScore = 0;
    document.getElementById('gameLevel').textContent = '1';
    document.getElementById('translateLevel').textContent = '1';
}

// ===== QUIZ MODE =====

// Start quiz mode
function startQuizMode() {
    welcomeScreen.classList.add('hidden');
    quizMode.classList.remove('hidden');
    totalQuestionsEl.textContent = totalQuestions;
    loadQuizQuestion();
}

// Load a quiz question
function loadQuizQuestion() {
    currentQuestionEl.textContent = currentQuizQuestion + 1;
    feedback.classList.add('hidden');
    nextQuestionBtn.classList.add('hidden');
    
    // Randomly select a verb, avoiding recently used ones
    let availableVerbs = verbs.filter(verb => !recentlyUsedVerbs.includes(verb.infinitive));
    
    // If all verbs have been used recently, reset the tracker
    if (availableVerbs.length === 0) {
        recentlyUsedVerbs = [];
        availableVerbs = verbs;
    }
    
    const randomVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    
    // Add to recently used list
    recentlyUsedVerbs.push(randomVerb.infinitive);
    
    // Keep the list to a reasonable size
    if (recentlyUsedVerbs.length > Math.min(10, verbs.length / 2)) {
        recentlyUsedVerbs.shift(); // Remove oldest verb
    }
    
    // Display verb information
    infinitiveEl.textContent = randomVerb.infinitive;
    translationEl.textContent = randomVerb.translation;
    
    // Clear input fields
    preteritInput.value = '';
    participleInput.value = '';
    preteritInput.classList.remove('correct', 'incorrect');
    participleInput.classList.remove('correct', 'incorrect');
    
    // Focus on the first input
    preteritInput.focus();
}

// Check quiz answer
function checkQuizAnswer(e) {
    e.preventDefault();
    
    const currentVerb = verbs.find(verb => verb.infinitive === infinitiveEl.textContent);
    const userPreterit = preteritInput.value.trim().toLowerCase();
    // Participe passé masqué - on remplit avec une valeur correcte par défaut
    participleInput.value = currentVerb.participle;
    
    const correctPreterit = currentVerb.preterit.toLowerCase();
    
    let isPreteritCorrect = false;
    
    // Check preterit
    if (correctPreterit.includes('/')) {
        const preteritOptions = correctPreterit.split('/');
        isPreteritCorrect = preteritOptions.some(option => option.trim() === userPreterit);
    } else {
        isPreteritCorrect = userPreterit === correctPreterit;
    }
    
    // Apply visual feedback to inputs
    preteritInput.classList.add(isPreteritCorrect ? 'correct' : 'incorrect');
    
    // Update score and feedback
    let feedbackMessage = '';
    
    if (isPreteritCorrect) {
        score += 10;
        correctAnswers++;
        scoreEl.textContent = score;
        feedbackMessage = 'Parfait ! La réponse est correcte.';
        feedback.className = 'bg-green-100 dark:bg-green-800 p-4 rounded-md mb-6';
        feedbackText.className = 'text-green-800 dark:text-green-100 font-medium';
        // Show confetti for correct answers
        createConfetti();
    } else {
        feedbackMessage = 'Pas tout à fait. La réponse correcte est :';
        feedback.className = 'bg-red-100 dark:bg-red-800 p-4 rounded-md mb-6';
        feedbackText.className = 'text-red-800 dark:text-red-100 font-medium';
        // Show correct answer if wrong
        feedbackMessage += `<div class="mt-2">Prétérit: <strong>${currentVerb.preterit}</strong></div>`;
    }
    
    feedbackText.innerHTML = feedbackMessage;
    feedback.classList.remove('hidden');
    nextQuestionBtn.classList.remove('hidden');

    
    // If this was the last question, show results after a delay
    if (currentQuizQuestion >= totalQuestions - 1) {
        nextQuestionBtn.textContent = 'Voir les résultats';
    }
}

// Load next quiz question
function loadNextQuizQuestion() {
    currentQuizQuestion++;
    
    if (currentQuizQuestion >= totalQuestions) {
        showResults();
    } else {
        loadQuizQuestion();
    }
}

// ===== GAME MODE =====

// Start game mode
function startGameMode() {
    welcomeScreen.classList.add('hidden');
    gameMode.classList.remove('hidden');
    loadGameQuestion();
}

// Load a game question
function loadGameQuestion() {
    clearInterval(timer);
    gameFeedback.classList.add('hidden');
    
    // Reset answer options
    answerOptions.innerHTML = '';
    
    // Set time depending on level
    timeRemaining = Math.max(15 - (currentGameLevel - 1), 5);
    
    // Randomly select a verb
    const randomIndex = Math.floor(Math.random() * verbs.length);
    currentGameVerb = verbs[randomIndex];
    
    // Display verb
    gameVerb.textContent = currentGameVerb.infinitive;
    gameTranslation.textContent = currentGameVerb.translation;
    
    // Toujours demander le prétérit (participe passé masqué)
    const askForPreterit = true;
    const questionType = 'prétérit';
    
    // Create answer options
    generateGameOptions(askForPreterit);
    
    // Clear previous questions
    const oldQuestions = document.querySelectorAll('.question-prompt');
    oldQuestions.forEach(el => el.remove());
    
    // Add question to game card
    const questionEl = document.createElement('div');
    questionEl.className = 'text-blue-600 dark:text-blue-400 font-semibold mt-2 question-prompt';
    questionEl.textContent = `Quel est le ${questionType} ?`;
    gameVerb.parentNode.appendChild(questionEl);
    
    // Start timer
    startGameTimer();
}

// Generate game options
function generateGameOptions(askForPreterit) {
    // Always ask for preterit (participle passé masqué)
    askForPreterit = true;
    
    // Get correct answer
    const correctAnswer = currentGameVerb.preterit;
    
    // Split if there are multiple correct forms
    const correctOptions = correctAnswer.includes('/') ? correctAnswer.split('/') : [correctAnswer];
    
    // Get the first correct option
    const mainCorrectOption = correctOptions[0].trim();
    
    // Create a pool of wrong answers
    const wrongAnswers = verbs
        .filter(verb => verb !== currentGameVerb)
        .map(verb => verb.preterit)
        .filter(ans => !ans.includes(mainCorrectOption)); // Make sure wrong answers don't contain the correct one
    
    // Shuffle and pick 3 wrong answers
    const shuffledWrong = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine with correct answer and shuffle
    currentGameOptions = [...correctOptions.map(opt => opt.trim()), ...shuffledWrong];
    currentGameOptions = [...new Set(currentGameOptions)]; // Remove duplicates
    currentGameOptions = currentGameOptions.slice(0, 4); // Limit to 4 options
    
    if (currentGameOptions.length < 4) {
        // Add more wrong answers if needed
        const moreWrong = wrongAnswers
            .filter(ans => !currentGameOptions.includes(ans))
            .slice(0, 4 - currentGameOptions.length);
        currentGameOptions = [...currentGameOptions, ...moreWrong];
    }
    
    // Shuffle options
    currentGameOptions.sort(() => 0.5 - Math.random());
    
    // Create option buttons
    currentGameOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-center font-medium shadow-sm dark:text-white';
        button.textContent = option;
        button.addEventListener('click', () => checkGameAnswer(option, correctOptions));
        answerOptions.appendChild(button);
    });
}

// Check game answer
function checkGameAnswer(selectedOption, correctOptions) {
    clearInterval(timer);
    
    const isCorrect = correctOptions.some(opt => opt.trim().toLowerCase() === selectedOption.toLowerCase());
    const buttons = document.querySelectorAll('.option');
    
    // Disable all buttons
    buttons.forEach(btn => {
        btn.disabled = true;
        
        // Mark correct/incorrect options
        if (correctOptions.some(opt => opt.trim().toLowerCase() === btn.textContent.toLowerCase())) {
            btn.classList.add('option-correct');
        } else if (btn.textContent.toLowerCase() === selectedOption.toLowerCase() && !isCorrect) {
            btn.classList.add('option-incorrect');
        }
    });
    
    // Update score and feedback
    if (isCorrect) {
        // Calculate score based on time remaining and level
        const timeBonus = Math.round(timeRemaining * (1 + (currentGameLevel - 1) * 0.1));
        const levelBonus = currentGameLevel * 5;
        const points = 10 + timeBonus + levelBonus;
        
        gameScore += points;
        gameScoreEl.textContent = gameScore;
        
        gameFeedbackText.innerHTML = `Correct ! +${points} points`;
        gameFeedback.className = 'bg-green-100 dark:bg-green-800 p-4 rounded-md mb-6';
        gameFeedbackText.className = 'text-green-800 dark:text-green-100 font-medium';
        
        // Increment level every 3 correct answers
        if (currentGameLevel < 5 && Math.random() < 0.3) {
            currentGameLevel++;
            document.getElementById('gameLevel').textContent = currentGameLevel;
        }
        
        // Show confetti
        createConfetti();
    } else {
        gameFeedbackText.innerHTML = `Incorrect. La bonne réponse était : ${correctOptions.join(' ou ')}`;
        gameFeedback.className = 'bg-red-100 dark:bg-red-800 p-4 rounded-md mb-6';
        gameFeedbackText.className = 'text-red-800 dark:text-red-100 font-medium';
    }
    
    gameFeedback.classList.remove('hidden');
    
    // Load next question after delay
    setTimeout(() => {
        if (Math.random() < 0.1) {
            // 10% chance to show results after each question (to keep game sessions short)
            showGameResults();
        } else {
            loadGameQuestion();
        }
    }, 2000);
}

// Start game timer
function startGameTimer() {
    timeLeft.textContent = `${timeRemaining}s`;
    progressBar.style.width = '100%';
    
    timer = setInterval(() => {
        timeRemaining--;
        timeLeft.textContent = `${timeRemaining}s`;
        
        // Update progress bar
        const percentage = (timeRemaining / Math.max(15 - (currentGameLevel - 1), 5)) * 100;
        progressBar.style.width = `${percentage}%`;
        
        if (timeRemaining <= 3) {
            timeLeft.classList.add('text-red-500');
        } else {
            timeLeft.classList.remove('text-red-500');
        }
        
        if (timeRemaining <= 0) {
            clearInterval(timer);
            
            // Automatically select wrong answer
            const correctOptions = currentGameVerb.preterit.split('/');
            const wrongOption = currentGameOptions.find(opt => 
                !correctOptions.some(correct => correct.trim().toLowerCase() === opt.toLowerCase())
            );
            
            if (wrongOption) {
                checkGameAnswer(wrongOption, correctOptions);
            } else {
                // Just in case we can't find a wrong option
                loadGameQuestion();
            }
        }
    }, 1000);
}

// Show game results
function showGameResults() {
    gameMode.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScoreEl.textContent = gameScore;
    
    // Calculate star rating based on score
    let rating = '⭐';
    if (gameScore > 100) rating = '⭐⭐';
    if (gameScore > 200) rating = '⭐⭐⭐';
    if (gameScore > 300) rating = '⭐⭐⭐⭐';
    if (gameScore > 400) rating = '⭐⭐⭐⭐⭐';
    
    accuracyRateEl.textContent = `Ta performance: ${rating}`;
    
    // Encouragement message
    const messages = [
        'Continue comme ça !',
        'Tu progresses bien !',
        'Excellent travail !',
        'Tu maîtrises presque ces verbes !',
        'Impressionnant !'
    ];
    
    encouragementEl.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// ===== TRANSLATE MODE =====

// Start translate mode
function startTranslateMode() {
    welcomeScreen.classList.add('hidden');
    translateMode.classList.remove('hidden');
    loadTranslateQuestion();
}

// Load a translate question
function loadTranslateQuestion() {
    clearInterval(timer);
    translateFeedback.classList.add('hidden');
    
    // Reset answer options
    translateOptions.innerHTML = '';
    
    // Set time depending on level
    timeRemaining = Math.max(15 - (currentTranslateLevel - 1), 5);
    
    // Randomly select a verb
    const randomIndex = Math.floor(Math.random() * verbs.length);
    currentTranslateWord = verbs[randomIndex];
    
    // Randomly decide direction: français -> anglais ou anglais -> français
    const translateToEnglish = Math.random() > 0.5;
    
    if (translateToEnglish) {
        // Afficher le mot français, demander l'anglais
        translateText.textContent = currentTranslateWord.translation;
        translateDirection.textContent = "Traduire en anglais";
        generateTranslateOptions(translateToEnglish);
    } else {
        // Afficher le mot anglais, demander le français
        translateText.textContent = currentTranslateWord.infinitive;
        translateDirection.textContent = "Traduire en français";
        generateTranslateOptions(translateToEnglish);
    }
    
    // Start timer
    startTranslateTimer();
}

// Generate translate options
function generateTranslateOptions(translateToEnglish) {
    // Get correct answer
    const correctAnswer = translateToEnglish ? currentTranslateWord.infinitive : currentTranslateWord.translation;
    
    // Create a pool of wrong answers
    const wrongAnswers = verbs
        .filter(verb => verb !== currentTranslateWord)
        .map(verb => translateToEnglish ? verb.infinitive : verb.translation)
        .filter(ans => ans !== correctAnswer); // Make sure wrong answers don't contain the correct one
    
    // Shuffle and pick 3 wrong answers
    const shuffledWrong = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine with correct answer and shuffle
    currentTranslateOptions = [correctAnswer, ...shuffledWrong];
    
    // Shuffle options
    currentTranslateOptions.sort(() => 0.5 - Math.random());
    
    // Create option buttons
    currentTranslateOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-center font-medium shadow-sm dark:text-white';
        button.textContent = option;
        button.addEventListener('click', () => checkTranslateAnswer(option, correctAnswer));
        translateOptions.appendChild(button);
    });
}

// Check translate answer
function checkTranslateAnswer(selectedOption, correctAnswer) {
    clearInterval(timer);
    
    const isCorrect = selectedOption === correctAnswer;
    const buttons = translateOptions.querySelectorAll('.option');
    
    // Disable all buttons
    buttons.forEach(btn => {
        btn.disabled = true;
        
        // Mark correct/incorrect options
        if (btn.textContent === correctAnswer) {
            btn.classList.add('option-correct');
        } else if (btn.textContent === selectedOption && !isCorrect) {
            btn.classList.add('option-incorrect');
        }
    });
    
    // Update score and feedback
    if (isCorrect) {
        // Calculate score based on time remaining and level
        const timeBonus = Math.round(timeRemaining * (1 + (currentTranslateLevel - 1) * 0.1));
        const levelBonus = currentTranslateLevel * 5;
        const points = 10 + timeBonus + levelBonus;
        
        translateScore += points;
        translateScoreEl.textContent = translateScore;
        
        translateFeedbackText.innerHTML = `Correct ! +${points} points`;
        translateFeedback.className = 'bg-green-100 dark:bg-green-800 p-4 rounded-md mb-6';
        translateFeedbackText.className = 'text-green-800 dark:text-green-100 font-medium';
        
        // Increment level every 3 correct answers
        if (currentTranslateLevel < 5 && Math.random() < 0.3) {
            currentTranslateLevel++;
            document.getElementById('translateLevel').textContent = currentTranslateLevel;
        }
        
        // Show confetti
        createConfetti();
    } else {
        translateFeedbackText.innerHTML = `Incorrect. La bonne réponse était : ${correctAnswer}`;
        translateFeedback.className = 'bg-red-100 dark:bg-red-800 p-4 rounded-md mb-6';
        translateFeedbackText.className = 'text-red-800 dark:text-red-100 font-medium';
    }
    
    translateFeedback.classList.remove('hidden');
    
    // Load next question after delay
    setTimeout(() => {
        if (Math.random() < 0.1) {
            // 10% chance to show results after each question (to keep game sessions short)
            showTranslateResults();
        } else {
            loadTranslateQuestion();
        }
    }, 2000);
}

// Start translate timer
function startTranslateTimer() {
    translateTimeLeft.textContent = `${timeRemaining}s`;
    translateProgressBar.style.width = '100%';
    
    timer = setInterval(() => {
        timeRemaining--;
        translateTimeLeft.textContent = `${timeRemaining}s`;
        
        // Update progress bar
        const percentage = (timeRemaining / Math.max(15 - (currentTranslateLevel - 1), 5)) * 100;
        translateProgressBar.style.width = `${percentage}%`;
        
        if (timeRemaining <= 3) {
            translateTimeLeft.classList.add('text-red-500');
        } else {
            translateTimeLeft.classList.remove('text-red-500');
        }
        
        if (timeRemaining <= 0) {
            clearInterval(timer);
            
            // Automatically select a wrong answer
            const correctAnswer = translateDirection.textContent.includes('anglais') ? 
                currentTranslateWord.infinitive : currentTranslateWord.translation;
            
            const wrongOption = currentTranslateOptions.find(opt => opt !== correctAnswer);
            
            if (wrongOption) {
                checkTranslateAnswer(wrongOption, correctAnswer);
            } else {
                // Just in case we can't find a wrong option
                loadTranslateQuestion();
            }
        }
    }, 1000);
}

// Show translate results
function showTranslateResults() {
    translateMode.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScoreEl.textContent = translateScore;
    
    // Calculate star rating based on score
    let rating = '⭐';
    if (translateScore > 100) rating = '⭐⭐';
    if (translateScore > 200) rating = '⭐⭐⭐';
    if (translateScore > 300) rating = '⭐⭐⭐⭐';
    if (translateScore > 400) rating = '⭐⭐⭐⭐⭐';
    
    accuracyRateEl.textContent = `Ta performance: ${rating}`;
    
    // Encouragement message
    const messages = [
        'Tu as un bon vocabulaire !',
        'Continue à apprendre !',
        'Excellent travail !',
        'Tu deviens bilingue !',
        'Impressionnant !'
    ];
    
    encouragementEl.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// Show quiz results
function showResults() {
    quizMode.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    finalScoreEl.textContent = score;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    accuracyRateEl.textContent = `Précision: ${accuracy}% (${correctAnswers}/${totalQuestions})`;
    
    // Encouragement based on score
    if (accuracy >= 90) {
        encouragementEl.textContent = 'Excellent travail ! Tu maîtrises vraiment ces verbes !';
    } else if (accuracy >= 70) {
        encouragementEl.textContent = 'Très bien ! Continue à pratiquer pour t\'améliorer.';
    } else if (accuracy >= 50) {
        encouragementEl.textContent = 'Bon travail ! Avec un peu plus de pratique, tu progresseras rapidement.';
    } else {
        encouragementEl.textContent = 'Continue à pratiquer, c\'est en faisant des erreurs qu\'on apprend !';
    }
    
    // Celebrate good results
    if (accuracy >= 70) {
        createConfetti();
    }
}

// ===== EFFECTS =====

// Create confetti effect
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);