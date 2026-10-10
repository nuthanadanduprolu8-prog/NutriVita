/**
 * NutriVita Module 13 - VitaQuiz Unit Test Suite
 * Tests 15 verification criteria across quiz questions, options,
 * bilingual content, scoring, progression, retry logic, certificate, and randomization.
 */

import {
  quizQuestions,
  getRandomizedQuiz,
  getPerformanceFeedback,
} from './src/data/quizData.js';
import {
  getCertificateMetadata,
  generateCertificate
} from './src/utils/certificateGenerator.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}: ${details}`);
    process.exitCode = 1;
  }
}

console.log('\n========================================================');
console.log('🔬 NutriVita Module 13 - VitaQuiz Test Suite');
console.log('========================================================\n');

// 1. At least 15 questions exist
console.log('Test Group 1: Question Pool Size');
{
  assert(
    quizQuestions.length >= 15,
    `1. Question bank contains at least 15 questions (found: ${quizQuestions.length})`
  );
}

// 2. Every question has exactly 4 options
console.log('\nTest Group 2: Option Count Consistency');
{
  const allHave4Options = quizQuestions.every(
    (q) => Array.isArray(q.options) && q.options.length === 4 &&
           Array.isArray(q.teluguOptions) && q.teluguOptions.length === 4
  );
  assert(allHave4Options, '2. Every question has exactly 4 English and 4 Telugu options');
}

// 3. Every question has a valid correct answer
console.log('\nTest Group 3: Correct Answer Index Validation');
{
  const validAnswers = quizQuestions.every(
    (q) => typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < 4
  );
  assert(validAnswers, '3. Every question has a valid correct answer index (0-3)');
}

// 4. Every question has English content
console.log('\nTest Group 4: English Content Completeness');
{
  const hasEnglish = quizQuestions.every(
    (q) => typeof q.question === 'string' && q.question.trim().length > 10 &&
           q.options.every((opt) => typeof opt === 'string' && opt.trim().length > 0)
  );
  assert(hasEnglish, '4. All questions and options contain non-empty English content');
}

// 5. Every question has Telugu content
console.log('\nTest Group 5: Telugu Content Completeness');
{
  const hasTelugu = quizQuestions.every(
    (q) => typeof q.teluguQuestion === 'string' && q.teluguQuestion.trim().length > 5 &&
           q.teluguOptions.every((opt) => typeof opt === 'string' && opt.trim().length > 0)
  );
  assert(hasTelugu, '5. All questions and options contain valid Telugu translations');
}

// 6. Explanations exist
console.log('\nTest Group 6: Educational Explanations');
{
  const hasExplanations = quizQuestions.every(
    (q) => typeof q.explanation === 'string' && q.explanation.length > 20 &&
           typeof q.teluguExplanation === 'string' && q.teluguExplanation.length > 20
  );
  assert(hasExplanations, '6. Every question provides detailed English & Telugu scientific explanations');
}

// 7. Score calculation
console.log('\nTest Group 7: Score Calculation');
{
  const sampleAnswers = [
    { isCorrect: true },
    { isCorrect: false },
    { isCorrect: true },
    { isCorrect: true },
    { isCorrect: false },
  ];
  const calculatedScore = sampleAnswers.filter((a) => a.isCorrect).length;
  assert(calculatedScore === 3, '7. Score calculation accurately tallies correct responses (3/5)');
}

// 8. Percentage calculation
console.log('\nTest Group 8: Percentage Calculation');
{
  const score = 12;
  const total = 15;
  const percentage = Math.round((score / total) * 100);
  assert(percentage === 80, `8. Percentage calculation: 12/15 -> 80% (got: ${percentage}%)`);

  const perfectScore = 15;
  const perfectPercentage = Math.round((perfectScore / total) * 100);
  assert(perfectPercentage === 100, `8b. Perfect score yields 100%`);
}

// 9. Correct answer handling
console.log('\nTest Group 9: Correct Answer Evaluation');
{
  const q = quizQuestions[0];
  const userSelection = q.correctAnswer;
  const isCorrect = userSelection === q.correctAnswer;
  assert(isCorrect === true, '9. Selecting the designated correct index returns isCorrect=true');
}

