import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle, 
  Info, 
  RotateCcw, 
  Edit3, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  Copy, 
  Check,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Apple,
  Search,
  Utensils,
  Package,
  Leaf
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import CameraModal from '../components/common/CameraModal';
import BackButton from '../components/common/BackButton';
import {
  parseNutritionText,
  calculateNutritionIndicators,
  calculateEducationalGrade,
  getEmptyNutritionValues
} from '../utils/nutritionLabelParser';
import scannerService from '../services/scannerService';
import foodService from '../services/foodService';

const VITAMIN_LABELS = {
  vitaminA: 'Vitamin A',
  vitaminB1: 'Vitamin B1 (Thiamine)',
  vitaminB2: 'Vitamin B2 (Riboflavin)',
  vitaminB3: 'Vitamin B3 (Niacin)',
  vitaminB6: 'Vitamin B6',
  vitaminB9: 'Vitamin B9 (Folate)',
  vitaminB12: 'Vitamin B12',
  vitaminC: 'Vitamin C',
  vitaminD: 'Vitamin D',
  vitaminE: 'Vitamin E',
  vitaminK: 'Vitamin K',
};

const MCG_VITAMINS = new Set(['vitaminA', 'vitaminB9', 'vitaminB12', 'vitaminD', 'vitaminK']);

export const formatVitaminsList = (vitamins) => {
  if (!vitamins) return ['Vitamin C', 'Dietary Fiber'];
  if (Array.isArray(vitamins)) {
    return vitamins.flatMap((item) => {
      if (typeof item === 'string') return [item];
      if (typeof item === 'object' && item !== null) {
        return Object.entries(item)
          .filter(([_, val]) => val !== null && val !== undefined && Number(val) > 0)
          .map(([k, val]) => {
            const name = VITAMIN_LABELS[k] || k.replace(/^vitamin([A-Z0-9]+)/i, 'Vitamin $1');
            const unit = MCG_VITAMINS.has(k) ? 'mcg' : 'mg';
            return `${name}: ${val} ${unit}`;
          });
      }
      return [String(item)];
    });
  }
  if (typeof vitamins === 'object') {
    const list = Object.entries(vitamins)
      .filter(([_, val]) => val !== null && val !== undefined && Number(val) > 0)
      .map(([k, val]) => {
        const name = VITAMIN_LABELS[k] || k.replace(/^vitamin([A-Z0-9]+)/i, 'Vitamin $1');
        const unit = MCG_VITAMINS.has(k) ? 'mcg' : 'mg';
        return `${name}: ${val} ${unit}`;
      });
    return list.length > 0 ? list : ['Multivitamins & Micronutrients'];
  }
  return [String(vitamins)];
};

const MINERAL_LABELS = {
  iron: 'Iron',
  calcium: 'Calcium',
  zinc: 'Zinc',
  magnesium: 'Magnesium',
  potassium: 'Potassium',
  sodium: 'Sodium',
  phosphorus: 'Phosphorus',
  selenium: 'Selenium',
  copper: 'Copper',
  manganese: 'Manganese',
};

export const formatMineralsList = (minerals) => {
  if (!minerals) return ['Potassium'];
  if (Array.isArray(minerals)) {
    return minerals.flatMap((item) => {
      if (typeof item === 'string') return [item];
      if (typeof item === 'object' && item !== null) {
        return Object.entries(item)
          .filter(([_, val]) => val !== null && val !== undefined && Number(val) > 0)
          .map(([k, val]) => `${MINERAL_LABELS[k] || k}: ${val} mg`);
      }
      return [String(item)];
    });
  }
  if (typeof minerals === 'object') {
    const list = Object.entries(minerals)
      .filter(([_, val]) => val !== null && val !== undefined && Number(val) > 0)
      .map(([k, val]) => `${MINERAL_LABELS[k] || (k.charAt(0).toUpperCase() + k.slice(1))}: ${val} mg`);
    return list.length > 0 ? list : Object.keys(minerals).filter(k => minerals[k]);
  }
  return [String(minerals)];
};

// Curated sample package nutrition labels for instant demonstration & testing
const SAMPLE_LABELS = [
  {
    id: 'oats',
    name: 'Rolled Oats (Healthy Balance)',
    teluguName: 'రోల్డ్ ఓట్స్ (సహజ సమతుల్యత)',
    type: 'wholesome',
    text: `Quaker Whole Rolled Oats
NUTRITION FACTS
Serving Size: 1/2 cup (40g)
Calories: 150 kcal
Total Fat: 3g
Saturated Fat: 0.5g
Trans Fat: 0g
Total Carbohydrate: 27g
Dietary Fiber: 4g
Total Sugars: 1g
Added Sugars: 0g
Protein: 5g
Sodium: 0mg
Iron: 1.8mg
Calcium: 20mg`
  },
  {
    id: 'juice',
    name: 'Sweetened Fruit Beverage',
    teluguName: 'తీపి పండ్ల రసం',
    type: 'sugary',
    text: `Mango Nectar Drink
NUTRITION INFORMATION
Serving Size: 1 bottle (300ml)
Calories: 160 kcal
Total Fat: 0g
Saturated Fat: 0g
Carbohydrates: 40g
Total Sugars: 36g
Added Sugars: 32g
Protein: 0g
Dietary Fiber: 0g
Sodium: 35mg`
  },
  {
    id: 'chips',
    name: 'Potato Crisps (High Sodium/Fat)',
    teluguName: 'బంగాళాదుంప చిప్స్ (అధిక సోడియం)',
    type: 'salty',
    text: `Classic Salted Potato Chips
NUTRITION FACTS
Serving Size: 1 bag (50g)
Calories: 270 kcal
Total Fat: 17g
Saturated Fat: 5g
Trans Fat: 0g
Total Carbohydrate: 26g
Dietary Fiber: 1.5g
Total Sugars: 1g
Protein: 3g
Sodium: 480mg`
  },
  {
    id: 'yogurt',
    name: 'Greek Yogurt (High Protein)',
    teluguName: 'గ్రీక్ పెరుగు (అధిక ప్రోటీన్)',
    type: 'protein',
    text: `Pure Natural Greek Yogurt
NUTRITION FACTS
Serving Size: 3/4 cup (170g)
Calories: 100 kcal
Total Fat: 0g
Saturated Fat: 0g
Total Carbohydrate: 6g
Total Sugars: 4g
Added Sugars: 0g
Protein: 18g
Sodium: 60mg
Calcium: 180mg`
  },
  {
    id: 'noodles',
    name: 'Instant Noodles (FSSAI Format)',
    teluguName: 'ఇన్‌స్టంట్ నూడుల్స్ (FSSAI ఫార్మాట్)',
    type: 'fssai',
    text: `Masala Instant Noodles
NUTRITIONAL INFORMATION PER 100g
Energy: 430 kcal
Protein: 8.0 g
Carbohydrate: 63.5 g
Total Sugars: 3.2 g
Added Sugars: 1.5 g
Total Fat: 16.0 g
Saturated Fat: 7.2 g
Trans Fat: 0.1 g
Sodium: 980 mg`
  }
];

const DEFAULT_POPULAR_FOODS = [
  { id: 'apple', name: 'Fresh Apple', teluguName: 'తాజా యాపిల్', calories: 52, category: 'fruits', servingSize: '100g' },
  { id: 'banana', name: 'Banana (Arati Pandu)', teluguName: 'అరటి పండు', calories: 89, category: 'fruits', servingSize: '100g' },
  { id: 'coconut', name: 'Coconut', teluguName: 'కొబ్బరి', calories: 354, category: 'nuts_seeds', servingSize: '100g' },
  { id: 'orange', name: 'Sweet Orange (Mosambi)', teluguName: 'బత్తాయి', calories: 43, category: 'fruits', servingSize: '100g' },
  { id: 'guava', name: 'Guava (Jama Pandu)', teluguName: 'జామ పండు', calories: 68, category: 'fruits', servingSize: '100g' },
  { id: 'carrot', name: 'Carrot', teluguName: 'క్యారెట్', calories: 41, category: 'vegetables', servingSize: '100g' },
  { id: 'spinach', name: 'Spinach (Palakura)', teluguName: 'పాలకూర', calories: 23, category: 'vegetables', servingSize: '100g' },
  { id: 'mango', name: 'Mango (Mamidi Pandu)', teluguName: 'మామిడి పండు', calories: 60, category: 'fruits', servingSize: '100g' },
];

