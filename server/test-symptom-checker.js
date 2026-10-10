// Automated Integration Test for Symptom-Based Deficiency Awareness Module
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting NutriVita Symptom Checker Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  };

  // 1. GET symptoms
  await test('1. GET /api/symptoms - Fetch all available symptoms catalog', async () => {
    const res = await fetch(`${BASE_URL}/symptoms`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length < 10) {
      throw new Error(`Expected at least 10 symptoms, got ${data.data?.length}`);
    }
    if (!data.categories || data.categories.length < 5) {
      throw new Error('Missing categories metadata');
    }
  });

  // 2. GET individual symptom
  await test('2. GET /api/symptoms/:id - Retrieve specific symptom (bleeding-gums)', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/bleeding-gums`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.symptomId !== 'bleeding-gums') {
      throw new Error('Symptom ID mismatch or retrieval failure');
    }
    if (!data.data.associatedVitamins || data.data.associatedVitamins.length === 0) {
      throw new Error('Missing populated associated vitamins');
    }
  });

  // 3. Empty assessment rejected
  await test('3. POST /api/symptoms/assess - Reject empty symptoms array with 400', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms: [] }),
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 4. Single symptom assessment
  await test('4. POST /api/symptoms/assess - Single symptom assessment (night-vision)', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms: ['night-vision'], language: 'en' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.selectedCount !== 1) throw new Error('Selected count mismatch');
    const topNutrient = data.nutritionConnections[0];
    if (topNutrient.vitaminId !== 'vitamin-a') {
      throw new Error(`Expected Vitamin A to rank top for night vision, got ${topNutrient.vitaminId}`);
    }
  });

  // 5. Multiple symptom assessment
  await test('5. POST /api/symptoms/assess - Multiple symptom assessment (fatigue, pale-skin, dizziness)', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['fatigue', 'pale-skin', 'dizziness'],
        language: 'en'
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.selectedCount !== 3) throw new Error('Selected symptoms count mismatch');
    if (!data.nutritionConnections || data.nutritionConnections.length === 0) {
      throw new Error('No nutrition connections returned');
    }
  });

  // 6. Multiple symptoms produce ranked nutrient connections
  await test('6. Scoring: Multiple matching symptoms increase educational relevance rank (Iron top)', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['fatigue', 'pale-skin', 'dizziness'],
        language: 'en'
      }),
    });
    const data = await res.json();
    const topResult = data.nutritionConnections[0];
    if (topResult.vitaminId !== 'mineral-iron') {
      throw new Error(`Expected Iron to be #1 ranked nutrient, got ${topResult.vitaminId}`);
    }
    if (topResult.matchCount < 2) {
      throw new Error('Expected multi-symptom match count >= 2 for Iron');
    }
    if (topResult.relevanceTier !== 'high') {
      throw new Error('Top convergent result should be high educational relevance tier');
    }
  });

  // 7. Food recommendations returned
  await test('7. Output: Food recommendations returned from verified foods database', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['bleeding-gums'],
        language: 'en'
      }),
    });
    const data = await res.json();
    const topResult = data.nutritionConnections[0];
    if (!topResult.recommendedFoods || topResult.recommendedFoods.length === 0) {
      throw new Error('No food recommendations returned for Vitamin C connection');
    }
    const hasAmlaOrGuava = topResult.recommendedFoods.some(f => f.id === 'amla' || f.id === 'guava');
    if (!hasAmlaOrGuava) throw new Error('Amla or Guava missing from Vitamin C whole foods');
  });

  // 8. Vitamin references returned
  await test('8. Output: Populated vitamin profile references and synergy pairs', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['bone-weakness', 'muscle-cramps'],
        language: 'en'
      }),
    });
    const data = await res.json();
    const topResult = data.nutritionConnections.find(c => c.vitaminId === 'vitamin-d' || c.vitaminId === 'mineral-calcium');
    if (!topResult) throw new Error('Expected Vitamin D or Calcium in top connections');
    if (!topResult.rdaAdults) throw new Error('Missing RDA reference information');
  });

  // 9. English response format
  await test('9. Language: English response returns proper localized labels', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['fatigue'],
        language: 'en'
      }),
    });
    const data = await res.json();
    if (!data.disclaimer.includes('educational nutrition guidance')) {
      throw new Error('English disclaimer mismatch');
    }
    if (!data.nutritionConnections[0].educationalExplanation.includes('documented nutritional associations')) {
      throw new Error('English explanation mismatch');
    }
  });

  // 10. Telugu response format
  await test('10. Language: Telugu response returns rich Telugu explanations and disclaimer', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['fatigue', 'pale-skin'],
        language: 'te'
      }),
    });
    const data = await res.json();
    if (!data.disclaimer.includes('నివారణ పోషకాహార')) {
      throw new Error('Telugu disclaimer mismatch');
    }
    if (!data.nutritionConnections[0].educationalExplanation.includes('పోషకాహార సంబంధాన్ని')) {
      throw new Error('Telugu explanation narrative mismatch');
    }
  });

  // 11. Medical disclaimer included
  await test('11. Safety: Mandated CSP non-diagnostic educational disclaimer present', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['fatigue'],
        language: 'en'
      }),
    });
    const data = await res.json();
    if (!data.disclaimer) throw new Error('Missing disclaimer property');
    // Ensure "diagnosed" is NOT used as confirmation
    if (data.disclaimer.includes('diagnosed with')) throw new Error('Forbidden diagnosis claim in disclaimer');
  });

  // 12. Severe/persistent symptom safety guidance included
  await test('12. Safety: Detailed "When to Seek Professional Medical Advice" guidance included', async () => {
    const res = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['tingling-numbness'],
        language: 'en'
      }),
    });
    const data = await res.json();
    if (!data.safetyGuidance || !Array.isArray(data.safetyGuidance.redFlags)) {
      throw new Error('Missing safety guidance red flags list');
    }
    if (!data.safetyGuidance.recommendation.includes('laboratory testing')) {
      throw new Error('Missing laboratory test recommendation');
    }
  });

  // 13. Invalid symptom IDs handled safely
  await test('13. Validation: Unrecognized symptom IDs handled safely without crashing', async () => {
    // Mixed valid and invalid IDs
    const mixedRes = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['fatigue', 'non-existent-xyz-symptom-123'],
        language: 'en'
      }),
    });
    if (!mixedRes.ok) throw new Error(`HTTP ${mixedRes.status} for mixed IDs`);
    const mixedData = await mixedRes.json();
    if (mixedData.selectedCount !== 1) {
      throw new Error(`Expected only 1 valid symptom recognized, got ${mixedData.selectedCount}`);
    }

    // Completely invalid IDs
    const allInvalidRes = await fetch(`${BASE_URL}/symptoms/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: ['bogus-1', 'bogus-2'],
        language: 'en'
      }),
    });
    if (allInvalidRes.status !== 400) {
      throw new Error(`Expected 400 for completely invalid IDs, got ${allInvalidRes.status}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`🏁 Symptom Checker Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
};

runTests();