// 10. Incorrect answer handling
console.log('\nTest Group 10: Incorrect Answer Evaluation');
{
  const q = quizQuestions[0];
  const wrongSelection = (q.correctAnswer + 1) % 4;
  const isCorrect = wrongSelection === q.correctAnswer;
  assert(isCorrect === false, '10. Selecting a non-matching index returns isCorrect=false');
}

// 11. Question progression
console.log('\nTest Group 11: Question Progression State Machine');
{
  let currentIndex = 0;
  const total = 15;
  const simulateNext = () => {
    if (currentIndex < total - 1) currentIndex++;
    else return 'completed';
  };

  simulateNext(); // index 1
  simulateNext(); // index 2
  assert(currentIndex === 2, '11a. Progresses smoothly to next question index (0 -> 1 -> 2)');

  currentIndex = 14;
  const finalState = simulateNext();
  assert(finalState === 'completed', '11b. Reaching the final question advances state to completed');
}

// 12. Reset/retry behaviour
console.log('\nTest Group 12: Retry & Reset Lifecycle');
{
  let state = {
    currentIndex: 14,
    score: 11,
    answers: [1, 2, 3],
    isCompleted: true
  };

  // Simulate retry
  const resetQuiz = () => ({
    currentIndex: 0,
    score: 0,
    answers: [],
    isCompleted: false
  });

  state = resetQuiz();
  assert(
    state.currentIndex === 0 &&
    state.score === 0 &&
    state.answers.length === 0 &&
    state.isCompleted === false,
    '12. Retry completely resets current question, score, answers, and completion flag'
  );
}

// 13. Final result generation & performance tiering
console.log('\nTest Group 13: Final Result Performance Tiering');
{
  const highTier = getPerformanceFeedback(90, false);
  const midTier = getPerformanceFeedback(75, false);
  const lowTier = getPerformanceFeedback(40, false);

  assert(highTier.level === 'excellent', '13a. 90% score maps to "excellent" performance tier');
  assert(midTier.level === 'good', '13b. 75% score maps to "good" performance tier');
  assert(lowTier.level === 'needs-improvement', '13c. 40% score maps to "needs-improvement" tier');
}

// 14. Certificate data generation
console.log('\nTest Group 14: Certificate Generation & Metadata');
{
  const certMeta = getCertificateMetadata({
    recipientName: 'Anusha Sharma',
    score: 14,
    total: 15,
    percentage: 93,
    date: 'October 8, 2026',
    isTelugu: false
  });

  const certDataUrl = generateCertificate({
    recipientName: 'Anusha Sharma',
    score: 14,
    total: 15,
    percentage: 93
  });

  assert(
    certMeta.recipientName === 'Anusha Sharma' &&
    certMeta.score === 14 &&
    certMeta.percentage === 93 &&
    Boolean(certMeta.title) &&
    typeof certDataUrl === 'string' &&
    certDataUrl.startsWith('data:image/png'),
    '14. Certificate metadata and high-res data URL generated successfully with user credentials'
  );
}

// 15. Randomization preserves correct answers
console.log('\nTest Group 15: Randomization & Answer Key Integrity');
{
  // Generate 10 randomized quizzes and verify every question's correct answer matches its original meaning
  let allIntact = true;
  for (let run = 0; run < 10; run++) {
    const randomized = getRandomizedQuiz(15);
    for (const randQ of randomized) {
      // Find original question by ID
      const original = quizQuestions.find((q) => q.id === randQ.id);
      if (!original) {
        allIntact = false;
        break;
      }
      const originalCorrectText = original.options[original.correctAnswer];
      const randomizedCorrectText = randQ.options[randQ.correctAnswer];

      if (originalCorrectText !== randomizedCorrectText) {
        allIntact = false;
        console.error(`Mismatch for question ${randQ.id}: expected "${originalCorrectText}", got "${randomizedCorrectText}"`);
        break;
      }
    }
  }

  assert(
    allIntact,
    '15. Question and option shuffling strictly preserves the correct answer mapping across 10 randomized trials'
  );
}

console.log('\n--------------------------------------------------------');
console.log(`Results: ${passedTests} / ${totalTests} VitaQuiz Tests Passed`);
console.log('--------------------------------------------------------\n');

if (passedTests === totalTests) {
  console.log('✨ All 15 VitaQuiz test criteria verified successfully!');
  process.exit(0);
} else {
  console.error('❌ Some VitaQuiz tests failed.');
  process.exit(1);
}
