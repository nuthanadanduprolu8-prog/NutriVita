import { memoryStore } from '../config/db.js';
import { symptomCategories } from '../data/symptomsData.js';
import AssessmentModel from '../models/Assessment.js';

const CSP_DISCLAIMER_EN = 'This tool provides educational nutrition guidance only. Symptoms can have many causes and cannot confirm a vitamin or mineral deficiency. Nutrition information cannot replace medical diagnosis or laboratory testing.';
const CSP_DISCLAIMER_TE = 'ఈ సాధనం నివారణ పోషకాహార అవగాహన మరియు విద్యను మాత్రమే అందిస్తుంది. లక్షణాలకు అనేక కారణాలు ఉండవచ్చు మరియు అవి విటమిన్ లేదా ఖనిజ లోపాన్ని నిర్ధారించలేవు. ఈ సమాచారం వైద్య పరీక్షలకు లేదా నిర్ధారణకు ప్రత్యామ్నాయం కాదు.';

const SAFETY_GUIDANCE_EN = {
  title: 'When to Seek Professional Medical Advice',
  guidance: 'Nutritional adjustments are preventive. You should consult a qualified physician or healthcare professional if your symptoms:',
  redFlags: [
    'Are severe, sudden, or rapidly worsening',
    'Persist for several weeks without noticeable improvement',
    'Interfere with everyday activities, work, or sleep',
    'Are accompanied by chest pain, shortness of breath, unexplained weight loss, or persistent fever'
  ],
  recommendation: 'Ask your healthcare provider about comprehensive clinical laboratory testing (such as Complete Blood Count / CBC, Serum Ferritin, 25-OH Vitamin D, or Serum B12) to receive an accurate medical diagnosis.'
};

const SAFETY_GUIDANCE_TE = {
  title: 'ఎప్పుడు వైద్యుడిని సంప్రదించాలి?',
  guidance: 'పోషకాహార సిఫార్సులు నివారణ కోసం మాత్రమే. మీ లక్షణాలు క్రింది విధంగా ఉంటే దయచేసి అర్హత కలిగిన వైద్యులను సంప్రదించండి:',
  redFlags: [
    'తీవ్రంగా, ఆకస్మికంగా లేదా వేగంగా పెరుగుతుంటే',
    'కొన్ని వారాల పాటు తగ్గకుండా నిరంతరం కొనసాగుతుంటే',
    'రోజువారీ పనులు, ఉద్యోగం లేదా నిద్రకు ఆటంకం కలిగిస్తుంటే',
    'ఛాతీ నొప్పి, శ్వాస ఆడకపోవడం, ఆకస్మిక బరువు తగ్గడం లేదా నిరంతర జ్వరంతో కూడి ఉంటే'
  ],
  recommendation: 'సరైన వైద్య నిర్ధారణ కోసం పూర్తి రక్త పరీక్ష (CBC), సీరం ఫెర్రిటిన్, విటమిన్ డి లేదా విటమిన్ బి12 ల్యాబ్ పరీక్షల గురించి మీ వైద్యుడితో చర్చించండి.'
};

