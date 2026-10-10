import { VisionAIService } from '../services/visionAIService.js';
import { BODY_AREAS } from '../data/bodyChangeKnowledge.js';

// @desc    Get all available body areas and curated observable changes
// @route   GET /api/body-analyzer/areas
// @access  Public
export const getBodyAreas = async (req, res, next) => {
  try {
    const { language = 'en' } = req.query;
    const isTelugu = language === 'te';

    const formattedAreas = BODY_AREAS.map((area) => ({
      id: area.id,
      name: isTelugu ? area.nameTe : area.nameEn,
      nameEn: area.nameEn,
      nameTe: area.nameTe,
      icon: area.icon,
      description: isTelugu ? area.descriptionTe : area.descriptionEn,
      changes: area.changes.map((c) => ({
        id: c.id,
        name: isTelugu ? c.nameTe : c.nameEn,
        nameEn: c.nameEn,
        nameTe: c.nameTe,
        description: isTelugu ? c.descriptionTe : c.descriptionEn,
        severity: c.severity,
      })),
    }));

    res.status(200).json({
      success: true,
      count: formattedAreas.length,
      data: formattedAreas,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Assess physical body change with optional photo and Vision AI
// @route   POST /api/body-analyzer/assess
// @access  Public
export const assessBodyChange = async (req, res, next) => {
  try {
    const {
      bodyArea,
      physicalChange,
      duration = '1_to_4_weeks',
      associatedSymptoms,
      language = 'en',
    } = req.body;

    if (!bodyArea || !physicalChange) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both bodyArea and physicalChange to perform assessment.',
      });
    }

    let parsedSymptoms = [];
    if (associatedSymptoms) {
      if (Array.isArray(associatedSymptoms)) {
        parsedSymptoms = associatedSymptoms;
      } else if (typeof associatedSymptoms === 'string') {
        try {
          parsedSymptoms = JSON.parse(associatedSymptoms);
        } catch {
          parsedSymptoms = associatedSymptoms.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    const imageBuffer = req.file?.buffer;
    const mimeType = req.file?.mimetype;

    const assessment = await VisionAIService.assess({
      imageBuffer,
      mimeType,
      bodyAreaId: bodyArea,
      changeId: physicalChange,
      duration,
      associatedSymptoms: parsedSymptoms,
      language,
    });

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get status of vision AI and body change analyzer
// @route   GET /api/body-analyzer/status
// @access  Public
export const getBodyAnalyzerStatus = async (req, res, next) => {
  try {
    const health = await VisionAIService.checkVisionHealth();
    res.status(200).json({
      success: true,
      visionAiConfigured: health.configured,
      visionAiReachable: health.reachable,
      status: health.status,
      message: health.message,
      provider: health.provider,
      modes: [
        {
          id: 'vision_ai',
          name: 'Multimodal Vision AI',
          provider: health.provider || 'Google Gemini 1.5 Flash',
          status: health.reachable ? 'active' : (health.configured ? 'error' : 'unconfigured'),
          description: health.reachable
            ? 'Analyzes visual physical signs directly using multimodal neural models.'
            : 'Analyzes visual physical signs directly using multimodal neural models. Requires reachable GEMINI_API_KEY in server/.env.'
        },
        {
          id: 'clinical_engine',
          name: 'Clinical Nutrition Rules Engine',
          provider: 'Evidence-Based Nutrition Engine',
          status: 'active',
          description: 'Deterministic evidence-based algorithm mapping selected body signs and symptoms to correlated micronutrient deficiencies.'
        },
        {
          id: 'reference_db',
          name: 'NutriVita Reference Food Database',
          provider: 'Local Verified Clinical Dataset',
          status: 'active',
          description: 'Provides verified reference nutrition per 100g for 53 whole foods to recommend dietary replenishment.'
        },
        {
          id: 'label_ocr',
          name: 'Nutrition Label OCR',
          provider: 'Tesseract.js',
          status: 'active',
          description: 'Runs client-side optical character recognition in Label Lens.'
        },
        {
          id: 'manual_entry',
          name: 'Manual Physical Sign Entry',
          provider: 'User Input',
          status: 'active',
          description: 'Enables direct selection of physical changes without photo upload.'
        }
      ]
    });
  } catch (error) {
    next(error);
  }
};

