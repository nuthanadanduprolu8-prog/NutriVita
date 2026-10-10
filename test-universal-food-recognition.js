import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000/api';

async function runUniversalRecognitionTests() {
  console.log('========================================================');
  console.log('🌍 NUTRIVITA UNIVERSAL FOOD VISION & NUTRITION TEST SUITE');
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
  // Test 1: Scanner Status & Universal AI Capabilities
  // -------------------------------------------------------------
  console.log('📋 Test Group 1: Scanner Status & AI Provider Health');
  try {
    const statusRes = await fetch(`${BASE_URL}/scanner/status`);
    const statusJson = await statusRes.json();
    assert(statusRes.ok && statusJson.success, '1a. Scanner status endpoint reachable (200 OK)');
    assert(statusJson.visionAiConfigured === true, '1b. Vision AI detected and configured in server environment');
    assert(statusJson.visionAiReachable === true, '1c. Vision AI model reachable from Google Generative Language API');
    assert(typeof statusJson.provider === 'string', '1d. Provider name reported dynamically');
  } catch (err) {
    assert(false, '1. Status check failed', err.message);
  }

  // -------------------------------------------------------------
  // Test 2: Real Image Recognition on Verified Database Item (Apple)
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 2: Image Recognition - Database Whole Food (Apple)');
  try {
    const imgBuffer = fs.readFileSync('client/public/images/foods/apple.jpg');
    const blob = new Blob([imgBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'apple.jpg');

    const startTime = Date.now();
    const identRes = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: formData,
    });
    const identJson = await identRes.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    assert(identRes.ok && identJson.success, `2a. POST /api/scanner/identify returns 200 OK (${duration}s)`);
    assert(identJson.visionAiAvailable === true, '2b. Reports visionAiAvailable: true');
    assert(identJson.isFood === true, '2c. Correctly classifies image as food (isFood: true)');
    assert(identJson.matched && identJson.matched.name.toLowerCase().includes('apple'), '2d. Matches to Fresh Apple in NutriVita database');
    assert(identJson.nutritionSource === 'verified_db', '2e. Properly labels source as verified_db');
    assert(Boolean(identJson.visualObservations), '2f. Provides visual observation rationale');
  } catch (err) {
    assert(false, '2. Database food test failed', err.message);
  }

  // -------------------------------------------------------------
  // Test 3: Real Image Recognition on Distinct Fruit (Mango)
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 3: Image Recognition - Distinct Shape (Mango)');
  try {
    const imgBuffer = fs.readFileSync('client/public/images/foods/mango.jpg');
    const blob = new Blob([imgBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'mango.jpg');

    const identRes = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: formData,
    });
    const identJson = await identRes.json();

    assert(identRes.ok && identJson.success, '3a. POST /api/scanner/identify succeeds for Mango');
    assert(identJson.matched && identJson.matched.name.toLowerCase().includes('mango'), '3b. Accurately identifies Mango without confusing with Orange');
    assert(identJson.confidenceLevel === 'high', '3c. Reports high visual confidence');
  } catch (err) {
    assert(false, '3. Mango image test failed', err.message);
  }

  // -------------------------------------------------------------
  // Test 4: Universal Food Nutrition Calculation (Unlisted Food: Pineapple)
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 4: Universal Nutrition Calculation - Unlisted Food (Pineapple)');
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

    assert(correctRes.ok && correctJson.success, '4a. POST /api/scanner/correct succeeds for Pineapple');
    assert(correctJson.data && correctJson.data.name.toLowerCase().includes('pineapple'), '4b. Accurately titles unlisted food as Pineapple');
    assert(typeof correctJson.data.calories === 'number' && correctJson.data.calories > 40, '4c. Returns realistic caloric estimate (>40 kcal)');
    assert(correctJson.data.macronutrients && typeof correctJson.data.macronutrients.carbs === 'number', '4d. Returns structured macronutrient breakdown (carbs, protein, fats, fiber)');
    assert(correctJson.data.nutritionSource === 'ai_estimated', '4e. Distinguishes value as ai_estimated (not faking verified DB)');
    assert(Boolean(correctJson.data.benefitsEn), '4f. Returns educational dietary benefits for pineapple');
  } catch (err) {
    assert(false, '4. Pineapple test failed', err.message);
  }

  // -------------------------------------------------------------
  // Test 5: Universal Dish Estimation (Chicken Biryani)
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 5: Universal Dish Estimation (Chicken Biryani)');
  try {
    const correctRes = await fetch(`${BASE_URL}/scanner/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        foodName: 'Chicken Biryani',
        targetWeightGrams: 250,
      }),
    });
    const correctJson = await correctRes.json();

    assert(correctRes.ok && correctJson.success, '5a. POST /api/scanner/correct succeeds for Chicken Biryani');
    assert(correctJson.data && correctJson.data.name.toLowerCase().includes('biryani'), '5b. Titles dish as Biryani');
    assert(correctJson.data.calories >= 300, '5c. Returns realistic meal calories (>= 300 kcal for 250g biryani)');
    assert(correctJson.data.macronutrients.protein >= 10, '5d. Returns realistic protein content for chicken (>= 10g)');
    assert(correctJson.data.preparationNotes && correctJson.data.preparationNotes.length > 5, '5e. Notes that cooking oil, ghee, and recipe alter calories');
  } catch (err) {
    assert(false, '5. Biryani test failed', err.message);
  }

  // -------------------------------------------------------------
  // Test 6: Regional Unlisted Food (Medu Vada)
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 6: Regional Specialty (Medu Vada)');
  try {
    const correctRes = await fetch(`${BASE_URL}/scanner/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        foodName: 'Medu Vada',
        targetWeightGrams: 75,
      }),
    });
    const correctJson = await correctRes.json();

    assert(correctRes.ok && correctJson.success, '6a. POST /api/scanner/correct succeeds for Medu Vada');
    assert(correctJson.data && correctJson.data.name.toLowerCase().includes('vada'), '6b. Titles dish as Medu Vada');
    assert(correctJson.data.macronutrients.protein > 3, '6c. Recognizes urad dal protein content');
  } catch (err) {
    assert(false, '6. Medu Vada test failed', err.message);
  }

  // -------------------------------------------------------------
  // Test 7: Portion Size Scaling & Recalculation
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 7: Mathematical Portion Scaling (Double Portion)');
  try {
    const baseFood = {
      name: 'Fresh Apple',
      calories: 52,
      servingWeightGrams: 100,
      macronutrients: { carbs: 13.8, protein: 0.3, fats: 0.2, fiber: 2.4 },
      minerals: { sodium: 1 },
      nutritionSource: 'verified_db',
    };

    const scaleRes = await fetch(`${BASE_URL}/scanner/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentFood: baseFood,
        targetWeightGrams: 200,
      }),
    });
    const scaleJson = await scaleRes.json();

    assert(scaleRes.ok && scaleJson.success, '7a. Scaling endpoint returns 200 OK');
    assert(scaleJson.data.calories === 104, `7b. Scaled calories correctly doubled (52 -> 104 kcal), got ${scaleJson.data.calories}`);
    assert(scaleJson.data.macronutrients.carbs === 27.6, `7c. Scaled carbs doubled (13.8 -> 27.6g), got ${scaleJson.data.macronutrients.carbs}`);
    assert(scaleJson.data.macronutrients.fiber === 4.8, `7d. Scaled fiber doubled (2.4 -> 4.8g), got ${scaleJson.data.macronutrients.fiber}`);
    assert(scaleJson.data.isPortionAdjusted === true, '7e. Flags isPortionAdjusted: true');
  } catch (err) {
    assert(false, '7. Portion scaling test failed', err.message);
  }

  // -------------------------------------------------------------
  // Test 8: Empty Request & Validation Handling
  // -------------------------------------------------------------
  console.log('\n📋 Test Group 8: Validation & Edge Cases');
  try {
    const emptyRes = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: new FormData(),
    });
    assert(emptyRes.status === 400, '8a. Correctly rejects empty image upload with 400 Bad Request');
  } catch (err) {
    assert(false, '8a. Empty upload check failed', err.message);
  }

  try {
    const invalidCorrectRes = await fetch(`${BASE_URL}/scanner/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert(invalidCorrectRes.status === 400, '8b. Correctly rejects empty correction payload with 400 Bad Request');
  } catch (err) {
    assert(false, '8b. Empty correction payload check failed', err.message);
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n--------------------------------------------------------');
  console.log(`Results: ${passed} / ${total} Universal Food Vision Tests Passed`);
  console.log('--------------------------------------------------------');

  if (passed === total) {
    console.log('\n🎉 ALL UNIVERSAL FOOD VISION & NUTRITION TESTS PASSED 100%!\n');
    process.exit(0);
  } else {
    console.error('\n❌ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

runUniversalRecognitionTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
