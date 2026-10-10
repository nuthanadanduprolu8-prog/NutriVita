import { memoryStore } from '../config/db.js';
import { VisionAIService } from '../services/visionAIService.js';
import {
  calculateNutritionIndicators,
  calculateEducationalGrade,
  getEmptyNutritionValues
} from '../utils/nutritionLabelParser.js';

// Popular curated whole foods list for quick-selection chips
const POPULAR_WHOLE_FOOD_IDS = [
  'apple', 'banana', 'coconut', 'orange', 'amla', 'guava', 'papaya',
  'carrot', 'spinach', 'ragi_sangati', 'tomato_dal', 'sambar', 'boiled_egg', 'milk'
];

// Mapping of common food aliases and AI recognized names to NutriVita's 53 food IDs
export const FOOD_SYNONYM_MAP = {
  apple: 'apple',
  fresh_apple: 'apple',
  mango: 'mango',
  ripe_mango: 'mango',
  indian_mango: 'mango',
  orange: 'orange',
  sweet_orange: 'orange',
  santra: 'orange',
  mosambi: 'orange',
  sweet_lime: 'orange',
  beetroot: 'beetroot_poriyal',
  beetroot_fry: 'beetroot_poriyal',
  beetroot_poriyal: 'beetroot_poriyal',
  spinach: 'spinach',
  palak: 'spinach',
  palakura: 'spinach',
  moringa: 'drumstick_leaves',
  drumstick_leaves: 'drumstick_leaves',
  munagaku: 'drumstick_leaves',
  carrot: 'carrot',
  sweet_potato: 'sweet_potato',
  bell_peppers: 'bell_peppers',
  capsicum: 'bell_peppers',
  tomato: 'tomato',
  fresh_tomatoes: 'tomato',
  amla: 'amla',
  indian_gooseberry: 'amla',
  gooseberry: 'amla',
  guava: 'guava',
  papaya: 'papaya',
  pomegranate: 'pomegranate',
  banana: 'banana',
  dark_chocolate: 'dark_chocolate',
  atta: 'whole_wheat',
  whole_wheat: 'whole_wheat',
  whole_wheat_flour: 'whole_wheat',
  oats: 'oats',
  rolled_oats: 'oats',
  lentils: 'lentils',
  toor_dal: 'lentils',
  pigeon_pea: 'lentils',
  chickpeas: 'chickpeas',
  chana: 'chickpeas',
  garbanzo: 'chickpeas',
  kala_chana: 'black_chickpeas',
  black_chickpeas: 'black_chickpeas',
  almonds: 'almonds',
  badam: 'almonds',
  sesame: 'sesame_seeds',
  sesame_seeds: 'sesame_seeds',
  til: 'sesame_seeds',
  coconut: 'coconut',
  curd: 'curd',
  yogurt: 'curd',
  dahi: 'curd',
  paneer: 'paneer',
  cottage_cheese: 'paneer',
  egg: 'egg',
  boiled_egg: 'egg',
  country_egg: 'egg',
  salmon: 'salmon',
  fish: 'salmon',
  bendakaya_fry: 'bendakaya_fry',
  okra_fry: 'bendakaya_fry',
  okra_stir_fry: 'bendakaya_fry',
  idli: 'idli',
  plain_dosa: 'plain_dosa',
  dosa: 'plain_dosa',
  mamidikaya_pappu: 'mamidikaya_pappu',
  raw_mango_dal: 'mamidikaya_pappu',
  upma: 'upma',
  vegetable_upma: 'upma',
  semolina_upma: 'upma',
  vegetable_pulao: 'vegetable_pulao',
  pulao: 'vegetable_pulao',
  veg_chapati_roll: 'veg_chapati_roll',
  chapati_roll: 'veg_chapati_roll',
  chapati: 'chapati',
  roti: 'chapati',
  vegetable_omelette: 'vegetable_omelette',
  omelette: 'vegetable_omelette',
  egg_omelette: 'vegetable_omelette',
  cooked_white_rice: 'cooked_white_rice',
  white_rice: 'cooked_white_rice',
  rice: 'cooked_white_rice',
  tomato_dal: 'tomato_dal',
  tomato_pappu: 'tomato_dal',
  sambar: 'sambar',
  south_indian_sambar: 'sambar',
  lemon_rice: 'lemon_rice',
  pulihora: 'lemon_rice',
  chitranna: 'lemon_rice',
  samosa: 'samosa',
  gongura_pappu: 'gongura_pappu',
  sorrel_leaves_dal: 'gongura_pappu',
  chicken_curry: 'chicken_curry',
  indian_chicken_curry: 'chicken_curry',
  roasted_peanuts: 'roasted_peanuts',
  peanuts: 'roasted_peanuts',
  groundnuts: 'roasted_peanuts',
  roasted_chana: 'roasted_chana',
  putnalu: 'roasted_chana',
  sweet_corn: 'sweet_corn',
  kakarakaya_fry: 'kakarakaya_fry',
  bitter_gourd_fry: 'kakarakaya_fry',
  vegetable_soup: 'vegetable_soup',
  ragi_sangati: 'ragi_sangati',
  ragi_mudde: 'ragi_sangati',
  ragi: 'ragi_sangati',
  finger_millet: 'ragi_sangati',
  sprouts_salad: 'sprouts_salad',
  sprouts: 'sprouts_salad',
  watermelon: 'watermelon',
  milk: 'milk',
  cow_milk: 'milk',
};

