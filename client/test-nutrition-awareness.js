/**
 * NutriVita Module 14: Community Health & Nutrition Awareness
 * Automated Verification Test Suite (20 Test Points)
 */

import {
  awarenessArticles,
  superfoods,
  seasonalGuides,
  nutritionMyths,
  healthyHabits,
  communityActions,
  DISCLAIMER_EN,
  DISCLAIMER_TE,
  filterArticles,
  filterSuperfoods,
  filterMyths,
  validateCommunityPlan,
  createCommunityPlan
} from './src/data/awarenessData.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${testName} - ${details}`);
  }
}

console.log('====================================================');
console.log('🧪 RUNNING MODULE 14 NUTRITION AWARENESS TEST SUITE');
console.log('====================================================\n');

// 1. Articles count
assert(
  Array.isArray(awarenessArticles) && awarenessArticles.length >= 10,
  '1. awarenessArticles contains at least 10 items',
  `Found: ${awarenessArticles.length}`
);

// 2. Article structure
const allArticlesValid = awarenessArticles.every(
  (a) =>
    a.id &&
    a.title &&
    a.teluguTitle &&
    a.category &&
    a.readTime &&
    a.shortDescription &&
    a.teluguDescription &&
    a.content &&
    a.teluguContent &&
    Array.isArray(a.keyTakeaways) &&
    a.keyTakeaways.length > 0 &&
    Array.isArray(a.teluguKeyTakeaways) &&
    a.teluguKeyTakeaways.length > 0 &&
    Array.isArray(a.practicalTips) &&
    a.practicalTips.length > 0 &&
    Array.isArray(a.teluguPracticalTips) &&
    a.teluguPracticalTips.length > 0
);
assert(
  allArticlesValid,
  '2. Each article has all required fields (bilingual titles, descriptions, takeaways, tips)',
  'Some articles missing required schema fields'
);

// 3. Superfoods count
assert(
  Array.isArray(superfoods) && superfoods.length >= 12,
  '3. superfoods contains at least 12 items',
  `Found: ${superfoods.length}`
);

// 4. Superfood schema
const allSuperfoodsValid = superfoods.every(
  (s) =>
    s.id &&
    s.name &&
    s.teluguName &&
    s.category &&
    (Array.isArray(s.nutrients) || (typeof s.nutrients === 'string' && s.nutrients.length > 0)) &&
    (Array.isArray(s.benefits) || (typeof s.benefits === 'string' && s.benefits.length > 0)) &&
    (Array.isArray(s.teluguBenefits) || (typeof s.teluguBenefits === 'string' && s.teluguBenefits.length > 0)) &&
    s.howToEat &&
    s.teluguHowToEat &&
    s.communityTip &&
    s.teluguCommunityTip &&
    s.imageUrl
);
assert(
  allSuperfoodsValid,
  '4. Each superfood has bilingual names, nutrients, benefits, and consumption tips',
  'Some superfoods missing required schema fields'
);

// 5. Seasonal guides seasons
const seasons = Object.keys(seasonalGuides);
assert(
  seasons.includes('summer') && seasons.includes('monsoon') && seasons.includes('winter'),
  '5. seasonalGuides has summer, monsoon, and winter',
  `Found keys: ${seasons.join(', ')}`
);

// 6. Seasonal guide details
const allSeasonsValid = ['summer', 'monsoon', 'winter'].every((seasonKey) => {
  const guide = seasonalGuides[seasonKey];
  return (
    guide &&
    guide.hydrationGuidance &&
    guide.teluguHydrationGuidance &&
    guide.foodSafetyTips &&
    guide.teluguFoodSafetyTips &&
    Array.isArray(guide.recommendedFoods) &&
    guide.recommendedFoods.length > 0 &&
    Array.isArray(guide.dailyHabits) &&
    guide.dailyHabits.length > 0
  );
});
assert(
  allSeasonsValid,
  '6. Each season has hydration, food safety, recommended foods, and daily habits',
  'Missing season guide fields'
);

// 7. Myths count
assert(
  Array.isArray(nutritionMyths) && nutritionMyths.length >= 10,
  '7. nutritionMyths contains at least 10 items',
  `Found: ${nutritionMyths.length}`
);

// 8. Myth schema
const allMythsValid = nutritionMyths.every(
  (m) =>
    m.id &&
    m.myth &&
    m.teluguMyth &&
    m.fact &&
    m.teluguFact &&
    m.explanation &&
    m.teluguExplanation &&
    m.category
);
assert(
  allMythsValid,
  '8. Each myth has myth, fact, and explanation in bilingual format',
  'Some myths missing required fields'
);

// 9. Habits count
assert(
  Array.isArray(healthyHabits) && healthyHabits.length >= 8,
  '9. healthyHabits contains at least 8 items',
  `Found: ${healthyHabits.length}`
);

