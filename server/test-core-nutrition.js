// Core Nutrition Integration Tester
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting NutriVita Core Nutrition APIs & Integration Tests...\n');
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

  // 1. Food List
  await test('Foods API: Fetch all foods directory', async () => {
    const res = await fetch(`${BASE_URL}/foods`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length < 10) {
      throw new Error(`Expected at least 10 foods, got ${data.data?.length}`);
    }
  });

  // 2. Search Filter
  await test('Foods API: Search for "Amla" (Indian Gooseberry)', async () => {
    const res = await fetch(`${BASE_URL}/foods?search=amla`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const found = data.data.find(f => f.id === 'amla' || f.name.toLowerCase().includes('amla'));
    if (!found) throw new Error('Amla not found in search results');
    if (found.vitamins?.vitaminC < 500) throw new Error('Amla Vitamin C value inaccurate');
  });

  // 3. Category Filter
  await test('Foods API: Category filter for "grains_millets"', async () => {
    const res = await fetch(`${BASE_URL}/foods?category=grains_millets`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.data.some(f => f.id === 'whole_wheat' || f.id === 'oats')) throw new Error('Whole grains missing from grains_millets');
    if (data.data.some(f => f.category !== 'grains_millets')) throw new Error('Category mismatch in results');
  });

  // 4. Nutrient Filter: Iron
  await test('Foods API: Filter by rich in "iron"', async () => {
    const res = await fetch(`${BASE_URL}/foods?richIn=iron`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data.length === 0) throw new Error('No iron-rich foods returned');
    if (data.data.some(f => (f.minerals?.iron || 0) < 2.0)) {
      throw new Error('Found food with insufficient iron in iron filter');
    }
  });

  // 5. Nutrient Sorting: Calcium Descending
  await test('Foods API: Sort by calcium descending', async () => {
    const res = await fetch(`${BASE_URL}/foods?sort=calcium_desc`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data[0].minerals.calcium < data.data[1].minerals.calcium) {
      throw new Error('Sorting order incorrect for calcium');
    }
    const topItem = data.data[0];
    if (topItem.minerals.calcium < 300) throw new Error('Top calcium food has surprisingly low calcium');
  });

  // 6. Food Image Validation
  await test('Foods Database: Verify all foods have valid, real image URLs', async () => {
    const res = await fetch(`${BASE_URL}/foods?limit=100`);
    const data = await res.json();
    for (const food of data.data) {
      if (!food.imageUrl || (!food.imageUrl.startsWith('http') && !food.imageUrl.startsWith('/images/'))) {
        throw new Error(`Food ${food.name} has invalid image URL: ${food.imageUrl}`);
      }
    }
  });

  // 7. Add Food API (with automatic cleanup)
  await test('Foods API: Add new food item and retrieve it (with cleanup)', async () => {
    const testFoodId = `test_snack_${Date.now()}`;
    const testFoodName = `Test Healthy Snack ${Date.now()}`;
    const res = await fetch(`${BASE_URL}/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testFoodId,
        name: testFoodName,
        teluguName: 'టెస్ట్ స్నాక్',
        category: 'snacks',
        calories: 95,
        macronutrients: { protein: 3.1, carbs: 12.5, fats: 2.2, fiber: 2.5 },
        vitamins: { vitaminC: 15, vitaminA: 50 },
        minerals: { calcium: 40, iron: 1.2 },
        imageUrl: '/images/foods/coconut.jpg',
        descriptionEn: 'Healthy test snack rich in fiber and vitamins.',
        benefitsEn: ['Energy boosting', 'High fiber'],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    // Verify it exists in query
    const checkRes = await fetch(`${BASE_URL}/foods/${testFoodId}`);
    if (!checkRes.ok) throw new Error('Could not retrieve newly added food');
    const checkData = await checkRes.json();
    if (checkData.data.name !== testFoodName) throw new Error('Added food name mismatch');

    // Clean up test food immediately
    const delRes = await fetch(`${BASE_URL}/foods/${testFoodId}`, { method: 'DELETE' });
    if (!delRes.ok) throw new Error('Failed to delete test food');
  });

  // 8. Vitamins Catalog
  await test('Vitamins API: Retrieve complete vitamins and minerals catalog', async () => {
    const res = await fetch(`${BASE_URL}/vitamins`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.length < 13) {
      throw new Error(`Expected at least 13 vitamins/minerals, got ${data.data?.length}`);
    }
  });

  // 9. Vitamin by ID with Populated Food Sources
  await test('Vitamins API: Get Vitamin C profile with populated food thumbnails', async () => {
    const res = await fetch(`${BASE_URL}/vitamins/vitamin-c`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const vit = data.data;
    if (vit.vitaminId !== 'vitamin-c') throw new Error('Vitamin ID mismatch');
    if (!vit.rdaAdults || !vit.rdaAdults.male) throw new Error('Missing RDA information');
    if (!vit.synergisticPairs || vit.synergisticPairs.length === 0) throw new Error('Missing synergistic pair data');
    if (!vit.richFoodDetails || vit.richFoodDetails.length === 0) throw new Error('Missing populated food details');
    if (!vit.richFoodDetails.some(f => f.id === 'amla')) throw new Error('Amla missing from Vitamin C foods');
  });

  // 10. Synergistic Nutrient Pairing Verification
  await test('Vitamins API: Verify Iron profile and synergy with Vitamin C', async () => {
    const res = await fetch(`${BASE_URL}/vitamins/mineral-iron`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const iron = data.data;
    if (iron.vitaminId !== 'mineral-iron') throw new Error('Iron ID mismatch');
    const hasVitCSynergy = iron.synergisticPairs.some(p => p.partnerNutrient.toLowerCase().includes('vitamin c'));
    if (!hasVitCSynergy) throw new Error('Iron missing Vitamin C absorption synergy partner');
  });

  console.log(`\n========================================`);
  console.log(`🏁 Core Nutrition Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
};

runTests();
