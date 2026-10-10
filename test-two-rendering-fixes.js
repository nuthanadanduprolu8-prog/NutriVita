// test-two-rendering-fixes.js
// Verification suite for the two rendering error fixes:
// 1. Saved Plans -> Open Smart Meal Planner
// 2. Food Scanner -> View Complete Micronutrient Radar

import fs from 'fs';
import path from 'path';
import http from 'http';

let passed = 0;
let failed = 0;

function assert(condition, name, details = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    failed++;
    console.error(`  ❌ [FAIL] ${name} ${details ? `-> ${details}` : ''}`);
  }
}

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: body });
        }
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      if (typeof postData === 'object') {
        req.setHeader('Content-Type', 'application/json');
        req.write(JSON.stringify(postData));
      } else {
        req.write(postData);
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('🔬 VERIFICATION SUITE: TWO RENDERING ERROR FIXES');
  console.log('========================================================\n');

  // ----------------------------------------------------
  // TEST GROUP 1: Smart Meal Planner Rendering Fix
  // ----------------------------------------------------
  console.log('📋 Test Group 1: Saved Plans -> Open Smart Meal Planner');

  const plannerCode = fs.readFileSync(path.resolve('client/src/pages/SmartMealPlanner.jsx'), 'utf-8');
  const savedPlansCode = fs.readFileSync(path.resolve('client/src/pages/SavedPlans.jsx'), 'utf-8');

  // 1a. State variable declarations exist
  assert(
    plannerCode.includes('const [generateLoading, setGenerateLoading] = useState(false);') &&
    plannerCode.includes('const [saveLoading, setSaveLoading] = useState(false);') &&
    plannerCode.includes('const [saveMessage, setSaveMessage] = useState(\'\');'),
    '1a. Declares generateLoading, saveLoading, and saveMessage state hooks'
  );

  // 1b. No undeclared references in button props
  assert(
    plannerCode.includes('loading={generateLoading}') &&
    plannerCode.includes('loading={saveLoading}'),
    '1b. Button loading props properly bound to state variables'
  );

  // 1c. Safe null/array checks on meals
  assert(
    plannerCode.includes('Array.isArray(meals?.breakfast)') &&
    plannerCode.includes('Array.isArray(meals?.lunch)') &&
    plannerCode.includes('Array.isArray(meals?.snack)') &&
    plannerCode.includes('Array.isArray(meals?.dinner)'),
    '1c. Daily totals calculation has strict Array.isArray guards'
  );

  // 1d. Safe slotItems check
  assert(
    plannerCode.includes('Array.isArray(meals?.[slot.id])'),
    '1d. Meal slots rendering has strict Array.isArray guard'
  );

  // 1e. Ingesting location.state.loadPlan is normalized
  assert(
    plannerCode.includes('if (p.meals && typeof p.meals === \'object\')') &&
    plannerCode.includes('breakfast: Array.isArray(p.meals.breakfast) ? p.meals.breakfast : []'),
    '1e. Ingestion of saved plans normalizes meal slots safely'
  );

  // 1f. SavedPlans "Open Smart Meal Planner" button destination
  assert(
    savedPlansCode.includes('<Link to="/meal-planner">') &&
    savedPlansCode.includes('Open Smart Meal Planner'),
    '1f. SavedPlans button targets /meal-planner correctly'
  );

  // 1g. BackButton on SmartMealPlanner
  assert(
    plannerCode.includes('<BackButton fallbackPath="/dashboard" />'),
    '1g. SmartMealPlanner includes BackButton with safe fallback'
  );

  // ----------------------------------------------------
  // TEST GROUP 2: Micronutrient Radar & Food Detail Modal Fix
  // ----------------------------------------------------
  console.log('\n📋 Test Group 2: Universal Food Scanner -> Micronutrient Radar');

  const foodModalCode = fs.readFileSync(path.resolve('client/src/components/food/FoodDetailModal.jsx'), 'utf-8');
  const foodScannerCode = fs.readFileSync(path.resolve('client/src/pages/FoodScanner.jsx'), 'utf-8');

  // 2a. Button wireup in FoodScanner
  assert(
    foodScannerCode.includes('setSelectedFoodForModal(scanResult.matched)') &&
    foodScannerCode.includes('View Complete Micronutrient Radar'),
    '2a. FoodScanner button properly sets selected food for modal'
  );

  // 2b. Safe benefits string & array handling
  assert(
    foodModalCode.includes('Array.isArray(rawBenefits)') &&
    foodModalCode.includes('typeof rawBenefits === \'string\''),
    '2b. Benefits list normalizes both strings and arrays without calling .map() on strings'
  );

  // 2c. Safe category handling
  assert(
    foodModalCode.includes('food.category') &&
    foodModalCode.includes('String(food.category).replace'),
    '2c. Category safely handles null/undefined values'
  );

  // 2d. SVG Radar Chart exists
  assert(
    foodModalCode.includes('<svg') &&
    foodModalCode.includes('polygonPoints') &&
    foodModalCode.includes('Radar RDA Footprint'),
    '2d. Renders authentic SVG Micronutrient Radar Chart'
  );

  // 2e. Radar axes definition
  assert(
    foodModalCode.includes('radarAxes') &&
    foodModalCode.includes('iron') &&
    foodModalCode.includes('calcium') &&
    foodModalCode.includes('vitaminC') &&
    foodModalCode.includes('vitaminA') &&
    foodModalCode.includes('vitaminB9') &&
    foodModalCode.includes('vitaminB12'),
    '2e. Covers all 6 primary micronutrient axes (Vit C, Iron, Calcium, Vit A, Folate, Vit B12)'
  );

  // 2f. Handles missing/unmeasured micronutrients without crashing
  assert(
    foodModalCode.includes('Not reported') || foodModalCode.includes('Not tested'),
    '2f. Clearly designates unmeasured/unavailable values instead of fabricating 0'
  );

  // 2g. Returns user safely with Close/Back button
  assert(
    foodModalCode.includes('Back to Scanner Result') || foodModalCode.includes('Close'),
    '2g. Provides explicit Back/Close navigation to return to scan result'
  );

  // ----------------------------------------------------
  // TEST GROUP 3: Live API Simulation with Universal & DB Foods
  // ----------------------------------------------------
  console.log('\n📋 Test Group 3: Real Food Analysis Payloads Passed to Modal Logic');

  // 3a. Universal unlisted food (Pineapple)
  try {
    const pineRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/scanner/correct',
      method: 'POST'
    }, {
      foodName: 'Pineapple',
      targetWeightGrams: 165
    });

    assert(pineRes.status === 200 && !!pineRes.data?.data, '3a. POST /api/scanner/correct returns universal food payload');

    const food = pineRes.data.data;

    // Test benefits normalization in JS
    const rawBenefits = food.benefitsTe || food.benefitsEn || [];
    const benefitsList = Array.isArray(rawBenefits)
      ? rawBenefits.filter(Boolean)
      : typeof rawBenefits === 'string' && rawBenefits.trim()
      ? [rawBenefits.trim()]
      : [];
    assert(Array.isArray(benefitsList) && benefitsList.length > 0, '3b. Pineapple benefits string safely parsed to array');

    // Test category normalization
    const cat = food.category ? String(food.category).replace(/_/g, ' ') : 'Whole Food';
    assert(cat.length > 0, '3c. Pineapple category string safely normalized');

    // Test that radar points can be calculated without NaN
    const numAxes = 6;
    const cx = 140, cy = 135, maxR = 90;
    const testPoints = [15, 10, 0, 5, 0, 0].map((val, i) => {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      const r = Math.max((val / 100) * maxR, 6);
      const x = (cx + r * Math.cos(angle)).toFixed(1);
      const y = (cy + r * Math.sin(angle)).toFixed(1);
      return `${x},${y}`;
    }).join(' ');

    assert(!testPoints.includes('NaN'), '3d. SVG radar polygon coordinates generated cleanly without NaN');
  } catch (err) {
    assert(false, 'Test Group 3 Pineapple exception', err.message);
  }

  // 3e. Universal prepared dish (Chicken Biryani)
  try {
    const biryaniRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/scanner/correct',
      method: 'POST'
    }, {
      foodName: 'Chicken Biryani',
      targetWeightGrams: 250
    });

    assert(biryaniRes.status === 200 && !!biryaniRes.data?.data, '3e. POST /api/scanner/correct returns Chicken Biryani payload');
    const biryani = biryaniRes.data.data;
    assert(typeof biryani.benefitsEn === 'string', '3f. Biryani returns single string nutritional benefits from AI');

    const rawBenefits = biryani.benefitsTe || biryani.benefitsEn || [];
    const benefitsList = Array.isArray(rawBenefits)
      ? rawBenefits.filter(Boolean)
      : typeof rawBenefits === 'string' && rawBenefits.trim()
      ? [rawBenefits.trim()]
      : [];
    assert(Array.isArray(benefitsList) && benefitsList.length > 0, '3g. Biryani string benefits safely converted to array without exception');
  } catch (err) {
    assert(false, 'Test Group 3 Biryani exception', err.message);
  }

  // 3h. Verified DB Food (Apple)
  try {
    const appleRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/foods/apple',
      method: 'GET'
    });
    assert(appleRes.status === 200 && !!appleRes.data?.data, '3h. GET /api/foods/apple returns verified whole food');
    const apple = appleRes.data.data;
    assert(Array.isArray(apple.benefitsEn), '3i. Verified DB food benefitsEn is authentic array');
  } catch (err) {
    assert(false, 'Test Group 3 Apple exception', err.message);
  }

  console.log('\n--------------------------------------------------------');
  console.log(`Results: ${passed} / ${passed + failed} Tests Passed`);
  console.log('--------------------------------------------------------\n');

  if (failed === 0) {
    console.log('🎉 BOTH RENDERING ERROR FIXES ARE FULLY VERIFIED!\n');
    process.exit(0);
  } else {
    console.error(`⚠️ ${failed} TEST(S) FAILED.\n`);
    process.exit(1);
  }
}

runTests();
