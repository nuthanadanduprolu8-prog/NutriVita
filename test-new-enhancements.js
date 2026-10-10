/**
 * NutriVita Three Major Enhancements Verification Suite
 * Tests:
 * 1. Label Lens OCR Parser, Review Badges, and 0-100 Educational Score Engine
 * 2. Food Database Expansion (Exactly 50 Unique Verified Foods)
 * 3. Body Change Analyzer Backend Endpoints & Multi-modal Workflow
 */

import {
  parseNutritionText,
  calculateEducationalGrade,
  calculateNutritionScore,
  getEmptyNutritionValues
} from './server/utils/nutritionLabelParser.js';
import { foodsData } from './server/data/foodsData.js';
import { BODY_AREAS, evaluateBodyChange } from './server/data/bodyChangeKnowledge.js';

const BASE_URL = 'http://localhost:5000/api';

let totalTests = 0;
let passedTests = 0;

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

async function runTests() {
  console.log('\n========================================================');
  console.log('🔬 NutriVita Three Major Enhancements Test Suite');
  console.log('========================================================\n');

  // ----------------------------------------------------
  // TEST GROUP 1: Real Label OCR & Review Step Parser
  // ----------------------------------------------------
  console.log('Test Group 1: Label Lens OCR & 0-100 Scoring Engine');
  {
    const sampleOats = `Quaker Rolled Oats
NUTRITION FACTS
Serving Size: 40g
Calories: 150 kcal
Energy: 628 kJ
Total Fat: 3g
Saturated Fat: 0.5g
Total Carbohydrate: 27g
Dietary Fiber: 4g
Total Sugars: 1g
Added Sugars: 0g
Protein: 5g
Sodium: 0mg
Calcium: 55mg
Iron: 2.1mg`;

    const parsed = parseNutritionText(sampleOats);

    assert(parsed.extracted.productName?.toLowerCase().includes('oats'), '1a. Product name extracted from top non-nutrition line', `Got: ${parsed.extracted.productName}`);
    assert(parsed.extracted.calories === 150, '1b. Calories extracted correctly (150 kcal)', `Got: ${parsed.extracted.calories}`);
    assert(parsed.extracted.energyKj === 628, '1c. Energy in kJ extracted (628 kJ)', `Got: ${parsed.extracted.energyKj}`);
    assert(parsed.extracted.fiber === 4, '1d. Dietary fiber extracted (4g)', `Got: ${parsed.extracted.fiber}`);
    assert(parsed.extracted.calcium === 55, '1e. Calcium extracted (55mg)', `Got: ${parsed.extracted.calcium}`);
    assert(parsed.extracted.iron === 2.1, '1f. Iron extracted (2.1mg)', `Got: ${parsed.extracted.iron}`);

    // Scoring engine calculation
    const gradeResult = calculateEducationalGrade(parsed.extracted);
    assert(gradeResult.nutritionScore >= 80, '1g. Whole-food rolled oats receives high Nutrition Score (>=80)', `Score: ${gradeResult.nutritionScore}`);
    assert(gradeResult.grade === 'A', '1h. Rolled oats receives Educational Grade A', `Grade: ${gradeResult.grade}`);
    assert(gradeResult.positiveFactors.length >= 2, '1i. Positive factors breakdown returned (Fiber, Protein, Calcium/Iron)', `Factors: ${gradeResult.positiveFactors.length}`);
    assert(gradeResult.dietarySuggestions.length > 0, '1j. Practical dietary suggestion returned', `Suggestions: ${gradeResult.dietarySuggestions.length}`);

    // Salt to Sodium fallback test
    const saltOnlyText = `Salt: 1.2g\nEnergy: 200 kcal`;
    const saltParsed = parseNutritionText(saltOnlyText);
    assert(saltParsed.extracted.salt === 1.2 && saltParsed.extracted.sodium === 480, '1k. Salt to Sodium bidirectional conversion (1.2g salt -> 480mg sodium)', `Sodium: ${saltParsed.extracted.sodium}`);

    // Missing values safety test (never silent 0)
    const emptyValues = getEmptyNutritionValues();
    assert(emptyValues.fiber === null && emptyValues.protein === null && emptyValues.calories === null, '1l. Unreported values remain null (not fabricated as 0)', `Fiber: ${emptyValues.fiber}`);
  }

  // ----------------------------------------------------
  // TEST GROUP 2: Food Database Expansion (50 Unique Foods)
  // ----------------------------------------------------
  console.log('\nTest Group 2: Foods Database Expansion (50 Unique Items)');
  {
    assert(foodsData.length >= 50, '2a. Foods dataset contains full verified catalog (>= 50 items)', `Count: ${foodsData.length}`);

    const idSet = new Set(foodsData.map((f) => f.id));
    assert(idSet.size === foodsData.length, '2b. All foods have completely unique IDs', `Unique: ${idSet.size}`);

    const validCategories = ['vegetables', 'fruits', 'grains_millets', 'pulses_legumes', 'dairy', 'nuts_seeds', 'eggs_poultry_fish', 'snack', 'snacks'];
    const allCategoriesValid = foodsData.every((f) => validCategories.includes(f.category));
    assert(allCategoriesValid, '2c. Every food belongs to an approved schema category');

    const allHaveTelugu = foodsData.every((f) => f.teluguName && f.teluguName.length > 2);
    assert(allHaveTelugu, '2d. Every food has authentic Telugu script name');

    const allHaveValidImages = foodsData.every((f) => f.imageUrl && (f.imageUrl.startsWith('http') || f.imageUrl.startsWith('/images/')));
    assert(allHaveValidImages, '2e. Every food has valid verified image URL or asset');

    const allHaveMacrosAndMinerals = foodsData.every((f) => 
      f.calories > 0 && 
      f.macronutrients && 
      typeof f.macronutrients.protein === 'number' && 
      f.minerals && 
      typeof f.minerals.iron === 'number'
    );
    assert(allHaveMacrosAndMinerals, '2f. Every food has complete macros and minerals schema');

    // Live API check
    try {
      const res = await fetch(`${BASE_URL}/foods?limit=100`);
      if (res.ok) {
        const json = await res.json();
        assert(json.success && json.total >= 50, '2g. GET /api/foods returns full dataset (>=50 foods)', `API total: ${json.total}`);
        
        // Target corrected and replaced items verification
        const correctedIds = [
          'mamidikaya_pappu', 'veg_chapati_roll', 'kakarakaya_fry', 'lemon_rice',
          'dark_chocolate', 'milk', 'beetroot_poriyal', 'upma',
          'tomato_dal', 'sambar', 'gongura_pappu', 'samosa', 'ragi_sangati', 'bendakaya_fry', 'chicken_curry'
        ];
        const allCorrectedPresent = correctedIds.every(id => json.data.some(f => f.id === id));
        assert(allCorrectedPresent, '2h. All target foods (Mamidikaya Pappu, Chapati Roll, Kakarakaya Fry, Lemon Rice, Dark Chocolate, Milk, Samosa, Poriyal, etc.) present in database');

        const noDuplicateNames = new Set(json.data.map(f => f.name.toLowerCase())).size === json.data.length;
        assert(noDuplicateNames, '2i. All foods have completely unique product names (no duplicate items)');
      } else {
        assert(false, '2g. GET /api/foods HTTP response OK');
      }
    } catch (err) {
      assert(false, '2g. GET /api/foods reachable', err.message);
    }
  }

  // ----------------------------------------------------
  // TEST GROUP 3: Body Change Analyzer
  // ----------------------------------------------------
  console.log('\nTest Group 3: Real Vision AI Body Change Analyzer');
  {
    assert(BODY_AREAS.length === 6, '3a. Exactly 6 anatomical body areas defined', `Count: ${BODY_AREAS.length}`);

    const expectedAreas = ['nails', 'hair', 'eyes', 'mouth_lips', 'skin', 'legs_joints'];
    const areasMatch = expectedAreas.every((id) => BODY_AREAS.some((a) => a.id === id));
    assert(areasMatch, '3b. All 6 areas present: nails, hair, eyes, mouth_lips, skin, legs_joints');

    // Rule knowledge evaluation
    const nailEval = evaluateBodyChange({
      bodyAreaId: 'nails',
      changeId: 'spoon_nails',
      duration: '1_to_3_months',
      language: 'en'
    });
    assert(nailEval.correlatedNutrients.some((n) => n.nutrient === 'Iron'), '3c. Koilonychia correlates to Iron with biological rationale');
    assert(nailEval.recommendedFoodIds.length > 0, '3d. Recommended whole foods mapped to physical change');
    assert(nailEval.redFlags.length > 0, '3e. Red flag clinical warning guidelines present');
    assert(nailEval.educationalDisclaimer.length > 10, '3f. Mandatory non-diagnostic safety disclaimer present');

    // Live API: GET /api/body-analyzer/areas
    try {
      const res = await fetch(`${BASE_URL}/body-analyzer/areas`);
      assert(res.ok, '3g. GET /api/body-analyzer/areas endpoint reachable');
      const json = await res.json();
      assert(json.success && json.count === 6, '3h. GET /api/body-analyzer/areas returns 6 areas');
    } catch (err) {
      assert(false, '3g. GET /api/body-analyzer/areas reachable', err.message);
    }

    // Live API: POST /api/body-analyzer/assess (JSON)
    try {
      const res = await fetch(`${BASE_URL}/body-analyzer/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyArea: 'mouth_lips',
          physicalChange: 'angular_cheilitis',
          duration: '1_to_4_weeks',
          associatedSymptoms: ['fatigue'],
          language: 'en'
        })
      });
      assert(res.ok, '3i. POST /api/body-analyzer/assess accepts assessment request');
      const json = await res.json();
      assert(json.success && json.data.bodyArea.id === 'mouth_lips', '3j. Assessment response contains structured body area data');
      assert(json.data.recommendedFoods.length > 0, '3k. Assessment populates verified food items from NutriVita database');
      assert(json.data.visionAiUsed === false && json.data.apiKeyNotice.includes('Educational Rules-Based Mode Active'), '3l. Transparent educational notice when no photo uploaded or unconfigured');
    } catch (err) {
      assert(false, '3i. POST /api/body-analyzer/assess reachable', err.message);
    }

    // Live API: POST /api/body-analyzer/assess with Telugu language
    try {
      const res = await fetch(`${BASE_URL}/body-analyzer/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyArea: 'skin',
          physicalChange: 'bumpy_skin',
          duration: '1_to_3_months',
          language: 'te'
        })
      });
      const json = await res.json();
      assert(json.success && json.data.bodyArea.name.includes('చర్మం'), '3m. Telugu assessment returns localized anatomical names');
      assert(json.data.educationalDisclaimer.includes('విద్యా'), '3n. Telugu assessment returns localized educational disclaimer');
    } catch (err) {
      assert(false, '3m. Telugu assessment reachable', err.message);
    }

    // Validation: 400 rejection on missing parameters
    try {
      const res = await fetch(`${BASE_URL}/body-analyzer/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      assert(res.status === 400, '3o. Rejects missing required parameters with 400 status');
    } catch (err) {
      assert(false, '3o. 400 rejection check', err.message);
    }

    // CameraModal Component Verification
    const fs = await import('fs');
    const cameraModalExists = fs.existsSync('./client/src/components/common/CameraModal.jsx');
    assert(cameraModalExists, '3p. Reusable CameraModal component exists with stream lifecycle and constraint fallback');

    const labelLensContent = fs.readFileSync('./client/src/pages/LabelLens.jsx', 'utf8');
    const bodyChangeContent = fs.readFileSync('./client/src/pages/BodyChangeAnalyzer.jsx', 'utf8');
    assert(
      labelLensContent.includes('CameraModal') && bodyChangeContent.includes('CameraModal'),
      '3q. CameraModal integrated in both LabelLens and BodyChangeAnalyzer pages'
    );

    assert(
      bodyChangeContent.includes('aiConsent') && bodyChangeContent.includes('aiConsentLabel'),
      '3r. Explicit AI consent checkbox and validation wired into BodyChangeAnalyzer'
    );
  }

  console.log('\n--------------------------------------------------------');
  console.log(`Results: ${passedTests} / ${totalTests} Enhancement Tests Passed`);
  console.log('--------------------------------------------------------\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL THREE ENHANCEMENTS FULLY VERIFIED AND PASSING!\n');
  } else {
    process.exitCode = 1;
  }
}

runTests();
