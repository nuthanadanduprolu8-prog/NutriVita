/**
 * Client-Side Label Lens Unit Verification Test
 * Verifies that client/src/utils/nutritionLabelParser.js exports correctly and
 * functions identically in client-side environment.
 */

import {
  parseNutritionText,
  calculateNutritionIndicators,
  calculateEducationalGrade,
} from './src/utils/nutritionLabelParser.js';

let passed = 0;
let total = 0;

function check(cond, msg) {
  total++;
  if (cond) {
    passed++;
    console.log(`  ✅ [PASS] ${msg}`);
  } else {
    console.error(`  ❌ [FAIL] ${msg}`);
    process.exitCode = 1;
  }
}

console.log('\n--- Client Nutrition Label Parser Verification ---');

const testLabel = `
Nutrition Facts
Serving Size: 30g
Calories: 140 kcal
Total Fat: 4g
Saturated Fat: 1g
Total Carbohydrate: 22g
Total Sugars: 4g
Dietary Fiber: 3g
Protein: 6g
Sodium: 110mg
`;

const res = parseNutritionText(testLabel);
check(res.confidence === 'high', 'Confidence is high for standard label');
check(res.extracted.calories === 140, 'Calories parsed as 140 kcal');
check(res.extracted.protein === 6, 'Protein parsed as 6g');
check(res.extracted.fiber === 3, 'Fiber parsed as 3g');
check(res.extracted.sodium === 110, 'Sodium parsed as 110mg');

const indicators = calculateNutritionIndicators(res.extracted);
check(indicators.some(i => i.key === 'lowSugar'), 'Identifies low sugar');
check(indicators.some(i => i.key === 'lowSodium'), 'Identifies low sodium');
check(indicators.some(i => i.key === 'goodProtein'), 'Identifies good protein');
check(indicators.some(i => i.key === 'goodFiber'), 'Identifies good fiber');

const grade = calculateEducationalGrade(res.extracted);
check(grade.grade === 'A', 'Evaluates to Educational Grade A');
check(grade.disclaimer.includes('Educational Nutrition Grade'), 'Includes non-regulatory disclaimer');

console.log(`\nClient Parser: ${passed} / ${total} tests passed.\n`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
