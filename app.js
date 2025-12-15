// Sample Questions Data
const questions = [
  {
    id: 'q1',
    subject: 'Mathematics',
    topic: 'Algebra',
    difficulty: 'medium',
    question: 'Solve for x: 2x + 5 = 15',
    options: ['5', '10', '7.5', '2.5'],
    correct: 0,
    explanation: '2x = 15 - 5 = 10, therefore x = 5',
    marks: 4
  },
  {
    id: 'q2',
    subject: 'Mathematics',
    topic: 'Geometry',
    difficulty: 'easy',
    question: 'What is the sum of angles in a triangle?',
    options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
    correct: 1,
    explanation: 'The sum of all angles in any triangle is always 180 degrees',
    marks: 4
  },
  {
    id: 'q3',
    subject: 'Science',
    topic: 'Physics',
    difficulty: 'hard',
    question: 'What is the SI unit of force?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correct: 1,
    explanation: 'Newton (N) is the SI unit of force. 1 Newton = 1 kg⋅m/s²',
    marks: 4
  },
  {
    id: 'q4',
    subject: 'Science',
    topic: 'Chemistry',
    difficulty: 'medium',
    question: 'What is the atomic number of Carbon?',
    options: ['4', '6', '8', '12'],
    correct: 1,
    explanation: 'Carbon has 6 protons, so its atomic number is 6',
    marks: 4
  },
  {
    id: 'q5',
    subject: 'Mathematics',
    topic: 'Algebra',
    difficulty: 'hard',
    question: 'If x² - 5x + 6 = 0, what are the values of x?',
    options: ['2 and 3', '1 and 6', '2 and 4', '3 and 4'],
    correct: 0,
    explanation: '(x-2)(x-3) = 0, so x = 2 or x = 3',
    marks: 4
  },
  {
    id: 'q6',
    subject: 'Science',
    topic: 'Biology',
    difficulty: 'easy',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'],
    correct: 1,
    explanation: 'Mitochondria produce ATP and are called the powerhouse of the cell',
    marks: 4
  },
  {
    id: 'q7',
    subject: 'Mathematics',
    topic: 'Geometry',
    difficulty: 'medium',
    question: 'What is the area of a circle with radius 7 cm? (π = 22/7)',
    options: ['154 cm²', '144 cm²', '164 cm²', '134 cm²'],
    correct: 0,
    explanation: 'Area = πr² = (22/7) × 7 × 7 = 154 cm²',
    marks: 4
  },
  {
    id: 'q8',
    subject: 'Science',
    topic: 'Physics',
    difficulty: 'hard',
    question: 'What is the speed of light in vacuum?',
    options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁷ m/s', '3 × 10⁹ m/s'],
    correct: 0,
    explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second',
    marks: 4
  },
  {
    id: 'q9',
    subject: 'Mathematics',
    topic: 'Statistics',
    difficulty: 'easy',
    question: 'What is the mean of 2, 4, 6, 8, 10?',
    options: ['5', '6', '7', '8'],
    correct: 1,
    explanation: 'Mean = (2+4+6+8+10)/5 = 30/5 = 6',
    marks: 4
  },
  {
    id: 'q10',
    subject: 'Science',
    topic: 'Chemistry',
    difficulty: 'medium',
    question: 'What is the chemical formula of water?',
    options: ['H₂O', 'CO₂', 'O₂', 'H₂O₂'],
    correct: 0,
    explanation: 'Water consists of 2 hydrogen atoms and 1 oxygen atom: H₂O',
    marks: 4
  }
];

// Test Packages Data
const packages = [
  {
    id: 'pkg1',
    name: 'Class 10 Mock Test Package',
    description: '15 Full Mock Tests + Solutions',
    price: 999,
    tests: 15,
    validity: '1 Year'
  },
  {
    id: 'pkg2',
    name: 'Class 12 PCMB Package',
    description: '20 Tests + Video Solutions',
    price: 1499,
    tests: 20,
    validity: '1 Year'
  },
  {
    id: 'pkg3',
    name: 'JEE Foundation Package',
    description: '30 Tests + Analytics Dashboard',
    price: 2499,
    tests: 30,
    validity: '2 Years'
  }
];

// Test State
let testState = {
  currentQuestion: 0,
  answers: {},
  marked: new Set(),
  visited: new Set([0]),
  timeRemaining: 1200, // 20 minutes in seconds
  startTime: null,
  questionTimes: {},
  currentQuestionStartTime: null
};

