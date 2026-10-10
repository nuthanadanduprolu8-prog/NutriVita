/**
 * NutriVita Nutrition Label Parser & Educational Grading Engine
 * Extracts nutrition facts from OCR text and computes educational quality indicators.
 */

// Helper to sanitize and normalize OCR text
export const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[—–]/g, '-')
    .replace(/[|]/g, ' ')
    .replace(/O(?=\d)/gi, '0') // Common OCR confusion of O and 0 before digits
    .replace(/(\d+)[,](\d+)(?!\d)/g, '$1.$2'); // standard decimal point (avoiding thousands separator)
};

/**
 * Extract numerical value with optional units from regex matches
 */
const extractNumber = (str) => {
  if (!str) return null;
  const match = str.match(/(\d+(?:[.,]\d+)?)/);
  return match ? parseFloat(match[1].replace(',', '.')) : null;
};

/**
 * Empty nutrition structure
 */
export const getEmptyNutritionValues = () => ({
  productName: null,
  brand: null,
  servingSize: null,
  servingBasis: 'per_serving',
  calories: null,
  energyKj: null,
  totalFat: null,
  saturatedFat: null,
  transFat: null,
  carbohydrates: null,
  totalSugars: null,
  addedSugars: null,
  fiber: null,
  protein: null,
  sodium: null,
  salt: null,
  ingredients: null,
  allergens: null,
  calcium: null,
  iron: null,
  vitaminC: null,
  vitaminD: null,
  potassium: null,
});

/**
 * Robust regex parser for nutrition labels
 * Supports US FDA, Indian FSSAI, UK/EU per-serving & per-100g formats, and Telugu terms.
 */
