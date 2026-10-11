/**
 * Comprehensive Mocked Test Suite for Vision Scanner & Label Lens Endpoints
 * Verifies:
 * 1. POST /api/scanner/identify:
 *    - Successful image identification (verified DB match)
 *    - Successful image identification (universal unlisted food)
 *    - Non-food image handling
 *    - Missing GEMINI_API_KEY (honest 'unconfigured' response + fallback)
 *    - Gemini API network failure (accurate 'network_error', NOT unconfigured)
 *    - Gemini Quota limit (accurate 'quota_exceeded', NOT unconfigured)
 *    - Gemini Invalid Key (accurate 'invalid_key', NOT unconfigured)
 * 2. POST /api/scanner/analyze-label:
 *    - Successful label fact extraction + automated grading
 *    - Fresh whole food without printed label notice
 *    - Missing GEMINI_API_KEY (honest 'unconfigured' response)
 *    - Gemini API failure (accurate 'vision_error', NOT unconfigured)
 *    - Gemini Quota limit (accurate 'quota_exceeded', NOT unconfigured)
 * 3. Sanitization & Safe Logging:
 *    - sanitizeErrorMessage strips sensitive keys and tokens
 */

import fs from 'fs';
import { VisionAIService } from './services/visionAIService.js';

process.env.PORT = '5009';
process.env.NODE_ENV = 'test';

const { default: app } = await import('./server.js');
const BASE_URL = 'http://localhost:5009/api';