let timerInterval = null;
let performanceChart = null;

// View Management
function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(viewId).classList.add('active');
}

function showDashboard() {
  showView('dashboard-view');
  updateResultsPreview();
}

function showPackages() {
  showView('packages-view');
  renderPackages();
}

// Instructions Modal
function showInstructions() {
  document.getElementById('instructions-modal').classList.add('active');
}

function closeInstructions() {
  document.getElementById('instructions-modal').classList.remove('active');
}

// Start Test
function startTest() {
  closeInstructions();
  resetTestState();
  showView('test-view');
  initializeTest();
  startTimer();
}

function resetTestState() {
  testState = {
    currentQuestion: 0,
    answers: {},
    marked: new Set(),
    visited: new Set([0]),
    timeRemaining: 1200,
    startTime: Date.now(),
    questionTimes: {},
    currentQuestionStartTime: Date.now()
  };
}

function initializeTest() {
  renderQuestionPalette();
  renderQuestion();
}

// Timer
function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    testState.timeRemaining--;
    updateTimerDisplay();
    
    if (testState.timeRemaining <= 0) {
      clearInterval(timerInterval);
      autoSubmitTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(testState.timeRemaining / 60);
  const seconds = testState.timeRemaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timer-display').textContent = display;
  
  const timerElement = document.getElementById('timer');
  if (testState.timeRemaining < 300) {
    timerElement.classList.add('warning');
  } else {
    timerElement.classList.remove('warning');
  }
}

// Question Rendering
function renderQuestionPalette() {
  const paletteGrid = document.getElementById('palette-grid');
  paletteGrid.innerHTML = '';
  
  questions.forEach((q, index) => {
    const btn = document.createElement('div');
    btn.className = 'palette-btn';
    btn.textContent = index + 1;
    
    // Set status classes
    if (testState.answers[index] !== undefined) {
      btn.classList.add('answered');
    } else if (testState.marked.has(index)) {
      btn.classList.add('marked');
    } else if (testState.visited.has(index)) {
      btn.classList.add('not-answered');
    } else {
      btn.classList.add('not-visited');
    }
    
    if (index === testState.currentQuestion) {
      btn.classList.add('current');
    }
    
    btn.onclick = () => navigateToQuestion(index);
    paletteGrid.appendChild(btn);
  });
}

function renderQuestion() {
  const question = questions[testState.currentQuestion];
  const container = document.getElementById('question-container');
  
  // Record time spent on previous question
  if (testState.currentQuestionStartTime) {
    const timeSpent = Date.now() - testState.currentQuestionStartTime;
    testState.questionTimes[testState.currentQuestion] = 
      (testState.questionTimes[testState.currentQuestion] || 0) + timeSpent;
  }
  testState.currentQuestionStartTime = Date.now();
  
  container.innerHTML = `
    <div class="question-header">
      <div class="question-number">Question ${testState.currentQuestion + 1} of ${questions.length}</div>
      <div class="question-marks">Marks: ${question.marks}</div>
    </div>
    <div class="question-text">${question.question}</div>
    <ul class="options-list">
      ${question.options.map((option, index) => `
        <li class="option-item">
          <label class="option-label ${testState.answers[testState.currentQuestion] === index ? 'selected' : ''}">
            <input type="radio" name="answer" value="${index}" 
              ${testState.answers[testState.currentQuestion] === index ? 'checked' : ''}>
            <span>${String.fromCharCode(65 + index)}. ${option}</span>
          </label>
        </li>
      `).join('')}
    </ul>
  `;
  
  // Add event listeners to options
  container.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const optionIndex = parseInt(e.target.value);
      testState.answers[testState.currentQuestion] = optionIndex;
      renderQuestion();
      renderQuestionPalette();
    });
  });
  
  testState.visited.add(testState.currentQuestion);
}

function navigateToQuestion(index) {
  testState.currentQuestion = index;
  renderQuestion();
  renderQuestionPalette();
}

// Navigation Functions
function saveAndNext() {
  if (testState.currentQuestion < questions.length - 1) {
    testState.currentQuestion++;
    renderQuestion();
    renderQuestionPalette();
  } else {
    showSubmitConfirmation();
  }
}