// Precise, non-confusing database matcher for AI recognized food name
export const matchAiNameToDatabase = (name, allFoods) => {
  if (!name || typeof name !== 'string') return null;
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  
  // Specific exclusions: "pineapple" and "custard apple" are NOT orchard "apple"
  if (clean.includes('pineapple') || clean.includes('custard_apple')) {
    return null;
  }

  // 1. Direct synonym lookup
  if (FOOD_SYNONYM_MAP[clean]) {
    const found = allFoods.find(f => f.id === FOOD_SYNONYM_MAP[clean]);
    if (found) return found;
  }

  // 2. Exact ID match
  const byId = allFoods.find(f => f.id === clean);
  if (byId) return byId;

  // 3. Exact name match (English or Telugu)
  const normName = name.toLowerCase().trim();
  const byName = allFoods.find(f => f.name.toLowerCase() === normName || f.teluguName?.toLowerCase() === normName);
  if (byName) return byName;

  // 4. Whole-word based match for synonym keys (e.g., "fresh apple" matches "apple", but "pineapple" does NOT)
  for (const [key, targetId] of Object.entries(FOOD_SYNONYM_MAP)) {
    const keyWords = key.split('_');
    const allWordsPresent = keyWords.every(w => {
      const regex = new RegExp(`\\b${w}\\b`, 'i');
      return regex.test(normName);
    });
    if (allWordsPresent) {
      const found = allFoods.find(f => f.id === targetId);
      if (found) return found;
    }
  }

  // 5. Whole word containment match in food's primary title
  const normWords = normName.split(/\s+/).filter(Boolean);
  const byWholeWords = allFoods.find(f => {
    const foodWords = f.name.toLowerCase().split(/\s+/).filter(Boolean);
    return normWords.length >= 2 && foodWords.every(fw => {
      const regex = new RegExp(`\\b${fw}\\b`, 'i');
      return regex.test(normName);
    });
  });
  if (byWholeWords) return byWholeWords;

  return null;
};

