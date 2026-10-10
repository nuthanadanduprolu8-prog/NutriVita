/**
 * NutriVita Module 12 - Label Lens OCR & Nutrition Parsing Unit Test Suite
 * Tests 15 verification criteria across OCR text parsing, unit normalization,
 * quality indicators, educational grading, and manual fallback analysis.
 */

import {
  parseNutritionText,
  calculateNutritionIndicators,
  calculateEducationalGrade,
  getEmptyNutritionValues,
  normalizeText,
} from './utils/nutritionLabelParser.js';

let passedTests = 0;
let totalTests = 0;

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

console.log('\n========================================================');
console.log('🔬 NutriVita Module 12 - Label Lens Test Suite');
console.log('========================================================\n');

// 1. Calories extraction (standard, kcal, Energy, kJ conversion)
console.log('Test Group 1: Calories & Energy Parsing');
{
  const text1 = `Nutrition Facts\nServing Size: 1 bar (40g)\nCalories: 180\nTotal Fat 6g`;
  const res1 = parseNutritionText(text1);
  assert(res1.extracted.calories === 180, '1. Calories standard extraction (180 kcal)', `Got ${res1.extracted.calories}`);

  const text2 = `Energy: 837 kJ\nProtein 5g\nCarbohydrate 25g`;
  const res2 = parseNutritionText(text2);
  // 837 kJ / 4.184 ≈ 200 kcal
  assert(res2.extracted.calories === 200, '1b. Energy in kJ converted to kcal (837 kJ -> 200 kcal)', `Got ${res2.extracted.calories}`);
}

// 2. Sugar extraction ("Sugars", "Total Sugars", decimal values)
console.log('\nTest Group 2: Sugars Extraction');
{
  const text = `Nutrition Information\nTotal Sugars: 14.5g\nProtein: 4g`;
  const res = parseNutritionText(text);
  assert(res.extracted.totalSugars === 14.5, '2. Total Sugars decimal extraction (14.5g)', `Got ${res.extracted.totalSugars}`);
}

// 3. Added sugars extraction
console.log('\nTest Group 3: Added Sugars Extraction');
{
  const text = `Total Carbohydrate 30g\nTotal Sugars 15g\nIncludes 12g Added Sugars\nProtein 2g`;
  const res = parseNutritionText(text);
  assert(res.extracted.addedSugars === 12, '3. Added Sugars extracted ("Includes 12g Added Sugars")', `Got ${res.extracted.addedSugars}`);
}

// 4. Sodium extraction (mg, g, and "Salt" fallback conversion)
console.log('\nTest Group 4: Sodium & Salt Extraction');
{
  const textMg = `Sodium: 480mg\nTotal Fat: 8g`;
  const resMg = parseNutritionText(textMg);
  assert(resMg.extracted.sodium === 480, '4a. Sodium in mg extracted (480mg)', `Got ${resMg.extracted.sodium}`);

  const textG = `Sodium: 0.6g\nProtein: 5g`;
  const resG = parseNutritionText(textG);
  assert(resG.extracted.sodium === 600, '4b. Sodium in grams normalized to mg (0.6g -> 600mg)', `Got ${resG.extracted.sodium}`);

  const textSalt = `Salt: 1.5g\nEnergy: 250 kcal`;
  const resSalt = parseNutritionText(textSalt);
  // 1.5g salt * 400mg = 600mg sodium
  assert(resSalt.extracted.sodium === 600 && resSalt.extracted.salt === 1.5, '4c. Salt fallback converted to sodium (1.5g salt -> 600mg sodium)', `Got sodium=${resSalt.extracted.sodium}`);
}

// 5. Protein extraction
console.log('\nTest Group 5: Protein Extraction');
{
  const text = `Nutrition Values\nProteins: 8.5g\nFat: 3g`;
  const res = parseNutritionText(text);
  assert(res.extracted.protein === 8.5, '5. Protein extracted (8.5g)', `Got ${res.extracted.protein}`);
}

// 6. Saturated Fat extraction ("Sat Fat", "Saturates")
console.log('\nTest Group 6: Saturated Fat Extraction');
{
  const text1 = `Total Fat 10g\nSaturated Fat: 4.2g\nTrans Fat 0g`;
  const res1 = parseNutritionText(text1);
  assert(res1.extracted.saturatedFat === 4.2, '6a. Saturated Fat extracted (4.2g)', `Got ${res1.extracted.saturatedFat}`);

  const text2 = `Total Fat 12g\nSaturates: 3g`;
  const res2 = parseNutritionText(text2);
  assert(res2.extracted.saturatedFat === 3, '6b. "Saturates" synonym recognized (3g)', `Got ${res2.extracted.saturatedFat}`);
}