function markForReview() {
  testState.marked.add(testState.currentQuestion);
  if (testState.currentQuestion < questions.length - 1) {
    testState.currentQuestion++;
  }
  renderQuestion();
  renderQuestionPalette();
}

function clearResponse() {
  delete testState.answers[testState.currentQuestion];
  testState.marked.delete(testState.currentQuestion);
  renderQuestion();
  renderQuestionPalette();
}

// Submit Functions
function showSubmitConfirmation() {
  const answered = Object.keys(testState.answers).length;
  const notAnswered = questions.length - answered;
  const marked = testState.marked.size;
  
  document.getElementById('submit-summary').innerHTML = `
    <div class="submit-stats">
      <div class="stat-item">
        <div class="stat-value">${answered}</div>
        <div class="stat-label">Answered</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${notAnswered}</div>
        <div class="stat-label">Not Answered</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${marked}</div>
        <div class="stat-label">Marked for Review</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${questions.length}</div>
        <div class="stat-label">Total Questions</div>
      </div>
    </div>
  `;
  
  document.getElementById('submit-modal').classList.add('active');
}

function closeSubmitModal() {
  document.getElementById('submit-modal').classList.remove('active');
}

function submitTest() {
  // Record final question time
  if (testState.currentQuestionStartTime) {
    const timeSpent = Date.now() - testState.currentQuestionStartTime;
    testState.questionTimes[testState.currentQuestion] = 
      (testState.questionTimes[testState.currentQuestion] || 0) + timeSpent;
  }
  
  clearInterval(timerInterval);
  closeSubmitModal();
  calculateAndShowResults();
}

function autoSubmitTest() {
  if (testState.currentQuestionStartTime) {
    const timeSpent = Date.now() - testState.currentQuestionStartTime;
    testState.questionTimes[testState.currentQuestion] = 
      (testState.questionTimes[testState.currentQuestion] || 0) + timeSpent;
  }
  calculateAndShowResults();
}

// Results Calculation
function calculateAndShowResults() {
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;
  
  questions.forEach((q, index) => {
    if (testState.answers[index] === undefined) {
      unattempted++;
    } else if (testState.answers[index] === q.correct) {
      correct++;
    } else {
      incorrect++;
    }
  });
  
  const totalMarks = questions.length * 4;
  const scoredMarks = correct * 4;
  const percentage = ((scoredMarks / totalMarks) * 100).toFixed(2);
  
  // Display results
  document.getElementById('score-display').textContent = `${scoredMarks} / ${totalMarks}`;
  document.getElementById('score-percentage').textContent = `${percentage}%`;
  
  // Render chart
  renderPerformanceChart(correct, incorrect, unattempted);
  
  // Render topic-wise analysis
  renderTopicAnalysis();
  
  // Render time analysis
  renderTimeAnalysis();
  
  // Save to results
  saveResult(scoredMarks, totalMarks, percentage);
  
  showView('result-view');
}

function renderPerformanceChart(correct, incorrect, unattempted) {
  const ctx = document.getElementById('performance-chart');
  
  if (performanceChart) {
    performanceChart.destroy();
  }
  
  performanceChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Correct', 'Incorrect', 'Unattempted'],
      datasets: [{
        data: [correct, incorrect, unattempted],
        backgroundColor: ['#10b981', '#dc2626', '#9ca3af'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 14,
              family: 'Poppins'
            }
          }
        }
      }
    }
  });
}