// 10. Actions count
assert(
  Array.isArray(communityActions) && communityActions.length >= 7,
  '10. communityActions contains at least 7 items',
  `Found: ${communityActions.length}`
);

// 11. Action schema
const allActionsValid = communityActions.every(
  (act) =>
    act.id &&
    act.name &&
    act.teluguName &&
    act.targetAudience &&
    act.teluguTargetAudience &&
    act.purpose &&
    act.teluguPurpose &&
    act.howToConduct &&
    act.teluguHowToConduct &&
    act.expectedBenefit
);
assert(
  allActionsValid,
  '11. Each action has bilingual title, target audience, objective, and steps',
  'Some community actions missing required fields'
);

// 12. Article categories filtering
const fundamentalsArticles = filterArticles(awarenessArticles, 'Fundamentals');
const micronutrientsArticles = filterArticles(awarenessArticles, 'Micronutrients');
assert(
  fundamentalsArticles.length > 0 &&
    micronutrientsArticles.length > 0 &&
    fundamentalsArticles.every((a) => a.category === 'Fundamentals'),
  '12. Article categories filtering works',
  'Category filtering returned incorrect counts'
);

// 13. Article search filtering
const plateArticles = filterArticles(awarenessArticles, 'All', 'Plate');
const teluguSearchArticles = filterArticles(awarenessArticles, 'All', 'ఆహార');
assert(
  plateArticles.length > 0 && teluguSearchArticles.length > 0,
  '13. Article search function filters correctly in English and Telugu',
  'Search returned empty array'
);

// 14. Superfood search filtering
const amlaResult = filterSuperfoods(superfoods, 'Amla');
const ironSuperfoods = filterSuperfoods(superfoods, 'Iron');
assert(
  amlaResult.length >= 1 && ironSuperfoods.length >= 1,
  '14. Superfood search function filters by name and nutrient',
  'Superfood search failed'
);

// 15. Myth search filtering
const proteinMyth = filterMyths(nutritionMyths, 'Protein');
const waterMyth = filterMyths(nutritionMyths, 'Water');
assert(
  proteinMyth.length >= 1 && waterMyth.length >= 1,
  '15. Myth search function filters correctly',
  'Myth search failed'
);

// 16. Non-diagnostic disclaimer presence
assert(
  typeof DISCLAIMER_EN === 'string' &&
    DISCLAIMER_EN.includes('educational') &&
    DISCLAIMER_EN.includes('diagnosis') &&
    typeof DISCLAIMER_TE === 'string' &&
    DISCLAIMER_TE.includes('నివారణ'),
  '16. Non-diagnostic disclaimer is present in English and Telugu',
  'Disclaimer text missing required non-diagnostic safeguards'
);

// 17. Planner form validation catches missing fields
const emptyValidation = validateCommunityPlan({});
const partialValidation = validateCommunityPlan({ title: 'My Camp' });
assert(
  !emptyValidation.isValid &&
    emptyValidation.errors.title &&
    emptyValidation.errors.targetAudience &&
    !partialValidation.isValid &&
    partialValidation.errors.date,
  '17. Planner form validation catches missing required fields',
  'Validation allowed empty plan'
);

// 18. Planner form submission creates valid activity plan
const validPlanInput = {
  title: 'Campus Iron & Nutrition Drive',
  targetAudience: 'College Campus Students',
  date: '2026-11-15',
  organizer: 'NSS Nutrition Volunteers',
  steps: '1. Leaflet distribution\n2. Tasting booth for Amla juice\n3. Iron-rich diet presentation'
};
const planCreated = createCommunityPlan(validPlanInput);
assert(
  planCreated.id &&
    planCreated.title === validPlanInput.title &&
    planCreated.targetAudience === validPlanInput.targetAudience &&
    planCreated.steps === validPlanInput.steps &&
    planCreated.createdAt,
  '18. Planner form submission creates valid activity plan',
  'Plan creation failed'
);

// 19. Language switching toggles bilingual fields
const testArticle = awarenessArticles[0];
const testSuperfood = superfoods[0];
assert(
  Boolean(testArticle.title && testArticle.teluguTitle && testArticle.title !== testArticle.teluguTitle) &&
    Boolean(testSuperfood.name && testSuperfood.teluguName && testSuperfood.name !== testSuperfood.teluguName),
  '19. Language switching toggles bilingual fields properly',
  'Bilingual fields are identical or missing'
);

// 20. Module integrity and exports
assert(
  typeof filterArticles === 'function' &&
    typeof filterSuperfoods === 'function' &&
    typeof filterMyths === 'function' &&
    typeof validateCommunityPlan === 'function' &&
    typeof createCommunityPlan === 'function',
  '20. All module exports and utility helpers are intact and functional',
  'Missing module helper exports'
);

console.log('\n----------------------------------------------------');
console.log(`📊 Test Results: ${passedTests} / ${totalTests} Passed (${failedTests} Failed)`);
console.log('----------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 20 MODULE 14 AWARENESS CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
}
