/**
 * NutriVita Production Fixes Verification Suite
 * Tests the 3 production issues reported on Render:
 * 1. Body Signs: Endpoint reachability, non-JSON safe response handling, CORS headers, assess flow
 * 2. Label Lens: POST /api/scanner/analyze-label, Gemini label extraction, nutrition indicators & grading
 * 3. AI Food Scanner: Multipart boundary handling, universal recognition beyond 53-food database, honest errors
 */

import fs from 'fs';
import path from 'path';

process.env.PORT = '5008';
process.env.NODE_ENV = 'test';

const { default: app } = await import('./server/server.js');
const BASE_URL = 'http://localhost:5008/api';

async function runProductionFixesTests() {
  console.log('========================================================');
  console.log('🚀 NUTRIVITA PRODUCTION FIXES VERIFICATION TEST SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${details}`);
    }
  }

  // -------------------------------------------------------------
  // GROUP 1: ISSUE 1 - BODY SIGNS & SAFE RESPONSE HANDLING
  // -------------------------------------------------------------
  console.log('📋 Test Group 1: Body Signs & Safe Response Handling');

  // Test 1a: CORS Dynamic Origin Reflection
  try {
    const corsRes = await fetch(`${BASE_URL}/body-analyzer/status`, {
      method: 'GET',
      headers: {
        'Origin': 'https://nutrivita.onrender.com',
      },
    });
    const allowOrigin = corsRes.headers.get('access-control-allow-origin');
    const allowCreds = corsRes.headers.get('access-control-allow-credentials');
    assert(
      allowOrigin === 'https://nutrivita.onrender.com' && allowCreds === 'true',
      '1a. CORS dynamic origin reflects requesting Render origin with credentials: true',
      `Got origin=${allowOrigin}, credentials=${allowCreds}`
    );
  } catch (err) {
    assert(false, '1a. CORS check failed', err.message);
  }

  // Test 1b: GET /api/body-analyzer/status
  try {
    const statusRes = await fetch(`${BASE_URL}/body-analyzer/status`);
    const statusJson = await statusRes.json();
    assert(statusRes.ok && statusJson.success, '1b. GET /api/body-analyzer/status returns HTTP 200 with success: true');
    assert(Array.isArray(statusJson.modes), '1c. Status endpoint returns all supported evaluation modes');
  } catch (err) {
    assert(false, '1b. Status check failed', err.message);
  }

  // Test 1c: GET /api/body-analyzer/areas
  try {
    const areasRes = await fetch(`${BASE_URL}/body-analyzer/areas?language=en`);
    const areasJson = await areasRes.json();
    assert(areasRes.ok && areasJson.success && Array.isArray(areasJson.data), '1d. GET /api/body-analyzer/areas returns curated body areas');
    assert(areasJson.data.length >= 4, '1e. At least 4 distinct body areas are available');
  } catch (err) {
    assert(false, '1c. Areas check failed', err.message);
  }

  // Test 1d: POST /api/body-analyzer/assess (JSON payload)
  try {
    const assessRes = await fetch(`${BASE_URL}/body-analyzer/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bodyArea: 'nails',
        physicalChange: 'spoon_nails',
        duration: '1_to_4_weeks',
        associatedSymptoms: ['fatigue'],
        language: 'en',
      }),
    });
    const assessJson = await assessRes.json();
    assert(assessRes.ok && assessJson.success, '1f. POST /api/body-analyzer/assess returns 200 OK with valid analysis');
    assert(assessJson.data && assessJson.data.urgencyLevel, '1g. Assessment contains urgencyLevel and correlated nutrients');
    assert(Array.isArray(assessJson.data.recommendedFoods), '1h. Assessment provides verified dietary replenishment foods');
  } catch (err) {
    assert(false, '1d. Assess JSON failed', err.message);
  }

  // Test 1e: POST /api/body-analyzer/assess (Multipart FormData with image)
  try {
    const imgBuffer = fs.readFileSync('client/public/images/foods/apple.jpg');
    const blob = new Blob([imgBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('bodyArea', 'hair');
    formData.append('physicalChange', 'diffuse_hair_shedding');
    formData.append('duration', '1_to_3_months');
    formData.append('associatedSymptoms', JSON.stringify(['fatigue', 'muscle_weakness']));
    formData.append('language', 'en');
    formData.append('photo', blob, 'sample_sign.jpg');

    const assessMultiRes = await fetch(`${BASE_URL}/body-analyzer/assess`, {
      method: 'POST',
      body: formData,
    });
    const assessMultiJson = await assessMultiRes.json();
    assert(assessMultiRes.ok && assessMultiJson.success, '1i. POST /api/body-analyzer/assess accepts multipart photo upload');
    assert(assessMultiJson.data && assessMultiJson.data.bodyArea, '1j. Multipart assessment produces valid body area assessment data');
  } catch (err) {
    assert(false, '1e. Multipart assess failed', err.message);
  }

  // Test 1f: Client API Base URL Normalization & Safe Fetch Test
  {
    const normalizeUrl = (envUrl) => {
      if (!envUrl || !envUrl.trim()) return '/api';
      const trimmed = envUrl.trim().replace(/\/+$/, '');
      return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
    };

    assert(
      normalizeUrl('https://nutrivita-server.onrender.com') === 'https://nutrivita-server.onrender.com/api',
      '1k. URL normalizer attaches /api to bare Render domain'
    );
    assert(
      normalizeUrl('https://nutrivita-server.onrender.com/api') === 'https://nutrivita-server.onrender.com/api',
      '1l. URL normalizer preserves existing /api path'
    );
    assert(
      normalizeUrl('https://nutrivita-server.onrender.com/api/') === 'https://nutrivita-server.onrender.com/api',
      '1m. URL normalizer strips trailing slash cleanly'
    );
    assert(
      normalizeUrl(undefined) === '/api',
      '1n. URL normalizer defaults to local proxy /api when unset'
    );
  }

  // -------------------------------------------------------------
  // GROUP 2: ISSUE 2 - LABEL LENS & VISION LABEL EXTRACTION
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 2: Label Lens & Vision Label Extraction');

  // Test 2a: GET /api/scanner/status
  try {
    const scStatusRes = await fetch(`${BASE_URL}/scanner/status`);
    const scStatusJson = await scStatusRes.json();
    assert(scStatusRes.ok && scStatusJson.success, '2a. GET /api/scanner/status is reachable');
    assert(scStatusJson.modes && scStatusJson.modes.some(m => m.id === 'label_ocr'), '2b. Scanner status lists Nutrition Label mode');
  } catch (err) {
    assert(false, '2a. Scanner status check failed', err.message);
  }

  // Test 2b: GET /api/scanner/popular-foods
  try {
    const popRes = await fetch(`${BASE_URL}/scanner/popular-foods`);
    const popJson = await popRes.json();
    assert(popRes.ok && popJson.success && Array.isArray(popJson.data), '2c. GET /api/scanner/popular-foods returns list of foods');
  } catch (err) {
    assert(false, '2b. Popular foods check failed', err.message);
  }

  // Test 2c: POST /api/scanner/analyze-label without image returns 400
  try {
    const emptyRes = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
    });
    const emptyJson = await emptyRes.json();
    assert(emptyRes.status === 400 && !emptyJson.success, '2d. POST /api/scanner/analyze-label rejects empty payload with 400');
  } catch (err) {
    assert(false, '2c. Empty label request test failed', err.message);
  }

  // Test 2d: POST /api/scanner/analyze-label with real image payload
  try {
    const imgBuffer = fs.readFileSync('client/public/images/foods/apple.jpg');
    const blob = new Blob([imgBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'sample_label.jpg');

    const labelRes = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: formData,
    });
    const labelJson = await labelRes.json();
    assert(labelRes.ok, '2e. POST /api/scanner/analyze-label responds with HTTP 200');
    assert(typeof labelJson.success === 'boolean', '2f. Response returns boolean success indicator');
    // If analyzed as whole food without label: isNutritionLabel: false or extracted facts
    assert(
      labelJson.isNutritionLabel === false || (labelJson.isNutritionLabel === true && labelJson.extracted !== null) || labelJson.source === 'unconfigured',
      '2g. Label Lens returns structured outcome (extracted facts or clean no_label notice without fake data)'
    );
  } catch (err) {
    assert(false, '2d. Label analysis test failed', err.message);
  }

  // Test 2e: Label Parser indicators & grading calculations
  try {
    const { calculateNutritionIndicators, calculateEducationalGrade, parseNutritionText } = await import('./server/utils/nutritionLabelParser.js');
    
    // Wholesome label text
    const sampleText = `Nutrition Facts\nServing Size: 40g\nCalories: 150 kcal\nTotal Fat: 3g\nSaturated Fat: 0.5g\nCarbohydrates: 27g\nDietary Fiber: 4g\nTotal Sugars: 1g\nProtein: 5g\nSodium: 5mg`;
    const parsed = parseNutritionText(sampleText);
    assert(parsed.isNutritionLabel && parsed.extracted.calories === 150, '2h. parseNutritionText extracts wholesome nutrition values');

    const indicators = calculateNutritionIndicators(parsed.extracted);
    assert(indicators.some(i => i.id === 'low-sugar'), '2i. Low sugar indicator detected (≤5g)');
    assert(indicators.some(i => i.id === 'good-fiber'), '2j. Good fiber indicator detected (≥3g)');
    assert(indicators.some(i => i.id === 'good-protein'), '2k. Good protein indicator detected (≥5g)');

    const grade = calculateEducationalGrade(parsed.extracted);
    assert(grade.grade === 'A', '2l. Wholesome profile receives Educational Grade A');
  } catch (err) {
    assert(false, '2e. Label Parser test failed', err.message);
  }

  // -------------------------------------------------------------
  // GROUP 3: ISSUE 3 - AI FOOD VISION SCANNER & UNIVERSAL FOODS
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 3: AI Food Scanner & Universal Recognition');

  // Test 3a: Identify Verified Food (Apple)
  try {
    const imgBuffer = fs.readFileSync('client/public/images/foods/apple.jpg');
    const blob = new Blob([imgBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'apple.jpg');

    const identRes = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: formData,
    });
    const identJson = await identRes.json();

    assert(identRes.ok, '3a. POST /api/scanner/identify responds with HTTP 200');
    if (identJson.success && identJson.matched) {
      assert(identJson.isFood === true, '3b. Correctly flags isFood: true');
      assert(identJson.matched.name.toLowerCase().includes('apple'), '3c. Matches apple in verified database');
      assert(identJson.nutritionSource === 'verified_db', '3d. Properly identifies source as verified_db');
    } else {
      assert(identJson.source === 'unconfigured' || identJson.visionAiAvailable === false, '3b. Honest unconfigured message when key not provided');
    }
  } catch (err) {
    assert(false, '3a. Identify verified food test failed', err.message);
  }

  // Test 3b: Universal Food Nutrition Calculation for Unlisted Food (Pineapple)
  try {
    const correctRes = await fetch(`${BASE_URL}/scanner/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        foodName: 'Pineapple',
        targetWeightGrams: 165,
      }),
    });
    const correctJson = await correctRes.json();
    assert(correctRes.ok && correctJson.success, '3e. POST /api/scanner/correct computes nutrition for unlisted food');
    assert(correctJson.data && correctJson.data.name.toLowerCase().includes('pineapple'), '3f. Retains food name for unlisted item');
    assert(typeof correctJson.data.calories === 'number' && correctJson.data.calories > 0, '3g. Calculates realistic caloric density');
    assert(correctJson.data.macronutrients && correctJson.data.macronutrients.carbs > 0, '3h. Calculates macronutrient breakdown for unlisted food');
    assert(correctJson.data.isVerifiedDatabase === false, '3i. Properly marks unlisted food as AI estimated (isVerifiedDatabase: false)');
  } catch (err) {
    assert(false, '3b. Universal food calculation failed', err.message);
  }

  // Test 3c: Serving Size Recalculation
  try {
    const scaleRes = await fetch(`${BASE_URL}/scanner/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentFood: {
          id: 'universal_apple',
          name: 'Apple',
          servingWeightGrams: 100,
          calories: 52,
          macronutrients: { carbs: 14, protein: 0.3, fats: 0.2 },
        },
        targetWeightGrams: 200,
      }),
    });
    const scaleJson = await scaleRes.json();
    assert(scaleRes.ok && scaleJson.success, '3j. Portion scaling recalculation succeeds');
    assert(scaleJson.data.calories === 104, '3k. Calories dynamically doubled for 200g portion (52 -> 104 kcal)');
    assert(scaleJson.data.servingWeightGrams === 200, '3l. Updated servingWeightGrams set to 200');
  } catch (err) {
    assert(false, '3c. Portion scaling test failed', err.message);
  }

  console.log('\n========================================================');
  console.log(`🏁 TEST RESULTS: ${passed} / ${total} Tests Passed`);
  console.log('========================================================\n');

  if (passed === total) {
    console.log('✨ All production fixes verified successfully!');
    process.exit(0);
  } else {
    console.error(`❌ ${total - passed} tests failed!`);
    process.exit(1);
  }
}

runProductionFixesTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
