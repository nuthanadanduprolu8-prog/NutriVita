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
  // GROUP 2: LABEL LENS 5-CATEGORY CLASSIFICATION & ERROR HANDLING (POST /api/scanner/analyze-label)
  // -------------------------------------------------------------------------
  console.log('\n📋 Test Group 2: Label Lens 5-Category Classification & Error Handling (POST /api/scanner/analyze-label)');

  // Test 2a: PACKAGED_FOOD_WITH_LABEL - Extracted facts with indicators and educational grade
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => ({
      category: 'PACKAGED_FOOD_WITH_LABEL',
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
      ingredientsText: 'Roasted almonds, sea salt, rosemary extract',
      allergens: 'Contains tree nuts (almonds)',
      rawTextSummary: 'Energy 190 kcal, Protein 7g, Fiber 4.5g, Sugars 3g',
    });

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('almond_label.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '2a. PACKAGED_FOOD_WITH_LABEL endpoint succeeds with HTTP 200');
    assert(json.category === 'PACKAGED_FOOD_WITH_LABEL', '2b. Correctly sets category: PACKAGED_FOOD_WITH_LABEL');
    assert(json.isNutritionLabel === true, '2c. Accurately sets isNutritionLabel: true for packaged label');
    assert(json.extracted && json.extracted.calories === 190, '2d. Extracts exact caloric value (190 kcal)');
    assert(json.extracted.sodium === 85, '2e. Extracts sodium (85mg)');
    assert(json.extracted.protein === 7, '2f. Extracts protein (7g)');
    assert(Array.isArray(json.indicators) && json.indicators.some(i => i.id === 'good-protein'), '2g. Identifies good protein indicator');
    assert(json.gradeInfo && json.gradeInfo.grade, '2h. Computes educational grade (A-E)');
  } catch (err) {
    assert(false, 'Group 2a failed', err.message);
  }

  // Test 2b: WHOLE_FOOD - Fresh produce (e.g. Apple / Guava)
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => ({
      category: 'WHOLE_FOOD',
      isNutritionLabel: false,
      confidence: 'high',
      foodName: 'Fresh Apple',
      alternativeNames: ['Red Delicious', 'Seb'],
      teluguName: 'తాజా యాపిల్',
      visibleIngredients: ['Whole fresh apple with red skin'],
      servingSize: '100g standard serving',
      servingBasis: 'per_100g',
      calories: 52,
      protein: 0.3,
      carbohydrates: 14.0,
      totalFat: 0.2,
      saturatedFat: 0,
      fiber: 2.4,
      totalSugars: 10.4,
      sodium: 1,
      keyVitamins: ['Vitamin C', 'Vitamin K'],
      keyMinerals: ['Potassium', 'Boron'],
      nutritionalBenefits: 'Rich in soluble pectin fiber and dietary antioxidants supporting gut and cardiovascular wellness.',
      nutritionalBenefitsTe: 'యాపిల్ జీర్ణక్రియకు మరియు గుండె ఆరోగ్యానికి మంచిది.',
    });

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('apple.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '2i. WHOLE_FOOD responds with HTTP 200 and success: true');
    assert(json.category === 'WHOLE_FOOD', '2j. Correctly sets category: WHOLE_FOOD');
    assert(json.isNutritionLabel === false, '2k. Correctly sets isNutritionLabel: false');
    assert(json.foodName === 'Fresh Apple', '2l. Identifies likely food name: Fresh Apple');
    assert(Array.isArray(json.alternativeNames) && json.alternativeNames.includes('Seb'), '2m. Includes alternative names');
    assert(Array.isArray(json.keyVitamins) && json.keyVitamins.includes('Vitamin C'), '2n. Returns key vitamins');
    assert(Array.isArray(json.keyMinerals) && json.keyMinerals.includes('Potassium'), '2o. Returns key minerals');
    assert(json.nutritionalBenefits && json.nutritionalBenefits.length > 0, '2p. Provides nutritional benefits');
    assert(json.extracted && json.extracted.calories === 52, '2q. Provides standard nutrition per 100g');
    assert(json.gradeInfo && json.gradeInfo.grade, '2r. Calculates educational grade for whole food');
  } catch (err) {
    assert(false, 'Group 2b failed', err.message);
  }

  // Test 2c: COOKED_MEAL - Prepared dish (e.g. Vegetable Biryani)
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => ({
      category: 'COOKED_MEAL',
      isNutritionLabel: false,
      confidence: 'high',
      foodName: 'Vegetable Biryani',
      alternativeNames: ['Veg Pulao', 'Hyderabadi Veg Biryani'],
      teluguName: 'కూరగాయల బిర్యానీ',
      visibleIngredients: ['Basmati Rice', 'Carrots', 'Green Peas', 'Fried Onions', 'Mint Leaves'],
      servingSize: '1 plate (~300g)',
      servingBasis: 'per_serving',
      calories: 360,
      protein: 7.5,
      carbohydrates: 58.0,
      totalFat: 11.0,
      saturatedFat: 3.0,
      fiber: 4.0,
      totalSugars: 3.5,
      sodium: 520,
      preparationNotes: 'Nutritional values for cooked meals are approximate estimates based on standard recipes. Actual values depend on cooking oils, portion weight, and specific ingredients.',
      nutritionalBenefits: 'Provides sustained dietary complex carbohydrates and vegetable fiber.',
    });

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('biryani.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '2s. COOKED_MEAL responds with HTTP 200 and success: true');
    assert(json.category === 'COOKED_MEAL', '2t. Correctly sets category: COOKED_MEAL');
    assert(json.foodName === 'Vegetable Biryani', '2u. Identifies likely dish name');
    assert(Array.isArray(json.visibleIngredients) && json.visibleIngredients.includes('Basmati Rice'), '2v. Identifies visible ingredients');
    assert(json.preparationNotes && json.preparationNotes.includes('approximate'), '2w. Includes clear disclaimer on recipe and portion variance');
    assert(json.extracted && json.extracted.calories === 360, '2x. Provides estimated nutrition per serving');
  } catch (err) {
    assert(false, 'Group 2c failed', err.message);
  }

  // Test 2d: PACKAGED_FOOD_WITHOUT_LABEL - Branded packaged food without visible nutrition panel
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => ({
      category: 'PACKAGED_FOOD_WITHOUT_LABEL',
      isNutritionLabel: false,
      confidence: 'high',
      productName: 'Classic Potato Chips',
      brand: 'Lays',
      visibleIngredients: ['Front packaging of salted potato chips pouch'],
      notice: 'This image shows packaged food, but the printed nutrition facts panel is not facing the camera or visible. Please turn the packaging around and photograph the printed Nutrition Facts panel for exact verified values.',
      noticeTe: 'ఈ ఫోటోలో ప్యాకేజ్డ్ ఫుడ్ కనిపిస్తుంది, కానీ ముద్రించిన పోషకాహార పట్టిక కనిపించడం లేదు. దయచేసి ప్యాకేజింగ్ వెనుక ఉన్న పోషకాహార లేబుల్‌ను ఫోటో తీయండి.',
    });

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('chips_front.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '2y. PACKAGED_FOOD_WITHOUT_LABEL responds with HTTP 200 and success: true');
    assert(json.category === 'PACKAGED_FOOD_WITHOUT_LABEL', '2z. Correctly sets category: PACKAGED_FOOD_WITHOUT_LABEL');
    assert(json.productName === 'Classic Potato Chips', '2aa. Identifies product name from packaging front');
    assert(json.brand === 'Lays', '2ab. Identifies brand from packaging front');
    assert(json.notice && json.notice.includes('printed Nutrition Facts panel'), '2ac. Explains exact values require readable label panel');
    assert(json.extracted === undefined, '2ad. Does NOT invent numerical nutrition numbers without visible label');
  } catch (err) {
    assert(false, 'Group 2d failed', err.message);
  }

  // Test 2e: NON_FOOD/UNCLEAR - Non-food object or blurry photo
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => ({
      category: 'NON_FOOD/UNCLEAR',
      isNutritionLabel: false,
      confidence: 'uncertain',
      unclearReason: 'The image depicts an office desk with a computer monitor, mouse, and coffee mug, not edible food or food packaging.',
      notice: 'Please upload a clear, well-lit photo of a whole food (fruit, vegetable), cooked meal, or packaged food label.',
    });

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('desk.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success, '2ae. NON_FOOD/UNCLEAR responds with HTTP 200');
    assert(json.category === 'NON_FOOD/UNCLEAR', '2af. Correctly sets category: NON_FOOD/UNCLEAR');
    assert(json.unclearReason && json.unclearReason.includes('not edible food'), '2ag. Explains why image was rejected');
    assert(json.notice && json.notice.includes('clear, well-lit photo'), '2ah. Guides user to upload clear food image');
    assert(json.extracted === undefined, '2ai. No extracted nutrition for non-food image');
  } catch (err) {
    assert(false, 'Group 2e failed', err.message);
  }

  // Test 2f: Missing API Key for Label Lens (Unconfigured)
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

    assert(res.status === 200 && json.success === false, '2aj. Missing key returns HTTP 200 with success: false');
    assert(json.source === 'unconfigured', '2ak. Reports source: "unconfigured"');
  } catch (err) {
    assert(false, 'Group 2f failed', err.message);
  }

  // Restore key for error tests
  VisionAIService.getApiKeyInfo = () => ({
    key: 'MOCK_VALID_API_KEY_12345',
    envVarName: 'GEMINI_API_KEY',
    maskedPrefix: 'MOCK...',
    length: 25,
  });

  // Test 2g: Label Lens Gemini Error (HTTP 500)
  try {
    VisionAIService.analyzeNutritionLabelWithGemini = async () => {
      throw new Error('Gemini internal model processing failure');
    };

    const res = await fetch(`${BASE_URL}/scanner/analyze-label`, {
      method: 'POST',
      body: createMockFormData('label.jpg'),
    });
    const json = await res.json();

    assert(res.status === 200 && json.success === false, '2al. Processing error returns HTTP 200 with success: false');
    assert(json.source === 'vision_error', '2am. Reports source: "vision_error"');
    assert(json.source !== 'unconfigured', '2an. Does NOT falsely report "unconfigured" on provider error');
  } catch (err) {
    assert(false, 'Group 2g failed', err.message);
  }

  // Test 2h: Label Lens Quota Exceeded (HTTP 429)
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

    assert(json.source === 'quota_exceeded', '2ao. Correctly classifies quota exhaustion as "quota_exceeded"');
    assert(json.source !== 'unconfigured', '2ap. Does NOT falsely report "unconfigured" when quota exceeded');
  } catch (err) {
    assert(false, 'Group 2h failed', err.message);
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
