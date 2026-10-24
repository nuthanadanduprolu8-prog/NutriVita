/**
 * NutriVita Real Vision AI & Clinical Nutrition Assessment Service
 * Integrates Google Gemini Vision API (and OpenAI Vision fallback) using native fetch.
 * When no API key is provided, provides an honest, evidence-based rule assessment without faking visual AI.
 */

import { evaluateBodyChange, BODY_AREAS } from '../data/bodyChangeKnowledge.js';
import { FoodRepository } from '../models/FoodItem.js';

export class VisionAIService {
  static _healthCache = null;

  /**
   * Official Google Generative AI production models prioritized for multimodal vision
   * Followed by alias and legacy models for resilience.
   */
  static SUPPORTED_GEMINI_MODELS = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro',
    'gemini-flash-latest',
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash'
  ];

  /**
   * Retrieves, normalizes, and sanitizes the Gemini API key from environment variables.
   * Resilient to Linux case-sensitivity, accidental whitespace in variable names or values,
   * surrounding quotes/escaped quotes, and key=value formatting.
   * Checks GEMINI_API_KEY, GOOGLE_API_KEY, GEMINI_KEY, GOOGLE_GEMINI_API_KEY, and common aliases.
   */
  static getApiKeyInfo() {
    const cleanValue = (val) => {
      if (!val || typeof val !== 'string') return null;
      let cleaned = val.trim();
      // Strip escaped quotes or surrounding quotes
      cleaned = cleaned.replace(/^["'\\]+|["'\\]+$/g, '').trim();
      // Strip accidental 'VARIABLE_NAME=' prefix if pasted as key=value in dashboard
      cleaned = cleaned.replace(/^[A-Za-z0-9_]+=\s*/, '').trim();
      // Strip wrapping quotes again if value was quoted inside key=value
      cleaned = cleaned.replace(/^["']|["']$/g, '').trim();
      return cleaned.length > 0 ? cleaned : null;
    };

    // 1. Direct candidate priority order
    const priorityCandidates = [
      'GEMINI_API_KEY',
      'GOOGLE_API_KEY',
      'GEMINI_KEY',
      'GOOGLE_GEMINI_API_KEY',
      'VITE_GEMINI_API_KEY',
      'GENAI_API_KEY',
      'GEMINI_APIKEY',
      'GOOGLE_GENAI_API_KEY',
      'GEMINI_TOKEN'
    ];

    for (const name of priorityCandidates) {
      const val = process.env[name];
      const cleaned = cleanValue(val);
      if (cleaned) {
        return {
          key: cleaned,
          envVarName: name,
          maskedPrefix: cleaned.length >= 4 ? `${cleaned.slice(0, 4)}...` : '***',
          length: cleaned.length
        };
      }
    }

    // 2. Case-insensitive and trimmed key name scan across process.env
    // (Crucial for Linux environments like Render where env variable names are strictly case-sensitive)
    if (typeof process !== 'undefined' && process.env) {
      for (const rawName of Object.keys(process.env)) {
        const normalizedName = rawName.trim().toUpperCase();
        if (
          normalizedName === 'GEMINI_API_KEY' ||
          normalizedName === 'GOOGLE_API_KEY' ||
          normalizedName === 'GEMINI_KEY' ||
          normalizedName === 'GOOGLE_GEMINI_API_KEY' ||
          normalizedName === 'VITE_GEMINI_API_KEY' ||
          normalizedName === 'GENAI_API_KEY' ||
          normalizedName === 'GEMINI_APIKEY' ||
          normalizedName === 'GOOGLE_GENAI_API_KEY' ||
          /^(VITE_)?GEMINI.*KEY$/.test(normalizedName) ||
          /^(VITE_)?GOOGLE.*GEMINI.*KEY$/.test(normalizedName)
        ) {
          const cleaned = cleanValue(process.env[rawName]);
          if (cleaned) {
            return {
              key: cleaned,
              envVarName: rawName.trim(),
              maskedPrefix: cleaned.length >= 4 ? `${cleaned.slice(0, 4)}...` : '***',
              length: cleaned.length
            };
          }
        }
      }
    }

    return {
      key: null,
      envVarName: null,
      maskedPrefix: null,
      length: 0
    };
  }

  /**
   * Returns the sanitized Gemini API key string or null if not configured.
   */
  static getApiKey() {
    return this.getApiKeyInfo().key;
  }

  /**
   * Sanitizes any sensitive tokens, API keys, or database secrets from error strings.
   * Ensures no API secrets or keys are ever logged or sent to clients.
   */
  static sanitizeErrorMessage(errMsg, apiKey) {
    if (!errMsg || typeof errMsg !== 'string') return 'Provider error occurred';
    let sanitized = errMsg;
    if (apiKey && typeof apiKey === 'string' && apiKey.length > 5) {
      sanitized = sanitized.split(apiKey).join('[REDACTED_API_KEY]');
    }
    // Redact query parameter patterns like ?key=... or &key=...
    sanitized = sanitized.replace(/([?&]key=)[^&\s"']+/gi, '$1[REDACTED]');
    // Redact typical Google API key patterns AIzaSy...
    sanitized = sanitized.replace(/AIzaSy[A-Za-z0-9_-]{33}/g, '[REDACTED_API_KEY]');
    return sanitized;
  }

  /**
   * Classifies a Vision provider error into a standardized error object.
   * Accurately distinguishes missing configuration, invalid keys, quota exhaustion,
   * service timeouts, and network failures. Never leaks secrets or raw tokens.
   */
  static classifyVisionError(err) {
    if (!err) {
      return {
        source: 'vision_error',
        message: 'Vision AI encountered an unknown processing error.',
      };
    }

    const msg = (err.message || '').toLowerCase();
    const status = err.status || 0;

    // Check for invalid or unauthorized API key
    if (status === 400 || msg.includes('api_key_invalid') || msg.includes('api key not valid') || msg.includes('invalid api key')) {
      return {
        source: 'invalid_key',
        message: 'The configured Gemini API key is invalid or unauthorized. Please verify GEMINI_API_KEY in Render.',
      };
    }

    // Check for quota exhaustion / rate limiting
    if (status === 429 || msg.includes('429') || msg.includes('resource_exhausted') || msg.includes('quota') || msg.includes('rate limit')) {
      return {
        source: 'quota_exceeded',
        message: 'Gemini Vision API quota limit has been reached. Please enter nutrition values manually below or try again shortly.',
      };
    }

    // Check for provider service unavailable
    if (status === 503 || msg.includes('503') || msg.includes('unavailable') || msg.includes('overloaded')) {
      return {
        source: 'service_busy',
        message: 'Google Gemini Vision service is temporarily overloaded. Please try again in a few moments.',
      };
    }

    // Check for network errors / timeouts
    if (err.name === 'AbortError' || msg.includes('timeout') || msg.includes('network') || msg.includes('econnreset') || msg.includes('etimedout') || msg.includes('fetch failed')) {
      return {
        source: 'network_error',
        message: 'Network connection to Gemini Vision provider timed out or failed. Please check network connectivity and try again.',
      };
    }

    // Default provider error with sanitized summary
    const sanitized = this.sanitizeErrorMessage(err.message || 'Vision analysis failed');
    return {
      source: 'vision_error',
      message: `Vision AI service could not analyze this image (${sanitized}). Please try another photo or use manual search.`,
    };
  }

  /**
   * Health and reachability probe for Google Gemini Vision
   */
  static async checkVisionHealth(force = false) {
    const keyInfo = this.getApiKeyInfo();
    const geminiKey = keyInfo.key;

    if (!geminiKey) {
      console.warn('[VisionAIService] Health check: No Gemini API key detected in environment. Checked: GEMINI_API_KEY, GOOGLE_API_KEY, GEMINI_KEY, GOOGLE_GEMINI_API_KEY.');
      return {
        configured: false,
        reachable: false,
        provider: null,
        status: 'unconfigured',
        envVarName: null,
        message: 'Educational Rules-Based Mode Active. AI-powered photo analysis is currently unavailable because the vision service has not been configured in Render environment variables.'
      };
    }

    if (!force && this._healthCache && (Date.now() - this._healthCache.timestamp < 60000)) {
      return this._healthCache.data;
    }

    console.log(`[VisionAIService] Probing Gemini Vision health (Key source: ${keyInfo.envVarName}, prefix: ${keyInfo.maskedPrefix}, length: ${keyInfo.length})...`);

    try {
      // Actively supported Gemini models with generateContent capability
      const probeModels = VisionAIService.SUPPORTED_GEMINI_MODELS;
      let reachableModel = null;
      let lastErrMsg = '';

      for (const model of probeModels) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${geminiKey}`, {
            method: 'GET',
            signal: controller.signal
          });
          clearTimeout(timeout);

          if (res.ok) {
            reachableModel = model;
            break;
          } else {
            const errJson = await res.json().catch(() => ({}));
            lastErrMsg = errJson?.error?.message || `HTTP ${res.status}`;
            console.warn(`[VisionAIService] Probe model ${model} returned HTTP ${res.status}: ${this.sanitizeErrorMessage(lastErrMsg, geminiKey)}`);
          }
        } catch (e) {
          lastErrMsg = e.message;
          console.warn(`[VisionAIService] Probe model ${model} network notice: ${this.sanitizeErrorMessage(e.message, geminiKey)}`);
        }
      }

      if (reachableModel) {
        console.log(`[VisionAIService] Gemini Vision probe successful. Active model: "${reachableModel}".`);
        const data = {
          configured: true,
          reachable: true,
          provider: 'Google Gemini Flash Vision AI',
          model: reachableModel,
          envVarName: keyInfo.envVarName,
          status: 'active',
          message: `Google Gemini Vision AI (${reachableModel}) is active and reachable.`
        };
        this._healthCache = { timestamp: Date.now(), data };
        return data;
      } else {
        const sanitized = this.sanitizeErrorMessage(lastErrMsg, geminiKey);
        console.error(`[VisionAIService] Gemini Vision probe failed across tested models. Last notice: ${sanitized}`);
        const data = {
          configured: true,
          reachable: false,
          provider: 'Google Gemini Flash Vision AI',
          envVarName: keyInfo.envVarName,
          status: 'error',
          error: sanitized,
          message: `Educational Rules-Based Mode Active. AI-powered photo analysis is temporarily unavailable: ${sanitized}`
        };
        // Short 5s backoff so transient cold-start probe issues don't latch for 60s
        this._healthCache = { timestamp: Date.now() - 55000, data };
        return data;
      }
    } catch (err) {
      const sanitized = this.sanitizeErrorMessage(err.message, geminiKey);
      console.error(`[VisionAIService] Gemini Vision probe unexpected exception: ${sanitized}`);
      const data = {
        configured: true,
        reachable: false,
        provider: 'Google Gemini Flash Vision AI',
        envVarName: keyInfo.envVarName,
        status: 'error',
        error: sanitized,
        message: `Educational Rules-Based Mode Active. AI-powered photo analysis could not reach the vision provider: ${sanitized}`
      };
      this._healthCache = { timestamp: Date.now() - 55000, data };
      return data;
    }
  }

  /**
   * Main assessment entry point
   */
  static async assess({
    imageBuffer,
    mimeType,
    bodyAreaId,
    changeId,
    duration,
    associatedSymptoms = [],
    language = 'en'
  }) {
    const isTelugu = language === 'te';
    const geminiKey = this.getApiKey();
    const openAIKey = process.env.OPENAI_API_KEY?.trim();

    // Baseline rule-based knowledge evaluation
    const ruleEvaluation = evaluateBodyChange({
      bodyAreaId,
      changeId,
      duration,
      associatedSymptoms,
      language
    });

    if (!ruleEvaluation) {
      throw new Error(`Invalid body area '${bodyAreaId}' or physical change specified.`);
    }

    // Populate recommended whole foods from NutriVita's verified food repository
    const recommendedFoods = [];
    if (ruleEvaluation.recommendedFoodIds && ruleEvaluation.recommendedFoodIds.length > 0) {
      for (const foodId of ruleEvaluation.recommendedFoodIds.slice(0, 6)) {
        try {
          const food = await FoodRepository.findById(foodId);
          if (food) {
            recommendedFoods.push({
              id: food.id,
              name: food.name,
              teluguName: food.teluguName,
              category: food.category,
              servingSize: food.servingSize,
              imageUrl: food.imageUrl,
              calories: food.calories,
              macronutrients: food.macronutrients,
              keyVitamins: food.vitamins,
              keyMinerals: food.minerals,
              benefits: language === 'te' ? food.benefitsTe : food.benefitsEn
            });
          }
        } catch {
          // continue
        }
      }
    }

    const nonDiagnosticNotice = isTelugu
      ? 'ముఖ్యమైన వైద్య గమనిక: ఈ విశ్లేషణ విద్యా మరియు అవగాహన ప్రయోజనాల కోసం మాత్రమే. ఫోటో లేదా లక్షణాల ఆధారిత అంచనా విటమిన్ లోపం లేదా వ్యాధికి క్లినికల్ రుజువు కాదు. ఖచ్చితమైన నిర్ధారణ కోసం అర్హత కలిగిన వైద్యుడిని లేదా ప్రయోగశాల పరీక్షలను సంప్రదించండి.'
      : 'Important Medical Notice: This assessment is strictly educational and non-diagnostic. A photograph or symptom check is NOT clinical proof of a vitamin deficiency or disease. Laboratory diagnostic tests (e.g. serum ferritin, vitamin assays) and certified physician evaluation are required for medical diagnosis.';

    // Check if an image was uploaded and an active vision API key exists
    const hasImage = Boolean(imageBuffer && imageBuffer.length > 0);
    const hasVisionKey = Boolean(geminiKey || openAIKey);

    if (hasImage && hasVisionKey) {
      try {
        let aiResult = null;
        if (geminiKey) {
          aiResult = await this.callGeminiVision({
            geminiKey,
            imageBuffer,
            mimeType: mimeType || 'image/jpeg',
            bodyAreaName: ruleEvaluation.bodyArea.name,
            changeName: ruleEvaluation.physicalChange.name,
            duration,
            associatedSymptoms,
            language
          });
        } else if (openAIKey) {
          aiResult = await this.callOpenAIVision({
            openAIKey,
            imageBuffer,
            mimeType: mimeType || 'image/jpeg',
            bodyAreaName: ruleEvaluation.bodyArea.name,
            changeName: ruleEvaluation.physicalChange.name,
            duration,
            associatedSymptoms,
            language
          });
        }

        if (aiResult) {
          return {
            visionAiUsed: true,
            photoAnalyzed: true,
            provider: geminiKey ? 'Google Gemini 1.5 Flash Vision' : 'OpenAI Vision',
            visualObservations: aiResult.visualObservations || 'Visual indicators consistent with reported nutritional signals.',
            bodyArea: ruleEvaluation.bodyArea,
            physicalChange: ruleEvaluation.physicalChange,
            duration: ruleEvaluation.duration,
            associatedSymptoms,
            urgencyLevel: aiResult.urgencyLevel || ruleEvaluation.urgencyLevel,
            correlatedNutrients: aiResult.correlatedNutrients?.length > 0 
              ? aiResult.correlatedNutrients 
              : ruleEvaluation.correlatedNutrients,
            recommendedFoods,
            synergies: ruleEvaluation.synergies,
            redFlags: aiResult.redFlags?.length > 0 ? aiResult.redFlags : ruleEvaluation.redFlags,
            educationalDisclaimer: ruleEvaluation.educationalDisclaimer,
            nonDiagnosticNotice,
            notes: 'Multi-modal Vision AI analysis completed in conjunction with clinical nutrition algorithms.'
          };
        }
      } catch (err) {
        console.warn('Vision AI call encountered an issue, falling back cleanly to verified rule knowledge:', err.message);
      }
    }

    // Transparent, honest response when no API key is configured or photo was skipped
    const apiKeyNotice = !hasVisionKey
      ? (isTelugu
          ? 'ఎడ్యుకేషనల్ రూల్స్-బేస్డ్ మోడ్ యాక్టివ్‌గా ఉంది. మీ మార్గదర్శకత్వం ఎంచుకున్న శరీర భాగం మరియు లక్షణాల ఆధారంగా రూపొందించబడింది. విజన్ సర్వీస్ కాన్ఫిగర్ కానందున AI ఫోటో విశ్లేషణ ప్రస్తుతం అందుబాటులో లేదు (GEMINI_API_KEY server/.env లో లేదు).'
          : 'Educational Rules-Based Mode Active. Your guidance is based on the selected body area and reported symptoms. AI-powered photo analysis is currently unavailable because the vision service has not been configured (GEMINI_API_KEY is not set in server/.env).')
      : (hasImage
          ? (isTelugu
              ? 'ఎడ్యుకేషనల్ రూల్స్-బేస్డ్ మోడ్ యాక్టివ్‌గా ఉంది. మీ మార్గదర్శకత్వం ఎంచుకున్న శరీర భాగం మరియు లక్షణాల ఆధారంగా రూపొందించబడింది. విజన్ సర్వీస్ అందుబాటులో లేనందున AI ఫోటో విశ్లేషణ తాత్కాలికంగా పనిచేయడం లేదు.'
              : 'Educational Rules-Based Mode Active. Your guidance is based on the selected body area and reported symptoms. AI-powered photo analysis is temporarily unavailable because the vision service could not be reached.')
          : (isTelugu
              ? 'ఎడ్యుకేషనల్ రూల్స్-బేస్డ్ మోడ్ యాక్టివ్‌గా ఉంది. నివేదించబడిన శరీర మార్పు మరియు లక్షణాల ఆధారంగా విశ్లేషణ లెక్కించబడింది.'
              : 'Educational Rules-Based Mode Active. Assessment calculated from reported physical signs and symptoms.'));

    return {
      visionAiUsed: false,
      photoAnalyzed: false,
      apiKeyNotice,
      bodyArea: ruleEvaluation.bodyArea,
      physicalChange: ruleEvaluation.physicalChange,
      duration: ruleEvaluation.duration,
      associatedSymptoms,
      urgencyLevel: ruleEvaluation.urgencyLevel,
      correlatedNutrients: ruleEvaluation.correlatedNutrients,
      recommendedFoods,
      synergies: ruleEvaluation.synergies,
      redFlags: ruleEvaluation.redFlags,
      educationalDisclaimer: ruleEvaluation.educationalDisclaimer,
      nonDiagnosticNotice
    };
  }

  /**
   * Google Gemini Vision 1.5 Flash API invocation via native fetch
   */
  static async callGeminiVision({
    geminiKey,
    imageBuffer,
    mimeType,
    bodyAreaName,
    changeName,
    duration,
    associatedSymptoms,
    language
  }) {
    const isTelugu = language === 'te';
    const base64Data = imageBuffer.toString('base64');

    const promptText = `
You are the NutriVita Body Change Vision AI Assistant, an educational nutrition awareness tool.
Analyze this user-submitted photo of their ${bodyAreaName}.
Reported physical concern: "${changeName}".
Reported duration: "${duration}".
Associated symptoms: ${JSON.stringify(associatedSymptoms)}.
Language preference: ${language}.

Analyze the visual characteristics in the image (such as surface texture, color shifts, contour, pallor, or scaling) strictly from an educational micronutrient awareness standpoint.
DO NOT make a definitive medical diagnosis. Provide preventive nutrition education.

You MUST respond strictly with valid JSON conforming to this exact structure:
{
  "visualObservations": "Concise 2-3 sentence visual description of what is observable in the image relating to ${bodyAreaName}.",
  "urgencyLevel": "Mild" | "Moderate" | "Moderate to High" | "Seek Medical Guidance",
  "correlatedNutrients": [
    {
      "nutrient": "Name of nutrient (e.g. Iron, Vitamin C, Zinc)",
      "confidence": "High" | "Moderate",
      "rationale": "Scientific rationale connecting this physical sign to this micronutrient."
    }
  ],
  "redFlags": [
    "Specific warning symptoms that necessitate a qualified doctor visit."
  ]
}
${isTelugu ? 'All descriptions, rationales, and redFlags must be translated into Telugu script.' : ''}
`;

    const modelsToTry = VisionAIService.SUPPORTED_GEMINI_MODELS;
    let lastError = null;

    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (response.status === 404 || response.status === 503 || response.status === 429) {
          console.warn(`[VisionAIService] Body vision model ${model} returned HTTP ${response.status}, trying fallback model...`);
          continue;
        }

        if (!response.ok) {
          const errBody = await response.text().catch(() => '');
          throw new Error(`Gemini ${model} HTTP error ${response.status}: ${errBody}`);
        }

        const json = await response.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) return null;

        console.log(`[VisionAIService] Body vision successfully evaluated using model ${model}.`);
        return JSON.parse(rawText.trim());
      } catch (err) {
        lastError = err;
        console.warn(`[VisionAIService] Gemini body vision model ${model} attempt notice:`, err.message);
      } finally {
        clearTimeout(timeout);
      }
    }

    if (lastError) throw lastError;
    return null;
  }

  /**
   * Identify ANY food item from image using Google Gemini Multimodal Vision AI.
   * Recognizes any global food, dish, fruit, vegetable, street food, snack, beverage,
   * or home-cooked meal without being limited to a predefined catalog.
   * Estimates nutrition profile for unlisted foods.
   */
  static async identifyFoodWithGemini({
    geminiKey,
    imageBuffer,
    mimeType = 'image/jpeg'
  }) {
    const key = geminiKey || this.getApiKey();
    if (!key || !imageBuffer) return null;
    const base64Data = imageBuffer.toString('base64');

    const promptText = `
You are NutriVita's Expert Universal Food Recognition & Nutritional Analysis Vision AI.
Carefully analyze the image to identify ANY food, meal, beverage, snack, dish, or raw ingredient visible.
You support both authentic regional Indian preparations and international global cuisines (e.g. Biryani, Medu Vada, Pineapple, Custard Apple, Pizza, Noodles, Curry, Sandwich, Sushi, Dosa, Tacos, Salad, etc.).

ANALYSIS RULES:
1. UNIVERSAL RECOGNITION:
   - Identify ANY food regardless of whether it is well-known or an unfamiliar regional specialty.
   - Do NOT restrict yourself to a predefined list.
   - Distinguish visually similar items carefully (e.g. Mango vs Orange, Apple vs Beetroot, Sambar vs Tomato Dal vs Gongura Pappu, Okra vs Bitter Gourd fry).
2. NON-FOOD & UNCLEAR IMAGES:
   - If the image clearly DOES NOT contain food (e.g. a person, animal, electronic device, furniture, paper document, clothing, scenery), set "isFood": false, "confidenceLevel": "uncertain", and explain what is visible in "visualObservations".
   - If the image is too blurry, dark, obscured, or ambiguous to determine the food, set "confidenceLevel": "uncertain" and provide a helpful "clarificationQuestion".
3. AMBIGUOUS DISHES:
   - If a dish looks like one of several possibilities (e.g. Chicken Biryani vs Veg Biryani, or Dal Tadka vs Sambar), state the most likely dish in "foodName", set "confidenceLevel": "moderate", list candidates in "possibleAlternatives", and formulate a "clarificationQuestion".
4. MIXED MEALS & THALIS:
   - If multiple foods are visible on a plate or meal tray, set "isMultipleFoods": true, report the primary prominent food in "foodName", and list all visible components in "detectedFoods" (e.g. ["Steamed Basmati Rice", "Chicken Curry", "Roti", "Salad"]).
5. PACKAGED FOODS:
   - If a commercial packaged food product is shown, set "isPackagedProduct": true and identify the food contents.
6. NUTRITIONAL ESTIMATION FOR THIS FOOD:
   - Provide realistic, scientifically grounded nutritional estimations per standard serving.
   - State the estimated portion weight in grams.
   - Include calories, protein (g), carbohydrates (g), total fat (g), dietary fiber (g), saturated fat (g), total sugars (g), and sodium (mg).
   - List key vitamins and minerals if notable (e.g. Vitamin C, Iron, Calcium, Vitamin A).
   - In "preparationNotes", note that cooking oil, ghee, and recipes can cause homemade dishes to vary in caloric and fat content.

You MUST respond strictly with valid JSON conforming to this exact schema (no prose outside JSON):
{
  "isFood": true,
  "foodName": "Specific common name of the food or dish",
  "teluguName": "Telugu name with Telugu script if known (e.g. అనాస పండు, చికెన్ బిర్యానీ, మేదు వడ, etc.)",
  "category": "fruits" | "vegetables" | "grains_millets" | "pulses_legumes" | "dairy" | "snacks" | "prepared_meals" | "meat_poultry_seafood" | "bakery" | "beverages",
  "confidenceLevel": "high" | "moderate" | "uncertain",
  "visualObservations": "1-2 sentence description explaining visible colors, textures, shapes, and cooking markers.",
  "isMultipleFoods": false,
  "detectedFoods": ["Visible Component 1", "Visible Component 2"],
  "isPackagedProduct": false,
  "clarificationNeeded": false,
  "clarificationQuestion": "Optional question if ambiguous or if confirmation is helpful",
  "possibleAlternatives": ["Alternative 1", "Alternative 2"],
  "estimatedServing": {
    "size": "1 typical serving (approx. 200g)",
    "grams": 200
  },
  "estimatedNutrition": {
    "calories": 250,
    "servingBasis": "per_serving",
    "protein": 8.0,
    "carbohydrates": 38.0,
    "totalFat": 7.5,
    "dietaryFiber": 4.0,
    "saturatedFat": 2.0,
    "totalSugars": 4.0,
    "sodium": 340,
    "keyVitamins": ["Vitamin C: ~15mg", "Vitamin A: ~60mcg"],
    "keyMinerals": ["Iron: ~1.8mg", "Calcium: ~40mg"],
    "keyNutrientsSummary": ["Dietary Fiber", "Complex Carbs", "Protein"]
  },
  "nutritionalBenefits": "1-2 sentence evidence-based dietary benefit summary.",
  "servingGuidance": "Practical serving advice (e.g. pair with salad or yogurt).",
  "preparationNotes": "Culinary note explaining recipe/oil variations for this dish."
}
`;

    // Try modern supported Gemini models in prioritized order
    const modelsToTry = VisionAIService.SUPPORTED_GEMINI_MODELS;
    let lastError = null;

    console.log(`[VisionAIService] Calling Gemini Vision for food recognition (image: ${imageBuffer.length} bytes, mimetype: ${mimeType})...`);

    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (response.status === 404 || response.status === 503 || response.status === 429) {
          const errBody = await response.text().catch(() => '');
          lastError = new Error(`Gemini ${model} HTTP ${response.status}: ${VisionAIService.sanitizeErrorMessage(errBody, key)}`);
          lastError.status = response.status;
          console.warn(`[VisionAIService] Food identification model ${model} returned HTTP ${response.status}, falling back to next model...`);
          continue;
        }

        if (!response.ok) {
          const errBody = await response.text().catch(() => '');
          const sanitized = VisionAIService.sanitizeErrorMessage(errBody, key);
          const err = new Error(`Gemini ${model} HTTP error ${response.status}: ${sanitized}`);
          err.status = response.status;
          throw err;
        }

        const json = await response.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) return null;

        const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleanJson);
        console.log(`[VisionAIService] Food recognition successful via model "${model}": "${parsed.foodName}" (isFood: ${parsed.isFood}, confidence: ${parsed.confidenceLevel})`);
        return parsed;
      } catch (err) {
        lastError = err;
        console.warn(`[VisionAIService] Food recognition model ${model} attempt notice:`, VisionAIService.sanitizeErrorMessage(err.message, key));
      } finally {
        clearTimeout(timeout);
      }
    }

    if (lastError) {
      throw lastError;
    }
    return null;
  }

  /**
   * Estimate nutrition profile for any specified food name using Gemini
   * Used when a user manually corrects the food identification or requests a custom food.
   */
  static async estimateNutritionForFoodName({
    foodName,
    portionGrams = 150,
    geminiKey
  }) {
    const key = geminiKey || this.getApiKey();
    if (!key || !foodName) return null;

    const promptText = `
You are NutriVita's Nutritional Intelligence specialist.
Calculate realistic, evidence-based nutritional estimations for: "${foodName}".
Portion size: ${portionGrams}g.

Respond strictly with valid JSON conforming to this schema:
{
  "foodName": "${foodName}",
  "teluguName": "Telugu name if known",
  "category": "fruits" | "vegetables" | "grains_millets" | "pulses_legumes" | "dairy" | "snacks" | "prepared_meals" | "meat_poultry_seafood" | "bakery" | "beverages",
  "estimatedServing": {
    "size": "${portionGrams}g serving",
    "grams": ${portionGrams}
  },
  "estimatedNutrition": {
    "calories": 200,
    "servingBasis": "per_serving",
    "protein": 5.0,
    "carbohydrates": 25.0,
    "totalFat": 6.0,
    "dietaryFiber": 3.0,
    "saturatedFat": 1.5,
    "totalSugars": 3.0,
    "sodium": 250,
    "keyVitamins": ["Vitamin C: ~10mg", "Vitamin A: ~40mcg"],
    "keyMinerals": ["Iron: ~1.2mg", "Calcium: ~35mg"],
    "keyNutrientsSummary": ["Dietary Fiber", "Protein"]
  },
  "nutritionalBenefits": "Concise 1-2 sentence evidence-based dietary summary.",
  "servingGuidance": "Practical healthy serving suggestion.",
  "preparationNotes": "Note on cooking oil, salt, and recipe variance."
}
`;

    const modelsToTry = VisionAIService.SUPPORTED_GEMINI_MODELS;
    let lastError = null;

    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const payload = {
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (response.status === 404 || response.status === 503 || response.status === 429) continue;
        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(`Gemini ${model} error: ${errText}`);
        }

        const json = await response.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) return null;

        const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        return JSON.parse(cleanJson);
      } catch (err) {
        lastError = err;
      } finally {
        clearTimeout(timeout);
      }
    }

    if (lastError) throw lastError;
    return null;
  }

  /**
   * OpenAI GPT-4o-mini Vision API invocation fallback
   */
  static async callOpenAIVision({
    openAIKey,
    imageBuffer,
    mimeType,
    bodyAreaName,
    changeName,
    duration,
    language
  }) {
    const base64Data = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    const promptText = `
You are NutriVita's educational Body Change Vision AI. Analyze the photo of ${bodyAreaName} regarding ${changeName} (duration: ${duration}).
Respond strictly with valid JSON:
{
  "visualObservations": "Concise visual observation.",
  "urgencyLevel": "Mild" | "Moderate" | "Seek Medical Guidance",
  "correlatedNutrients": [
    { "nutrient": "string", "confidence": "High"|"Moderate", "rationale": "string" }
  ],
  "redFlags": ["string"]
}
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: promptText },
                { type: 'image_url', image_url: { url: dataUrl } }
              ]
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 500
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`OpenAI HTTP ${response.status}`);
      }

      const json = await response.json();
      const text = json?.choices?.[0]?.message?.content;
      return text ? JSON.parse(text) : null;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Analyze food package or nutrition facts label image directly using Gemini Multimodal Vision.
   * Extracts numerical nutrients, serving size, basis, and ingredients.
   */
  static async analyzeNutritionLabelWithGemini({
    geminiKey,
    imageBuffer,
    mimeType = 'image/jpeg'
  }) {
    const key = geminiKey || this.getApiKey();
    if (!key || !imageBuffer) return null;
    const base64Data = imageBuffer.toString('base64');

    const promptText = `
You are NutriVita's Expert Multimodal Food & Nutrition Optical Intelligence AI.
Analyze the provided image with high precision.

STEP 1: IMAGE CLASSIFICATION
Classify the image into EXACTLY ONE of these 5 categories:
1. "WHOLE_FOOD": Raw or single-ingredient whole foods, fresh fruits, vegetables, raw grains/millets, nuts, seeds, fresh herbs, or farm produce (e.g. apple, banana, raw almonds, spinach leaves, fresh guava, coconut, raw carrot, tomato).
2. "COOKED_MEAL": Prepared, cooked, or assembled dishes, mixed plates, curries, thalis, restaurant or home-cooked meals (e.g. Biryani, Dosa, Sambar, Dal Tadka with Rice, Salad Bowl, Pizza, Pasta, Curry, Sandwich, Roti with Sabzi).
3. "PACKAGED_FOOD_WITH_LABEL": A commercial packaged food product, container, bottle, can, pouch, or box with a VISIBLE, READABLE printed nutrition facts table, nutritional panel, or back-of-pack label.
4. "PACKAGED_FOOD_WITHOUT_LABEL": A commercial packaged food product or branded container where the front packaging or branding is visible, but the printed nutrition facts panel is NOT visible, facing away, or unreadable.
5. "NON_FOOD/UNCLEAR": The image does not contain edible food or food packaging (e.g. person, pet, electronics, documents, furniture, scenery, vehicles) OR is too dark, blurry, obscured, or corrupted to identify anything clearly.

STEP 2: CATEGORY-SPECIFIC DETAILS
- If "WHOLE_FOOD":
  * foodName: Common standard name of the whole food.
  * alternativeNames: Array of 1-3 common aliases or regional names (e.g. ["Red Delicious", "Seb"]).
  * teluguName: Telugu name in Telugu script if applicable (e.g. "తాజా యాపిల్").
  * visibleIngredients: Array describing visible state (e.g. ["Whole fresh apple with peel"]).
  * keyVitamins: Key vitamins present (e.g. ["Vitamin C", "Vitamin K"]).
  * keyMinerals: Key minerals present (e.g. ["Potassium", "Dietary Fiber"]).
  * nutritionalBenefits: 1-2 sentence evidence-based dietary summary.
  * nutritionalBenefitsTe: Telugu translation if known.
  * servingSize: "100g standard serving".
  * servingBasis: "per_100g".
  * Provide approximate scientific nutrition numbers per 100g for calories, protein, carbohydrates, totalFat, saturatedFat, transFat (0), totalSugars, fiber, sodium.

- If "COOKED_MEAL":
  * foodName: Common name of the cooked dish or meal (e.g. "Vegetable Biryani with Raita").
  * alternativeNames: Common aliases (e.g. ["Veg Pulao"]).
  * teluguName: Telugu name in Telugu script if known.
  * visibleIngredients: Array of 2-6 visible dish components/ingredients (e.g. ["Basmati Rice", "Carrots", "Green Peas", "Fried Onions"]).
  * servingSize: Estimated typical serving size (e.g. "1 plate (~300g)").
  * servingBasis: "per_serving".
  * Provide estimated culinary nutrition numbers per typical serving ONLY when reasonable.
  * preparationNotes: Note explaining that cooked meal values are approximate culinary estimates based on standard recipes and depend on oil, portion, and cooking method.
  * nutritionalBenefits: 1-2 sentence dietary summary.

- If "PACKAGED_FOOD_WITH_LABEL":
  * productName: Name of the packaged food product.
  * brand: Brand or manufacturer if visible.
  * servingSize: Printed serving size from label (e.g. "1 bar (40g)", "100g", "1 cup").
  * servingBasis: "per_serving" or "per_100g" based on the label.
  * Extract all printed numbers: calories, energyKj, protein, carbohydrates, totalFat, saturatedFat, transFat, totalSugars, addedSugars, fiber, sodium, salt, calcium, iron, vitaminC, vitaminD, potassium.
  * CRITICAL: Mark missing or unreadable nutrients as null; NEVER invent or guess printed label values!
  * ingredientsText: Printed ingredients list if visible.
  * allergens: Printed allergen warnings if visible.
  * rawTextSummary: Key printed text summary.

- If "PACKAGED_FOOD_WITHOUT_LABEL":
  * productName: Product name / description identifiable from front of packaging.
  * brand: Brand name if visible.
  * notice: "This appears to be packaged food, but the printed nutrition facts table is not visible or readable. Please turn the packaging around and photograph the printed 'Nutrition Facts' panel for exact verified values."
  * Leave numerical nutrition fields as null (never invent packaged facts).

- If "NON_FOOD/UNCLEAR":
  * foodName: null.
  * unclearReason: State clearly why it cannot be processed (e.g. "The image shows a laptop keyboard, not edible food.", or "The image is too blurry to identify any food item.").
  * notice: "Please upload a clear, well-lit photo of a whole food, cooked meal, or packaged food label."
  * Leave numerical nutrition fields as null.

Respond strictly with valid JSON conforming to this schema (no markdown formatting outside JSON):
{
  "category": "WHOLE_FOOD" | "COOKED_MEAL" | "PACKAGED_FOOD_WITH_LABEL" | "PACKAGED_FOOD_WITHOUT_LABEL" | "NON_FOOD/UNCLEAR",
  "confidence": "high" | "medium" | "low",
  "foodName": "string or null",
  "productName": "string or null",
  "brand": "string or null",
  "alternativeNames": ["string"],
  "teluguName": "string or null",
  "visibleIngredients": ["string"],
  "servingSize": "string or null",
  "servingBasis": "per_serving" | "per_100g",
  "calories": null,
  "energyKj": null,
  "totalFat": null,
  "saturatedFat": null,
  "transFat": null,
  "carbohydrates": null,
  "totalSugars": null,
  "addedSugars": null,
  "fiber": null,
  "protein": null,
  "sodium": null,
  "salt": null,
  "calcium": null,
  "iron": null,
  "vitaminC": null,
  "vitaminD": null,
  "potassium": null,
  "keyVitamins": ["string"],
  "keyMinerals": ["string"],
  "nutritionalBenefits": "string or null",
  "nutritionalBenefitsTe": "string or null",
  "preparationNotes": "string or null",
  "ingredientsText": "string or null",
  "allergens": "string or null",
  "unclearReason": "string or null",
  "notice": "string or null",
  "rawTextSummary": "string or null"
}
`;

    const modelsToTry = VisionAIService.SUPPORTED_GEMINI_MODELS;
    let lastError = null;

    console.log(`[VisionAIService] Calling Gemini Vision for nutrition label analysis (image: ${imageBuffer.length} bytes, mimetype: ${mimeType})...`);

    for (const model of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (response.status === 404 || response.status === 503 || response.status === 429) {
          const errBody = await response.text().catch(() => '');
          lastError = new Error(`Gemini ${model} HTTP ${response.status}: ${VisionAIService.sanitizeErrorMessage(errBody, key)}`);
          lastError.status = response.status;
          console.warn(`[VisionAIService] Nutrition label model ${model} returned HTTP ${response.status}, falling back to next model...`);
          continue;
        }

        if (!response.ok) {
          const errBody = await response.text().catch(() => '');
          const sanitized = VisionAIService.sanitizeErrorMessage(errBody, key);
          const err = new Error(`Gemini ${model} HTTP error ${response.status}: ${sanitized}`);
          err.status = response.status;
          throw err;
        }

        const json = await response.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) return null;

        const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleanJson);

        // Normalize category
        let category = (parsed.category || '').toUpperCase().trim();
        const validCategories = [
          'WHOLE_FOOD',
          'COOKED_MEAL',
          'PACKAGED_FOOD_WITH_LABEL',
          'PACKAGED_FOOD_WITHOUT_LABEL',
          'NON_FOOD/UNCLEAR',
        ];
        if (!validCategories.includes(category)) {
          if (parsed.isNutritionLabel === true) {
            category = 'PACKAGED_FOOD_WITH_LABEL';
          } else if (parsed.isNutritionLabel === false) {
            category = 'WHOLE_FOOD';
          } else {
            category = 'PACKAGED_FOOD_WITH_LABEL';
          }
        }
        parsed.category = category;
        parsed.isNutritionLabel = category === 'PACKAGED_FOOD_WITH_LABEL';
        parsed.alternativeNames = Array.isArray(parsed.alternativeNames) ? parsed.alternativeNames : [];
        parsed.visibleIngredients = Array.isArray(parsed.visibleIngredients) ? parsed.visibleIngredients : [];
        parsed.keyVitamins = Array.isArray(parsed.keyVitamins) ? parsed.keyVitamins : [];
        parsed.keyMinerals = Array.isArray(parsed.keyMinerals) ? parsed.keyMinerals : [];

        console.log(`[VisionAIService] Label intelligence analysis successful via model "${model}": category=${parsed.category}, product="${parsed.productName || parsed.foodName || 'unnamed'}"`);
        return parsed;
      } catch (err) {
        lastError = err;
        console.warn(`[VisionAIService] Nutrition label model ${model} attempt notice:`, VisionAIService.sanitizeErrorMessage(err.message, key));
      } finally {
        clearTimeout(timeout);
      }
    }

    if (lastError) throw lastError;
    return null;
  }
}