export const parseNutritionText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return {
      extracted: getEmptyNutritionValues(),
      rawText: '',
      detectedCount: 0,
      confidence: 'none',
      isNutritionLabel: false,
      isFoodOnlyOrUnlabeled: false,
      foodOnlyNotice: null,
    };
  }

  const normalized = normalizeText(rawText);
  const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);

  const values = getEmptyNutritionValues();
  let detectedCount = 0;

  // Check for presence of nutrition label terms
  const hasNutritionTerms = /(?:nutrition|facts|information|calories|energy|macronutrients?|serving|portion|protein|carbohydrate|total\s*fat|saturated|trans\s*fat|sodium|salt|sugar|sugars|fiber|fibre|calcium|iron|vitamin|fssai|per\s*100\s*g|per\s*serving|%?\s*dv|%?\s*rda|శక్తి|ప్రోటీన్|కొవ్వు|చక్కెర|పీచు|సోడియం)/i.test(normalized);

  // Helper matcher searching line-by-line first with multi-format delimiters
  const findValue = (patterns) => {
    for (const pattern of patterns) {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match) {
          const val = extractNumber(match[1] || match[0]);
          if (val !== null && !isNaN(val)) return val;
        }
      }
    }
    return null;
  };

  // 1. Serving Size
  const servingSizePattern = /(?:serving\s*size|servings\s*per|per\s*serving|portion\s*size|సర్వింగ్\s*సైజు)[:|\-—–.\s]+([^\n\r,]+)/i;
  const servingMatch = normalized.match(servingSizePattern);
  if (servingMatch && servingMatch[1]) {
    const rawSize = servingMatch[1].trim().slice(0, 30);
    if (rawSize.length > 0) {
      values.servingSize = rawSize;
      detectedCount++;
    }
  }

  // Serving Basis detection ('per_100g' vs 'per_serving')
  if (/per\s*100\s*g|100\s*g\s*per/i.test(normalized) || /100g/i.test(values.servingSize || '')) {
    values.servingBasis = 'per_100g';
  } else {
    values.servingBasis = 'per_serving';
  }

  // 2. Product Name & Brand Detection
  // Check for explicit Product / Brand prefixes
  const explicitProductMatch = normalized.match(/(?:product\s*name|item\s*name|food\s*name|product|item)[:|\-—–\s]+([^\n\r,]+)/i);
  if (explicitProductMatch && explicitProductMatch[1]) {
    values.productName = explicitProductMatch[1].trim().slice(0, 50);
    detectedCount++;
  }

  const explicitBrandMatch = normalized.match(/(?:brand\s*name|brand|marketed\s*by|mfg\s*by|manufactured\s*by)[:|\-—–\s]+([^\n\r,]+)/i);
  if (explicitBrandMatch && explicitBrandMatch[1]) {
    values.brand = explicitBrandMatch[1].trim().slice(0, 40);
  }

  // If no explicit product name, scan early non-noise header lines
  if (!values.productName) {
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const l = lines[i];
      if (
        l &&
        l.length >= 3 &&
        l.length <= 60 &&
        !/^(?:nutrition|facts|information|panel|table|per\s*100|per\s*serving|amount\s*per|serving\s*size|servings\s*per|daily\s*value|%?\s*dv|%?\s*rda|fssai|lic|batch|mfg|exp|best\s*before|use\s*by|mrp|rs\.|net\s*wt|ingredients|contains|calories|energy)/i.test(l) &&
        !/^\d+$/.test(l) &&
        !/(?:total\s*fat|saturated|protein|carbohydrate|sodium|sugars)/i.test(l)
      ) {
        const cleaned = l.replace(/^[^a-zA-Z0-9]+/, '').trim();
        if (cleaned.length >= 3) {
          values.productName = cleaned;
          detectedCount++;

          // Check if first word is a common brand
          const brandTokens = ['Quaker', 'Kellogg', "Kellogg's", 'Nestle', 'Amul', 'Britannia', 'Haldiram', "Haldiram's", 'Dabur', 'Patanjali', 'MTR', 'Tata', 'Horlicks', 'Cadbury'];
          const matchedBrand = brandTokens.find((b) => cleaned.toLowerCase().startsWith(b.toLowerCase()));
          if (matchedBrand && !values.brand) {
            values.brand = matchedBrand;
          }
          break;
        }
      }
    }
  }

  // 3. Calories / Energy
  let calories = null;
  let energyKj = null;

  // Check explicit kJ first
  for (const line of lines) {
    const kjLineMatch = line.match(/(?:energy|energy\s*value|శక్తి)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*kj/i);
    if (kjLineMatch) {
      const kj = extractNumber(kjLineMatch[1]);
      if (kj !== null) {
        energyKj = kj;
        calories = Math.round(kj / 4.184); // Convert kJ to kcal
        break;
      }
    }
  }

  // Check explicit kcal or calories
  if (calories === null) {
    const calPatterns = [
      /(?:calories|calorie|energy|energy\s*value|శక్తి|క్యాలరీలు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*(?:kcal|cal)\b/i,
      /(?:calories|calorie|క్యాలరీలు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i,
      /(?:energy|శక్తి)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*kcal/i,
      /(?:calories|calorie|క్యాలరీలు)\s+(\d+(?:[.,]\d+)?)/i,
    ];
    calories = findValue(calPatterns);
  }

  // Fallback: generic energy without kJ tag
  if (calories === null) {
    for (const line of lines) {
      const genericEnergy = line.match(/(?:energy|శక్తి)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i);
      if (genericEnergy && !/kj/i.test(line)) {
        calories = extractNumber(genericEnergy[1]);
        if (calories !== null) break;
      }
    }
  }

  if (calories !== null) {
    values.calories = calories;
    values.energyKj = energyKj !== null ? energyKj : Math.round(calories * 4.184);
    detectedCount++;
  } else if (energyKj !== null) {
    values.energyKj = energyKj;
    detectedCount++;
  }

  // 4. Total Fat
  const fatPatterns = [
    /(?:total\s*fat|fat|lipids|మొత్తం\s*కొవ్వు|కొవ్వు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i,
    /(?:total\s*fat|మొత్తం\s*కొవ్వు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i,
    /(?:total\s*fat|మొత్తం\s*కొవ్వు)\s+(\d+(?:[.,]\d+)?)/i,
  ];
  const fat = findValue(fatPatterns);
  if (fat !== null) {
    values.totalFat = fat;
    detectedCount++;
  }

  // 5. Saturated Fat
  const satFatPatterns = [
    /(?:saturated\s*fat|sat\s*fat|saturates|saturated\s*fatty\s*acids|సంతృప్త\s*కొవ్వు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i,
    /(?:saturated\s*fat|sat\s*fat|saturates|సంతృప్త\s*కొవ్వు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i,
  ];
  const satFat = findValue(satFatPatterns);
  if (satFat !== null) {
    values.saturatedFat = satFat;
    detectedCount++;
  }

  // 6. Trans Fat
  const transFatPatterns = [
    /(?:trans\s*fat|trans\s*fatty\s*acids|trans\s*fatty|ట్రాన్స్\s*కొవ్వు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i,
    /(?:trans\s*fat|ట్రాన్స్\s*కొవ్వు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i,
  ];
  const transFat = findValue(transFatPatterns);
  if (transFat !== null) {
    values.transFat = transFat;
    detectedCount++;
  }

  // 7. Carbohydrates
  const carbPatterns = [
    /(?:total\s*carbohydrate|total\s*carbohydrates|total\s*carbs|carbohydrates|carbohydrate|carbs|కార్బోహైడ్రేట్లు|పిండిపదార్థాలు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i,
    /(?:total\s*carbohydrate|carbohydrates|కార్బోహైడ్రేట్లు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i,
  ];
  const carbs = findValue(carbPatterns);
  if (carbs !== null) {
    values.carbohydrates = carbs;
    detectedCount++;
  }

  // 8. Added Sugars
  const addedSugarPatterns = [
    /(?:added\s*sugars|added\s*sugar|చేర్చిన\s*చక్కెర)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i,
    /(?:added\s*sugars|added\s*sugar|చేర్చిన\s*చక్కెర)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i,
    /includes\s+(\d+(?:[.,]\d+)?)\s*g\s*(?:added\s*sugars|added\s*sugar)/i,
  ];
  const addedSugars = findValue(addedSugarPatterns);
  if (addedSugars !== null) {
    values.addedSugars = addedSugars;
    detectedCount++;
  }

  // 9. Total Sugars
  let totalSugars = null;
  for (const line of lines) {
    if (!/added/i.test(line)) {
      const sugMatch =
        line.match(/(?:total\s*sugars|total\s*sugar|sugars|sugar|మొత్తం\s*చక్కెర|చక్కెర)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i) ||
        line.match(/(?:total\s*sugars|total\s*sugar|sugars|మొత్తం\s*చక్కెర)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i);
      if (sugMatch) {
        totalSugars = extractNumber(sugMatch[1]);
        break;
      }
    }
  }
  if (totalSugars !== null) {
    values.totalSugars = totalSugars;
    detectedCount++;
  }

  // 10. Dietary Fiber
  const fiberPatterns = [
    /(?:dietary\s*fiber|dietary\s*fibre|fiber|fibre|పీచు\s*పదార్థం)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i,
    /(?:dietary\s*fiber|dietary\s*fibre|పీచు\s*పదార్థం)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i,
  ];
  const fiber = findValue(fiberPatterns);
  if (fiber !== null) {
    values.fiber = fiber;
    detectedCount++;
  }

  // 11. Protein
  const proteinPatterns = [
    /(?:protein|proteins|ప్రోటీన్)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i,
    /(?:protein|proteins|ప్రోటీన్)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i,
    /(?:protein|proteins|ప్రోటీన్)\s+(\d+(?:[.,]\d+)?)/i,
  ];
  const protein = findValue(proteinPatterns);
  if (protein !== null) {
    values.protein = protein;
    detectedCount++;
  }

  // 12. Sodium / Salt
  let sodium = null;
  let saltG = null;
  for (const line of lines) {
    const naMg = line.match(/(?:sodium|సోడియం)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*mg\b/i);
    if (naMg) {
      sodium = extractNumber(naMg[1]);
      break;
    }
    const naG = line.match(/(?:sodium|సోడియం)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*g\b/i);
    if (naG) {
      const g = extractNumber(naG[1]);
      if (g !== null) {
        sodium = Math.round(g * 1000);
        break;
      }
    }
    const naPlain = line.match(/(?:sodium|సోడియం)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i);
    if (naPlain && !/g/i.test(line)) {
      sodium = extractNumber(naPlain[1]);
      break;
    }
  }

  // Check explicit Salt
  for (const line of lines) {
    const saltMatch = line.match(/(?:salt|ఉప్పు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)\s*(?:g|mg)\b/i) ||
                      line.match(/(?:salt|ఉప్పు)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i);
    if (saltMatch) {
      const saltVal = extractNumber(saltMatch[1]);
      if (saltVal !== null) {
        const isMg = /mg/i.test(saltMatch[0]);
        saltG = isMg ? saltVal / 1000 : saltVal;
        values.salt = saltG;
        if (sodium === null) {
          sodium = Math.round(saltG * 400); // 1g salt ≈ 400mg sodium
        }
        break;
      }
    }
  }

  if (sodium !== null) {
    values.sodium = sodium;
    if (values.salt === null) {
      values.salt = Number((sodium / 400).toFixed(2));
    }
    detectedCount++;
  }

  // 13. Ingredients & Allergens
  const ingMatch = normalized.match(/(?:ingredients|కావలసిన\s*పదార్థాలు)[:|\-—–\s]+([^.\n\r]+(?:\.[^.\n\r]+)?)/i);
  if (ingMatch && ingMatch[1]) {
    const raw = ingMatch[1].trim().slice(0, 160);
    if (raw.length > 3 && !/nutrition|facts/i.test(raw)) {
      values.ingredients = raw;
      detectedCount++;
    }
  }

  const allMatch = normalized.match(/(?:contains\s*allergens?|allergen\s*information|allergens?|allergy\s*advice|contains)[:|\-—–\s]+([^\n\r]+)/i);
  if (allMatch && allMatch[1]) {
    const raw = allMatch[1].trim().slice(0, 100);
    if (raw.length > 2 && !/nutrition|calories/i.test(raw)) {
      values.allergens = raw;
      detectedCount++;
    }
  }

  // 14. Optional Micronutrients (Vitamins & Minerals)
  const calciumMatch = findValue([/(?:calcium|కాల్షియం)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i]);
  if (calciumMatch !== null) {
    values.calcium = calciumMatch;
    detectedCount++;
  }

  const ironMatch = findValue([/(?:iron|ఐరన్)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i]);
  if (ironMatch !== null) {
    values.iron = ironMatch;
    detectedCount++;
  }

  const vitCMatch = findValue([/(?:vitamin\s*c|vit\s*c|విటమిన్\s*సి)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i]);
  if (vitCMatch !== null) {
    values.vitaminC = vitCMatch;
    detectedCount++;
  }

  const vitDMatch = findValue([/(?:vitamin\s*d|vit\s*d|విటమిన్\s*డి)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i]);
  if (vitDMatch !== null) {
    values.vitaminD = vitDMatch;
    detectedCount++;
  }

  const potassiumMatch = findValue([/(?:potassium|పొటాషియం)[:|\-—–.\s]+(\d+(?:[.,]\d+)?)/i]);
  if (potassiumMatch !== null) {
    values.potassium = potassiumMatch;
    detectedCount++;
  }

  // Confidence & Food-Only determination
  let confidence = 'none';
  if (detectedCount >= 5) confidence = 'high';
  else if (detectedCount >= 3) confidence = 'medium';
  else if (detectedCount >= 1) confidence = 'low';

  const isNutritionLabel = hasNutritionTerms || detectedCount >= 2;
  const isFoodOnlyOrUnlabeled = !hasNutritionTerms && detectedCount === 0;

  let foodOnlyNotice = null;
  if (isFoodOnlyOrUnlabeled) {
    foodOnlyNotice = {
      en: 'No printed nutrition label detected. Whole fresh foods (e.g. apple, banana, or fresh produce) do not carry printed packaging labels. Label Lens scans printed packaging labels. To explore whole-food nutrients, use Food Explorer or enter reference values manually.',
      te: 'ముద్రించిన పోషకాహార లేబుల్ కనుగొనబడలేదు. తాజా పండ్లు లేదా కూరగాయలకు ప్యాకేజింగ్ లేబుల్స్ ఉండవు. పోషకాలను తనిఖీ చేయడానికి ఫుడ్ ఎక్స్‌ప్లోరర్ ఉపయోగించండి లేదా క్రింద వివరాలను నమోదు చేయండి.'
    };
  }

  return {
    extracted: values,
    rawText: normalized,
    detectedCount,
    confidence,
    isNutritionLabel,
    isFoodOnlyOrUnlabeled,
    foodOnlyNotice,
  };
};

/**
 * Calculate educational quality indicators
 */
export const calculateNutritionIndicators = (values) => {
  if (!values) return [];
  const indicators = [];

  const {
    totalSugars,
    addedSugars,
    sodium,
    saturatedFat,
    protein,
    fiber,
  } = values;

  // 1. Sugar Indicators
  const effectiveSugar = totalSugars !== null ? totalSugars : addedSugars;
  if (effectiveSugar !== null) {
    if (effectiveSugar > 10) {
      indicators.push({
        id: 'high-sugar',
        key: 'highSugar',
        type: 'warning',
        severity: 'high',
        label: 'High Sugar',
        teluguLabel: 'ఎక్కువ చక్కెర',
        value: `${effectiveSugar}g`,
        threshold: '> 10g per serving',
        message: 'Contains more than 10g of sugar per serving. Consider moderate consumption.',
        teluguMessage: 'ఒక్క సర్వింగ్‌కు 10 గ్రాముల కంటే ఎక్కువ చక్కెర ఉంది. మితంగా తీసుకోవడం మంచిది.',
      });
    } else if (effectiveSugar <= 5) {
      indicators.push({
        id: 'low-sugar',
        key: 'lowSugar',
        type: 'positive',
        severity: 'low',
        label: 'Low Sugar',
        teluguLabel: 'తక్కువ చక్కెర',
        value: `${effectiveSugar}g`,
        threshold: '≤ 5g per serving',
        message: 'Low in sugar content per serving.',
        teluguMessage: 'ఒక్క సర్వింగ్‌లో చాలా తక్కువ చక్కెర ఉంది.',
      });
    }
  }

  // 2. Sodium Indicators
  if (sodium !== null) {
    if (sodium > 400) {
      indicators.push({
        id: 'high-sodium',
        key: 'highSodium',
        type: 'warning',
        severity: 'high',
        label: 'High Sodium',
        teluguLabel: 'ఎక్కువ సోడియం',
        value: `${sodium}mg`,
        threshold: '> 400mg per serving',
        message: 'Contains more than 400mg sodium per serving (over 20% of recommended daily limit).',
        teluguMessage: 'ఒక్క సర్వింగ్‌లో 400 మిల్లీగ్రాముల కంటే ఎక్కువ సోడియం ఉంది.',
      });
    } else if (sodium <= 140) {
      indicators.push({
        id: 'low-sodium',
        key: 'lowSodium',
        type: 'positive',
        severity: 'low',
        label: 'Low Sodium',
        teluguLabel: 'తక్కువ సోడియం',
        value: `${sodium}mg`,
        threshold: '≤ 140mg per serving',
        message: 'Low sodium content per serving.',
        teluguMessage: 'ఒక్క సర్వింగ్‌లో తక్కువ సోడియం ఉంది.',
      });
    }
  }

  // 3. Saturated Fat Indicators
  if (saturatedFat !== null) {
    if (saturatedFat > 3.5) {
      indicators.push({
        id: 'high-sat-fat',
        key: 'highSatFat',
        type: 'warning',
        severity: 'high',
        label: 'High Saturated Fat',
        teluguLabel: 'ఎక్కువ సంతృప్త కొవ్వు',
        value: `${saturatedFat}g`,
        threshold: '> 3.5g per serving',
        message: 'Contains elevated saturated fat per serving. Heart-healthy diets favor unsaturated fats.',
        teluguMessage: 'ఎక్కువ సంతృప్త కొవ్వు ఉంది. గుండె ఆరోగ్యానికి అసంతృప్త కొవ్వులు మేలు చేస్తాయి.',
      });
    } else if (saturatedFat <= 1.5) {
      indicators.push({
        id: 'low-sat-fat',
        key: 'lowSatFat',
        type: 'positive',
        severity: 'low',
        label: 'Low Saturated Fat',
        teluguLabel: 'తక్కువ సంతృప్త కొవ్వు',
        value: `${saturatedFat}g`,
        threshold: '≤ 1.5g per serving',
        message: 'Low in saturated fat per serving.',
        teluguMessage: 'ఒక్క సర్వింగ్‌లో చాలా తక్కువ సంతృప్త కొవ్వు ఉంది.',
      });
    }
  }

  // 4. Protein Indicators
  if (protein !== null && protein >= 5) {
    indicators.push({
      id: 'good-protein',
      key: 'goodProtein',
      type: 'positive',
      severity: 'good',
      label: 'Good Source of Protein',
      teluguLabel: 'మంచి ప్రోటీన్ మూలం',
      value: `${protein}g`,
      threshold: '≥ 5g per serving',
      message: 'Provides 5g or more of dietary protein per serving to support muscle and tissue maintenance.',
      teluguMessage: 'కండరాల నిర్మాణానికి మరియు మరమ్మత్తుకు 5 గ్రాముల కంటే ఎక్కువ ప్రోటీన్‌ను అందిస్తుంది.',
    });
  }

  // 5. Fiber Indicators
  if (fiber !== null && fiber >= 3) {
    indicators.push({
      id: 'good-fiber',
      key: 'goodFiber',
      type: 'positive',
      severity: 'good',
      label: 'Good Source of Fiber',
      teluguLabel: 'మంచి పీచు పదార్థం',
      value: `${fiber}g`,
      threshold: '≥ 3g per serving',
      message: 'Provides 3g or more of dietary fiber to promote digestive wellness and satiety.',
      teluguMessage: 'జీర్ణక్రియ మరియు కడుపు నిండిన భావన కోసం 3 గ్రాముల కంటే ఎక్కువ పీచు అందిస్తుంది.',
    });
  }

  return indicators;
};

/**
 * Educational Nutrition Grade (A to E)
 */
export const calculateEducationalGrade = (values) => {
  if (!values) {
    return {
      grade: 'N/A',
      score: 0,
      badgeColor: 'gray',
      title: 'Insufficient Data',
      teluguTitle: 'సరిపడా సమాచారం లేదు',
      explanation: 'Not enough nutrition facts were detected to calculate an educational grade.',
      teluguExplanation: 'విద్యా పోషకాహార గ్రేడ్ గణన చేయడానికి అవసరమైన సమాచారం సరిపోలేదు.',
      criteria: [],
    };
  }

  let negativePoints = 0;
  let positivePoints = 0;
  const criteria = [];

  // Sugar
  const sugars = values.totalSugars !== null ? values.totalSugars : values.addedSugars;
  if (sugars !== null) {
    const pts = Math.min(6, Math.floor(sugars / 2.5));
    negativePoints += pts;
    criteria.push({
      item: 'Sugars',
      teluguItem: 'చక్కెర',
      value: `${sugars}g`,
      impact: pts > 0 ? `+${pts} penalty pts` : '0 penalty pts',
      positive: false,
    });
  }

  // Saturated Fat
  if (values.saturatedFat !== null) {
    const pts = Math.min(5, Math.floor(values.saturatedFat / 1.5));
    negativePoints += pts;
    criteria.push({
      item: 'Saturated Fat',
      teluguItem: 'సంతృప్త కొవ్వు',
      value: `${values.saturatedFat}g`,
      impact: pts > 0 ? `+${pts} penalty pts` : '0 penalty pts',
      positive: false,
    });
  }

  // Sodium
  if (values.sodium !== null) {
    const pts = Math.min(5, Math.floor(values.sodium / 120));
    negativePoints += pts;
    criteria.push({
      item: 'Sodium',
      teluguItem: 'సోడియం',
      value: `${values.sodium}mg`,
      impact: pts > 0 ? `+${pts} penalty pts` : '0 penalty pts',
      positive: false,
    });
  }

  // Calories
  if (values.calories !== null) {
    let calPts = 0;
    if (values.calories > 400) calPts = 2;
    else if (values.calories > 250) calPts = 1;
    negativePoints += calPts;
    if (calPts > 0) {
      criteria.push({
        item: 'Energy / Calories',
        teluguItem: 'శక్తి / క్యాలరీలు',
        value: `${values.calories} kcal`,
        impact: `+${calPts} penalty pts`,
        positive: false,
      });
    }
  }

  // Protein (Beneficial)
  if (values.protein !== null) {
    const pts = Math.min(4, Math.floor(values.protein / 3));
    positivePoints += pts;
    if (pts > 0) {
      criteria.push({
        item: 'Protein',
        teluguItem: 'ప్రోటీన్',
        value: `${values.protein}g`,
        impact: `-${pts} credit pts`,
        positive: true,
      });
    }
  }

  // Fiber (Beneficial)
  if (values.fiber !== null) {
    const pts = Math.min(4, Math.floor(values.fiber / 1.5));
    positivePoints += pts;
    if (pts > 0) {
      criteria.push({
        item: 'Dietary Fiber',
        teluguItem: 'పీచు పదార్థం',
        value: `${values.fiber}g`,
        impact: `-${pts} credit pts`,
        positive: true,
      });
    }
  }

  if (criteria.length === 0) {
    return {
      grade: 'N/A',
      score: 0,
      badgeColor: 'gray',
      title: 'Insufficient Data',
      teluguTitle: 'సరిపడా సమాచారం లేదు',
      explanation: 'Not enough nutrition facts were detected to calculate an educational grade.',
      teluguExplanation: 'విద్యా పోషకాహార గ్రేడ్ గణన చేయడానికి అవసరమైన సమాచారం సరిపోలేదు.',
      criteria: [],
    };
  }

  const netScore = negativePoints - positivePoints;

  let grade = 'C';
  let badgeColor = 'amber';
  let title = 'Moderate Nutritional Balance';
  let teluguTitle = 'మధ్యస్థ పోషక సమతుల్యత';
  let explanation = 'Moderate nutritional composition. Monitor portions of sugar and sodium.';
  let teluguExplanation = 'మధ్యస్థ పోషక సమతుల్యత. చక్కెర మరియు సోడియం పరిమాణాలను గమనించండి.';

  if (netScore <= 0) {
    grade = 'A';
    badgeColor = 'emerald';
    title = 'Excellent Nutritional Balance';
    teluguTitle = 'అత్యుత్తమ పోషక సమతుల్యత';
    explanation = 'Favorable profile with low sugar, saturated fat, and sodium balanced by wholesome fiber and protein.';
    teluguExplanation = 'చక్కెర, సంతృప్త కొవ్వు మరియు సోడియం తక్కువగా ఉండి, పీచు మరియు ప్రోటీన్ సమృద్ధిగా ఉన్నాయి.';
  } else if (netScore <= 3) {
    grade = 'B';
    badgeColor = 'teal';
    title = 'Good Nutritional Balance';
    teluguTitle = 'మంచి పోషక సమతుల్యత';
    explanation = 'Balanced nutritional composition with reasonable levels of limiting nutrients.';
    teluguExplanation = 'సహేతుకమైన పోషకాలతో కూడిన మంచి పోషక సమతుల్యత.';
  } else if (netScore <= 7) {
    grade = 'C';
    badgeColor = 'amber';
    title = 'Moderate Nutritional Balance';
    teluguTitle = 'మధ్యస్థ పోషక సమతుల్యత';
    explanation = 'Contains moderate levels of sugar, saturated fat, or sodium.';
    teluguExplanation = 'మధ్యస్థంగా చక్కెర, సంతృప్త కొవ్వు లేదా సోడియం కలిగి ఉంది.';
  } else if (netScore <= 11) {
    grade = 'D';
    badgeColor = 'orange';
    title = 'Higher in Limiting Nutrients';
    teluguTitle = 'పరిమిత పోషకాలు ఎక్కువ';
    explanation = 'Higher content of sugar, sodium, or saturated fat compared to beneficial fiber and protein.';
    teluguExplanation = 'పీచు మరియు ప్రోటీన్ కంటే చక్కెర, సోడియం లేదా సంతృప్త కొవ్వులు ఎక్కువగా ఉన్నాయి.';
  } else {
    grade = 'E';
    badgeColor = 'rose';
    title = 'High in Limiting Nutrients';
    teluguTitle = 'అధిక పరిమిత పోషకాలు';
    explanation = 'Elevated levels of sugar, saturated fat, or sodium with minimal protein or dietary fiber.';
    teluguExplanation = 'చాలా తక్కువ పీచు లేదా ప్రోటీన్‌తో పాటు అధిక మోతాదులో చక్కెర, సంతృప్త కొవ్వు లేదా సోడియం ఉన్నాయి.';
  }

  // 0-100 Numerical Nutrition Score Calculation
  let score100 = 85;
  const positiveFactors = [];
  const negativeFactors = [];
  const unknownFactors = [];

  // Sugars
  if (sugars !== null) {
    if (sugars > 25) {
      score100 -= 30;
      negativeFactors.push({ factor: 'Very High Sugar', teluguFactor: 'అత్యధిక చక్కెర', value: `${sugars}g`, points: -30, explanation: 'Contains >25g sugar per serving, adding heavy glycemic load.' });
    } else if (sugars > 10) {
      score100 -= 15;
      negativeFactors.push({ factor: 'Elevated Sugar', teluguFactor: 'ఎక్కువ చక్కెర', value: `${sugars}g`, points: -15, explanation: 'Contains >10g sugar per serving; moderation recommended.' });
    } else if (sugars <= 5) {
      score100 += 5;
      positiveFactors.push({ factor: 'Low Sugar Profile', teluguFactor: 'తక్కువ చక్కెర', value: `${sugars}g`, points: +5, explanation: 'Low sugar content (≤5g) supports steady metabolic health.' });
    }
  } else {
    unknownFactors.push('Sugar content not explicitly reported; left unpenalized.');
  }

  // Saturated Fat
  if (values.saturatedFat !== null) {
    if (values.saturatedFat > 5) {
      score100 -= 20;
      negativeFactors.push({ factor: 'High Saturated Fat', teluguFactor: 'అధిక సంతృప్త కొవ్వు', value: `${values.saturatedFat}g`, points: -20, explanation: 'Exceeds 5g saturated fat per serving.' });
    } else if (values.saturatedFat > 3.5) {
      score100 -= 10;
      negativeFactors.push({ factor: 'Elevated Saturated Fat', teluguFactor: 'ఎక్కువ సంతృప్త కొవ్వు', value: `${values.saturatedFat}g`, points: -10, explanation: 'Between 3.5g and 5g saturated fat per serving.' });
    } else if (values.saturatedFat <= 1.5) {
      score100 += 5;
      positiveFactors.push({ factor: 'Low Saturated Fat', teluguFactor: 'తక్కువ సంతృప్త కొవ్వు', value: `${values.saturatedFat}g`, points: +5, explanation: 'Heart-healthy low saturated fat composition.' });
    }
  } else {
    unknownFactors.push('Saturated fat not detected; left unpenalized.');
  }

  // Trans Fat
  if (values.transFat !== null && values.transFat > 0) {
    score100 -= 15;
    negativeFactors.push({ factor: 'Trans Fat Present', teluguFactor: 'ట్రాన్స్ ఫ్యాట్ ఉంది', value: `${values.transFat}g`, points: -15, explanation: 'Contains industrial trans fatty acids.' });
  }

  // Sodium
  if (values.sodium !== null) {
    if (values.sodium > 600) {
      score100 -= 25;
      negativeFactors.push({ factor: 'Very High Sodium', teluguFactor: 'అత్యధిక సోడియం', value: `${values.sodium}mg`, points: -25, explanation: 'Exceeds 600mg sodium per serving (over 30% daily allowance).' });
    } else if (values.sodium > 400) {
      score100 -= 15;
      negativeFactors.push({ factor: 'Elevated Sodium', teluguFactor: 'ఎక్కువ సోడియం', value: `${values.sodium}mg`, points: -15, explanation: 'Exceeds 400mg sodium per serving.' });
    } else if (values.sodium <= 140) {
      score100 += 5;
      positiveFactors.push({ factor: 'Low Sodium Density', teluguFactor: 'తక్కువ సోడియం', value: `${values.sodium}mg`, points: +5, explanation: 'Heart-favorable low sodium (≤140mg per serving).' });
    }
  } else {
    unknownFactors.push('Sodium not detected; left unpenalized.');
  }

  // Beneficial: Protein
  if (values.protein !== null) {
    if (values.protein >= 10) {
      score100 += 15;
      positiveFactors.push({ factor: 'High Protein Density', teluguFactor: 'అధిక ప్రోటీన్', value: `${values.protein}g`, points: +15, explanation: 'Excellent protein content (≥10g) promoting satiety and muscle repair.' });
    } else if (values.protein >= 5) {
      score100 += 10;
      positiveFactors.push({ factor: 'Good Source of Protein', teluguFactor: 'మంచి ప్రోటీన్', value: `${values.protein}g`, points: +10, explanation: 'Provides at least 5g dietary protein.' });
    }
  } else {
    unknownFactors.push('Protein not detected; left unpenalized.');
  }

  // Beneficial: Dietary Fiber
  if (values.fiber !== null) {
    if (values.fiber >= 5) {
      score100 += 15;
      positiveFactors.push({ factor: 'High Dietary Fiber', teluguFactor: 'అధిక పీచు', value: `${values.fiber}g`, points: +15, explanation: 'Rich prebiotic and digestive fiber (≥5g).' });
    } else if (values.fiber >= 3) {
      score100 += 10;
      positiveFactors.push({ factor: 'Good Source of Fiber', teluguFactor: 'మంచి పీచు', value: `${values.fiber}g`, points: +10, explanation: 'Provides at least 3g dietary fiber.' });
    }
  } else {
    unknownFactors.push('Dietary fiber not detected; left unpenalized.');
  }

  // Micronutrients Bonus (Calcium, Iron)
  if (values.calcium !== null && values.calcium >= 50) {
    score100 += 5;
    positiveFactors.push({ factor: 'Contains Calcium', teluguFactor: 'కాల్షియం లభిస్తుంది', value: `${values.calcium}mg`, points: +5, explanation: 'Supports bone mineral density.' });
  }
  if (values.iron !== null && values.iron >= 1.5) {
    score100 += 5;
    positiveFactors.push({ factor: 'Contains Iron', teluguFactor: 'ఐరన్ లభిస్తుంది', value: `${values.iron}mg`, points: +5, explanation: 'Contributes to hemoglobin synthesis.' });
  }

  const finalNutritionScore = Math.max(5, Math.min(100, Math.round(score100)));

  // Practical Dietary Suggestions
  const dietarySuggestions = [];
  if (sugars !== null && sugars > 10) {
    dietarySuggestions.push({
      en: 'High added sugar: Balance with fiber-rich fresh fruits (such as guava or amla) or whole pulses to slow glucose uptake.',
      te: 'చక్కెర ఎక్కువ: గ్లూకోజ్ హెచ్చుతగ్గులను అరికట్టడానికి జామ లేదా ఉసిరి వంటి తాజా పండ్లతో కలిపి తీసుకోండి.'
    });
  }
  if (values.sodium !== null && values.sodium > 400) {
    dietarySuggestions.push({
      en: 'High sodium content: Drink plenty of water and incorporate potassium-rich natural foods like fresh bananas or drumstick leaves.',
      te: 'సోడియం ఎక్కువ: రోజంతా సరిపడా నీరు త్రాగండి మరియు అరటిపండు, మునగాకు వంటి పొటాషియం నిధుల ఆహారాలు చేర్చండి.'
    });
  }
  if (values.saturatedFat !== null && values.saturatedFat > 3.5) {
    dietarySuggestions.push({
      en: 'Moderate portion size to avoid excess saturated fats; balance with healthy unsaturated plant fats like flaxseeds or almonds.',
      te: 'సంతృప్త కొవ్వు ఎక్కువ: మోతాదు తగ్గించి, బాదం లేదా అవిసె గింజల వంటి ఆరోగ్యకరమైన కొవ్వులతో సమతుల్యం చేయండి.'
    });
  }
  if ((values.fiber === null || values.fiber < 2) && (values.protein === null || values.protein < 3)) {
    dietarySuggestions.push({
      en: 'Low protein and fiber: Combine this item with sprouted green gram (moong) or roasted chickpeas (chana) for sustained energy.',
      te: 'ప్రోటీన్ మరియు పీచు తక్కువ: మొలకెత్తిన పెసలు లేదా వేయించిన శనగలతో కలిపి తీసుకోవడం ద్వారా సంపూర్ణ పోషణ పొందండి.'
    });
  }
  if (dietarySuggestions.length === 0) {
    dietarySuggestions.push({
      en: 'Wholesome nutritional balance: Safe to incorporate as part of a diversified daily Indian whole-food diet.',
      te: 'మంచి పోషక సమతుల్యత: రోజువారీ సమతుల్య భారతీయ భోజనంలో భాగంగా నిరభ్యంతరంగా తీసుకోవచ్చు.'
    });
  }

  return {
    grade,
    score: netScore,
    nutritionScore: finalNutritionScore,
    positiveFactors,
    negativeFactors,
    unknownFactors,
    dietarySuggestions,
    negativePoints,
    positivePoints,
    badgeColor,
    title,
    teluguTitle,
    explanation,
    teluguExplanation,
    criteria,
    disclaimer: 'Educational Nutrition Grade — based on balanced nutrient composition guidelines (sugar, saturated fat, sodium vs protein and fiber). Not an official regulatory mark.',
    teluguDisclaimer: 'విద్యా పోషకాహార గ్రేడ్ — చక్కెర, సంతృప్త కొవ్వు, సోడియం మరియు ప్రోటీన్/పీచు ఆధారిత సమతుల్యతపై ఆధారపడిన విద్యా సూచిక. ఇది అధికారిక రెగ్యులేటరీ మార్కు కాదు.',
  };
};

/**
 * Direct calculator for 0-100 Nutrition Score
 */
export const calculateNutritionScore = (values) => {
  const result = calculateEducationalGrade(values);
  return {
    nutritionScore: result.nutritionScore,
    grade: result.grade,
    positiveFactors: result.positiveFactors,
    negativeFactors: result.negativeFactors,
    unknownFactors: result.unknownFactors,
    dietarySuggestions: result.dietarySuggestions,
  };
};