const LabelLens = () => {
  const { t, language } = useLanguage();
  const isTelugu = language === 'te';

  // Overall workflow step: 'review' (form visible) | 'results' (calculated grade)
  const [activeStep, setActiveStep] = useState('review');

  // File & camera state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const fileInputRef = useRef(null);
  const activeScanIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  // OCR state
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrStep, setOcrStep] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [rawOcrText, setRawOcrText] = useState('');
  const [showRawOcr, setShowRawOcr] = useState(false);
  const [copiedOcr, setCopiedOcr] = useState(false);
  const [ocrError, setOcrError] = useState('');
  const [ocrConfidence, setOcrConfidence] = useState('none');
  const [categoryData, setCategoryData] = useState(null);

  // Editable fields and field statuses
  // field status: 'ocr' | 'user' | 'sample' | 'manual' | 'blank'
  const [reviewFields, setReviewFields] = useState({
    productName: '',
    brand: '',
    servingSize: '',
    servingBasis: 'per_serving',
    calories: '',
    energyKj: '',
    totalFat: '',
    saturatedFat: '',
    transFat: '',
    carbohydrates: '',
    totalSugars: '',
    addedSugars: '',
    fiber: '',
    protein: '',
    sodium: '',
    salt: '',
    ingredients: '',
    allergens: '',
    calcium: '',
    iron: '',
    vitaminC: '',
    vitaminD: '',
    potassium: '',
  });

  const [fieldOrigins, setFieldOrigins] = useState({});
  const [dataSource, setDataSource] = useState('manual'); // 'image' | 'sample' | 'manual'

  // Results & Analysis state
  const [nutritionValues, setNutritionValues] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [gradeInfo, setGradeInfo] = useState(null);
  const [showGradeDetails, setShowGradeDetails] = useState(false);

  // Assessment Mode, Whole-Food Quick-Select & Status state
  const [scannerStatus, setScannerStatus] = useState(null);
  const [showModesModal, setShowModesModal] = useState(false);
  const [identifiedFood, setIdentifiedFood] = useState(null);
  const [popularFoods, setPopularFoods] = useState(DEFAULT_POPULAR_FOODS);
  const [allFoodsList, setAllFoodsList] = useState([]);
  const [foodSearchTerm, setFoodSearchTerm] = useState('');

  // Fetch scanner status and popular whole foods on mount using centralized API client
  useEffect(() => {
    scannerService.getStatus()
      .then((data) => {
        if (data?.success) setScannerStatus(data);
      })
      .catch((err) => console.warn('Scanner status notice:', err.message || err));

    scannerService.getPopularFoods()
      .then((data) => {
        if (data?.success && data.data) setPopularFoods(data.data);
      })
      .catch((err) => console.warn('Popular foods notice:', err.message || err));

    foodService.getFoods({ limit: 100 })
      .then((data) => {
        if (data?.success && data.data) setAllFoodsList(data.data);
      })
      .catch((err) => console.warn('Foods catalog notice:', err.message || err));
  }, []);

  // Filter whole foods by search query
  const filteredWholeFoods = (allFoodsList || []).filter((f) => {
    if (!foodSearchTerm.trim()) return false;
    const term = foodSearchTerm.toLowerCase().trim();
    return (
      f.name?.toLowerCase().includes(term) ||
      f.teluguName?.toLowerCase().includes(term) ||
      f.id?.toLowerCase().includes(term)
    );
  });

  // Handle image selection
  const handleFileChange = (e) => {
    setOcrError('');
    setCategoryData(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setOcrError(t('labelLens.errorInvalidType') || 'Unsupported file format. Please upload JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setOcrError(t('labelLens.errorTooLarge') || 'Image size exceeds 10MB limit.');
      return;
    }

    const url = URL.createObjectURL(file);
    processImage(file, url);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setOcrError('');
    setCategoryData(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setOcrError(t('labelLens.errorInvalidType') || 'Unsupported file format. Please upload JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setOcrError(t('labelLens.errorTooLarge') || 'Image size exceeds 10MB limit.');
      return;
    }

    const url = URL.createObjectURL(file);
    processImage(file, url);
  };

  // Camera modal handler
  const handleOpenModalCamera = () => {
    setOcrError('');
    setCameraError('');
    setCategoryData(null);
    setCameraActive(true);
  };

  // Remove chosen image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setRawOcrText('');
    setOcrError('');
    setCameraError('');
    setCategoryData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Setup review state from extracted values
  const setupReviewFromParsed = (parsedValues, rawText, source = 'image', confidence = 'none') => {
    const fields = {};
    const origins = {};

    const stringKeys = ['productName', 'brand', 'servingSize', 'servingBasis', 'ingredients', 'allergens'];
    const numericKeys = [
      'calories', 'energyKj', 'totalFat', 'saturatedFat', 'transFat',
      'carbohydrates', 'totalSugars', 'addedSugars', 'fiber', 'protein',
      'sodium', 'salt', 'calcium', 'iron', 'vitaminC', 'vitaminD', 'potassium'
    ];

    const originType = source === 'manual' ? 'manual' : (source === 'sample' ? 'sample' : (source === 'reference' ? 'reference' : 'ocr'));

    stringKeys.forEach((key) => {
      const val = parsedValues[key];
      if (val) {
        fields[key] = String(val);
        origins[key] = originType;
      } else {
        fields[key] = key === 'servingBasis' ? (parsedValues.servingBasis || 'per_serving') : '';
        origins[key] = 'blank';
      }
    });

    numericKeys.forEach((key) => {
      const val = parsedValues[key];
      if (val !== null && val !== undefined && val !== '') {
        fields[key] = String(val);
        origins[key] = originType;
      } else {
        fields[key] = '';
        origins[key] = 'blank';
      }
    });

    setReviewFields(fields);
    setFieldOrigins(origins);
    setRawOcrText(rawText || '');
    setDataSource(source);
    setOcrConfidence(confidence);
    setActiveStep('review');
  };

  // Populate form and calculate grade from verified whole food reference database (Workflow 2)
  const populateFromReferenceFood = (incomingFood, confidence = 100, source = 'database_lookup') => {
    if (!incomingFood) return;
    const food = allFoodsList.find((f) => f.id === incomingFood.id) || incomingFood;

    const fields = {
      productName: food.name,
      brand: '',
      servingSize: food.servingSize || '100g',
      servingBasis: 'per_100g',
      calories: String(food.calories || ''),
      energyKj: food.calories ? String(Math.round(food.calories * 4.184)) : '',
      protein: String(food.macronutrients?.protein ?? 0),
      carbohydrates: String(food.macronutrients?.carbs ?? 0),
      totalFat: String(food.macronutrients?.fats ?? 0),
      saturatedFat: String(food.macronutrients?.saturatedFat ?? (food.id === 'coconut' ? 29.7 : (food.id === 'milk' ? 2.0 : 0))),
      transFat: '0',
      totalSugars: String(food.category === 'fruits' ? (food.id === 'banana' ? 12.2 : (food.id === 'apple' ? 10.4 : (food.id === 'orange' ? 9.4 : 8.0))) : (food.id === 'coconut' ? 6.2 : 0)),
      addedSugars: '0',
      fiber: String(food.macronutrients?.fiber ?? 0),
      sodium: String(food.minerals?.sodium ?? (food.id === 'coconut' ? 20 : (food.id === 'apple' ? 1 : (food.id === 'banana' ? 1 : 15)))),
      salt: '',
      ingredients: '',
      allergens: '',
      calcium: food.minerals?.calcium ? String(food.minerals.calcium) : '',
      iron: food.minerals?.iron ? String(food.minerals.iron) : '',
      vitaminC: food.vitamins?.vitaminC ? String(food.vitamins.vitaminC) : '',
      vitaminD: food.vitamins?.vitaminD ? String(food.vitamins.vitaminD) : '',
      potassium: food.minerals?.potassium ? String(food.minerals.potassium) : '',
    };

    const origins = {};
    Object.keys(fields).forEach((k) => {
      origins[k] = (fields[k] !== '' && k !== 'brand' && k !== 'salt' && k !== 'ingredients' && k !== 'allergens') ? 'reference' : 'blank';
    });

    setReviewFields(fields);
    setFieldOrigins(origins);
    setDataSource('reference');
    setIdentifiedFood({ ...food, confidence, source });
    setCategoryData({
      category: 'WHOLE_FOOD',
      foodName: food.name,
      productName: food.name,
      teluguName: food.teluguName || null,
      servingSize: food.servingSize || '100g standard serving',
      servingBasis: 'per_100g',
      visibleIngredients: [`Raw whole ${food.name}`],
      keyVitamins: formatVitaminsList(food.vitamins),
      keyMinerals: formatMineralsList(food.minerals),
      nutritionalBenefits: food.benefitsEn || 'Natural whole food rich in dietary micronutrients and clean nourishment.',
      nutritionalBenefitsTe: food.benefitsTe || null,
      matchedFood: food,
      source: 'reference_db',
    });
    setOcrError('');

    // Immediately calculate grade & health indicators
    const finalValues = {
      productName: food.name,
      brand: null,
      servingSize: food.servingSize || '100g',
      servingBasis: 'per_100g',
      calories: Number(food.calories),
      energyKj: Math.round(Number(food.calories) * 4.184),
      totalFat: Number(food.macronutrients?.fats || 0),
      saturatedFat: Number(food.macronutrients?.saturatedFat || (food.id === 'coconut' ? 29.7 : 0)),
      transFat: 0,
      carbohydrates: Number(food.macronutrients?.carbs || 0),
      totalSugars: Number(food.category === 'fruits' ? (food.id === 'banana' ? 12.2 : (food.id === 'apple' ? 10.4 : 8.0)) : (food.id === 'coconut' ? 6.2 : 0)),
      addedSugars: 0,
      fiber: Number(food.macronutrients?.fiber || 0),
      protein: Number(food.macronutrients?.protein || 0),
      sodium: Number(food.minerals?.sodium || (food.id === 'coconut' ? 20 : 5)),
      salt: null,
      ingredients: null,
      allergens: null,
      calcium: food.minerals?.calcium || null,
      iron: food.minerals?.iron || null,
      vitaminC: food.vitamins?.vitaminC || null,
      vitaminD: food.vitamins?.vitaminD || null,
      potassium: food.minerals?.potassium || null,
    };

    setNutritionValues(finalValues);
    setIndicators(calculateNutritionIndicators(finalValues));
    setGradeInfo(calculateEducationalGrade(finalValues));
    setActiveStep('results');
  };

  // Unified image processing function for File Upload, Drag & Drop, and Camera Capture
  const processImage = async (file, targetUrl) => {
    const activeUrl = (typeof targetUrl === 'string' && targetUrl) ? targetUrl : previewUrl;
    const activeFile = file || selectedFile;
    if (!activeUrl && !activeFile) return;

    // 1. Cancel any active in-flight scan
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const currentScanId = ++activeScanIdRef.current;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 2. Clear previous scan state completely so results do not mix
    setOcrError('');
    setCameraError('');
    setCategoryData(null);
    setIdentifiedFood(null);
    setNutritionValues(null);
    setIndicators([]);
    setGradeInfo(null);
    setRawOcrText('');
    if (file) setSelectedFile(file);
    if (activeUrl) setPreviewUrl(activeUrl);
    setupReviewFromParsed(getEmptyNutritionValues(), '', 'manual', 'none');

    setIsProcessing(true);
    setOcrStep(isTelugu ? 'చిత్రాన్ని సిద్ధం చేస్తోంది...' : (t('labelLens.ocrPreparing') || 'Preparing image...'));
    setOcrProgress(15);

    try {
      await new Promise((r) => setTimeout(r, 40));
      if (activeScanIdRef.current !== currentScanId) return;

      setOcrStep(isTelugu ? 'జెమిని విజన్ AI తో ఆహారాన్ని విశ్లేషిస్తోంది...' : 'Identifying food with Multimodal Vision AI...');
      setOcrProgress(35);

      // Ensure real image file payload (use passed file or convert dataUrl)
      let uploadFile = activeFile;
      if (!uploadFile && activeUrl && activeUrl.startsWith('data:')) {
        try {
          const fetchRes = await fetch(activeUrl);
          const blob = await fetchRes.blob();
          uploadFile = new File([blob], 'captured_food.jpg', { type: blob.type || 'image/jpeg' });
        } catch (blobErr) {
          console.warn('Could not convert dataUrl to File:', blobErr);
        }
      }

      const formData = new FormData();
      if (uploadFile) {
        formData.append('image', uploadFile);
        formData.append('filename', uploadFile.name || 'food.jpg');
      }

      setOcrProgress(50);

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsProcessing(false);
        setOcrError(
          isTelugu
            ? 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. ఆహార విశ్లేషణకు ఇంటర్నెట్ కనెక్షన్ అవసరం. కింద ఉన్న రిఫరెన్స్ ఆహారాలలో ఎంచుకోవచ్చు.'
            : 'You are currently offline. Food image analysis requires an active internet connection. You can select a food from Whole Food Quick-Select below.'
        );
        return;
      }

      let foodRes = null;
      try {
        foodRes = await scannerService.identifyFood(formData);
      } catch (reqErr) {
        if (reqErr.name === 'AbortError') return;
        console.warn('identifyFood network or client error:', reqErr);
        const msg = reqErr.response?.data?.message || reqErr.message || 'Vision food service unavailable.';
        setOcrError(msg);
      }

      if (activeScanIdRef.current !== currentScanId) return;

      if (foodRes && foodRes.success) {
        setOcrProgress(90);

        if (foodRes.isFood === false) {
          setCategoryData({
            category: 'NON_FOOD/UNCLEAR',
            foodName: null,
            productName: null,
            unclearReason: foodRes.visualObservations || 'No food items were detected in this image.',
            notice: foodRes.clarificationQuestion || 'Please take or upload a clear photo of any food item or dish.',
            source: 'vision_ai',
          });
          setActiveStep('results');
        } else if (foodRes.matched) {
          const food = foodRes.matched;
          const isWhole = food.category === 'fruits' || food.category === 'vegetables' || food.category === 'grains_millets' || food.category === 'pulses_legumes';
          const cat = isWhole ? 'WHOLE_FOOD' : 'COOKED_MEAL';

          setIdentifiedFood(food);
          setCategoryData({
            category: cat,
            foodName: food.name,
            productName: food.name,
            teluguName: food.teluguName || null,
            servingSize: food.servingSize || (isWhole ? '100g standard serving' : '1 typical serving'),
            servingBasis: food.servingBasis || (isWhole ? 'per_100g' : 'per_serving'),
            visibleIngredients: food.detectedFoods?.length ? food.detectedFoods : (food.visibleIngredients || [`Fresh ${food.name}`]),
            keyVitamins: formatVitaminsList(food.vitamins),
            keyMinerals: formatMineralsList(food.minerals),
            nutritionalBenefits: food.benefitsEn || food.nutritionalBenefits || 'Natural food rich in essential dietary nutrients.',
            nutritionalBenefitsTe: food.benefitsTe || food.nutritionalBenefitsTe || null,
            preparationNotes: food.preparationNotes || null,
            matchedFood: food,
            source: foodRes.source || 'vision_ai',
          });

          const finalValues = {
            productName: food.name,
            brand: null,
            servingSize: food.servingSize || '100g',
            servingBasis: food.servingBasis || (isWhole ? 'per_100g' : 'per_serving'),
            calories: Number(food.calories || 0),
            energyKj: Math.round(Number(food.calories || 0) * 4.184),
            totalFat: Number(food.macronutrients?.fats || 0),
            saturatedFat: Number(food.macronutrients?.saturatedFat || 0),
            transFat: 0,
            carbohydrates: Number(food.macronutrients?.carbs || 0),
            totalSugars: Number(food.macronutrients?.sugars || (food.category === 'fruits' ? 10 : 0)),
            addedSugars: 0,
            fiber: Number(food.macronutrients?.fiber || 0),
            protein: Number(food.macronutrients?.protein || 0),
            sodium: Number(food.minerals?.sodium || 0),
            calcium: food.minerals?.calcium || null,
            iron: food.minerals?.iron || null,
            potassium: food.minerals?.potassium || null,
            vitaminC: food.vitamins?.vitaminC || null,
            vitaminD: food.vitamins?.vitaminD || null,
          };
          setNutritionValues(finalValues);
          setIndicators(calculateNutritionIndicators(finalValues));
          setGradeInfo(calculateEducationalGrade(finalValues));
          setupReviewFromParsed(finalValues, foodRes.visualObservations || '', 'image', foodRes.confidenceLevel || 'high');
          setActiveStep('results');
        } else {
          setActiveStep('results');
        }
      } else if (foodRes && !foodRes.success) {
        setOcrError(foodRes.message || foodRes.error || 'Vision AI could not identify this food image. Please try another photo or choose a whole food below.');
      }

      setOcrProgress(100);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Image processing error:', err);
      if (activeScanIdRef.current !== currentScanId) return;
      setOcrError('An error occurred during image processing. You can enter values manually.');
    } finally {
      if (activeScanIdRef.current === currentScanId) {
        setIsProcessing(false);
      }
    }
  };

  // Backward-compatible runOCR alias
  const runOCR = (overrideUrl) => {
    processImage(selectedFile, typeof overrideUrl === 'string' ? overrideUrl : previewUrl);
  };

  // Run instant sample analysis
  const handleSelectSample = (sample) => {
    setOcrError('');
    setIdentifiedFood(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setCategoryData({
      category: 'PACKAGED_FOOD_WITH_LABEL',
      productName: isTelugu ? sample.teluguName : sample.name,
      servingBasis: 'per_serving',
    });
    setRawOcrText(sample.text);
    setIsProcessing(true);
    setOcrStep(t('labelLens.ocrExtracting') || 'Extracting nutrition values...');
    setOcrProgress(80);

    setTimeout(() => {
      const parseResult = parseNutritionText(sample.text);
      setupReviewFromParsed(parseResult.extracted, sample.text, 'sample', parseResult.confidence);
      // Auto-calculate immediately so score and grade are ready
      const finalValues = {
        ...parseResult.extracted,
        servingBasis: parseResult.extracted.servingBasis || 'per_serving',
      };
      if (finalValues.sodium === null && finalValues.salt !== null) {
        finalValues.sodium = Math.round(finalValues.salt * 400);
      }
      setNutritionValues(finalValues);
      setIndicators(calculateNutritionIndicators(finalValues));
      setGradeInfo(calculateEducationalGrade(finalValues));
      setIsProcessing(false);
      setOcrProgress(100);
      setActiveStep('results');
    }, 250);
  };

  // Open manual entry mode
  const handleOpenManual = () => {
    setOcrError('');
    setCategoryData(null);
    setIdentifiedFood(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setRawOcrText('');
    setOcrConfidence('none');
    setNutritionValues(null);
    setIndicators([]);
    setGradeInfo(null);
    setupReviewFromParsed(getEmptyNutritionValues(), '', 'manual', 'none');
    setActiveStep('review');
  };

  // Update a field in the review step and track user edit status
  const handleFieldChange = (field, value) => {
    setReviewFields((prev) => ({
      ...prev,
      [field]: value
    }));

    setFieldOrigins((prev) => {
      if (value === '') {
        return { ...prev, [field]: 'blank' };
      }
      return { ...prev, [field]: 'user' };
    });
  };

  // Convert review fields into structured object and calculate final score
  const handleConfirmAndCalculate = () => {
    const parseNum = (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const n = parseFloat(val);
      return isNaN(n) ? null : n;
    };

    const finalValues = {
      productName: reviewFields.productName.trim() || null,
      brand: reviewFields.brand?.trim() || null,
      servingSize: reviewFields.servingSize.trim() || null,
      servingBasis: reviewFields.servingBasis || 'per_serving',
      calories: parseNum(reviewFields.calories),
      energyKj: parseNum(reviewFields.energyKj),
      totalFat: parseNum(reviewFields.totalFat),
      saturatedFat: parseNum(reviewFields.saturatedFat),
      transFat: parseNum(reviewFields.transFat),
      carbohydrates: parseNum(reviewFields.carbohydrates),
      totalSugars: parseNum(reviewFields.totalSugars),
      addedSugars: parseNum(reviewFields.addedSugars),
      fiber: parseNum(reviewFields.fiber),
      protein: parseNum(reviewFields.protein),
      sodium: parseNum(reviewFields.sodium),
      salt: parseNum(reviewFields.salt),
      ingredients: reviewFields.ingredients?.trim() || null,
      allergens: reviewFields.allergens?.trim() || null,
      calcium: parseNum(reviewFields.calcium),
      iron: parseNum(reviewFields.iron),
      vitaminC: parseNum(reviewFields.vitaminC),
      vitaminD: parseNum(reviewFields.vitaminD),
      potassium: parseNum(reviewFields.potassium),
    };

    // If salt is provided without sodium, automatically compute sodium
    if (finalValues.sodium === null && finalValues.salt !== null) {
      finalValues.sodium = Math.round(finalValues.salt * 400);
    }

    setNutritionValues(finalValues);

    const detectedIndicators = calculateNutritionIndicators(finalValues);
    const calculatedGrade = calculateEducationalGrade(finalValues);

    setIndicators(detectedIndicators);
    setGradeInfo(calculatedGrade);
    setActiveStep('results');
  };

  // Copy raw OCR text to clipboard
  const handleCopyOcr = () => {
    if (!rawOcrText) return;
    navigator.clipboard.writeText(rawOcrText);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 2000);
  };

  // Reset entire state
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setRawOcrText('');
    setNutritionValues(null);
    setIndicators([]);
    setGradeInfo(null);
    setOcrError('');
    setCameraError('');
    setCategoryData(null);
    setIdentifiedFood(null);
    setOcrConfidence('none');
    setupReviewFromParsed(getEmptyNutritionValues(), '', 'manual', 'none');
    setActiveStep('review');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper to get grade badge classes
  const getGradeColorClasses = (grade) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200';
      case 'B':
        return 'bg-teal-600 text-white border-teal-500 shadow-teal-200';
      case 'C':
        return 'bg-amber-500 text-white border-amber-400 shadow-amber-200';
      case 'D':
        return 'bg-orange-600 text-white border-orange-500 shadow-orange-200';
      case 'E':
        return 'bg-rose-600 text-white border-rose-500 shadow-rose-200';
      default:
        return 'bg-gray-500 text-white border-gray-400 shadow-gray-200';
    }
  };

  // Origin badge renderer
  const renderOriginBadge = (fieldKey) => {
    const origin = fieldOrigins[fieldKey] || 'blank';
    switch (origin) {
      case 'ocr':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            OCR Extracted
          </span>
        );
      case 'reference':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-2.5 h-2.5 text-purple-600" />
            Reference Estimate
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Edit3 className="w-2.5 h-2.5 text-blue-600" />
            User Edited
          </span>
        );
      case 'sample':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Sample Preset
          </span>
        );
      case 'manual':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-300">
            Manual
          </span>
        );
      case 'blank':
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/dashboard" />
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>{t('labelLens.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t('labelLens.headerTitle')}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {t('labelLens.subtitle')}
        </p>
      </div>

      {/* Engine Status & Mode Explainer Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-white border border-gray-200 rounded-xl text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold text-gray-900">
            <Activity className="w-4 h-4 text-emerald-600" />
          </span>
          <span className="text-gray-500 text-[11px]">
            {dataSource === 'reference'
              ? '• Currently in Workflow 2 (Reference Food Lookup)'
              : dataSource === 'image'
              ? '• Currently analyzing food image'
              : '• Ready for scan or food selection'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowModesModal(true)}
          className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          Understanding Assessment Modes
        </button>
      </div>

      {/* Main Grid: 2 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & OCR Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border border-gray-200 shadow-sm bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              {t('labelLens.uploadTitle') || 'Scan Any Food'}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {t('labelLens.uploadSubtitle') || 'Upload or take a photo of any food item or dish for identification and analysis (JPG, PNG, WEBP, up to 10MB)'}
            </p>

            {/* Error Message */}
            {ocrError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{ocrError}</p>
                  <p className="mt-0.5 text-rose-600">{t('labelLens.ocrFailedTip')}</p>
                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={handleOpenManual}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 rounded-lg shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      {t('labelLens.manualFormTitle') || 'Enter Nutrition Values Manually'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{cameraError}</p>
                </div>
              </div>
            )}

            {/* Drag & Drop Upload Area */}
            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-gray-300 hover:border-emerald-400 bg-gray-50/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-emerald-100/70 text-emerald-700 rounded-full">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {isDragging ? t('labelLens.dragActive') : t('labelLens.uploadButton')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Image Preview Panel */
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 flex items-center justify-center max-h-72">
                  <img
                    src={previewUrl}
                    alt="Food Preview"
                    className="object-contain max-h-72 w-full"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                    title={t('labelLens.removeImage')}
                    aria-label={t('labelLens.removeImage')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={runOCR}
                    disabled={isProcessing}
                    className="w-full sm:w-auto text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    {t('labelLens.scanButton')}
                  </Button>
                </div>
              </div>
            )}

            {/* Camera Trigger */}
            {!previewUrl && (
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
            )}

            {!previewUrl && (
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleOpenModalCamera}
                  className="w-full text-xs font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                  {t('labelLens.cameraButton')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOpenManual}
                  className="w-full text-xs font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                  {t('labelLens.manualFormTitle')}
                </Button>
              </div>
            )}

            {/* OCR Processing Indicator */}
            {isProcessing && (
              <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {ocrStep}
                  </span>
                  <span>{ocrProgress}%</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Whole Food Quick-Select (Workflow 2) */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5 text-purple-600" />
                  <p className="text-xs font-semibold text-gray-800">
                    Whole Food Quick-Select (Workflow 2):
                  </p>
                </div>
                <span className="text-[10px] text-purple-700 font-bold bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                  Reference Database
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Fresh produce has no printed packaging labels. Click any whole food to load verified clinical reference nutrition:
              </p>

              {/* Quick chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {popularFoods.map((pf) => (
                  <button
                    key={pf.id}
                    type="button"
                    onClick={() => {
                      populateFromReferenceFood(pf, 100, 'quick_select');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      identifiedFood?.id === pf.id
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-purple-50/70 hover:bg-purple-100 text-purple-900 border-purple-200'
                    }`}
                  >
                    <span>{isTelugu && pf.teluguName ? pf.teluguName : pf.name}</span>
                  </button>
                ))}
              </div>

              {/* Search or browse more foods */}
              <div className="pt-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={foodSearchTerm}
                    onChange={(e) => setFoodSearchTerm(e.target.value)}
                    placeholder="Search 53 verified foods (e.g. Guava, Carrot, Dal)..."
                    className="w-full text-xs pl-8 pr-7 py-1.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-400 bg-gray-50/50"
                  />
                  {foodSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setFoodSearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {foodSearchTerm.trim().length > 0 && (
                  <div className="mt-1.5 max-h-36 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg p-1 space-y-0.5">
                    {filteredWholeFoods.length > 0 ? (
                      filteredWholeFoods.slice(0, 8).map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          onClick={() => {
                            populateFromReferenceFood(food, 100, 'database_search');
                            setFoodSearchTerm('');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-purple-50 text-gray-800 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="font-medium truncate">{food.name}</span>
                          <span className="text-[10px] text-gray-400 shrink-0 ml-2">{food.calories} kcal/100g</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-2 text-center text-[11px] text-gray-500">
                        No food matched "{foodSearchTerm}". Check spelling or explore Food Explorer.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Raw OCR Text Toggle Card */}
          {rawOcrText && (
            <Card className="p-4 border border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowRawOcr(!showRawOcr)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900"
                >
                  {showRawOcr ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showRawOcr ? t('labelLens.hideRawOcr') : t('labelLens.viewRawOcr')}
                </button>
                {showRawOcr && (
                  <button
                    onClick={handleCopyOcr}
                    className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
                  >
                    {copiedOcr ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedOcr ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              {showRawOcr && (
                <pre className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-mono text-gray-700 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {rawOcrText}
                </pre>
              )}
            </Card>
          )}
        </div>

        {/* Right Column: Dynamic Step Content */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 2: REVIEW & CORRECTION */}
          {activeStep !== 'results' && (
            <Card className="p-6 border border-gray-200 shadow-sm bg-white space-y-5">
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Nutrition Facts Form
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {dataSource === 'image'
                        ? `Workflow 1: Image OCR (${ocrConfidence} confidence)`
                        : dataSource === 'reference'
                        ? `Workflow 2: Reference Estimate (${identifiedFood?.confidence || 98}% match)`
                        : dataSource === 'sample'
                        ? 'Sample Label Preset'
                        : 'Manual Nutrition Entry'}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">
                    {dataSource === 'reference'
                      ? 'Whole Food Reference Nutrition'
                      : dataSource === 'manual'
                      ? 'Nutrition Facts & Scoring'
                      : 'Review & Correct Extracted Facts'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dataSource === 'reference'
                      ? 'Standard reference values loaded per 100g. Pure natural foods carry no synthetic additives or added sugars.'
                      : dataSource === 'manual'
                      ? 'Upload a photo or enter values below. Missing values remain unpenalized.'
                      : 'Verify detected numbers before calculating scores. Missing values remain unpenalized.'}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                  title="Clear & Reset"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600">
                <span className="font-semibold text-gray-700">Status Badges:</span>
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  OCR Extracted
                </span>
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Reference Estimate
                </span>
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  User Edited
                </span>
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Sample Preset
                </span>
              </div>

              {/* Identified Whole Food Banner (Workflow 2) */}
              {identifiedFood && (
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl flex items-start justify-between gap-3 text-xs text-purple-950">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-purple-900 text-sm">
                          Identified: {identifiedFood.name}
                        </span>
                        {isTelugu && identifiedFood.teluguName && (
                          <span className="text-xs text-purple-700 font-medium">
                            ({identifiedFood.teluguName})
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200 text-purple-900">
                          {typeof identifiedFood.confidence === 'number'
                            ? `${identifiedFood.confidence}% Match`
                            : `${identifiedFood.confidence} Confidence`}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-purple-800 border border-purple-300">
                          {identifiedFood.source === 'vision_ai' ? 'Google Gemini Vision AI' : 'NutriVita 53-Food Database'}
                        </span>
                      </div>
                      <p className="mt-1 text-purple-800 text-[11px] leading-relaxed">
                        {identifiedFood.visualObservations || 'Clinical reference values per 100g loaded into form. Zero added sugars or industrial additives.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifiedFood(null);
                        setCategoryData(null);
                        setActiveStep('review');
                      }}
                      className="text-xs text-purple-800 hover:text-purple-950 font-semibold underline cursor-pointer shrink-0"
                    >
                      Choose different food
                    </button>
                    <button
                      onClick={() => {
                        setIdentifiedFood(null);
                        handleReset();
                      }}
                      className="text-purple-400 hover:text-purple-700 p-1 rounded-md cursor-pointer"
                      title="Clear selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Calculated Score & Grade Preview Bar */}
              {gradeInfo && (
                <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl border ${getGradeColorClasses(gradeInfo.grade)}`}>
                      {gradeInfo.grade}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-900">
                          {isTelugu ? gradeInfo.teluguTitle : gradeInfo.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                          Nutrition Score: {gradeInfo.nutritionScore}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        {gradeInfo.positiveFactors?.length || 0} positive boosters • {gradeInfo.negativeFactors?.length || 0} areas of concern
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => setActiveStep('results')}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 cursor-pointer"
                  >
                    View Full Analysis <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              )}

              {/* Form Grid */}
              <div className="space-y-4">
                {/* Product Name, Brand & Serving */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Brand / Maker</label>
                      {renderOriginBadge('brand')}
                    </div>
                    <input
                      type="text"
                      value={reviewFields.brand}
                      onChange={(e) => handleFieldChange('brand', e.target.value)}
                      placeholder="e.g. Quaker / Nestle"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Product Name</label>
                      {renderOriginBadge('productName')}
                    </div>
                    <input
                      type="text"
                      value={reviewFields.productName}
                      onChange={(e) => handleFieldChange('productName', e.target.value)}
                      placeholder="e.g. Rolled Oats"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Serving Size</label>
                      {renderOriginBadge('servingSize')}
                    </div>
                    <input
                      type="text"
                      value={reviewFields.servingSize}
                      onChange={(e) => handleFieldChange('servingSize', e.target.value)}
                      placeholder="e.g. 40g or 1 pouch"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Serving Basis</label>
                      {renderOriginBadge('servingBasis')}
                    </div>
                    <select
                      value={reviewFields.servingBasis}
                      onChange={(e) => handleFieldChange('servingBasis', e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 bg-white"
                    >
                      <option value="per_serving">Per Serving</option>
                      <option value="per_100g">Per 100g / 100ml</option>
                    </select>
                  </div>
                </div>

                {/* Core Macros */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pt-1">
                  Core Macronutrients & Energy
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Calories */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Calories (kcal)</label>
                      {renderOriginBadge('calories')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.calories}
                      onChange={(e) => handleFieldChange('calories', e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Energy kJ */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Energy (kJ)</label>
                      {renderOriginBadge('energyKj')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.energyKj}
                      onChange={(e) => handleFieldChange('energyKj', e.target.value)}
                      placeholder="e.g. 628"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Protein */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Protein (g)</label>
                      {renderOriginBadge('protein')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.protein}
                      onChange={(e) => handleFieldChange('protein', e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Carbs (g)</label>
                      {renderOriginBadge('carbohydrates')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.carbohydrates}
                      onChange={(e) => handleFieldChange('carbohydrates', e.target.value)}
                      placeholder="e.g. 27"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Total Sugars */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Total Sugars (g)</label>
                      {renderOriginBadge('totalSugars')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.totalSugars}
                      onChange={(e) => handleFieldChange('totalSugars', e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Added Sugars */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Added Sugars (g)</label>
                      {renderOriginBadge('addedSugars')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.addedSugars}
                      onChange={(e) => handleFieldChange('addedSugars', e.target.value)}
                      placeholder="e.g. 0"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Fiber */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Dietary Fiber (g)</label>
                      {renderOriginBadge('fiber')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.fiber}
                      onChange={(e) => handleFieldChange('fiber', e.target.value)}
                      placeholder="e.g. 4"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Total Fat */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Total Fat (g)</label>
                      {renderOriginBadge('totalFat')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.totalFat}
                      onChange={(e) => handleFieldChange('totalFat', e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Saturated Fat */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Sat Fat (g)</label>
                      {renderOriginBadge('saturatedFat')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.saturatedFat}
                      onChange={(e) => handleFieldChange('saturatedFat', e.target.value)}
                      placeholder="e.g. 0.5"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Trans Fat */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Trans Fat (g)</label>
                      {renderOriginBadge('transFat')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.transFat}
                      onChange={(e) => handleFieldChange('transFat', e.target.value)}
                      placeholder="e.g. 0"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Sodium */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Sodium (mg)</label>
                      {renderOriginBadge('sodium')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.sodium}
                      onChange={(e) => handleFieldChange('sodium', e.target.value)}
                      placeholder="e.g. 120"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Salt */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Salt (g)</label>
                      {renderOriginBadge('salt')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.salt}
                      onChange={(e) => handleFieldChange('salt', e.target.value)}
                      placeholder="e.g. 0.3"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Micronutrients Optional */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pt-2">
                  Micronutrients (Vitamins & Minerals, optional)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Calcium (mg)</label>
                      {renderOriginBadge('calcium')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.calcium}
                      onChange={(e) => handleFieldChange('calcium', e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Iron (mg)</label>
                      {renderOriginBadge('iron')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.iron}
                      onChange={(e) => handleFieldChange('iron', e.target.value)}
                      placeholder="e.g. 2.5"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Vitamin C (mg)</label>
                      {renderOriginBadge('vitaminC')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.vitaminC}
                      onChange={(e) => handleFieldChange('vitaminC', e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Vitamin D (mcg)</label>
                      {renderOriginBadge('vitaminD')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.vitaminD}
                      onChange={(e) => handleFieldChange('vitaminD', e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Potassium (mg)</label>
                      {renderOriginBadge('potassium')}
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={reviewFields.potassium}
                      onChange={(e) => handleFieldChange('potassium', e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Ingredients & Allergens */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 pt-2">
                  Ingredients & Allergens (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Ingredients</label>
                      {renderOriginBadge('ingredients')}
                    </div>
                    <textarea
                      rows={2}
                      value={reviewFields.ingredients}
                      onChange={(e) => handleFieldChange('ingredients', e.target.value)}
                      placeholder="e.g. Rolled oats, sugar, salt, cocoa"
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Allergens / Warnings</label>
                      {renderOriginBadge('allergens')}
                    </div>
                    <textarea
                      rows={2}
                      value={reviewFields.allergens}
                      onChange={(e) => handleFieldChange('allergens', e.target.value)}
                      placeholder="e.g. Contains gluten. May contain tree nuts."
                      className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Clear / Reset Form
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleConfirmAndCalculate}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Calculate Nutrition Score & Grade
                </Button>
              </div>
            </Card>
          )}

          {/* STEP 3: RESULTS DISPLAY */}
          {activeStep === 'results' && (categoryData || nutritionValues) && (
            <div className="space-y-6">
              {/* Category-Specific Intelligence Cards */}

              {/* 1. NON_FOOD / UNCLEAR */}
              {categoryData?.category === 'NON_FOOD/UNCLEAR' && (
                <Card className="p-6 border border-rose-200 bg-white shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      {t('labelLens.categoryNonFood') || 'Food Not Detected / Unclear Photo'}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      {t('labelLens.reset')}
                    </Button>
                  </div>

                  <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-950">
                    <h3 className="font-bold text-sm text-rose-900">
                      Unable to Detect Food
                    </h3>
                    <p className="leading-relaxed">
                      {categoryData.unclearReason || 'The uploaded photo does not contain recognizable food, ingredients, or a meal.'}
                    </p>
                    <p className="text-rose-800 font-medium">
                      {isTelugu && categoryData.noticeTe ? categoryData.noticeTe : (categoryData.notice || t('labelLens.nonFoodGuidance') || 'Please upload or take a clear, well-lit photo of any food item or dish.')}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs text-gray-700">
                    <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-emerald-600" />
                      Tips for a Successful Scan:
                    </h4>
                    <ul className="space-y-1 text-gray-600 list-disc pl-4">
                      <li>Ensure adequate lighting on the food item or dish.</li>
                      <li>Hold the camera steady to avoid motion blur.</li>
                      <li>For whole foods and cooked meals, center the dish within the camera frame.</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <Button
                      variant="primary"
                      onClick={handleOpenModalCamera}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1.5" />
                      {t('labelLens.retakePhoto') || 'Retake with Camera'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      {t('labelLens.uploadButton')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleOpenManual}
                      className="text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      {t('labelLens.manualFormTitle')}
                    </Button>
                  </div>
                </Card>
              )}

              {/* 3. WHOLE_FOOD */}
              {categoryData?.category === 'WHOLE_FOOD' && (
                <Card className="p-6 border border-emerald-200 bg-white shadow-sm space-y-5">
                  <div className="flex items-start justify-between pb-3 border-b border-emerald-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                          {t('labelLens.categoryWholeFood') || 'Whole Food & Fresh Produce'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {categoryData.servingBasis === 'per_100g' ? 'Per 100g Reference' : categoryData.servingSize || '100g Standard'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">
                        {categoryData.foodName}
                        {isTelugu && categoryData.teluguName && (
                          <span className="text-base font-semibold text-emerald-700 ml-2">({categoryData.teluguName})</span>
                        )}
                      </h3>
                      {categoryData.alternativeNames?.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[11px] text-gray-500 font-medium">Also known as:</span>
                          {categoryData.alternativeNames.map((alias, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                              {alias}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveStep('review')} className="text-xs">
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Edit Values
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        {t('labelLens.reset')}
                      </Button>
                    </div>
                  </div>

                  {/* Nutritional Benefits Highlight */}
                  {categoryData.nutritionalBenefits && (
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        Nutritional Benefits & Dietary Value
                      </div>
                      <p className="leading-relaxed">
                        {isTelugu && categoryData.nutritionalBenefitsTe ? categoryData.nutritionalBenefitsTe : categoryData.nutritionalBenefits}
                      </p>
                    </div>
                  )}

                  {/* Key Micronutrients (Vitamins & Minerals) */}
                  {(categoryData.keyVitamins?.length > 0 || categoryData.keyMinerals?.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryData.keyVitamins?.length > 0 && (
                        <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl space-y-1.5 text-xs">
                          <span className="font-bold text-purple-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Key Vitamins
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {categoryData.keyVitamins.map((vit, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-semibold text-[11px]">
                                {typeof vit === 'object' && vit !== null
                                  ? Object.entries(vit).filter(([_, val]) => val).map(([k, val]) => `${k}: ${val}`).join(', ')
                                  : String(vit)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {categoryData.keyMinerals?.length > 0 && (
                        <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl space-y-1.5 text-xs">
                          <span className="font-bold text-teal-900 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-teal-600" /> Key Minerals
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {categoryData.keyMinerals.map((min, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-semibold text-[11px]">
                                {typeof min === 'object' && min !== null
                                  ? Object.entries(min).filter(([_, val]) => val).map(([k, val]) => `${k}: ${val}`).join(', ')
                                  : String(min)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-gray-500 italic">
                      {t('labelLens.wholeFoodNote') || 'Standard clinical reference values per 100g. Fresh whole foods contain natural intrinsic sugars and zero added industrial sugars.'}
                    </p>
                    <Link
                      to="/foods"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs"
                    >
                      Food Explorer <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              )}

              {/* 4. COOKED_MEAL */}
              {categoryData?.category === 'COOKED_MEAL' && (
                <Card className="p-6 border border-amber-200 bg-white shadow-sm space-y-5">
                  <div className="flex items-start justify-between pb-3 border-b border-amber-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-600" />
                          {t('labelLens.categoryCookedMeal') || 'Cooked Meal / Prepared Dish'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {categoryData.servingSize || '1 typical serving'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">
                        {categoryData.foodName}
                        {isTelugu && categoryData.teluguName && (
                          <span className="text-base font-semibold text-amber-800 ml-2">({categoryData.teluguName})</span>
                        )}
                      </h3>
                      {categoryData.alternativeNames?.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[11px] text-gray-500 font-medium">Also called:</span>
                          {categoryData.alternativeNames.map((alias, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                              {alias}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveStep('review')} className="text-xs">
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Adjust Values
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        {t('labelLens.reset')}
                      </Button>
                    </div>
                  </div>

                  {/* Visible Ingredients */}
                  {categoryData.visibleIngredients?.length > 0 && (
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1.5 text-xs">
                      <span className="font-bold text-gray-800 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-emerald-600" /> Visible Dish Components / Ingredients
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {categoryData.visibleIngredients.map((ing, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-800 font-medium text-[11px]">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Culinary Variance Disclaimer */}
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-900">Culinary Recipe & Portion Variance Notice</p>
                      <p className="mt-0.5 leading-relaxed">
                        {categoryData.preparationNotes || (t('labelLens.culinaryDisclaimer') || 'Image-based nutrition estimates for cooked meals are approximate. Actual values vary based on cooking oils, portion weight, and specific household recipes.')}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* 5. PACKAGED_FOOD_WITH_LABEL Header Badge */}
              {categoryData?.category === 'PACKAGED_FOOD_WITH_LABEL' && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-950">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold text-blue-900">
                        {categoryData.productName || 'Packaged Food'} {categoryData.brand ? `(${categoryData.brand})` : ''}
                      </span>
                      <p className="text-[11px] text-blue-800">
                        Identified food item and nutritional intelligence.
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-white text-blue-800 border-blue-300 shrink-0">
                    {categoryData.servingSize ? `Serving: ${categoryData.servingSize}` : 'Food Profile'}
                  </Badge>
                </div>
              )}
              {/* Educational Grade & Score Card */}
              {gradeInfo && (
                <Card className="p-6 border border-gray-200 shadow-sm bg-white overflow-hidden relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Grade Badge Circle */}
                      <div
                        className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-3xl shadow-md border-2 ${getGradeColorClasses(
                          gradeInfo.grade
                        )}`}
                      >
                        <span>{gradeInfo.grade}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {t('labelLens.gradeTitle')}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                            Score: {gradeInfo.nutritionScore}/100
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                          {nutritionValues.productName ? `${nutritionValues.productName} — ` : ''}
                          {isTelugu ? gradeInfo.teluguTitle : gradeInfo.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 max-w-md">
                          {isTelugu ? gradeInfo.teluguExplanation : gradeInfo.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveStep('review')}
                        className="text-xs flex-1 sm:flex-none"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" />
                        Edit Values
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs flex-1 sm:flex-none"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        {t('labelLens.reset')}
                      </Button>
                    </div>
                  </div>

                  {/* Score Meter Bar */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                      <span>Nutrition Quality Score (0–100)</span>
                      <span className="font-mono text-emerald-700 font-bold">{gradeInfo.nutritionScore} / 100</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          gradeInfo.nutritionScore >= 80
                            ? 'bg-emerald-500'
                            : gradeInfo.nutritionScore >= 65
                            ? 'bg-teal-500'
                            : gradeInfo.nutritionScore >= 50
                            ? 'bg-amber-500'
                            : gradeInfo.nutritionScore >= 35
                            ? 'bg-orange-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(5, Math.min(100, gradeInfo.nutritionScore))}%` }}
                      />
                    </div>
                  </div>

                  {/* Positive & Negative Factors Breakdown */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Positive Factors */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        Positive Nutrition Factors ({gradeInfo.positiveFactors?.length || 0})
                      </h4>
                      {gradeInfo.positiveFactors && gradeInfo.positiveFactors.length > 0 ? (
                        <div className="space-y-1.5">
                          {gradeInfo.positiveFactors.map((f, i) => (
                            <div key={i} className="text-xs flex items-start justify-between gap-2 text-emerald-950">
                              <div>
                                <span className="font-semibold">{isTelugu ? f.teluguFactor : f.factor}: </span>
                                <span className="font-mono text-[11px] bg-emerald-100/70 px-1 rounded">{f.value}</span>
                                <p className="text-[11px] text-emerald-800 mt-0.5">{f.explanation}</p>
                              </div>
                              <span className="text-[11px] font-bold text-emerald-700 shrink-0">
                                +{f.points} pts
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-700 italic">No significant positive boosters identified.</p>
                      )}
                    </div>

                    {/* Negative Factors */}
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
                      <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <TrendingDown className="w-4 h-4 text-amber-600" />
                        Areas of Concern / Reducers ({gradeInfo.negativeFactors?.length || 0})
                      </h4>
                      {gradeInfo.negativeFactors && gradeInfo.negativeFactors.length > 0 ? (
                        <div className="space-y-1.5">
                          {gradeInfo.negativeFactors.map((f, i) => (
                            <div key={i} className="text-xs flex items-start justify-between gap-2 text-amber-950">
                              <div>
                                <span className="font-semibold">{isTelugu ? f.teluguFactor : f.factor}: </span>
                                <span className="font-mono text-[11px] bg-amber-100/70 px-1 rounded">{f.value}</span>
                                <p className="text-[11px] text-amber-800 mt-0.5">{f.explanation}</p>
                              </div>
                              <span className="text-[11px] font-bold text-amber-700 shrink-0">
                                {f.points} pts
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-amber-700 italic">No excessive negative penalizers detected.</p>
                      )}
                    </div>
                  </div>

                  {/* Unknown factors transparent note */}
                  {gradeInfo.unknownFactors && gradeInfo.unknownFactors.length > 0 && (
                    <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-2 text-xs text-gray-600">
                      <HelpCircle className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-700">Omitted / Not Reported: </span>
                        <span>{gradeInfo.unknownFactors.join(' ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Practical Dietary Suggestions & Whole-Food Swaps */}
                  {gradeInfo.dietarySuggestions && gradeInfo.dietarySuggestions.length > 0 && (
                    <div className="mt-4 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                      <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Apple className="w-4 h-4 text-blue-600" />
                        Practical Dietary Suggestions & Whole-Food Swaps
                      </h4>
                      <ul className="space-y-1.5 text-xs text-blue-950">
                        {gradeInfo.dietarySuggestions.map((sug, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{isTelugu ? sug.te : sug.en}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Collapsible Grade Calculation Breakdown */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setShowGradeDetails(!showGradeDetails)}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      {showGradeDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {showGradeDetails ? t('labelLens.hideCalculation') : t('labelLens.howCalculated')}
                    </button>

                    {showGradeDetails && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
                        <p className="text-gray-600 font-medium">
                          {t('labelLens.educationalNote')}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {gradeInfo.criteria.map((c, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded-lg border flex items-center justify-between ${
                                c.positive
                                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                                  : 'bg-amber-50/50 border-amber-200 text-amber-900'
                              }`}
                            >
                              <span className="font-semibold">{isTelugu ? c.teluguItem : c.item}: {c.value}</span>
                              <span className="text-[11px] font-mono">{c.impact}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Quality Indicators Badges */}
              {indicators.length > 0 && (
                <Card className="p-6 border border-gray-200 shadow-sm bg-white">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-600" />
                    {t('labelLens.indicatorsTitle')}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {t('labelLens.indicatorsSubtitle')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {indicators.map((ind) => (
                      <div
                        key={ind.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 ${
                          ind.type === 'warning'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        {ind.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">
                              {isTelugu ? ind.teluguLabel : ind.label}
                            </span>
                            <span className="text-[11px] font-semibold px-1.5 py-0.2 bg-white/70 rounded border border-current">
                              {ind.value}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5 opacity-90">
                            {isTelugu ? ind.teluguMessage : ind.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Nutrition Snapshot Grid (only when numerical nutrition values exist) */}
              {nutritionValues && (
                <>
                  <Card className="p-6 border border-gray-200 shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {t('labelLens.snapshotTitle')}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {nutritionValues.servingBasis === 'per_100g' ? 'Values per 100g/ml' : 'Values per serving'}
                          {nutritionValues.servingSize ? ` (${nutritionValues.servingSize})` : ''}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {dataSource === 'image'
                          ? t('labelLens.sourceImage')
                          : dataSource === 'sample'
                          ? 'Sample Preset'
                          : t('labelLens.sourceManual')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      {/* Calories */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-500 block">{t('labelLens.calories')}</span>
                        <span className="text-lg font-bold text-gray-900 block mt-0.5">
                          {nutritionValues.calories !== null ? `${nutritionValues.calories} kcal` : t('labelLens.notDetected')}
                        </span>
                      </div>

                      {/* Protein */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-500 block">{t('labelLens.protein')}</span>
                        <span className="text-lg font-bold text-gray-900 block mt-0.5">
                          {nutritionValues.protein !== null ? `${nutritionValues.protein}g` : t('labelLens.notDetected')}
                        </span>
                      </div>

                      {/* Carbohydrates */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-500 block">{t('labelLens.carbs')}</span>
                        <span className="text-lg font-bold text-gray-900 block mt-0.5">
                          {nutritionValues.carbohydrates !== null ? `${nutritionValues.carbohydrates}g` : t('labelLens.notDetected')}
                        </span>
                      </div>

                      {/* Total Sugars */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-500 block">{t('labelLens.totalSugars')}</span>
                        <span className="text-lg font-bold text-gray-900 block mt-0.5">
                          {nutritionValues.totalSugars !== null ? `${nutritionValues.totalSugars}g` : t('labelLens.notDetected')}
                        </span>
                      </div>

                      {/* Total Fat */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-500 block">{t('labelLens.totalFat')}</span>
                        <span className="text-lg font-bold text-gray-900 block mt-0.5">
                          {nutritionValues.totalFat !== null ? `${nutritionValues.totalFat}g` : t('labelLens.notDetected')}
                        </span>
                      </div>

                      {/* Saturated Fat */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-500 block">{t('labelLens.saturatedFat')}</span>
                        <span className="text-lg font-bold text-gray-900 block mt-0.5">
                          {nutritionValues.saturatedFat !== null ? `${nutritionValues.saturatedFat}g` : t('labelLens.notDetected')}
                        </span>
                      </div>

                      {/* Dietary Fiber */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-500 block">{t('labelLens.fiber')}</span>
                        <span className="text-lg font-bold text-gray-900 block mt-0.5">
                          {nutritionValues.fiber !== null ? `${nutritionValues.fiber}g` : t('labelLens.notDetected')}
                        </span>
                      </div>

                      {/* Sodium */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-500 block">{t('labelLens.sodium')}</span>
                        <span className="text-lg font-bold text-gray-900 block mt-0.5">
                          {nutritionValues.sodium !== null ? `${nutritionValues.sodium}mg` : t('labelLens.notDetected')}
                        </span>
                      </div>
                    </div>

                    {/* Additional Micronutrients if detected */}
                    {(nutritionValues.addedSugars !== null ||
                      nutritionValues.calcium !== null ||
                      nutritionValues.iron !== null ||
                      nutritionValues.vitaminC !== null ||
                      nutritionValues.vitaminD !== null ||
                      nutritionValues.potassium !== null) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-600">
                        {nutritionValues.addedSugars !== null && (
                          <div>
                            <span className="font-semibold text-gray-700">{t('labelLens.addedSugars')}: </span>
                            <span>{nutritionValues.addedSugars}g</span>
                          </div>
                        )}
                        {nutritionValues.calcium !== null && (
                          <div>
                            <span className="font-semibold text-gray-700">Calcium: </span>
                            <span>{nutritionValues.calcium}mg</span>
                          </div>
                        )}
                        {nutritionValues.iron !== null && (
                          <div>
                            <span className="font-semibold text-gray-700">Iron: </span>
                            <span>{nutritionValues.iron}mg</span>
                          </div>
                        )}
                        {nutritionValues.vitaminC !== null && (
                          <div>
                            <span className="font-semibold text-gray-700">Vitamin C: </span>
                            <span>{nutritionValues.vitaminC}mg</span>
                          </div>
                        )}
                        {nutritionValues.vitaminD !== null && (
                          <div>
                            <span className="font-semibold text-gray-700">Vitamin D: </span>
                            <span>{nutritionValues.vitaminD}mcg</span>
                          </div>
                        )}
                        {nutritionValues.potassium !== null && (
                          <div>
                            <span className="font-semibold text-gray-700">Potassium: </span>
                            <span>{nutritionValues.potassium}mg</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Ingredients & Allergens if detected */}
                    {(nutritionValues.ingredients || nutritionValues.allergens) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-xs">
                        {nutritionValues.ingredients && (
                          <div>
                            <span className="font-semibold text-gray-700">Ingredients: </span>
                            <span className="text-gray-600">{nutritionValues.ingredients}</span>
                          </div>
                        )}
                        {nutritionValues.allergens && (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                            <span className="font-semibold">Allergens / Advisory: </span>
                            <span>{nutritionValues.allergens}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1.5" />
                      {t('labelLens.scanAnother')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep('review')}
                      className="text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      Edit Values
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="text-xs text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      Clear / Start Over
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Universal Camera Capture Modal with live preview & review */}
      <CameraModal
        isOpen={cameraActive}
        onClose={() => setCameraActive(false)}
        onCapture={(file, dataUrl) => {
          processImage(file, dataUrl);
        }}
        title={t('labelLens.cameraModalTitle') || 'Scan Any Food'}
        guideType="rectangle"
        instruction={t('labelLens.cameraInstructions') || 'Position food item or dish clearly inside camera frame.'}
        fileName="captured-food.jpg"
      />

      {/* Educational Modal: Understanding NutriVita Assessment & Analysis Modes */}
      <Modal
        isOpen={showModesModal}
        onClose={() => setShowModesModal(false)}
        title="NutriVita Assessment & Analysis Modes Explained"
        subtitle="Transparent guide to multimodal Vision AI, label OCR, and clinical reference databases"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs text-gray-700">
          {/* Current Vision AI API Status */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            scannerStatus?.visionAiConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <Info className={`w-5 h-5 shrink-0 mt-0.5 ${scannerStatus?.visionAiConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <span className="font-bold text-sm block">
                Current Vision AI Status: {scannerStatus?.visionAiConfigured ? `Active & Configured (${scannerStatus?.provider || 'Google Gemini Flash Vision AI'})` : 'Unconfigured in server/.env'}
              </span>
              <p className="mt-1 leading-relaxed">
                {scannerStatus?.visionAiConfigured
                  ? 'Multimodal Vision AI is currently active. Photos submitted with consent are analyzed directly in-memory.'
                  : 'NutriVita operates with strict scientific integrity. When GEMINI_API_KEY is not configured in server/.env, no artificial intelligence is simulated or faked. The application runs transparently on client-side Tesseract.js OCR and our clinically verified 53-food database.'}
              </p>
            </div>
          </div>

          {/* The 5 System Modes */}
          <h4 className="font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
            The 5 Nutrition Assessment Modes in NutriVita
          </h4>
          <div className="space-y-2.5">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">1. Multimodal Vision AI ({scannerStatus?.provider || 'Google Gemini Flash Vision AI'})</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scannerStatus?.visionAiConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                  {scannerStatus?.visionAiConfigured ? 'Active' : 'Requires API Key'}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Analyzes visual food images and physical signs directly. Enabled by adding <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">GEMINI_API_KEY</code> into <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">server/.env</code>. All images are processed strictly in-memory and never stored on disk.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">2. Nutrition Label OCR (Tesseract.js)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active (Local Browser)
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Runs optical character recognition directly inside your web browser. Parses printed packaged facts panels (serving sizes, calories, fats, carbs, sugars, fiber, protein, and sodium). No external network key required.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">3. NutriVita Reference Food Database</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active (53 Verified Items)
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Whole fresh produce (Fresh Apple, Banana, Coconut, Guava, Carrot, Spinach) and traditional dishes have no printed packaging labels. NutriVita matches images against its verified database and auto-populates clinical 100g reference values.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">4. Manual Nutrition Entry</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Always Available
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Allows students, researchers, and users to directly type or adjust any nutrient value for unlisted home-cooked recipes or obscure packaging, with real-time educational grade updates.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">5. Clinical Nutrition Knowledge & Grading Engine</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active (Deterministic)
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Scientific algorithms grounded in WHO, ICMR-NIN, and FSSAI dietary guidelines that compute the 0–100 quality score, Educational Grades (A through E), positive/negative factor points, and deficiency correlations.
              </p>
            </div>
          </div>

          {/* Setup Guide */}
          {!scannerStatus?.visionAiConfigured && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2 mt-3">
              <h5 className="font-bold text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                How to configure Google Gemini Vision AI in NutriVita
              </h5>
              <ol className="list-decimal pl-5 space-y-1 text-blue-900">
                <li>Get a free Gemini API key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-blue-700">Google AI Studio</a>.</li>
                <li>Open the <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">server/.env</code> file in your NutriVita folder.</li>
                <li>Add: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY=your_gemini_api_key_here</code>.</li>
                <li>Restart the backend server (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono">node server/server.js</code>).</li>
              </ol>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LabelLens;
