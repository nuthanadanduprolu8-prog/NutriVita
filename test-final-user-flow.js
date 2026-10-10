/**
 * NutriVita End-to-End User Flow Audit Test Suite
 * Tests the complete student journey through Modules 1 to 14
 */

import { getRandomizedQuiz, getPerformanceFeedback } from './client/src/data/quizData.js';
import { generateCertificate, getCertificateMetadata } from './client/src/utils/certificateGenerator.js';
import { parseNutritionText, calculateEducationalGrade } from './client/src/utils/nutritionLabelParser.js';
import {
  awarenessArticles,
  superfoods,
  seasonalGuides,
  nutritionMyths,
  filterArticles,
  filterSuperfoods,
  filterMyths,
  validateCommunityPlan,
  createCommunityPlan
} from './client/src/data/awarenessData.js';

const API_BASE = 'http://localhost:5000/api';

let passedSteps = 0;
let totalSteps = 0;

function assert(condition, stepName, details = '') {
  totalSteps++;
  if (condition) {
    passedSteps++;
    console.log(`  ✅ [PASS] Step ${totalSteps}: ${stepName}`);
  } else {
    console.error(`  ❌ [FAIL] Step ${totalSteps}: ${stepName} - ${details}`);
    throw new Error(`Step failed: ${stepName} - ${details}`);
  }
}