// 7. Unit normalization
console.log('\nTest Group 7: Unit Normalization');
{
  const text = `Serving Size: 30g\nCalories: 150 kcal\nTotal Fat: 5 g\nSodium: 250 mg\nDietary Fiber: 4 g`;
  const res = parseNutritionText(text);
  assert(
    res.extracted.calories === 150 &&
    res.extracted.totalFat === 5 &&
    res.extracted.sodium === 250 &&
    res.extracted.fiber === 4,
    '7. Unit normalization across kcal, g, mg',
    `Result: ${JSON.stringify(res.extracted)}`
  );
}

// 8. Missing value handling (does not fabricate fake data)
console.log('\nTest Group 8: Missing Value Handling');
{
  const sparseText = `Calories: 100\nTotal Carbohydrate: 22g`;
  const res = parseNutritionText(sparseText);
  assert(
    res.extracted.calories === 100 &&
    res.extracted.carbohydrates === 22 &&
    res.extracted.totalFat === null &&
    res.extracted.sodium === null &&
    res.extracted.protein === null,
    '8. Missing values safely set to null without fabrication',
    `Got fat=${res.extracted.totalFat}, sodium=${res.extracted.sodium}`
  );
}

// 9. OCR text variations (FDA, FSSAI India, EU)
console.log('\nTest Group 9: Common Label Formats');
{
  // Indian FSSAI format
  const fssaiText = `
  NUTRITIONAL INFORMATION PER 100g
  Energy: 420 kcal
  Protein: 7.2 g
  Carbohydrate: 68.0 g
  Total Sugars: 18.5 g
  Added Sugars: 14.0 g
  Total Fat: 12.0 g
  Saturated Fat: 5.5 g
  Trans Fat: 0.0 g
  Sodium: 450 mg
  `;
  const resFssai = parseNutritionText(fssaiText);
  assert(
    resFssai.extracted.calories === 420 &&
    resFssai.extracted.protein === 7.2 &&
    resFssai.extracted.carbohydrates === 68 &&
    resFssai.extracted.totalSugars === 18.5 &&
    resFssai.extracted.addedSugars === 14 &&
    resFssai.extracted.saturatedFat === 5.5 &&
    resFssai.extracted.sodium === 450,
    '9. FSSAI Multi-field Indian nutrition panel extracted cleanly',
    `FSSAI result: ${JSON.stringify(resFssai.extracted)}`
  );
}

// 10. Malformed values & edge case resilience
console.log('\nTest Group 10: Malformed & Noisy Text Resilience');
{
  const noisyText = `Random text without numbers\nTotal Fat: invalid g\nCalories: O50\nSodium: -- mg`;
  const res = parseNutritionText(noisyText);
  assert(typeof res.extracted === 'object' && !isNaN(res.extracted.calories || 0), '10. No crash on malformed values', 'Handled safely');
}

// 11. Educational quality indicator calculation
console.log('\nTest Group 11: Nutrition Quality Indicators');
{
  const values = {
    totalSugars: 16,
    addedSugars: 14,
    sodium: 650,
    saturatedFat: 4.5,
    protein: 8,
    fiber: 5,
  };
  const indicators = calculateNutritionIndicators(values);
  const highSugar = indicators.some((i) => i.key === 'highSugar');
  const highSodium = indicators.some((i) => i.key === 'highSodium');
  const highSatFat = indicators.some((i) => i.key === 'highSatFat');
  const goodProtein = indicators.some((i) => i.key === 'goodProtein');
  const goodFiber = indicators.some((i) => i.key === 'goodFiber');

  assert(
    highSugar && highSodium && highSatFat && goodProtein && goodFiber,
    '11. Correctly flags High Sugar (>10g), High Sodium (>400mg), High Sat Fat (>3.5g), Good Protein (>=5g), Good Fiber (>=3g)',
    `Indicators: ${indicators.map((i) => i.key).join(', ')}`
  );
}

// 12. Grade calculation (Grade A vs Grade E)
console.log('\nTest Group 12: Educational Grade Calculation');
{
  // Healthy Oatmeal: Low sugar, low sodium, low sat fat, high protein & fiber
  const healthyFood = {
    calories: 150,
    totalSugars: 1,
    saturatedFat: 0.5,
    sodium: 50,
    protein: 6,
    fiber: 4,
  };
  const gradeA = calculateEducationalGrade(healthyFood);
  assert(gradeA.grade === 'A', `12a. Wholesome oatmeal receives Educational Grade A (got ${gradeA.grade})`);

  // Ultra-processed sweet/salty snack: High sugar, high sat fat, high sodium, zero fiber/protein
  const unhealthyFood = {
    calories: 450,
    totalSugars: 28,
    saturatedFat: 9,
    sodium: 780,
    protein: 1,
    fiber: 0.5,
  };
  const gradeE = calculateEducationalGrade(unhealthyFood);
  assert(gradeE.grade === 'E', `12b. Ultra-processed high-sugar/fat snack receives Educational Grade E (got ${gradeE.grade})`);
}

