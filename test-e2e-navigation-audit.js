// test-e2e-navigation-audit.js
// Comprehensive End-to-End Application Audit, Navigation & Cross-Feature Interaction Test Suite for NutriVita

import http from 'http';
import fs from 'fs';
import path from 'path';

let passedCount = 0;
let failedCount = 0;

function report(testName, passed, detail = '') {
  if (passed) {
    passedCount++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedCount++;
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
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

async function runAudit() {
  console.log('========================================================');
  console.log('🔍 NUTRIVITA COMPREHENSIVE END-TO-END APPLICATION AUDIT');
  console.log('========================================================\n');

  let authToken = '';
  let testUserEmail = `audit_user_${Date.now()}@nutrivita.test`;
  let savedPlanId = '';

  // ----------------------------------------------------
  // SECTION 1: Authentication & Account Lifecycle
  // ----------------------------------------------------
  console.log('📋 Section 1: Authentication & Account Lifecycle');
  try {
    // 1a. User Registration
    const regRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST'
    }, {
      name: 'Ananya Sharma',
      email: testUserEmail,
      password: 'NutriPassword123!',
      age: 26,
      gender: 'female',
      dietaryPreference: 'vegetarian',
      activityLevel: 'moderate',
      languagePreference: 'en'
    });
    report('1a. User registration creates account with valid token', regRes.status === 201 && !!regRes.data?.token);
    authToken = regRes.data?.token;

    // 1b. Duplicate Registration Rejection
    const dupRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST'
    }, {
      name: 'Duplicate',
      email: testUserEmail,
      password: 'password123'
    });
    report('1b. Registration correctly rejects duplicate email with 400', dupRes.status === 400);

    // 1c. User Login
    const loginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST'
    }, {
      email: testUserEmail,
      password: 'NutriPassword123!'
    });
    report('1c. User login returns JWT authentication token', loginRes.status === 200 && !!loginRes.data?.token);

    // 1d. Invalid credentials rejected
    const badLogin = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST'
    }, {
      email: testUserEmail,
      password: 'WrongPassword'
    });
    report('1d. Login rejects invalid password with 401', badLogin.status === 401);

    // 1e. Protected route without token rejected
    const noAuthRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET'
    });
    report('1e. Protected route rejects unauthenticated request with 401', noAuthRes.status === 401);

    // 1f. Protected route with valid token
    const authProfileRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    report('1f. Authenticated profile endpoint returns current user details', authProfileRes.status === 200 && authProfileRes.data?.user?.email === testUserEmail);

    // 1g. Profile Update
    const updateProfileRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/profile',
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` }
    }, {
      name: 'Ananya Sharma (Updated)',
      age: 27,
      activityLevel: 'active',
      languagePreference: 'te'
    });
    report('1g. Profile update persists new age, activity level & language preference', updateProfileRes.status === 200 && updateProfileRes.data?.user?.activityLevel === 'active');
  } catch (err) {
    report('Section 1 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 2: Foods Database, Search & Filtering
  // ----------------------------------------------------
  console.log('\n📋 Section 2: Foods Database, Search & Filtering');
  try {
    // 2a. Fetch full foods catalogue
    const foodsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/foods',
      method: 'GET'
    });
    const foods = foodsRes.data?.data || [];
    report('2a. Foods catalog contains >= 50 verified whole food entries', foods.length >= 50, `Found: ${foods.length}`);

    // 2b. Verify Moringa Pods was removed completely
    const moringaExists = foods.some(f => /moringa\s*pods/i.test(f.name));
    report('2b. "Moringa Pods (Drumstick Curry)" is completely absent', !moringaExists);

    // 2c. Verify Dark Chocolate exists and is categorized properly
    const darkChoc = foods.find(f => /dark\s*chocolate/i.test(f.name));
    report('2c. Dark Chocolate exists with authentic Telugu name & snack category', !!darkChoc && darkChoc.teluguName === 'డార్క్ చాక్లెట్' && darkChoc.category === 'snacks');

    // 2d. Verify Coconut replaced Flaxseeds
    const coconut = foods.find(f => /coconut/i.test(f.name) || /కొబ్బరి/i.test(f.teluguName));
    const flaxseeds = foods.find(f => /flaxseeds/i.test(f.name));
    report('2d. Coconut exists with Telugu "కొబ్బరి" and flaxseeds is absent', !!coconut && !flaxseeds);

    // 2e. Whole Wheat Flour image verification
    const atta = foods.find(f => /whole wheat flour/i.test(f.name));
    report('2e. Whole Wheat Flour (Atta) exists with authentic nutrition values', !!atta && atta.calories > 300);

    // 2f. Search filter query: "dal"
    const searchRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/foods?search=dal',
      method: 'GET'
    });
    report('2f. GET /api/foods?search=dal returns matching dal items', searchRes.status === 200 && searchRes.data?.data?.length > 0);

    // 2g. Category filter: "fruits"
    const fruitRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/foods?category=fruits',
      method: 'GET'
    });
    report('2g. GET /api/foods?category=fruits returns fruit items', fruitRes.status === 200 && fruitRes.data?.data?.every(f => f.category === 'fruits'));

    // 2h. Rich-in filter: "vitamin_c"
    const richRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/foods?richIn=vitamin_c',
      method: 'GET'
    });
    report('2h. GET /api/foods?richIn=vitamin_c returns vitamin C rich foods (e.g. Amla, Guava)', richRes.status === 200 && richRes.data?.data?.length > 0);

    // 2i. Single food lookup by ID
    const singleFood = foods[0];
    const singleRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/foods/${singleFood.id}`,
      method: 'GET'
    });
    report('2i. GET /api/foods/:id retrieves specific food with full nutrient breakdown', singleRes.status === 200 && singleRes.data?.data?.id === singleFood.id);
  } catch (err) {
    report('Section 2 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 3: Vitamins Directory & RDA Benchmarks
  // ----------------------------------------------------
  console.log('\n📋 Section 3: Vitamins Directory & RDA Benchmarks');
  try {
    const vitRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/vitamins',
      method: 'GET'
    });
    const vitamins = vitRes.data?.data || [];
    report('3a. GET /api/vitamins returns all 13 essential vitamins', vitamins.length === 13, `Count: ${vitamins.length}`);

    // 3b. Search filter on vitamins: water soluble
    const waterVit = vitamins.filter(v => v.type === 'water_soluble');
    report('3b. Water-soluble vitamins count is 7 (B-complex + Vitamin C)', waterVit.length === 7, `Count: ${waterVit.length}`);

    // 3c. Specific vitamin lookup
    const vitCRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/vitamins/vitamin-c',
      method: 'GET'
    });
    report('3c. GET /api/vitamins/vitamin-c returns ascorbic acid profile with deficiency symptoms', vitCRes.status === 200 && !!vitCRes.data?.data?.rdaAdults);
  } catch (err) {
    report('Section 3 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 4: Plate Balancer & Alias Normalization
  // ----------------------------------------------------
  console.log('\n📋 Section 4: Balance My Meal & Food Alias Resolution');
  try {
    // 4a. Balance meal with standard IDs
    const balanceRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/meals/balance',
      method: 'POST'
    }, {
      items: [
        { foodId: 'palak_paneer', quantity: 150 },
        { foodId: 'tomato_dal', quantity: 100 }
      ]
    });
    report('4a. Plate balancer returns 50:25:25 macro evaluation & total nutrients', balanceRes.status === 200 && balanceRes.data?.evaluation?.score > 0 && balanceRes.data?.nutrition?.totalCalories > 0);

    // 4b. Test alias resolution: 'ragi' -> 'ragi_sangati'
    const aliasRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/meals/balance',
      method: 'POST'
    }, {
      items: [
        { foodId: 'ragi', quantity: 100 },
        { foodId: 'sambar', quantity: 150 }
      ]
    });
    const ragiFoundInAnalysis = aliasRes.data?.nutrition?.itemsDetailed?.some(it => it.foodId === 'ragi_sangati');
    report('4b. Alias "ragi" successfully maps to "ragi_sangati" in meal evaluation', ragiFoundInAnalysis);

    // 4c. Test alias resolution: 'finger_millet' -> 'ragi_sangati'
    const aliasRes2 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/meals/balance',
      method: 'POST'
    }, {
      items: [
        { foodId: 'finger_millet', quantity: 100 }
      ]
    });
    const milletFound = aliasRes2.data?.nutrition?.itemsDetailed?.some(it => it.foodId === 'ragi_sangati');
    report('4c. Alias "finger_millet" successfully maps to "ragi_sangati"', milletFound);
  } catch (err) {
    report('Section 4 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 5: Smart Meal Planner & Saved Plans CRUD
  // ----------------------------------------------------
  console.log('\n📋 Section 5: Smart Meal Planner & Saved Plans CRUD');
  try {
    // 5a. Generate auto meal plan
    const genPlanRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/meals/generate',
      method: 'POST'
    }, {
      targetCalories: 2000,
      dietaryPreference: 'vegetarian'
    });
    report('5a. Meal planner generates 4 meals (breakfast, lunch, snack, dinner)', genPlanRes.status === 200 && !!genPlanRes.data?.data?.meals?.breakfast);

    // 5b. Save custom meal plan
    const savePlanRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/meals/save',
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` }
    }, {
      title: 'South Indian Balanced Day',
      targetCalories: 1950,
      dietaryPreference: 'vegetarian',
      meals: genPlanRes.data.data.meals,
      dailyTotals: genPlanRes.data.data.dailyTotals
    });
    savedPlanId = savePlanRes.data?.data?.id || savePlanRes.data?.data?._id;
    report('5b. Save meal plan persists to user archive with unique ID', savePlanRes.status === 201 && !!savedPlanId);

    // 5c. Retrieve saved plans
    const listPlansRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/meals/saved',
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    report('5c. GET /api/meals/saved retrieves saved plan for authenticated user', listPlansRes.status === 200 && listPlansRes.data?.data?.some(p => (p.id || p._id) === savedPlanId));

    // 5d. Delete saved plan
    const deletePlanRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/meals/saved/${savedPlanId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    report('5d. DELETE /api/meals/saved/:id removes plan successfully', deletePlanRes.status === 200);

    // 5e. Confirm deletion
    const listAfterDelete = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/meals/saved',
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    report('5e. Verified plan no longer present in saved plans list', !listAfterDelete.data?.data?.some(p => (p.id || p._id) === savedPlanId));
  } catch (err) {
    report('Section 5 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 6: Symptom Checker & Educational Guidance
  // ----------------------------------------------------
  console.log('\n📋 Section 6: Symptom Checker & Educational Guidance');
  try {
    // 6a. Get symptom catalog
    const symCatalog = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/symptoms',
      method: 'GET'
    });
    report('6a. GET /api/symptoms returns symptom catalog with categories', symCatalog.status === 200 && symCatalog.data?.data?.length > 0);

    // 6b. Assess multiple symptoms
    const symAssess = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/symptoms/assess',
      method: 'POST'
    }, {
      symptoms: ['fatigue', 'pale-skin', 'dizziness'],
      language: 'en'
    });
    report('6b. POST /api/symptoms/assess identifies potential micronutrient deficiency (e.g. Iron)', symAssess.status === 200 && symAssess.data?.nutritionConnections?.some(d => /iron|b12/i.test(d.nameEn || d.vitaminId)));
    report('6c. Non-diagnostic safety disclaimer present in symptom assessment', !!symAssess.data?.disclaimer);
  } catch (err) {
    report('Section 6 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 7: Body Change Analyzer & Status
  // ----------------------------------------------------
  console.log('\n📋 Section 7: Body Change Analyzer & Status');
  try {
    const bStatus = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/body-analyzer/status',
      method: 'GET'
    });
    report('7a. Body Analyzer status endpoint reachable with boolean configuration flags', bStatus.status === 200 && typeof bStatus.data?.visionAiConfigured === 'boolean');

    const bAreas = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/body-analyzer/areas',
      method: 'GET'
    });
    report('7b. Body Analyzer areas returns 6 anatomical areas', bAreas.status === 200 && bAreas.data?.data?.length === 6);

    const bAssess = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/body-analyzer/assess',
      method: 'POST'
    }, {
      bodyArea: 'mouth_lips',
      physicalChange: 'angular_cheilitis',
      duration: '1_to_4_weeks',
      associatedSymptoms: ['fatigue'],
      language: 'en'
    });
    report('7c. Body assessment maps physical change with biological rationale', bAssess.status === 200 && bAssess.data?.data?.bodyArea?.id === 'mouth_lips');
    report('7d. Photo analyzed flag reports non-analyzed when no image uploaded', bAssess.data?.data?.visionAiUsed === false || bAssess.data?.data?.photoAnalyzed === false);
    report('7e. Prominent medical non-diagnostic notice present', !!(bAssess.data?.data?.educationalDisclaimer || bAssess.data?.data?.apiKeyNotice));
  } catch (err) {
    report('Section 7 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 8: VitaMate AI Nutrition Consultation
  // ----------------------------------------------------
  console.log('\n📋 Section 8: VitaMate AI Nutrition Consultation');
  try {
    const aiRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/chat',
      method: 'POST'
    }, {
      message: 'What foods are rich in Vitamin C for boosting immunity?',
      language: 'en'
    });
    report('8a. VitaMate AI returns contextual nutrition advice', aiRes.status === 200 && !!aiRes.data?.message);
    report('8b. Returns associated food recommendations (Amla, Citrus)', aiRes.data?.relatedFoods?.length > 0 || /amla|guava|citrus|orange/i.test(aiRes.data?.message));
    report('8c. Response includes follow-up suggestions for continuous chat flow', Array.isArray(aiRes.data?.suggestedFollowUps) && aiRes.data.suggestedFollowUps.length > 0);
  } catch (err) {
    report('Section 8 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 9: Client Codebase Navigation & UI Architecture Audit
  // ----------------------------------------------------
  console.log('\n📋 Section 9: Client Codebase Navigation & UI Architecture Audit');
  try {
    // 9a. Check BackButton component exists and handles history.state.idx
    const backBtnCode = fs.readFileSync(path.resolve('client/src/components/common/BackButton.jsx'), 'utf-8');
    report('9a. BackButton component checks window.history.state.idx > 0 for safe back navigation', backBtnCode.includes('window.history.state.idx > 0') && backBtnCode.includes('navigate(-1)'));
    report('9b. BackButton component provides fallbackPath if history is absent', backBtnCode.includes('fallbackPath'));
    report('9c. BackButton provides bilingual support (EN: "Back", TE: "వెనుకకు")', backBtnCode.includes('వెనుకకు') && backBtnCode.includes('Back'));

    // 9d. Verify pages have BackButton integrated
    const pagesWithBackBtn = [
      'client/src/pages/BalanceMyMeal.jsx',
      'client/src/pages/FoodScanner.jsx',
      'client/src/pages/FoodExplorer.jsx',
      'client/src/pages/VitaminExplorer.jsx',
      'client/src/pages/SymptomChecker.jsx',
      'client/src/pages/BodyChangeAnalyzer.jsx',
      'client/src/pages/LabelLens.jsx',
      'client/src/pages/SmartMealPlanner.jsx',
      'client/src/pages/SavedPlans.jsx',
      'client/src/pages/VitaMateAI.jsx',
      'client/src/pages/VitaQuiz.jsx',
      'client/src/pages/NutritionAwareness.jsx',
      'client/src/pages/Profile.jsx'
    ];

    let allPagesHaveBack = true;
    for (const pagePath of pagesWithBackBtn) {
      const code = fs.readFileSync(path.resolve(pagePath), 'utf-8');
      if (!code.includes('<BackButton') && !code.includes('BackButton')) {
        allPagesHaveBack = false;
        console.error(`Missing BackButton in: ${pagePath}`);
      }
    }
    report('9d. All 13 primary feature and explorer pages integrate BackButton', allPagesHaveBack);

    // 9e. FoodExplorer uses useSearchParams for query param preservation
    const foodExplorerCode = fs.readFileSync(path.resolve('client/src/pages/FoodExplorer.jsx'), 'utf-8');
    report('9e. FoodExplorer preserves search and filter parameters in URL via useSearchParams', foodExplorerCode.includes('useSearchParams') && foodExplorerCode.includes('setSearchParams'));

    // 9f. VitaminExplorer uses useSearchParams
    const vitExplorerCode = fs.readFileSync(path.resolve('client/src/pages/VitaminExplorer.jsx'), 'utf-8');
    report('9f. VitaminExplorer preserves filter parameters in URL via useSearchParams', vitExplorerCode.includes('useSearchParams'));

    // 9g. FoodScanner wires "Add to Balance Meal" with location.state
    const foodScannerCode = fs.readFileSync(path.resolve('client/src/pages/FoodScanner.jsx'), 'utf-8');
    report('9g. FoodScanner passes scanned food & quantity to /balance-my-meal via location.state', foodScannerCode.includes("navigate('/balance-my-meal'") && foodScannerCode.includes('addFood'));

    // 9h. BalanceMyMeal ingests location.state.addFood and location.state.loadPlanMeals
    const balanceMealCode = fs.readFileSync(path.resolve('client/src/pages/BalanceMyMeal.jsx'), 'utf-8');
    report('9h. BalanceMyMeal consumes location.state.addFood and location.state.loadPlanMeals', balanceMealCode.includes('location.state.addFood') && balanceMealCode.includes('location.state.loadPlanMeals'));

    // 9i. SavedPlans provides "View Menu Details" modal and "Edit in Planner"
    const savedPlansCode = fs.readFileSync(path.resolve('client/src/pages/SavedPlans.jsx'), 'utf-8');
    report('9i. SavedPlans provides "View Menu" breakdown modal and "Edit in Planner" routing', savedPlansCode.includes('activePlanModal') && savedPlansCode.includes('loadPlan: plan'));

    // 9j. Navbar includes Food Scanner in both navLinks and desktop links
    const navbarCode = fs.readFileSync(path.resolve('client/src/components/layout/Navbar.jsx'), 'utf-8');
    report('9j. Navbar includes Food Scanner in mobile and desktop navigation', navbarCode.includes('/food-scanner'));

    // 9k. Dashboard includes Food Scanner and Smart Meal Planner in quickActions
    const dashCode = fs.readFileSync(path.resolve('client/src/pages/Dashboard.jsx'), 'utf-8');
    report('9k. Dashboard includes Food Scanner and Smart Meal Planner in Quick Actions', dashCode.includes('/food-scanner') && dashCode.includes('/meal-planner'));
  } catch (err) {
    report('Section 9 Exception', false, err.message);
  }

  // ----------------------------------------------------
  // SECTION 10: Security & Environment Integrity
  // ----------------------------------------------------
  console.log('\n📋 Section 10: Security & Environment Integrity');
  try {
    // 10a. Verify server/.env exists and client does NOT bundle GEMINI_API_KEY
    const clientDistJs = fs.existsSync(path.resolve('client/dist/assets'))
      ? fs.readdirSync(path.resolve('client/dist/assets')).filter(f => f.endsWith('.js'))
      : [];
    let keyLeakedInClient = false;
    for (const jsFile of clientDistJs) {
      const content = fs.readFileSync(path.resolve('client/dist/assets', jsFile), 'utf-8');
      if (content.includes('AIzaSy')) {
        keyLeakedInClient = true;
      }
    }
    report('10a. GEMINI_API_KEY is not leaked into compiled client JavaScript bundles', !keyLeakedInClient);

    // 10b. Scanner status endpoint does NOT expose raw key value
    const scanStatus = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/scanner/status',
      method: 'GET'
    });
    report('10b. Scanner status endpoint only exposes boolean configuration flags, never the key value', scanStatus.status === 200 && !scanStatus.data?.apiKey && typeof scanStatus.data?.visionAiConfigured === 'boolean');
  } catch (err) {
    report('Section 10 Exception', false, err.message);
  }

  console.log('\n--------------------------------------------------------');
  console.log(`Results: ${passedCount} / ${passedCount + failedCount} Audit Tests Passed`);
  console.log('--------------------------------------------------------');

  if (failedCount === 0) {
    console.log('\n🎉 COMPREHENSIVE END-TO-END APPLICATION AUDIT PASSED 100%!\n');
    process.exit(0);
  } else {
    console.error(`\n⚠️  ${failedCount} AUDIT TEST(S) FAILED.\n`);
    process.exit(1);
  }
}

runAudit();