async function runMockedTests() {
  console.log('================================================================');
  console.log('🧪 VISION SCANNER & LABEL LENS MOCKED CONTROLLER TEST SUITE');
  console.log('================================================================\n');

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

  // Create a dummy image buffer for multipart requests
  const dummyImageBytes = Buffer.from('FAKE_JPEG_IMAGE_CONTENT_FOR_MOCK_TESTING');
  const createMockFormData = (filename = 'test_food.jpg') => {
    const blob = new Blob([dummyImageBytes], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, filename);
    return formData;
  };

  // Save original methods
  const originalGetApiKeyInfo = VisionAIService.getApiKeyInfo;
  const originalIdentifyFood = VisionAIService.identifyFoodWithGemini;
  const originalAnalyzeLabel = VisionAIService.analyzeNutritionLabelWithGemini;

  // -------------------------------------------------------------------------
  // GROUP 1: FOOD SCANNER (POST /api/scanner/identify)
  // -------------------------------------------------------------------------
  console.log('📋 Test Group 1: Food Scanner (POST /api/scanner/identify)');

  // Test 1a: Successful food identification matching verified database (Apple)
  try {
    VisionAIService.getApiKeyInfo = () => ({
      key: 'MOCK_VALID_API_KEY_12345',
      envVarName: 'GEMINI_API_KEY',
      maskedPrefix: 'MOCK...',
      length: 25,
    });
    VisionAIService.identifyFoodWithGemini = async () => ({
      isFood: true,
      foodName: 'Fresh Apple',
      category: 'fruits',
      confidenceLevel: 'high',
      visualObservations: 'A crisp red whole apple.',
      estimatedServing: { size: '1 medium apple (150g)', grams: 150 },
      estimatedNutrition: { calories: 78, protein: 0.5, carbohydrates: 20 },
    });

    const res = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: createMockFormData('apple.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '1a. Identify endpoint succeeds with HTTP 200');
    assert(json.visionAiAvailable === true, '1b. visionAiAvailable is true on successful AI call');
    assert(json.matched && json.matched.id === 'apple', '1c. Successfully maps recognized apple to verified food item');
    assert(json.source === 'vision_ai', '1d. Reports source as vision_ai');
  } catch (err) {
    assert(false, 'Group 1a failed', err.message);
  }

  // Test 1b: Universal Food recognition for food NOT in local 53-food database
  try {
    VisionAIService.identifyFoodWithGemini = async () => ({
      isFood: true,
      foodName: 'Dragon Fruit Smoothie Bowl',
      category: 'fruits',
      confidenceLevel: 'high',
      visualObservations: 'Vibrant pink dragon fruit puree topped with chia seeds.',
      estimatedServing: { size: '1 bowl (250g)', grams: 250 },
      estimatedNutrition: {
        calories: 185,
        protein: 4.2,
        carbohydrates: 36.0,
        totalFat: 2.5,
        dietaryFiber: 6.0,
        saturatedFat: 0.5,
        totalSugars: 18.0,
        sodium: 35,
        keyVitamins: ['Vitamin C: ~25mg'],
        keyMinerals: ['Iron: ~1.2mg'],
      },
      nutritionalBenefits: 'Rich in dietary fiber and powerful antioxidant betacyanins.',
    });

    const res = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: createMockFormData('dragon_bowl.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '1e. Unlisted food responds with HTTP 200');
    assert(json.matched && json.matched.isAiEstimated === true, '1f. Properly flags universal food as isAiEstimated: true');
    assert(json.matched.isVerifiedDatabase === false, '1g. Accurately marks isVerifiedDatabase: false');
    assert(json.matched.calories === 185, '1h. Carries AI estimated calories (185 kcal)');
    assert(json.source === 'vision_ai_universal', '1i. Source identified as vision_ai_universal');
  } catch (err) {
    assert(false, 'Group 1b failed', err.message);
  }

  // Test 1c: Non-food image handling
  try {
    VisionAIService.identifyFoodWithGemini = async () => ({
      isFood: false,
      confidenceLevel: 'uncertain',
      visualObservations: 'This appears to be a wrist watch on a wooden desk, not edible food.',
      clarificationQuestion: 'No food detected. Please take a photo of a meal or dish.',
    });

    const res = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: createMockFormData('watch.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200, '1j. Non-food image responds with HTTP 200');
    assert(json.isFood === false, '1k. Correctly sets isFood: false');
    assert(json.source === 'non_food', '1l. Source identified as non_food');
    assert(json.matched === null, '1m. matched is null for non-food');
  } catch (err) {
    assert(false, 'Group 1c failed', err.message);
  }

  // Test 1d: Missing GEMINI_API_KEY (Unconfigured)
  try {
    VisionAIService.getApiKeyInfo = () => ({
      key: null,
      envVarName: null,
      maskedPrefix: null,
      length: 0,
    });

    const res = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: createMockFormData('food.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success === false, '1n. Missing key returns success: false with HTTP 200');
    assert(json.source === 'unconfigured', '1o. Accurately reports source as "unconfigured"');
    assert(json.visionAiAvailable === false, '1p. Accurately reports visionAiAvailable: false');
    assert(Array.isArray(json.popularWholeFoods) && json.popularWholeFoods.length > 0, '1q. Provides popularWholeFoods fallback list');
  } catch (err) {
    assert(false, 'Group 1d failed', err.message);
  }

  // Restore key info for error-handling tests
  VisionAIService.getApiKeyInfo = () => ({
    key: 'MOCK_VALID_API_KEY_12345',
    envVarName: 'GEMINI_API_KEY',
    maskedPrefix: 'MOCK...',
    length: 25,
  });

  // Test 1e: Gemini Network Timeout / Failure
  try {
    VisionAIService.identifyFoodWithGemini = async () => {
      const netErr = new Error('fetch failed: connect ETIMEDOUT 142.250.180.10');
      netErr.name = 'AbortError';
      throw netErr;
    };

    const res = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: createMockFormData('food.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success === false, '1r. Network failure returns HTTP 200 with success: false');
    assert(json.source === 'network_error', '1s. Correctly classifies error as "network_error"');
    assert(json.source !== 'unconfigured', '1t. Does NOT falsely report "unconfigured" when key is present');
  } catch (err) {
    assert(false, 'Group 1e failed', err.message);
  }

  // Test 1f: Gemini Quota Exceeded (HTTP 429)
  try {
    VisionAIService.identifyFoodWithGemini = async () => {
      const quotaErr = new Error('Gemini HTTP error 429: RESOURCE_EXHAUSTED');
      quotaErr.status = 429;
      throw quotaErr;
    };

    const res = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: createMockFormData('food.jpg'),
    });
    const json = await res.json();

    assert(json.source === 'quota_exceeded', '1u. Correctly classifies HTTP 429 as "quota_exceeded"');
    assert(json.source !== 'unconfigured', '1v. Does NOT falsely report "unconfigured" on quota exhaustion');
  } catch (err) {
    assert(false, 'Group 1f failed', err.message);
  }

  // Test 1g: Gemini Invalid API Key (HTTP 400)
  try {
    VisionAIService.identifyFoodWithGemini = async () => {
      const keyErr = new Error('Gemini HTTP error 400: API_KEY_INVALID');
      keyErr.status = 400;
      throw keyErr;
    };

    const res = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      body: createMockFormData('food.jpg'),
    });
    const json = await res.json();

    assert(json.source === 'invalid_key', '1w. Correctly classifies HTTP 400 as "invalid_key"');
    assert(json.message.includes('GEMINI_API_KEY in Render'), '1x. Provides actionable guidance to update key in Render');
  } catch (err) {
    assert(false, 'Group 1g failed', err.message);
  }

  // -------------------------------------------------------------------------
  // GROUP 2: LABEL LENS (POST /api/scanner/analyze-label)
  // -------------------------------------------------------------------------
  console.log('\n📋 Test Group 2: Label Lens (POST /api/scanner/analyze-label)');

  // Test 2a: Successful label facts extraction with clinical grading
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => ({
      isNutritionLabel: true,
      confidence: 'high',
      productName: 'Roasted Almond Crunch',
      brand: 'NutriBite',
      servingSize: '1 pouch (35g)',
      servingBasis: 'per_serving',
      calories: 190,
      totalFat: 14.0,
      saturatedFat: 1.5,
      carbohydrates: 11.0,
      totalSugars: 3.0,
      fiber: 4.5,
      protein: 7.0,
      sodium: 85,
      rawTextSummary: 'Energy 190 kcal, Protein 7g, Fiber 4.5g, Sugars 3g',
    });

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('almond_label.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '2a. Label analysis endpoint succeeds with HTTP 200');
    assert(json.isNutritionLabel === true, '2b. Accurately sets isNutritionLabel: true');
    assert(json.extracted && json.extracted.calories === 190, '2c. Extracts exact caloric value (190 kcal)');
    assert(Array.isArray(json.indicators) && json.indicators.some(i => i.id === 'good-protein'), '2e. Identifies good protein indicator');
  } catch (err) {
    assert(false, 'Group 2a failed', err.message);
  }

  // Test 2b: Whole food without printed label
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => ({
      isNutritionLabel: false,
      productName: 'Fresh Guava',
    });

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('guava.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '2f. Non-label whole food responds with HTTP 200');
    assert(json.isNutritionLabel === false, '2g. Correctly sets isNutritionLabel: false');
    assert(json.foodOnlyNotice && json.foodOnlyNotice.en.includes('Food Scanner'), '2h. Advises user to use Food Scanner for fresh produce');
  } catch (err) {
    assert(false, 'Group 2b failed', err.message);
  }

  // Test 2c: Missing API Key for Label Lens
  try {
    VisionAIService.getApiKeyInfo = () => ({
      key: null,
      envVarName: null,
      maskedPrefix: null,
      length: 0,
    });

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('label.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success === false, '2i. Missing key returns HTTP 200 with success: false');
    assert(json.source === 'unconfigured', '2j. Reports source: "unconfigured"');
  } catch (err) {
    assert(false, 'Group 2c failed', err.message);
  }

  // Restore key for error tests
  VisionAIService.getApiKeyInfo = () => ({
    key: 'MOCK_VALID_API_KEY_12345',
    envVarName: 'GEMINI_API_KEY',
    maskedPrefix: 'MOCK...',
    length: 25,
  });

  // Test 2d: Label Lens Gemini Error (HTTP 500)
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => {
      throw new Error('Gemini internal model processing failure');
    };

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('label.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success === false, '2k. Processing error returns HTTP 200 with success: false');
    assert(json.source === 'vision_error', '2l. Reports source: "vision_error"');
    assert(json.source !== 'unconfigured', '2m. Does NOT falsely report "unconfigured" on provider error');
  } catch (err) {
    assert(false, 'Group 2d failed', err.message);
  }

  // Test 2e: Label Lens Quota Exceeded (HTTP 429)
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => {
      const quotaErr = new Error('Gemini HTTP 429: RESOURCE_EXHAUSTED');
      quotaErr.status = 429;
      throw quotaErr;
    };

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('label.jpg'),
    });
    const json = await res.json();

    assert(json.source === 'quota_exceeded', '2n. Correctly classifies quota exhaustion as "quota_exceeded"');
    assert(json.source !== 'unconfigured', '2o. Does NOT falsely report "unconfigured" when quota exceeded');
  } catch (err) {
    assert(false, 'Group 2e failed', err.message);
  }

  // -------------------------------------------------------------------------
  // GROUP 3: SANITIZATION & SAFE LOGGING INTEGRITY
  // -------------------------------------------------------------------------
  console.log('\n📋 Test Group 3: Sanitization & Safe Logging Integrity');

  {
    const secretKey = 'AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6';
    const rawError = `Google API error: https://generativelanguage.googleapis.com/v1beta/models?key=${secretKey} failed with key ${secretKey}`;
    const sanitized = VisionAIService.sanitizeErrorMessage(rawError, secretKey);

    assert(!sanitized.includes(secretKey), '3a. sanitizeErrorMessage scrubs full raw secret from error strings');
    assert(sanitized.includes('[REDACTED_API_KEY]'), '3b. Replaces secret with safe placeholder');
    assert(!sanitized.includes('AIzaSy'), '3c. Scrubbed standard AIzaSy prefix completely');
  }

  // Restore original methods
  VisionAIService.getApiKeyInfo = originalGetApiKeyInfo;
  VisionAIService.identifyFoodWithGemini = originalIdentifyFood;
  VisionAIService.analyzeNutritionLabelWithGemini = originalAnalyzeLabel;

  console.log('\n================================================================');
  console.log(`🏁 MOCKED TEST RESULTS: ${passed} / ${total} Tests Passed`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('🎉 All mocked vision scanner and label lens tests passed successfully!\n');
    process.exit(0);
  } else {
    console.error(`💥 ${total - passed} tests failed.`);
    process.exit(1);
  }
}

runMockedTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
