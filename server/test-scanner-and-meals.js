// Integration Test for Scanner, Balance My Meal, and Smart Meal Planner
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting Scanner, Meal Balancer & Meal Planner Integration Tests...\n');
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

  // 1. Food Scanner Identification by Hint
  await test('Scanner API: Identify food from filename / keyword hint (Spinach)', async () => {
    const res = await fetch(`${BASE_URL}/scanner/identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: 'fresh_spinach_leaves.jpg',
        labelHint: 'palak greens',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.matched || data.matched.id !== 'spinach') {
      throw new Error(`Expected spinach match, got ${data.matched?.id}`);
    }
    if (data.confidence < 70) throw new Error(`Confidence too low: ${data.confidence}%`);
  });

  // 2. Food Scanner Fallback Search
  await test('Scanner API: Manual fallback search for "Ragi"', async () => {
    const res = await fetch(`${BASE_URL}/scanner/search?q=ragi`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data || !data.data.some(f => f.id === 'ragi')) {
      throw new Error('Ragi not found in fallback search');
    }
  });

  // 3. Meal Balancer: Calculate Nutrition for Multi-Item Meal
  await test('Meal Balancer API: Calculate combined nutrition and balance score', async () => {
    const res = await fetch(`${BASE_URL}/meals/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { foodId: 'spinach', quantity: 100 },
          { foodId: 'lentils', quantity: 150 },
          { foodId: 'ragi', quantity: 100 },
          { foodId: 'curd', quantity: 100 },
          { foodId: 'amla', quantity: 30 },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.nutrition) throw new Error('Missing nutrition data');
    if (data.nutrition.totalCalories < 500) throw new Error('Unexpected low calories');
    if (data.nutrition.protein < 20) throw new Error('Protein calculation incorrect');
    if (data.nutrition.iron < 5.0) throw new Error('Iron calculation incorrect');
    if (data.nutrition.calcium < 400) throw new Error('Calcium calculation incorrect');
    if (data.evaluation.score < 70) throw new Error(`Balanced meal score should be >= 70, got ${data.evaluation.score}`);
    if (!data.evaluation.isBalanced) throw new Error('Meal should be marked as balanced');
  });

  // 4. Meal Balancer: Gap Detection & Actionable Advice
  await test('Meal Balancer API: Detect low calcium and missing veggies in poor meal', async () => {
    const res = await fetch(`${BASE_URL}/meals/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { foodId: 'banana', quantity: 100 }, // only fruit
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.evaluation.isBalanced) throw new Error('Meal should not be marked as balanced');
    const hasVeggieGap = data.evaluation.suggestions.some(s => s.gap.includes('Vegetables'));
    const hasProteinGap = data.evaluation.suggestions.some(s => s.gap.includes('Protein'));
    if (!hasVeggieGap || !hasProteinGap) throw new Error('Failed to detect vegetable or protein deficiency gaps');
  });

  // 5. Smart Meal Planner: Auto-Generate Balanced Day
  let generatedPlan = null;
  await test('Meal Planner API: Auto-generate balanced daily meal plan', async () => {
    const res = await fetch(`${BASE_URL}/meals/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dietaryPreference: 'vegetarian',
        targetCalories: 2000,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data || !data.data.meals) throw new Error('Missing meal slots in generated plan');
    const { breakfast, lunch, snack, dinner } = data.data.meals;
    if (breakfast.length === 0 || lunch.length === 0 || snack.length === 0 || dinner.length === 0) {
      throw new Error('One or more meal slots are empty in auto-generated plan');
    }
    generatedPlan = data.data;
  });

  // 6. Smart Meal Planner: Save Plan to Database
  let savedPlanId = '';
  await test('Meal Planner API: Save meal plan to profile archive', async () => {
    const res = await fetch(`${BASE_URL}/meals/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'NutriVita Test Plan 2026',
        targetCalories: 2000,
        dietaryPreference: 'vegetarian',
        meals: generatedPlan.meals,
        dailyTotals: generatedPlan.dailyTotals,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data?.id) throw new Error('Failed to return saved plan ID');
    savedPlanId = data.data.id;
  });

  // 7. Smart Meal Planner: Retrieve Saved Plans
  await test('Meal Planner API: Retrieve saved meal plans', async () => {
    const res = await fetch(`${BASE_URL}/meals/saved`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('No saved plans found');
    }
    const found = data.data.find(p => p.id === savedPlanId || p.title === 'NutriVita Test Plan 2026');
    if (!found) throw new Error('Saved plan not found in archive query');
  });

  // 8. Smart Meal Planner: Delete Saved Plan
  await test('Meal Planner API: Delete saved meal plan by ID', async () => {
    const res = await fetch(`${BASE_URL}/meals/saved/${savedPlanId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Delete API reported unsuccessful response');

    // Confirm deletion
    const checkRes = await fetch(`${BASE_URL}/meals/saved`);
    const checkData = await checkRes.json();
    if (checkData.data.some(p => p.id === savedPlanId)) throw new Error('Plan still exists after deletion');
  });

  console.log(`\n========================================`);
  console.log(`🏁 Scanner & Meal Planning Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
};

runTests();