// @desc    Get all available symptoms with category filtering & search
// @route   GET /api/symptoms
// @access  Public
export const getSymptoms = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let list = [...memoryStore.symptoms];

    if (category && category !== 'all') {
      list = list.filter(s => s.category === category);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(s =>
        s.titleEn.toLowerCase().includes(q) ||
        s.titleTe.toLowerCase().includes(q) ||
        s.symptomId.toLowerCase().includes(q) ||
        (s.shortDescriptionEn && s.shortDescriptionEn.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: list.length,
      categories: symptomCategories,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single symptom by ID with populated details
// @route   GET /api/symptoms/:id
// @access  Public
export const getSymptomById = async (req, res, next) => {
  try {
    const symptom = memoryStore.symptoms.find(
      s => s.symptomId === req.params.id || s.id === req.params.id
    );

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: `Symptom with ID '${req.params.id}' not found.`,
      });
    }

    // Populate associated vitamins details
    const populatedVitamins = (symptom.associatedDeficiencies || []).map(item => {
      const vit = memoryStore.vitamins.find(v => v.vitaminId === item.vitaminId);
      return {
        vitaminId: item.vitaminId,
        likelihoodWeight: item.likelihoodWeight,
        nameEn: vit?.nameEn || item.vitaminId,
        nameTe: vit?.nameTe || item.vitaminId,
        type: vit?.type || 'water_soluble',
      };
    });

    res.status(200).json({
      success: true,
      data: {
        ...symptom,
        associatedVitamins: populatedVitamins,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assess multiple symptoms and rank potential nutritional connections
// @route   POST /api/symptoms/assess
// @access  Public
export const assessSymptoms = async (req, res, next) => {
  try {
    const { symptoms, language = 'en', userId } = req.body;
    const isTelugu = language === 'te';

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one symptom to evaluate nutrition connections.',
      });
    }

    // Match symptoms against database
    const matchedSymptoms = symptoms
      .map(id => memoryStore.symptoms.find(s => s.symptomId === id || s.id === id))
      .filter(Boolean);

    if (matchedSymptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'None of the provided symptom IDs were recognized in the nutrition database.',
      });
    }

    // Accumulate nutrient connection weights
    const nutrientMap = {};

    for (const symptom of matchedSymptoms) {
      for (const assoc of symptom.associatedDeficiencies || []) {
        const vitId = assoc.vitaminId;
        if (!nutrientMap[vitId]) {
          nutrientMap[vitId] = {
            vitaminId: vitId,
            totalWeight: 0,
            matchCount: 0,
            matchingSymptoms: [],
          };
        }

        nutrientMap[vitId].totalWeight += assoc.likelihoodWeight;
        nutrientMap[vitId].matchCount += 1;
        nutrientMap[vitId].matchingSymptoms.push({
          id: symptom.symptomId,
          title: isTelugu ? symptom.titleTe : symptom.titleEn,
        });
      }
    }

    // Calculate normalized educational priority score and tiers
    const rankedConnections = Object.values(nutrientMap)
      .map(item => {
        const vitInfo = memoryStore.vitamins.find(v => v.vitaminId === item.vitaminId);
        
        // Bonus for multi-symptom convergence
        const compositeScore = Number((item.totalWeight * (1 + (item.matchCount - 1) * 0.25)).toFixed(2));
        
        let relevanceTier = 'low';
        let relevanceLabel = isTelugu ? 'స్వల్ప పోషకాహార ప్రాముఖ్యత' : 'Lower educational relevance';
        let badgeText = isTelugu ? 'స్వల్ప సంబంధం' : 'Slight Potential Link';

        if (item.matchCount >= 2 || compositeScore >= 1.5) {
          relevanceTier = 'high';
          relevanceLabel = isTelugu ? 'అధిక పోషకాహార ప్రాముఖ్యత' : 'High educational relevance';
          badgeText = isTelugu ? 'బలమైన సంబంధం' : 'Strong Potential Link';
        } else if (compositeScore >= 0.75) {
          relevanceTier = 'moderate';
          relevanceLabel = isTelugu ? 'మితమైన పోషకాహార ప్రాముఖ్యత' : 'Moderate educational relevance';
          badgeText = isTelugu ? 'మధ్యస్థ సంబంధం' : 'Moderate Potential Link';
        }

        const symptomNames = item.matchingSymptoms.map(s => s.title);
        const explanation = isTelugu
          ? `మీరు ఎంచుకున్న లక్షణాలు (${symptomNames.join(', ')}) ${vitInfo?.nameTe || item.vitaminId} తో పోషకాహార సంబంధాన్ని కలిగి ఉండే అవకాశం ఉంది.`
          : `Several selected symptoms (${symptomNames.join(', ')}) have documented nutritional associations with ${vitInfo?.nameEn || item.vitaminId}.`;

        // Fetch top matching whole foods
        const foodIds = vitInfo?.topFoodSources || [];
        const richFoods = foodIds
          .map(fId => memoryStore.foods.find(f => f.id === fId))
          .filter(Boolean)
          .slice(0, 4)
          .map(f => ({
            id: f.id,
            name: f.name,
            teluguName: f.teluguName,
            category: f.category,
            imageUrl: f.imageUrl,
            calories: f.calories,
            richIn: f.tags?.[0] || 'nutrient_dense',
          }));

        return {
          vitaminId: item.vitaminId,
          nameEn: vitInfo?.nameEn || item.vitaminId,
          nameTe: vitInfo?.nameTe || item.vitaminId,
          type: vitInfo?.type || 'water_soluble',
          rdaAdults: vitInfo?.rdaAdults || {},
          relevanceTier,
          relevanceLabel,
          badgeText,
          compositeScore,
          matchCount: item.matchCount,
          matchingSymptoms: item.matchingSymptoms,
          educationalExplanation: explanation,
          recommendedFoods: richFoods,
          synergisticPairs: vitInfo?.synergisticPairs || [],
        };
      })
      .sort((a, b) => b.compositeScore - a.compositeScore);

    // Save assessment to archive if user is specified
    const assessmentRecord = {
      id: 'assessment_' + Date.now(),
      userId: userId || 'guest_user',
      symptomsReported: matchedSymptoms.map(s => s.symptomId),
      detectedDeficiencies: rankedConnections.slice(0, 5).map(r => ({
        vitaminId: r.vitaminId,
        confidence: r.relevanceTier,
        score: r.compositeScore,
        primaryFoods: r.recommendedFoods.map(f => f.name),
      })),
      createdAt: new Date(),
    };

    memoryStore.assessments.push(assessmentRecord);

    res.status(200).json({
      success: true,
      assessmentId: assessmentRecord.id,
      selectedCount: matchedSymptoms.length,
      selectedSymptoms: matchedSymptoms.map(s => ({
        id: s.symptomId,
        title: isTelugu ? s.titleTe : s.titleEn,
        category: s.category,
      })),
      resultsCount: rankedConnections.length,
      nutritionConnections: rankedConnections,
      disclaimer: isTelugu ? CSP_DISCLAIMER_TE : CSP_DISCLAIMER_EN,
      safetyGuidance: isTelugu ? SAFETY_GUIDANCE_TE : SAFETY_GUIDANCE_EN,
    });
  } catch (error) {
    next(error);
  }
};