// @desc    Identify food from uploaded image or direct foodId using genuine Vision AI
// @route   POST /api/scanner/identify
// @access  Public
export const identifyFood = async (req, res, next) => {
  try {
    const file = req.file;
    const { foodId, labelHint, filename } = req.body;
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    const allFoods = [...memoryStore.foods];
    const popularWholeFoods = POPULAR_WHOLE_FOOD_IDS
      .map(id => allFoods.find(f => f.id === id))
      .filter(Boolean);

    // 1. Direct food ID request (e.g., from quick-select chip or search pick)
    if (foodId) {
      const directMatch = allFoods.find(f => f.id === foodId);
      if (directMatch) {
        return res.status(200).json({
          success: true,
          matched: directMatch,
          confidenceLevel: 'high',
          source: 'manual_selection',
          isReferenceEstimate: true,
          popularWholeFoods,
          message: `Loaded verified reference nutrition for ${directMatch.name} from NutriVita database.`,
        });
      }
    }

    // Check if an actual image file buffer was uploaded; if not, handle programmatic text query
    if (!file || !file.buffer || file.buffer.length === 0) {
      const textQuery = foodId || labelHint || (filename ? filename.replace(/\.[^/.]+$/, '').replace(/[_\-]/g, ' ') : null);
      if (textQuery) {
        const textMatch = matchAiNameToDatabase(textQuery, allFoods);
        if (textMatch) {
          return res.status(200).json({
            success: true,
            matched: textMatch,
            confidenceLevel: 'high',
            source: 'text_query',
            isReferenceEstimate: true,
            popularWholeFoods,
            message: `Loaded verified reference nutrition for ${textMatch.name} from NutriVita database.`,
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please provide an image to identify.',
        popularWholeFoods,
      });
    }

    // 2. Check Vision AI configuration & reachability
    const health = await VisionAIService.checkVisionHealth();
    if (!health.configured || !health.reachable) {
      return res.status(200).json({
        success: false,
        visionAiAvailable: false,
        source: 'unconfigured',
        matched: null,
        message: health.message,
        popularWholeFoods,
        allFoodsCount: allFoods.length,
      });
    }

    // 3. Process image with real Gemini Vision AI
    let aiResult = null;
    try {
      aiResult = await VisionAIService.identifyFoodWithGemini({
        geminiKey,
        imageBuffer: file.buffer,
        mimeType: file.mimetype || 'image/jpeg',
      });
    } catch (aiErr) {
      console.warn('Gemini vision processing notice:', aiErr.message);
      return res.status(200).json({
        success: false,
        visionAiAvailable: false,
        source: 'vision_error',
        matched: null,
        error: aiErr.message,
        message: 'Vision AI service could not analyze this image. Please select from verified foods below or try again.',
        popularWholeFoods,
      });
    }

    // Handle non-food images
    if (aiResult && aiResult.isFood === false) {
      return res.status(200).json({
        success: true,
        visionAiAvailable: true,
        isFood: false,
        matched: null,
        confidenceLevel: 'uncertain',
        source: 'non_food',
        recognizedName: null,
        visualObservations: aiResult.visualObservations || 'No food items were detected in this image.',
        clarificationQuestion: aiResult.clarificationQuestion || 'No food detected. Please take or upload a photo of a meal, fresh fruit, vegetable, or snack.',
        possibleAlternatives: [],
        popularWholeFoods,
        message: 'No food was detected in this image. Please provide a photo of food.',
      });
    }

    // Handle ambiguous or completely unrecognized images
    if (!aiResult?.foodName || (aiResult.confidenceLevel === 'uncertain' && !aiResult.foodName)) {
      return res.status(200).json({
        success: true,
        visionAiAvailable: true,
        isFood: true,
        matched: null,
        confidenceLevel: 'uncertain',
        source: 'uncertain',
        recognizedName: aiResult?.foodName || null,
        visualObservations: aiResult?.visualObservations || 'The image is unclear or could not be distinguished reliably.',
        clarificationQuestion: aiResult?.clarificationQuestion || 'Could not identify this food with certainty. Please upload a clearer photo or confirm the food name below.',
        possibleAlternatives: aiResult?.possibleAlternatives || [],
        message: 'Could not identify this food with certainty. Please upload a clearer photo or confirm the food name below.',
        popularWholeFoods,
      });
    }

    // 4. Map the AI's recognized food name to the verified 53-food database
    const matchedFood = matchAiNameToDatabase(aiResult.foodName, allFoods);

    if (matchedFood) {
      return res.status(200).json({
        success: true,
        visionAiAvailable: true,
        isFood: true,
        matched: {
          ...matchedFood,
          nutritionSource: 'verified_db',
          isVerifiedDatabase: true,
          visualObservations: aiResult.visualObservations,
          isMultipleFoods: Boolean(aiResult.isMultipleFoods),
          detectedFoods: aiResult.detectedFoods || [],
          servingGuidance: aiResult.servingGuidance || matchedFood.benefitsEn,
          preparationNotes: aiResult.preparationNotes || 'Verified clinical nutrition reference per standard 100g basis.',
        },
        recognizedName: aiResult.foodName,
        confidenceLevel: aiResult.confidenceLevel || 'high',
        visualObservations: aiResult.visualObservations,
        dishType: aiResult.category,
        isMultipleFoods: Boolean(aiResult.isMultipleFoods),
        detectedFoods: aiResult.detectedFoods || [],
        isPackagedProduct: Boolean(aiResult.isPackagedProduct),
        clarificationQuestion: aiResult.clarificationQuestion || null,
        possibleAlternatives: aiResult.possibleAlternatives || [],
        source: 'vision_ai',
        nutritionSource: 'verified_db',
        isReferenceEstimate: true,
        popularWholeFoods,
        message: `Recognized as ${matchedFood.name} (${matchedFood.teluguName}) using Google Gemini Vision AI. Verified clinical reference nutrition loaded.`,
      });
    }

    // 5. UNIVERSAL FOOD: Food recognized by AI but unlisted in the local 53-food database
    // Provide realistic, scientifically grounded nutritional values from Vision AI without blocking!
    const safeNumber = (val, fallback = 0) => {
      const num = Number(val);
      return Number.isFinite(num) ? num : fallback;
    };

    const universalFood = {
      id: `universal_${aiResult.foodName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: aiResult.foodName,
      teluguName: aiResult.teluguName || aiResult.regionalName || '',
      category: aiResult.category || 'prepared_meals',
      servingSize: aiResult.estimatedServing?.size || '1 typical serving (approx. 150g)',
      servingWeightGrams: safeNumber(aiResult.estimatedServing?.grams, 150),
      servingBasis: aiResult.estimatedNutrition?.servingBasis || 'per_serving',
      calories: safeNumber(aiResult.estimatedNutrition?.calories, 200),
      macronutrients: {
        protein: safeNumber(aiResult.estimatedNutrition?.protein, 5),
        carbs: safeNumber(aiResult.estimatedNutrition?.carbohydrates, 25),
        fats: safeNumber(aiResult.estimatedNutrition?.totalFat, 6),
        fiber: safeNumber(aiResult.estimatedNutrition?.dietaryFiber, 2),
        saturatedFat: safeNumber(aiResult.estimatedNutrition?.saturatedFat, 1),
        sugars: safeNumber(aiResult.estimatedNutrition?.totalSugars, 3),
      },
      minerals: {
        sodium: safeNumber(aiResult.estimatedNutrition?.sodium, 200),
        iron: aiResult.estimatedNutrition?.iron || null,
        calcium: aiResult.estimatedNutrition?.calcium || null,
        potassium: aiResult.estimatedNutrition?.potassium || null,
      },
      vitamins: Array.isArray(aiResult.estimatedNutrition?.keyVitamins) ? aiResult.estimatedNutrition.keyVitamins : [],
      keyNutrients: Array.isArray(aiResult.estimatedNutrition?.keyNutrientsSummary) ? aiResult.estimatedNutrition.keyNutrientsSummary : [],
      benefitsEn: aiResult.nutritionalBenefits || 'Provides dietary energy and macro-nutritional sustenance.',
      benefitsTe: aiResult.nutritionalBenefitsTe || '',
      servingGuidance: aiResult.servingGuidance || 'Enjoy as part of a balanced, nutrient-dense diet.',
      preparationNotes: aiResult.preparationNotes || 'Nutritional values are approximate AI culinary estimates for this dish. Actual values depend on specific ingredients, oil, and portion sizes.',
      nutritionSource: 'ai_estimated',
      isAiEstimated: true,
      isVerifiedDatabase: false,
      visualObservations: aiResult.visualObservations,
      isMultipleFoods: Boolean(aiResult.isMultipleFoods),
      detectedFoods: aiResult.detectedFoods || [],
    };

    return res.status(200).json({
      success: true,
      visionAiAvailable: true,
      isFood: true,
      matched: universalFood,
      recognizedName: aiResult.foodName,
      confidenceLevel: aiResult.confidenceLevel || 'moderate',
      visualObservations: aiResult.visualObservations,
      dishType: aiResult.category,
      isMultipleFoods: Boolean(aiResult.isMultipleFoods),
      detectedFoods: aiResult.detectedFoods || [],
      isPackagedProduct: Boolean(aiResult.isPackagedProduct),
      clarificationQuestion: aiResult.clarificationQuestion || null,
      possibleAlternatives: aiResult.possibleAlternatives || [],
      source: 'vision_ai_universal',
      nutritionSource: 'ai_estimated',
      isReferenceEstimate: true,
      popularWholeFoods,
      message: `Recognized as "${aiResult.foodName}" using Google Gemini Vision AI. AI-estimated nutritional values loaded.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Correct food name or recalculate portion size
// @route   POST /api/scanner/correct
// @access  Public
export const correctOrRecalculateFood = async (req, res, next) => {
  try {
    const { foodName, currentFood, targetWeightGrams, portionMultiplier = 1 } = req.body;
    const allFoods = [...memoryStore.foods];
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    // Case 1: Portion adjustment on an existing food
    if (currentFood && targetWeightGrams && !foodName) {
      const baseGrams = Number(currentFood.servingWeightGrams) || 100;
      const targetGrams = Number(targetWeightGrams);
      const ratio = targetGrams / baseGrams;

      const scale = (val) => {
        if (val === null || val === undefined) return null;
        const num = Number(val);
        return Number.isFinite(num) ? Math.round(num * ratio * 10) / 10 : null;
      };

      const updatedFood = {
        ...currentFood,
        servingSize: `${targetGrams}g portion`,
        servingWeightGrams: targetGrams,
        calories: Math.round(Number(currentFood.calories || 0) * ratio),
        macronutrients: {
          protein: scale(currentFood.macronutrients?.protein),
          carbs: scale(currentFood.macronutrients?.carbs),
          fats: scale(currentFood.macronutrients?.fats),
          fiber: scale(currentFood.macronutrients?.fiber),
          saturatedFat: scale(currentFood.macronutrients?.saturatedFat),
          sugars: scale(currentFood.macronutrients?.sugars),
        },
        minerals: {
          ...currentFood.minerals,
          sodium: scale(currentFood.minerals?.sodium),
        },
        nutritionSource: currentFood.nutritionSource || 'portion_adjusted',
        isPortionAdjusted: true,
      };

      return res.status(200).json({
        success: true,
        data: updatedFood,
        ratio,
        message: `Nutrition scaled for ${targetGrams}g portion.`
      });
    }

    // Case 2: User corrected the food name
    if (foodName && foodName.trim()) {
      const cleanName = foodName.trim();
      const dbMatch = matchAiNameToDatabase(cleanName, allFoods);

      if (dbMatch) {
        return res.status(200).json({
          success: true,
          data: {
            ...dbMatch,
            nutritionSource: 'verified_db',
            isVerifiedDatabase: true,
          },
          matchedDatabase: true,
          message: `Matched to verified NutriVita database: ${dbMatch.name}`
        });
      }

      // Query Gemini to estimate nutrition for this corrected food name
      if (geminiKey) {
        try {
          const estimated = await VisionAIService.estimateNutritionForFoodName({
            foodName: cleanName,
            portionGrams: targetWeightGrams || 150,
            geminiKey,
          });

          if (estimated) {
            const universalFood = {
              id: `custom_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
              name: estimated.foodName || cleanName,
              teluguName: estimated.teluguName || '',
              category: estimated.category || 'prepared_meals',
              servingSize: estimated.estimatedServing?.size || `${targetWeightGrams || 150}g serving`,
              servingWeightGrams: targetWeightGrams || 150,
              calories: Number(estimated.estimatedNutrition?.calories || 200),
              macronutrients: {
                protein: Number(estimated.estimatedNutrition?.protein || 5),
                carbs: Number(estimated.estimatedNutrition?.carbohydrates || 25),
                fats: Number(estimated.estimatedNutrition?.totalFat || 6),
                fiber: Number(estimated.estimatedNutrition?.dietaryFiber || 2),
                saturatedFat: Number(estimated.estimatedNutrition?.saturatedFat || 1),
                sugars: Number(estimated.estimatedNutrition?.totalSugars || 3),
              },
              minerals: {
                sodium: Number(estimated.estimatedNutrition?.sodium || 200),
                iron: estimated.estimatedNutrition?.iron || null,
                calcium: estimated.estimatedNutrition?.calcium || null,
              },
              vitamins: estimated.estimatedNutrition?.keyVitamins || [],
              benefitsEn: estimated.nutritionalBenefits || 'Provides dietary nourishment and energy.',
              servingGuidance: estimated.servingGuidance || 'Enjoy as part of a balanced diet.',
              preparationNotes: estimated.preparationNotes || 'Values are estimated for typical recipes.',
              nutritionSource: 'ai_estimated',
              isAiEstimated: true,
              isVerifiedDatabase: false,
            };

            return res.status(200).json({
              success: true,
              data: universalFood,
              matchedDatabase: false,
              message: `AI calculated nutrition estimates for "${cleanName}".`
            });
          }
        } catch (estErr) {
          console.warn('Nutrition estimate query notice:', estErr.message);
        }
      }

      // Heuristic fallback if Gemini API is unavailable
      const fallbackFood = {
        id: `custom_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name: cleanName,
        category: 'prepared_meals',
        servingSize: `${targetWeightGrams || 150}g serving`,
        servingWeightGrams: targetWeightGrams || 150,
        calories: Math.round((targetWeightGrams || 150) * 1.5),
        macronutrients: {
          protein: Math.round((targetWeightGrams || 150) * 0.05),
          carbs: Math.round((targetWeightGrams || 150) * 0.2),
          fats: Math.round((targetWeightGrams || 150) * 0.05),
          fiber: 2,
        },
        minerals: { sodium: 250 },
        benefitsEn: 'Provides dietary energy.',
        nutritionSource: 'heuristic_estimate',
        isAiEstimated: true,
      };

      return res.status(200).json({
        success: true,
        data: fallbackFood,
        matchedDatabase: false,
        message: `Provided estimated nutrition for "${cleanName}".`
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Please provide foodName or targetWeightGrams.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Manual search fallback for scanner
// @route   GET /api/scanner/search
// @access  Public
export const searchFoodsFallback = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({
        success: true,
        data: memoryStore.foods.slice(0, 10),
      });
    }

    const searchLower = q.trim().toLowerCase();
    const results = memoryStore.foods.filter(f =>
      f.name.toLowerCase().includes(searchLower) ||
      (f.teluguName && f.teluguName.toLowerCase().includes(searchLower)) ||
      (f.category && f.category.toLowerCase().includes(searchLower)) ||
      (f.tags && f.tags.some(t => t.toLowerCase().includes(searchLower)))
    );

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scanner status & AI configuration
// @route   GET /api/scanner/status
// @access  Public
export const getScannerStatus = async (req, res, next) => {
  try {
    const health = await VisionAIService.checkVisionHealth();
    res.status(200).json({
      success: true,
      visionAiConfigured: health.configured,
      visionAiReachable: health.reachable,
      status: health.status,
      message: health.message,
      provider: health.provider,
      referenceFoodsCount: memoryStore.foods.length,
      ocrEngine: 'Tesseract.js (Client-side)',
      modes: [
        {
          id: 'vision_ai',
          name: 'Multimodal Vision AI',
          provider: health.provider || 'Google Gemini 1.5 Flash',
          status: health.reachable ? 'active' : (health.configured ? 'error' : 'unconfigured'),
          description: health.reachable
            ? 'Analyzes visual food and body images directly using multimodal neural models.'
            : 'Analyzes visual food and body images directly using multimodal neural models. Requires reachable GEMINI_API_KEY in server/.env.'
        },
        {
          id: 'label_ocr',
          name: 'Nutrition Label OCR',
          provider: 'Tesseract.js',
          status: 'active',
          description: 'Runs client-side optical character recognition to extract printed nutrition facts panels, serving sizes, and ingredients.'
        },
        {
          id: 'reference_db',
          name: 'NutriVita Reference Database',
          provider: 'Local Verified Clinical Dataset',
          status: 'active',
          description: 'Provides verified reference nutrition per 100g for 53 whole foods, grains, pulses, and traditional South Indian preparations.'
        },
        {
          id: 'manual_entry',
          name: 'Manual Nutrition Entry',
          provider: 'User Input',
          status: 'active',
          description: 'Enables custom macronutrient and micronutrient entry for homemade meals or unlisted packages.'
        },
        {
          id: 'clinical_engine',
          name: 'Clinical Nutrition Rules Engine',
          provider: 'Evidence-Based Nutrition Engine',
          status: 'active',
          description: 'Deterministic evidence-based algorithm calculating 0-100 nutrition quality scores, educational grades, and physical sign deficiency correlations.'
        }
      ]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular whole foods for quick selection
// @route   GET /api/scanner/popular-foods
// @access  Public
export const getPopularWholeFoods = async (req, res, next) => {
  try {
    const allFoods = [...memoryStore.foods];
    const popularWholeFoods = POPULAR_WHOLE_FOOD_IDS
      .map(id => allFoods.find(f => f.id === id))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      count: popularWholeFoods.length,
      data: popularWholeFoods,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze nutrition facts label image directly using Multimodal Vision AI
// @route   POST /api/scanner/analyze-label
// @access  Public
export const analyzeLabel = async (req, res, next) => {
  try {
    const file = req.file;
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (!file || !file.buffer || file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please provide an image of the nutrition label.',
      });
    }

    const health = await VisionAIService.checkVisionHealth();
    if (!health.configured || !health.reachable) {
      return res.status(200).json({
        success: false,
        visionAiAvailable: false,
        source: 'unconfigured',
        error: health.message,
        message: health.message || 'Vision AI service is currently unavailable. You can enter label values manually.',
      });
    }

    let aiResult = null;
    try {
      aiResult = await VisionAIService.analyzeNutritionLabelWithGemini({
        geminiKey,
        imageBuffer: file.buffer,
        mimeType: file.mimetype || 'image/jpeg',
      });
    } catch (aiErr) {
      console.warn('Gemini label analysis notice:', aiErr.message);
      return res.status(200).json({
        success: false,
        visionAiAvailable: false,
        source: 'vision_error',
        error: aiErr.message,
        message: 'Vision AI could not read this label clearly. Please enter values manually or try another photo.',
      });
    }

    if (!aiResult) {
      return res.status(200).json({
        success: false,
        visionAiAvailable: true,
        source: 'empty_result',
        message: 'Could not extract nutrition facts from this image. Please enter values manually.',
      });
    }

    // Check if the image does not show a nutrition facts label
    if (aiResult.isNutritionLabel === false) {
      return res.status(200).json({
        success: true,
        visionAiAvailable: true,
        isNutritionLabel: false,
        source: 'no_label_detected',
        foodOnlyNotice: {
          en: 'No printed nutrition label detected in this photo. For whole foods or meals, use Food Scanner.',
          te: 'ఈ ఫోటోలో ముద్రించిన పోషకాహార లేబుల్ కనుగొనబడలేదు. ఆహారాన్ని విశ్లేషించడానికి ఫుడ్ స్కానర్ ఉపయోగించండి.',
        },
        message: 'No printed nutrition facts panel was detected on this item.',
      });
    }

    const safeNum = (v) => {
      if (v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const empty = getEmptyNutritionValues();
    const extracted = {
      ...empty,
      productName: aiResult.productName || null,
      brand: aiResult.brand || null,
      servingSize: aiResult.servingSize || null,
      servingBasis: aiResult.servingBasis === 'per_100g' ? 'per_100g' : 'per_serving',
      calories: safeNum(aiResult.calories),
      energyKj: safeNum(aiResult.energyKj) || (safeNum(aiResult.calories) ? Math.round(aiResult.calories * 4.184) : null),
      totalFat: safeNum(aiResult.totalFat),
      saturatedFat: safeNum(aiResult.saturatedFat),
      transFat: safeNum(aiResult.transFat),
      carbohydrates: safeNum(aiResult.carbohydrates),
      totalSugars: safeNum(aiResult.totalSugars),
      addedSugars: safeNum(aiResult.addedSugars),
      fiber: safeNum(aiResult.fiber),
      protein: safeNum(aiResult.protein),
      sodium: safeNum(aiResult.sodium),
      salt: safeNum(aiResult.salt) || (safeNum(aiResult.sodium) ? Number((aiResult.sodium / 400).toFixed(2)) : null),
      calcium: safeNum(aiResult.calcium),
      iron: safeNum(aiResult.iron),
      vitaminC: safeNum(aiResult.vitaminC),
      vitaminD: safeNum(aiResult.vitaminD),
      potassium: safeNum(aiResult.potassium),
      ingredients: aiResult.ingredients || null,
      allergens: aiResult.allergens || null,
    };

    if (extracted.sodium === null && extracted.salt !== null) {
      extracted.sodium = Math.round(extracted.salt * 400);
    }

    const indicators = calculateNutritionIndicators(extracted);
    const gradeInfo = calculateEducationalGrade(extracted);

    return res.status(200).json({
      success: true,
      visionAiAvailable: true,
      isNutritionLabel: true,
      confidence: aiResult.confidence || 'high',
      extracted,
      indicators,
      gradeInfo,
      rawText: aiResult.rawTextSummary || '',
      source: 'gemini_vision_label',
      message: 'Successfully analyzed nutrition label using Google Gemini Multimodal Vision AI.',
    });
  } catch (error) {
    next(error);
  }
};