function renderTopicAnalysis() {
  const topicStats = {};
  
  questions.forEach((q, index) => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0, attempted: 0 };
    }
    topicStats[q.topic].total++;
    
    if (testState.answers[index] !== undefined) {
      topicStats[q.topic].attempted++;
      if (testState.answers[index] === q.correct) {
        topicStats[q.topic].correct++;
      }
    }
  });
  
  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Topic</th>
          <th>Total</th>
          <th>Attempted</th>
          <th>Correct</th>
          <th>Accuracy</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(topicStats).map(([topic, stats]) => {
          const accuracy = stats.attempted > 0 
            ? ((stats.correct / stats.attempted) * 100).toFixed(1) 
            : 0;
          return `
            <tr>
              <td><strong>${topic}</strong></td>
              <td>${stats.total}</td>
              <td>${stats.attempted}</td>
              <td>${stats.correct}</td>
              <td>
                <div>${accuracy}%</div>
                <div class="accuracy-bar">
                  <div class="accuracy-fill" style="width: ${accuracy}%"></div>
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
  
  document.getElementById('topic-analysis').innerHTML = tableHTML;
}

function renderTimeAnalysis() {
  const container = document.getElementById('time-analysis');
  container.innerHTML = questions.map((q, index) => {
    const timeMs = testState.questionTimes[index] || 0;
    const timeSeconds = Math.round(timeMs / 1000);
    return `
      <div class="time-item">
        <div class="question-num">Q${index + 1}</div>
        <div class="time-spent">${timeSeconds}s</div>
      </div>
    `;
  }).join('');
}

// In-memory storage for results (replaces localStorage)
let savedResults = [];

function saveResult(scored, total, percentage) {
  savedResults.push({
    date: new Date().toISOString(),
    scored,
    total,
    percentage
  });
}

function updateResultsPreview() {
  const results = savedResults;
  const container = document.getElementById('results-preview');
  
  if (results.length === 0) {
    container.innerHTML = '<p class="empty-state">No tests taken yet. Start your first test!</p>';
    return;
  }
  
  container.innerHTML = results.slice(-3).reverse().map(result => {
    const date = new Date(result.date).toLocaleDateString();
    return `
      <div class="result-item">
        <div>
          <div><strong>Mock Test</strong></div>
          <div style="font-size: 0.9rem; color: var(--color-text-light);">${date}</div>
        </div>
        <div class="score">${result.percentage}%</div>
      </div>
    `;
  }).join('');
}

function showResults() {
  showView('result-view');
}

// Solutions View
function reviewSolutions() {
  showView('solutions-view');
  renderSolutions();
}

function renderSolutions() {
  const container = document.getElementById('solutions-container');
  container.innerHTML = questions.map((q, index) => {
    const userAnswer = testState.answers[index];
    const isCorrect = userAnswer === q.correct;
    const isUnattempted = userAnswer === undefined;
    
    let statusClass = 'unattempted';
    let statusText = 'Not Attempted';
    
    if (!isUnattempted) {
      statusClass = isCorrect ? 'correct' : 'incorrect';
      statusText = isCorrect ? 'Correct' : 'Incorrect';
    }
    
    return `
      <div class="solution-item">
        <div class="solution-header">
          <div class="question-number">Question ${index + 1}</div>
          <div class="solution-status ${statusClass}">${statusText}</div>
        </div>
        <div class="solution-question">${q.question}</div>
        <ul class="solution-options">
          ${q.options.map((option, optIndex) => {
            let optClass = '';
            if (optIndex === q.correct) {
              optClass = 'correct-answer';
            } else if (optIndex === userAnswer && userAnswer !== q.correct) {
              optClass = 'user-answer';
            }
            return `
              <li class="solution-option ${optClass}">
                ${String.fromCharCode(65 + optIndex)}. ${option}
                ${optIndex === q.correct ? ' ✓ (Correct Answer)' : ''}
                ${optIndex === userAnswer && userAnswer !== q.correct ? ' ✗ (Your Answer)' : ''}
              </li>
            `;
          }).join('')}
        </ul>
        <div class="solution-explanation">
          <strong>Explanation:</strong> ${q.explanation}
        </div>
      </div>
    `;
  }).join('');
}

// Packages View
function renderPackages() {
  const container = document.getElementById('packages-grid');
  container.innerHTML = packages.map(pkg => `
    <div class="package-card">
      <h3>${pkg.name}</h3>
      <p class="package-description">${pkg.description}</p>
      <div class="package-price">₹${pkg.price}</div>
      <ul class="package-features">
        <li><i class="fas fa-check-circle"></i> ${pkg.tests} Mock Tests</li>
        <li><i class="fas fa-check-circle"></i> Detailed Solutions</li>
        <li><i class="fas fa-check-circle"></i> Performance Analytics</li>
        <li><i class="fas fa-check-circle"></i> Valid for ${pkg.validity}</li>
      </ul>
      <button class="btn btn-primary" onclick="purchasePackage('${pkg.id}', ${pkg.price})">Purchase Now</button>
    </div>
  `).join('');
}

function purchasePackage(pkgId, price) {
  // Simulate payment
  setTimeout(() => {
    document.getElementById('payment-modal').classList.add('active');
  }, 500);
}

function closePaymentModal() {
  document.getElementById('payment-modal').classList.remove('active');
  showDashboard();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  showDashboard();
});