// 13. Manual nutrition analysis
console.log('\nTest Group 13: Manual Nutrition Entry Analysis');
{
  const manualEntry = {
    servingSize: '1 pouch (50g)',
    calories: 220,
    totalFat: 4,
    saturatedFat: 1.0,
    transFat: 0,
    carbohydrates: 40,
    totalSugars: 3,
    addedSugars: 1,
    fiber: 6,
    protein: 7,
    sodium: 110,
    salt: null,
  };
  const indicators = calculateNutritionIndicators(manualEntry);
  const grade = calculateEducationalGrade(manualEntry);

  const hasLowSugar = indicators.some((i) => i.key === 'lowSugar');
  const hasLowSodium = indicators.some((i) => i.key === 'lowSodium');
  const hasGoodFiber = indicators.some((i) => i.key === 'goodFiber');

  assert(
    hasLowSugar && hasLowSodium && hasGoodFiber && (grade.grade === 'A' || grade.grade === 'B'),
    '13. Manual nutrition facts analysis yields accurate indicators and Grade A/B',
    `Grade: ${grade.grade}, Indicators: ${indicators.map((i) => i.key).join(', ')}`
  );
}

// 14. English label parsing
console.log('\nTest Group 14: English Label Parsing');
{
  const englishLabel = `
  Nutrition Facts
  Serving Size: 1 cup (240ml)
  Calories 130
  Total Fat 5g
  Saturated Fat 3g
  Total Carbohydrate 12g
  Total Sugars 12g
  Protein 8g
  Sodium 125mg
  `;
  const res = parseNutritionText(englishLabel);
  assert(
    res.confidence === 'high' &&
    res.extracted.servingSize === '1 cup (240ml)' &&
    res.extracted.calories === 130 &&
    res.extracted.protein === 8,
    '14. Full English Nutrition Facts label parsed with high confidence',
    `Detected: ${res.detectedCount} items, confidence: ${res.confidence}`
  );
}

// 15. Telugu label parsing & bilingual indicators
console.log('\nTest Group 15: Telugu Label Parsing & Telugu Indicators');
{
  const teluguLabel = `
  పోషకాహార సమాచారం
  సర్వింగ్ సైజు: 50 గ్రాములు
  శక్తి: 220 kcal
  మొత్తం కొవ్వు: 5 g
  సంతృప్త కొవ్వు: 1.5 g
  కార్బోహైడ్రేట్లు: 38 g
  చక్కెర: 14 g
  ప్రోటీన్: 6 g
  సోడియం: 420 mg
  పీచు పదార్థం: 4 g
  `;
  const resTelugu = parseNutritionText(teluguLabel);
  const teluguIndicators = calculateNutritionIndicators(resTelugu.extracted);
  const teluguGrade = calculateEducationalGrade(resTelugu.extracted);

  const hasTeluguSugar = teluguIndicators.some((i) => i.teluguLabel === 'ఎక్కువ చక్కెర');
  const hasTeluguSodium = teluguIndicators.some((i) => i.teluguLabel === 'ఎక్కువ సోడియం');

  assert(
    resTelugu.extracted.calories === 220 &&
    resTelugu.extracted.totalSugars === 14 &&
    resTelugu.extracted.sodium === 420 &&
    resTelugu.extracted.protein === 6 &&
    hasTeluguSugar &&
    hasTeluguSodium &&
    Boolean(teluguGrade.teluguTitle),
    '15. Telugu label terms parsed and bilingual Telugu indicators generated',
    `Calories: ${resTelugu.extracted.calories}, Sugar: ${resTelugu.extracted.totalSugars}, Grade: ${teluguGrade.teluguTitle}`
  );
}

console.log('\n--------------------------------------------------------');
console.log(`Results: ${passedTests} / ${totalTests} Label Lens Tests Passed`);
console.log('--------------------------------------------------------\n');

if (passedTests === totalTests) {
  console.log('✨ All 15 Label Lens test criteria verified successfully!');
  process.exit(0);
} else {
  console.error('❌ Some Label Lens tests failed.');
  process.exit(1);
}
