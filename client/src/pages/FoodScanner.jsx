import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Scan, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Apple, 
  ArrowRight, 
  X,
  Camera,
  Sparkles,
  Edit3,
  Scale,
  HelpCircle,
  Layers,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import scannerService from '../services/scannerService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import FoodDetailModal from '../components/food/FoodDetailModal';
import CameraModal from '../components/common/CameraModal';
import BackButton from '../components/common/BackButton';
import { getVerifiedFoodImageUrl } from '../utils/foodImageFallback';

const FoodScanner = () => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';
  const navigate = useNavigate();

  // Upload, Camera & Scan state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [labelHint, setLabelHint] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Portion Adjuster & Correction state
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [customGrams, setCustomGrams] = useState(150);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [showNameCorrection, setShowNameCorrection] = useState(false);
  const [correctionInput, setCorrectionInput] = useState('');

  // Fallback search state
  const [fallbackQuery, setFallbackQuery] = useState('');
  const [fallbackResults, setFallbackResults] = useState([]);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  // Detail Modal state
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);

  // Reset state when selecting or taking a new photo
  const resetScanState = () => {
    setScanResult(null);
    setUploadError('');
    setPortionMultiplier(1);
    setShowNameCorrection(false);
    setCorrectionInput('');
  };

  const handleFileChange = (e) => {
    resetScanState();
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported file format. Please upload a valid JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCameraCapture = ({ file, dataUrl }) => {
    resetScanState();
    setSelectedFile(file);
    setPreviewUrl(dataUrl);
    setIsCameraOpen(false);
    // Execute scan immediately upon camera capture approval
    executeScan(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    resetScanState();
  };

  const executeScan = async (fileToScan) => {
    const targetFile = fileToScan || selectedFile;
    if (!targetFile) {
      setUploadError('Please select or capture a food photo first.');
      return;
    }

    setScanning(true);
    setUploadError('');
    setScanStep('Analyzing food with Google Gemini Multimodal Vision AI...');

    try {
      const formData = new FormData();
      formData.append('image', targetFile);
      if (labelHint) formData.append('labelHint', labelHint);

      const res = await scannerService.identifyFood(formData);
      setScanResult(res);

      if (res.matched) {
        const baseGrams = res.matched.servingWeightGrams || 150;
        setCustomGrams(baseGrams);
        setPortionMultiplier(1);
      } else if (!res.success && res.isFood !== false) {
        const msg = res.message || res.error || 'Vision AI could not identify this food image.';
        setUploadError(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Scanning encountered an error. Please try again or use manual search.';
      setUploadError(msg);
    } finally {
      setScanning(false);
      setScanStep('');
    }
  };

  const handleScan = () => {
    executeScan(selectedFile);
  };

  // Adjust portion size and dynamically update nutrition values
  const handlePortionChange = async (targetMultiplier, targetGrams) => {
    if (!scanResult?.matched) return;
    setPortionMultiplier(targetMultiplier);
    setCustomGrams(targetGrams);
    setIsRecalculating(true);

    try {
      const res = await scannerService.correctOrRecalculate({
        currentFood: scanResult.matched,
        targetWeightGrams: targetGrams,
        portionMultiplier: targetMultiplier,
      });

      if (res.success && res.data) {
        setScanResult(prev => ({
          ...prev,
          matched: res.data,
        }));
      }
    } catch (err) {
      console.warn('Portion scaling notice:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  // Submit manual correction for food name
  const handleApplyCorrection = async (chosenName) => {
    const targetName = chosenName || correctionInput;
    if (!targetName || !targetName.trim()) return;

    setIsRecalculating(true);
    try {
      const res = await scannerService.correctOrRecalculate({
        foodName: targetName.trim(),
        targetWeightGrams: customGrams,
      });

      if (res.success && res.data) {
        setScanResult(prev => ({
          ...prev,
          isFood: true,
          matched: res.data,
          recognizedName: res.data.name,
          confidenceLevel: 'high',
          clarificationQuestion: null,
          possibleAlternatives: [],
          message: res.message || `Identified as ${res.data.name}`,
        }));
        setShowNameCorrection(false);
        setCorrectionInput('');
      }
    } catch (err) {
      console.warn('Correction error:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleFallbackSearch = async (e) => {
    const q = e ? e.target.value : fallbackQuery;
    setFallbackQuery(q);

    if (!q || !q.trim()) {
      setFallbackResults([]);
      return;
    }

    setFallbackLoading(true);
    try {
      const res = await scannerService.searchFallback(q);
      setFallbackResults(res.data || []);
    } catch (err) {
      setFallbackResults([]);
    } finally {
      setFallbackLoading(false);
    }
  };

  const handleQuickSelectFood = (food) => {
    setScanResult({
      success: true,
      visionAiAvailable: true,
      isFood: true,
      matched: {
        ...food,
        nutritionSource: 'verified_db',
        isVerifiedDatabase: true,
      },
      recognizedName: food.name,
      confidenceLevel: 'high',
      source: 'manual_selection',
      message: `Selected from verified NutriVita database: ${food.name}`,
    });
    setCustomGrams(food.servingWeightGrams || 100);
    setPortionMultiplier(1);
  };

  const isVerifiedDatabase = scanResult?.matched?.nutritionSource === 'verified_db' || scanResult?.matched?.isVerifiedDatabase;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BackButton fallbackPath="/dashboard" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              NutriVita Universal Food Vision AI
            </span>
            <span className="text-xs text-slate-400">• Multi-Model Vision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTelugu ? 'ఆహారాన్ని స్కాన్ చేసి విశ్లేషించండి' : 'Universal Food & Meal Vision Scanner'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {isTelugu
              ? 'ఏదైనా ఆహారం, వంటకం, పండ్లు లేదా భోజనం ఫోటోను తీయండి లేదా అప్‌లోడ్ చేయండి. మల్టీమోడల్ విజన్ AI ద్వారా పోషకాలు మరియు విటమిన్లను తెలుసుకోండి.'
              : 'Upload or capture a photo of ANY food item, homemade dish, fruit, snack, or mixed meal. NutriVita detects ingredients, estimates macros and micronutrients, and provides verified clinical reference data.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Upload & Camera Scanner (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="space-y-5 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Scan className="w-4 h-4 text-emerald-600" />
                <span>Input Food Photo</span>
              </h2>
              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Max 10MB)</span>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{uploadError}</p>
                  <p className="text-[11px] text-rose-600 mt-0.5">
                    Tip: Try capturing another angle or use the manual search below.
                  </p>
                </div>
              </div>
            )}

            {/* Capture / Upload Zone */}
            {!previewUrl ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A: Take Photo via Camera */}
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group shadow-2xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                      Use Device Camera
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Snap live plate or food
                    </p>
                  </button>

                  {/* Option B: Upload File */}
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group shadow-2xs">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-2.5 group-hover:bg-emerald-100 group-hover:text-emerald-700 group-hover:scale-105 transition-all">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                      Upload from Device
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG or WEBP
                    </p>
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Works with all meals: Indian thalis, fruits, curries, global dishes, snacks & packaged foods.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-64 max-h-72 w-full flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Food preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1.5">
                    <span>{selectedFile?.name || 'Captured photo'}</span>
                    {selectedFile?.size && (
                      <span className="text-slate-300">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                    )}
                  </div>
                </div>

                {/* Optional Hint input to boost recognition */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                    <span>Dish Name or Preparation Hint (Optional)</span>
                    <span className="text-[10px] text-slate-400">Assists subtle recipe variants</span>
                  </label>
                  <input
                    type="text"
                    value={labelHint}
                    onChange={(e) => setLabelHint(e.target.value)}
                    placeholder="e.g. Pineapple, Chicken Biryani, Medu Vada, Paneer Tikka, Pizza..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Scan Action Controls */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleScan}
                    variant="primary"
                    size="md"
                    loading={scanning}
                    className="flex-1 font-bold shadow-md"
                  >
                    <Scan className="w-4 h-4 mr-1.5" />
                    <span>{scanning ? (scanStep || 'Analyzing Image...') : 'Scan with Gemini Vision AI'}</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    variant="outline"
                    size="md"
                    title="Retake with camera"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Manual Search Fallback */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Verified Food Search</span>
              </h3>
              <span className="text-[10px] text-slate-400">Database Lookup</span>
            </div>

            <p className="text-xs text-slate-500">
              Search any verified whole food or regional specialty to inspect immediate laboratory nutritional baselines:
            </p>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={fallbackQuery}
                onChange={handleFallbackSearch}
                placeholder="Type food name (e.g. Apple, Biryani, Palak, Ragi, Guava, Egg)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            {fallbackLoading && (
              <p className="text-xs text-slate-400 italic">Searching verified database...</p>
            )}

            {fallbackResults.length > 0 && (
              <div className="space-y-2 pt-2 max-h-56 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Matching Foods in Database ({fallbackResults.length}):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fallbackResults.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleQuickSelectFood(food)}
                      className="p-2 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 flex items-center gap-2.5 text-left transition-all group"
                    >
                      <img
                        src={getVerifiedFoodImageUrl(food)}
                        alt={food.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&auto=format&fit=crop&q=80';
                        }}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                          {food.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {food.calories} kcal • {food.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Universal Identification & Nutrition Results (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Scanning Progress Banner */}
          {scanning && (
            <Card className="p-6 text-center space-y-4 bg-emerald-50/50 border-emerald-200">
              <div className="w-12 h-12 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">
                  Multimodal AI Analysis in Progress
                </h3>
                <p className="text-xs text-slate-600">
                  {scanStep || 'Detecting visual food features and estimating nutritional density...'}
                </p>
              </div>
            </Card>
          )}

          {/* Non-Food Detected Notice */}
          {scanResult && scanResult.isFood === false && !scanning && (
            <Card className="p-6 space-y-4 border-amber-200 bg-amber-50/40">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-950">
                    No Food Detected in Photo
                  </h3>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    {scanResult.visualObservations || 'The uploaded image did not contain recognized edible food items.'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                {scanResult.clarificationQuestion || 'Please take or upload a photo showing a cooked dish, fresh fruit, vegetable, or snack.'}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setIsCameraOpen(true)}
                  variant="primary"
                  size="sm"
                  className="gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take Another Photo</span>
                </Button>
                <Button
                  onClick={handleRemoveFile}
                  variant="outline"
                  size="sm"
                >
                  Clear Photo
                </Button>
              </div>
            </Card>
          )}

          {/* Success: Matched Food Result (Verified DB OR Universal Food) */}
          {scanResult?.matched && !scanning && (
            <Card className="p-6 space-y-5 border-emerald-200 shadow-soft-lg">
              
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Food Identified
                    </h3>
                    <p className="text-[10px] text-emerald-700 font-semibold">
                      {scanResult.confidenceLevel ? `${scanResult.confidenceLevel.toUpperCase()} Confidence` : 'High Confidence'}
                    </p>
                  </div>
                </div>

                {/* Provenance Badge */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isVerifiedDatabase ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span>✓ Verified NutriVita Database</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Universal Vision AI Estimate</span>
                    </span>
                  )}
                  <Badge variant="emerald" size="sm">
                    {(scanResult.matched.category || 'meal').replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Matched Food Banner with Image Preview */}
              <div className="rounded-2xl overflow-hidden bg-slate-900 h-48 relative">
                <img
                  src={previewUrl || getVerifiedFoodImageUrl(scanResult.matched)}
                  alt={scanResult.matched.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-slate-900/80 text-white backdrop-blur-sm text-xs font-bold">
                  {scanResult.matched.calories} kcal • {scanResult.matched.servingSize || `${customGrams}g`}
                </div>
              </div>

              {/* Food Title & Visual Observations */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      {scanResult.matched.name}
                    </h2>
                    {scanResult.matched.teluguName && (
                      <p className="text-xs text-emerald-700 font-medium">
                        {scanResult.matched.teluguName}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setCorrectionInput(scanResult.matched.name);
                      setShowNameCorrection(true);
                    }}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 shrink-0 mt-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Correct Name</span>
                  </button>
                </div>

                {/* Inline Name Correction Input */}
                {showNameCorrection && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="text-[11px] font-semibold text-slate-700 block">
                      Edit food or dish name:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={correctionInput}
                        onChange={(e) => setCorrectionInput(e.target.value)}
                        placeholder="e.g. Chicken Biryani, Medu Vada, Paneer Butter Masala..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleApplyCorrection(correctionInput)}
                        loading={isRecalculating}
                      >
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNameCorrection(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Visual Observations rationale */}
                {scanResult.visualObservations && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-slate-700">Visual Identification: </strong>
                      {scanResult.visualObservations}
                    </p>
                  </div>
                )}

                {/* Mixed Meal Detected Components */}
                {scanResult.detectedFoods?.length > 1 && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-700" />
                      Detected Meal Components:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {scanResult.detectedFoods.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-medium"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ambiguity / Clarification question */}
                {scanResult.clarificationQuestion && scanResult.possibleAlternatives?.length > 0 && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                    <p className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      {scanResult.clarificationQuestion}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.possibleAlternatives.map((alt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleApplyCorrection(alt)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
                        >
                          {alt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Portion Adjuster */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    Adjust Serving Size:
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {customGrams}g portion {portionMultiplier !== 1 && `(${portionMultiplier}x)`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: '0.5x Half', factor: 0.5, grams: Math.round((scanResult.matched.servingWeightGrams || 150) * 0.5) },
                    { label: '1x Standard', factor: 1.0, grams: scanResult.matched.servingWeightGrams || 150 },
                    { label: '1.5x Large', factor: 1.5, grams: Math.round((scanResult.matched.servingWeightGrams || 150) * 1.5) },
                    { label: '2x Double', factor: 2.0, grams: Math.round((scanResult.matched.servingWeightGrams || 150) * 2.0) }
                  ].map(opt => (
                    <button
                      key={opt.factor}
                      onClick={() => handlePortionChange(opt.factor, opt.grams)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        portionMultiplier === opt.factor
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Nutrition Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Protein</p>
                  <p className="text-xs font-bold text-slate-800">
                    {scanResult.matched.macronutrients?.protein ?? 0}g
                  </p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Carbs</p>
                  <p className="text-xs font-bold text-slate-800">
                    {scanResult.matched.macronutrients?.carbs ?? 0}g
                  </p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Total Fat</p>
                  <p className="text-xs font-bold text-slate-800">
                    {scanResult.matched.macronutrients?.fats ?? 0}g
                  </p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Fiber</p>
                  <p className="text-xs font-bold text-slate-800">
                    {scanResult.matched.macronutrients?.fiber ?? 0}g
                  </p>
                </div>
              </div>

              {/* Secondary Nutrients (Sodium, Sugars, Saturated Fat) */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-1.5 bg-slate-50/60 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Sodium</span>
                  <span className="font-semibold text-slate-700">
                    {scanResult.matched.minerals?.sodium ?? '—'} mg
                  </span>
                </div>
                <div className="p-1.5 bg-slate-50/60 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Saturated Fat</span>
                  <span className="font-semibold text-slate-700">
                    {scanResult.matched.macronutrients?.saturatedFat ?? '—'} g
                  </span>
                </div>
                <div className="p-1.5 bg-slate-50/60 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Sugars</span>
                  <span className="font-semibold text-slate-700">
                    {scanResult.matched.macronutrients?.sugars ?? '—'} g
                  </span>
                </div>
              </div>

              {/* Health Benefits & Culinary Guidance */}
              <div className="space-y-2 text-xs">
                {scanResult.matched.benefitsEn && (
                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Nutritional Benefits: </strong>
                    {isTelugu && scanResult.matched.benefitsTe ? scanResult.matched.benefitsTe : scanResult.matched.benefitsEn}
                  </p>
                )}
                {scanResult.matched.servingGuidance && (
                  <p className="text-emerald-800 bg-emerald-50/50 p-2 rounded-lg leading-relaxed">
                    <strong>Serving Tip: </strong>
                    {scanResult.matched.servingGuidance}
                  </p>
                )}
                {scanResult.matched.preparationNotes && (
                  <p className="text-[11px] text-slate-500 italic">
                    Note: {scanResult.matched.preparationNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedFoodForModal(scanResult.matched)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <span>View Complete Micronutrient Radar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate('/balance-my-meal', { state: { addFood: scanResult.matched, quantity: customGrams || 100 } })}
                    className="py-2 px-3 rounded-xl border border-emerald-300 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Add to Balance Meal</span>
                  </button>
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Idle State: Guide when no scan performed */}
          {!scanResult && !scanning && (
            <Card className="p-8 text-center space-y-4 bg-slate-50/70 border-dashed border-slate-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Apple className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-800">
                  Ready to Recognize ANY Food
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Capture or upload any food image. NutriVita analyzes visual textures, detects ingredients, and produces nutritional values for both local and universal dishes.
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 text-left space-y-1.5 text-xs">
                <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                  Universal Capabilities:
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  • <strong>Local Superfoods:</strong> Amla, Ragi Sangati, Gongura Pappu, Tomato Dal, Palak, Curd<br />
                  • <strong>Global Dishes:</strong> Biryani, Medu Vada, Pizza, Noodles, Curries, Sandwiches, Soups<br />
                  • <strong>Mixed Plates:</strong> Thalis and meal trays with visible component breakdowns<br />
                  • <strong>Portion Scaling:</strong> Adjust serving grams with instant proportional nutrient updates
                </p>
              </div>
            </Card>
          )}
        </div>

      </div>

      {/* Universal Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title="Capture Food or Meal Photo"
        guideType="rectangle"
        instruction="Center the food, dish, or plate within the frame and capture."
        fileName="food-capture.jpg"
      />

      {/* Food Details Modal */}
      <FoodDetailModal
        food={selectedFoodForModal}
        isOpen={!!selectedFoodForModal}
        onClose={() => setSelectedFoodForModal(null)}
      />

    </div>
  );
};

export default FoodScanner;