async function runEndToEndUserFlow() {
  console.log('========================================================');
  console.log('🚀 NUTRIVITA COMPLETE END-TO-END STUDENT USER FLOW');
  console.log('========================================================\n');

  const testUser = {
    name: 'NutriVita Student',
    email: `student_${Date.now()}@example.com`,
    password: 'securePassword123!',
    age: 20,
    gender: 'female',
    activityLevel: 'moderate',
    dietaryPreference: 'vegetarian'
  };

  let token = '';

  // 1. REGISTER
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  const regData = await regRes.json();
  assert(regRes.ok && regData.token, 'User Registration', regData.message);
  token = regData.token;

  // 2. LOGIN
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  });
  const loginData = await loginRes.json();
  assert(loginRes.ok && loginData.token, 'User Authentication & JWT Token Issuance');

  // 3. PROFILE / DASHBOARD LOAD
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meData = await meRes.json();
  assert(meRes.ok && meData.user?.email === testUser.email, 'Fetch Protected User Profile & Dashboard Data');

  // 4. EXPLORE VITAMINS
  const vitRes = await fetch(`${API_BASE}/vitamins`);
  const vitData = await vitRes.json();
  assert(vitRes.ok && vitData.count >= 13, 'Explore Vitamins & Minerals Directory (13 essential)');

  const vitCRes = await fetch(`${API_BASE}/vitamins/vitamin-c`);
  const vitCData = await vitCRes.json();
  assert(vitCRes.ok && (vitCData.data?.nameEn || vitCData.data?.name)?.includes('Vitamin C'), 'Retrieve Specific Vitamin Profile (Vitamin C)');

  // 5. EXPLORE FOODS
  const foodsRes = await fetch(`${API_BASE}/foods?search=Amla`);
  const foodsData = await foodsRes.json();
  assert(foodsRes.ok && foodsData.data?.length >= 1, 'Search Verified Indian Foods Database (Amla)');

  // 6. SCAN FOOD
  const scanRes = await fetch(`${API_BASE}/scanner/identify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: 'fresh_spinach_leaves.jpg',
      labelHint: 'palak greens'
    })
  });
  const scanData = await scanRes.json();
  assert(scanRes.ok && scanData.matched?.name?.includes('Spinach'), 'Food Scanner Heuristic Matching (Spinach)');

  // 7. BALANCE MY MEAL
  const balanceRes = await fetch(`${API_BASE}/meals/balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { foodId: 'spinach', quantity: 100 },
        { foodId: 'lentils', quantity: 150 },
        { foodId: 'ragi', quantity: 100 }
      ]
    })
  });
  const balanceData = await balanceRes.json();
  assert(balanceRes.ok && balanceData.evaluation?.score > 0, 'Balance My Meal (50:25:25 Score & Nutrient Split)');

  // 8. CREATE MEAL PLAN
  const planGenRes = await fetch(`${API_BASE}/meals/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      targetCalories: 2000,
      dietaryPreference: 'vegetarian'
    })
  });
  const planGenData = await planGenRes.json();
  assert(planGenRes.ok && planGenData.data?.meals, 'Smart Meal Planner Generation');

  // 9. SAVE PLAN TO PROFILE
  const savePlanRes = await fetch(`${API_BASE}/meals/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Weekly Nutrition Plan',
      targetCalories: 2000,
      dietaryPreference: 'vegetarian',
      meals: planGenData.data.meals,
      dailyTotals: planGenData.data.dailyTotals
    })
  });
  const savePlanData = await savePlanRes.json();
  assert(savePlanRes.ok && savePlanData.data?.id, 'Save Meal Plan to Profile Archive');

  // 10. RETRIEVE SAVED PLANS
  const getSavedRes = await fetch(`${API_BASE}/meals/saved`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const getSavedData = await getSavedRes.json();
  assert(getSavedRes.ok && getSavedData.data?.length >= 1, 'Retrieve User Saved Plans');

  // 11. VITAMATE AI CONVERSATION
  const aiRes = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'What are the best vegetarian sources of Vitamin B12 and Iron?',
      language: 'en'
    })
  });
  const aiData = await aiRes.json();
  assert(aiRes.ok && aiData.message && aiData.disclaimer, 'VitaMate AI Conversational Nutrition Consultation');

  // 12. SYMPTOM DEFICIENCY CHECKER
  const symptomRes = await fetch(`${API_BASE}/symptoms/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symptoms: ['fatigue', 'pale-skin', 'dizziness'],
      language: 'en'
    })
  });
  const symptomData = await symptomRes.json();
  assert(
    symptomRes.ok &&
      (symptomData.nutritionConnections?.length > 0 || symptomData.suspectedDeficiencies?.length > 0) &&
      symptomData.disclaimer,
    'Symptom Deficiency Checker Assessment with Medical Guidance'
  );

  // 13. LABEL LENS ANALYSIS
  const labelResult = parseNutritionText('Nutrition Facts: Calories 160 kcal, Total Fat 3g, Total Sugars 2g, Sodium 90mg, Protein 7g, Dietary Fiber 4g');
  const gradeResult = calculateEducationalGrade(labelResult.extracted);
  assert(labelResult.extracted?.calories === 160 && gradeResult?.grade === 'A', 'Label Lens OCR & Educational Grade A Rating');

  // 14. VITAQUIZ CHALLENGE
  const quizQuestions = getRandomizedQuiz(15);
  assert(quizQuestions.length === 15, 'VitaQuiz Challenge Randomization (15 questions)');
  const percentage = Math.round((13 / 15) * 100);
  const feedback = getPerformanceFeedback(percentage, false);
  assert(feedback.level === 'excellent', 'VitaQuiz Score Calculation & Performance Tiering');

  // 15. WELLNESS CERTIFICATE GENERATION
  const certDataUrl = generateCertificate({
    recipientName: testUser.name,
    score: 13,
    total: 15,
    percentage: 87
  });
  const certMeta = getCertificateMetadata({
    recipientName: testUser.name,
    score: 13,
    total: 15,
    percentage: 87
  });
  assert(
    certDataUrl && certDataUrl.startsWith('data:image/') && certMeta.recipientName === testUser.name,
    'NutriVita Wellness Certificate Generation'
  );

  // 16. NUTRITION AWARENESS CSP HUB
  const filteredArts = filterArticles(awarenessArticles, 'Fundamentals');
  const filteredSupers = filterSuperfoods(superfoods, 'Moringa');
  const filteredMyth = filterMyths(nutritionMyths, 'Protein');
  assert(
    filteredArts.length > 0 &&
      filteredSupers.length > 0 &&
      filteredMyth.length > 0 &&
      seasonalGuides.summer,
    'Nutrition Awareness Education Hub (Articles, Superfoods, Seasonal & Myths)'
  );

  // 17. COMMUNITY ACTIVITY PLANNER
  const customPlanInput = {
    title: 'University Campus Iron Deficiency Awareness Day',
    targetAudience: 'College Campus Students',
    date: '2026-11-20',
    organizer: 'NSS Health Unit',
    steps: '1. Distribute Moringa leaflets\n2. Demonstrate steel plate 50:25:25 model\n3. Conduct 15-question VitaQuiz'
  };
  const val = validateCommunityPlan(customPlanInput);
  const planObj = createCommunityPlan(customPlanInput);
  assert(val.isValid && planObj.id && planObj.createdAt, 'Community Awareness Activity Planner');

  // 18. PROFILE UPDATE & LOGOUT
  const updateRes = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      age: 21,
      dietaryPreference: 'vegan'
    })
  });
  const updateData = await updateRes.json();
  assert(updateRes.ok && updateData.user?.age === 21, 'User Profile Update');

  console.log('\n--------------------------------------------------------');
  console.log(`🎉 COMPLETED ALL ${passedSteps} / ${totalSteps} STEPS IN END-TO-END FLOW!`);
  console.log('--------------------------------------------------------\n');
}

runEndToEndUserFlow().catch((err) => {
  console.error('\n❌ End-to-end user flow halted with error:', err.message);
  process.exit(1);
});
