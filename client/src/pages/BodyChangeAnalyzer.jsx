import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  AlertTriangle,
  Check,
  Info,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Activity,
  Eye,
  Smile,
  Hand,
  Shield,
  HeartPulse,
  ExternalLink,
  Lock,
  ChevronRight,
  CheckCircle2,
  Clock,
  Apple,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import CameraModal from '../components/common/CameraModal';
import BackButton from '../components/common/BackButton';
import { getVerifiedFoodImageUrl } from '../utils/foodImageFallback';
import { DEFAULT_BODY_AREAS } from '../data/bodyAreasFallback';

const ASSOCIATED_SYMPTOM_OPTIONS = [
  { id: 'fatigue', en: 'Persistent Daytime Fatigue', te: 'పగటిపూట నిరంతరం అలసట' },
  { id: 'cold_intolerance', en: 'Cold Sensitivity / Chilled Hands', te: 'చలి తట్టుకోలేకపోవడం / చేతులు చల్లబడటం' },
  { id: 'muscle_weakness', en: 'Muscle Weakness / Heaviness', te: 'కండరాల బలహీనత / కాళ్ల బరువు' },
  { id: 'poor_sleep', en: 'Disturbed Sleep or Restlessness', te: 'నిద్రలేమి లేదా కాళ్ల అసౌకర్యం' },
  { id: 'digestive_issues', en: 'Sluggish Digestion / Bloating', te: 'జీర్ణశక్తి మందగించడం / కడుపు ఉబ్బరం' },
  { id: 'tingling_pins', en: 'Tingling / Pins & Needles Sensation', te: 'కాళ్లు, చేతుల్లో తిమ్మిర్లు / సూదులు గుచ్చినట్లు' },
];

const DURATION_OPTIONS = [
  { id: 'less_than_1_week', en: 'Less than 1 week', te: '1 వారం కంటే తక్కువ' },
  { id: '1_to_4_weeks', en: '1 to 4 weeks', te: '1 నుండి 4 వారాలు' },
  { id: '1_to_3_months', en: '1 to 3 months', te: '1 నుండి 3 నెలలు' },
  { id: 'more_than_3_months', en: 'More than 3 months', te: '3 నెలల కంటే ఎక్కువ' },
];

const BodyChangeAnalyzer = () => {
  const { t, language } = useLanguage();
  const isTelugu = language === 'te';

  // Areas data loaded from backend or immediate fallback
  const [areas, setAreas] = useState(DEFAULT_BODY_AREAS);
  const [loadingAreas, setLoadingAreas] = useState(false);

  // User selection states
  const [selectedAreaId, setSelectedAreaId] = useState(DEFAULT_BODY_AREAS[0]?.id || 'nails');
  const [selectedChangeId, setSelectedChangeId] = useState(DEFAULT_BODY_AREAS[0]?.changes[0]?.id || 'spoon_nails');
  const [selectedDuration, setSelectedDuration] = useState('1_to_4_weeks');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // Image, camera & AI consent states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [aiConsent, setAiConsent] = useState(false);
  const fileInputRef = useRef(null);

  // Analysis status & results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [analyzerStatus, setAnalyzerStatus] = useState(null);
  const [showModesModal, setShowModesModal] = useState(false);

  // Fetch areas metadata and analyzer status on mount
  useEffect(() => {
    fetch('/api/body-analyzer/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnalyzerStatus(data);
      })
      .catch((err) => console.warn('Body analyzer status notice:', err));

    const fetchAreas = async () => {
      try {
        const res = await fetch(`/api/body-analyzer/areas?language=${language}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setAreas(data.data);
          if (data.data.length > 0) {
            setSelectedAreaId(data.data[0].id);
            if (data.data[0].changes?.length > 0) {
              setSelectedChangeId(data.data[0].changes[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch body areas:', err);
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, [language]);

  // When area changes, update default selected change
  const handleAreaSelect = (areaId) => {
    setSelectedAreaId(areaId);
    const area = areas.find((a) => a.id === areaId);
    if (area && area.changes?.length > 0) {
      setSelectedChangeId(area.changes[0].id);
    }
  };

  // Toggle associated symptoms
  const toggleSymptom = (symId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symId) ? prev.filter((id) => id !== symId) : [...prev, symId]
    );
  };

  // Handle file select
  const handleFileChange = (e) => {
    setAnalysisError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAnalysisError(t('labelLens.errorInvalidType') || 'Unsupported format. Please upload JPG, PNG, or WEBP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAnalysisError(t('labelLens.errorTooLarge') || 'Image size exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Drag & drop
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
    setAnalysisError('');
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAnalysisError(t('labelLens.errorInvalidType') || 'Unsupported format. Please upload JPG, PNG, or WEBP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAnalysisError(t('labelLens.errorTooLarge') || 'Image size exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Camera modal handler
  const handleOpenModalCamera = () => {
    setAnalysisError('');
    setCameraError('');
    setCameraActive(true);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCameraError('');
    setAiConsent(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit assessment request
  const handleAnalyze = async () => {
    if (!selectedAreaId || !selectedChangeId) {
      setAnalysisError('Please choose a body area and observable sign.');
      return;
    }

    // Require explicit user consent if photo is attached
    if (selectedFile && !aiConsent) {
      setAnalysisError(
        t('bodyChangeAnalyzer.aiConsentError') ||
          'Please confirm the AI processing consent checkbox before proceeding with photo analysis.'
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      const formData = new FormData();
      formData.append('bodyArea', selectedAreaId);
      formData.append('physicalChange', selectedChangeId);
      formData.append('duration', selectedDuration);
      formData.append('associatedSymptoms', JSON.stringify(selectedSymptoms));
      formData.append('language', language);

      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const res = await fetch('/api/body-analyzer/assess', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to complete physical sign analysis.');
      }

      setAssessmentResult(json.data);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err) {
      console.error('Assessment error:', err);
      setAnalysisError(err.message || 'Error occurred while analyzing physical sign.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAssessmentResult(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setAiConsent(false);
    setSelectedSymptoms([]);
    setAnalysisError('');
    setCameraError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper icon renderer
  const renderAreaIcon = (iconName) => {
    switch (iconName) {
      case 'Hand':
        return <Hand className="w-5 h-5 text-emerald-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-blue-600" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-amber-600" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-rose-600" />;
      case 'Activity':
      default:
        return <Activity className="w-5 h-5 text-teal-600" />;
    }
  };

  const selectedArea = areas.find((a) => a.id === selectedAreaId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/dashboard" />
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          <span>{t('bodyChangeAnalyzer.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t('bodyChangeAnalyzer.headerTitle')}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {t('bodyChangeAnalyzer.subtitle')}
        </p>
      </div>

      {/* Safety & Non-Diagnostic Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-sm">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">{t('disclaimer.badge')}: </span>
          <span>{t('bodyChangeAnalyzer.disclaimer')}</span>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-emerald-950 text-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{t('bodyChangeAnalyzer.privacyNotice')}</span>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] bg-white/80 px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-semibold">
          In-Memory Processing
        </span>
      </div>

      {/* Active Assessment Engine & Modes Explainer Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-white border border-gray-200 rounded-xl text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold text-gray-900">
            <Activity className="w-4 h-4 text-emerald-600" />
            Active Assessment Engine:
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            analyzerStatus?.visionAiReachable
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}>
            {analyzerStatus?.visionAiReachable
              ? 'Google Gemini Vision AI Active & Clinical Rules Engine'
              : 'Educational Rules-Based Mode Active (Vision AI unconfigured in server/.env)'}
          </span>
          <span className="text-gray-500 text-[11px]">
            • Evidence-Based Clinical Nutrition Knowledge
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

      {/* Assessment Workflow Form */}
      {!assessmentResult && (
        <div className="space-y-8">
          {/* Step 1: Body Area Selection */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">1</span>
                {t('bodyChangeAnalyzer.step1Title')}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t('bodyChangeAnalyzer.step1Subtitle')}
              </p>
            </div>

            {loadingAreas ? (
              <div className="p-8 text-center text-xs text-gray-500">Loading anatomical catalog...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {areas.map((area) => {
                  const isSelected = area.id === selectedAreaId;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => handleAreaSelect(area.id)}
                      className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
                      }`}
                    >
                      <div>
                        <div className="p-2 w-fit rounded-lg bg-gray-100 mb-2">
                          {renderAreaIcon(area.icon)}
                        </div>
                        <h3 className="text-xs font-bold text-gray-900">
                          {isTelugu ? area.nameTe : area.nameEn}
                        </h3>
                      </div>
                      {isSelected && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Specific Observable Physical Change */}
          {selectedArea && selectedArea.changes?.length > 0 && (
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">2</span>
                  {t('bodyChangeAnalyzer.step2Title')}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('bodyChangeAnalyzer.step2Subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedArea.changes.map((change) => {
                  const isSelected = change.id === selectedChangeId;
                  return (
                    <button
                      key={change.id}
                      type="button"
                      onClick={() => setSelectedChangeId(change.id)}
                      className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold text-gray-900">
                            {isTelugu ? change.nameTe : change.nameEn}
                          </h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 line-clamp-3">
                          {isTelugu ? change.descriptionTe : change.descriptionEn}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Duration */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">3</span>
                {t('bodyChangeAnalyzer.step3Title')}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDuration(opt.id)}
                  className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    selectedDuration === opt.id
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isTelugu ? opt.te : opt.en}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Associated Symptoms (Optional) */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">4</span>
                {t('bodyChangeAnalyzer.step4Title')}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {ASSOCIATED_SYMPTOM_OPTIONS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
                    <span>{isTelugu ? sym.te : sym.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Optional Photo Upload / Camera Capture */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">5</span>
                {t('bodyChangeAnalyzer.step5Title')}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t('bodyChangeAnalyzer.step5Subtitle')}
              </p>
            </div>

            <Card className="p-6 border border-gray-200 bg-white">
              {analysisError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{analysisError}</span>
                </div>
              )}

              {cameraError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {!previewUrl ? (
                <>
                  <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-gray-300 hover:border-emerald-400 bg-gray-50/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-full">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {isDragging ? 'Drop photo here' : t('bodyChangeAnalyzer.uploadButton')}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        JPG, PNG, WEBP (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                {!previewUrl && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleOpenModalCamera}
                      className="w-full text-xs font-medium border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                      {t('bodyChangeAnalyzer.cameraButton')}
                    </Button>
                  </div>
                )}
              </>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-900 max-h-64 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Physical Sign Preview"
                      className="object-contain max-h-64 w-full"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                      aria-label="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      Replace Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenModalCamera}
                      className="text-xs"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1" />
                      Use Camera
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="text-xs"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {/* Explicit AI Consent Checkbox (Required before Vision AI execution) */}
              {selectedFile && (
                <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiConsent}
                      onChange={(e) => setAiConsent(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-gray-800 font-medium leading-relaxed">
                      {t('bodyChangeAnalyzer.aiConsentLabel') ||
                        'I understand this photo will be processed by AI for nutrition awareness purposes only. No personal health information is permanently stored.'}
                    </span>
                  </label>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1.5 pl-6">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t('bodyChangeAnalyzer.privacyNotice') || 'Privacy Assured: Photos are processed in-memory and never saved to disk or database.'}</span>
                  </p>
                </div>
              )}

              {/* End of Upload / Camera section */}
            </Card>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              onClick={handleAnalyze}
              disabled={isAnalyzing || (Boolean(selectedFile) && !aiConsent)}
              className="w-full sm:w-auto text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{t('bodyChangeAnalyzer.analyzing')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('bodyChangeAnalyzer.analyzeButton')}</span>
                </>
              )}
            </Button>
            {!selectedFile && (
              <span className="text-xs text-gray-500">
                (Proceeding with observable sign assessment)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results View */}
      {assessmentResult && (
        <div className="space-y-6">
          <Card className="p-6 border border-gray-200 shadow-sm bg-white space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {t('bodyChangeAnalyzer.resultsTitle')}
                </span>
                <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                  {assessmentResult.physicalChange?.name} ({assessmentResult.bodyArea?.name})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reported duration: {assessmentResult.duration?.replace(/_/g, ' ')}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  {t('bodyChangeAnalyzer.startNew')}
                </Button>
              </div>
            </div>

            {/* 1. Assessment Mode & Processing Banner */}
            {assessmentResult.visionAiUsed ? (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2.5 text-xs text-purple-950">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">
                      Multi-modal Vision AI Analysis ({assessmentResult.provider || 'Google Gemini 1.5 Flash'}):
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      Photo Processed by AI
                    </span>
                  </div>
                  <p className="mt-1 text-purple-900 leading-relaxed font-medium">{assessmentResult.visualObservations}</p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start justify-between gap-2.5 text-xs text-amber-950">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">Assessment Mode: </span>
                    <p className="mt-0.5 leading-relaxed text-amber-900">
                      {assessmentResult.apiKeyNotice ||
                        'Educational Rules-Based Mode Active. Your guidance is based on the selected body area and reported symptoms. AI-powered photo analysis is currently unavailable because the vision service has not been configured.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModesModal(true)}
                  className="shrink-0 text-amber-900 hover:text-amber-950 font-semibold underline text-xs cursor-pointer ml-2 mt-0.5"
                >
                  Modes Explained
                </button>
              </div>
            )}

            {/* 2. Structured Section: Visible Observations vs User-Reported Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Visible Observations Card */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    Visible Observations
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    assessmentResult.photoAnalyzed
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {assessmentResult.photoAnalyzed ? 'AI Visual Inspection' : 'Manual Selection Only'}
                  </span>
                </div>
                {assessmentResult.photoAnalyzed ? (
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">AI Visual Findings: </span>
                    {assessmentResult.visualObservations}
                  </p>
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    Selected sign: <span className="font-semibold text-gray-900">{assessmentResult.physicalChange?.name}</span> ({assessmentResult.bodyArea?.name}).
                    <span className="block mt-1 text-[11px] text-gray-500 italic">
                      Visual photo analysis was not performed by AI. No automated diagnosis was drawn from imagery.
                    </span>
                  </p>
                )}
              </div>

              {/* User-Reported Symptoms & Timeline Card */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    User-Reported Symptoms & Context
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500">
                    Duration: {assessmentResult.duration?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block mb-1">Reported associated symptoms:</span>
                  {assessmentResult.associatedSymptoms && assessmentResult.associatedSymptoms.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {assessmentResult.associatedSymptoms.map((symId, idx) => {
                        const opt = ASSOCIATED_SYMPTOM_OPTIONS.find((s) => s.id === symId);
                        const label = opt ? (isTelugu ? opt.te : opt.en) : symId.replace(/_/g, ' ');
                        return (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-800 text-[11px] font-medium"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-500 italic text-[11px]">No additional symptoms reported by user</span>
                  )}
                </div>
              </div>
            </div>

            {/* Urgency Level Badge */}
            <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <Clock className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <span className="font-semibold text-gray-700">{t('bodyChangeAnalyzer.urgencyTitle')}: </span>
                <span className="font-bold text-emerald-900">{assessmentResult.urgencyLevel}</span>
              </div>
            </div>

            {/* 3. Possible Nutritional Associations (Educational Hypotheses) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  Possible Nutritional Associations (Educational Hypotheses)
                </h3>
                <span className="text-[11px] text-gray-500">
                  Evidence-based correlations, not clinical proof
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assessmentResult.correlatedNutrients?.map((n, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">{n.nutrient}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          n.confidence === 'Very High' || n.confidence === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {n.confidence} Confidence
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">{n.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Synergies Advice */}
            {assessmentResult.synergies?.length > 0 && (
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  {t('bodyChangeAnalyzer.synergiesTitle')}
                </h4>
                <div className="space-y-1.5 text-xs text-blue-950">
                  {assessmentResult.synergies.map((syn, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-bold text-blue-900">{syn.pair}: </span>
                      <span>{syn.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Whole Foods from NutriVita Database */}
            {assessmentResult.recommendedFoods?.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Apple className="w-4 h-4 text-emerald-600" />
                    {t('bodyChangeAnalyzer.foodsTitle')}
                  </h3>
                  <Link
                    to="/food-explorer"
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                  >
                    {t('bodyChangeAnalyzer.exploreFoods')}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {assessmentResult.recommendedFoods.map((food) => (
                    <Link
                      key={food.id}
                      to={`/food-explorer?search=${encodeURIComponent(food.id)}`}
                      className="group p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 bg-white transition-all text-left flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 mb-2">
                          <img
                            src={getVerifiedFoodImageUrl(food)}
                            alt={food.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {isTelugu ? food.teluguName : food.name}
                        </h4>
                        <span className="text-[10px] text-gray-500 block">
                          {food.calories} kcal ({food.servingSize})
                        </span>
                      </div>
                      <span className="mt-2 text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        View profile <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags Card */}
            {assessmentResult.redFlags?.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  {t('bodyChangeAnalyzer.redFlagsTitle')}
                </h4>
                <ul className="space-y-1 text-xs text-rose-950">
                  {assessmentResult.redFlags.map((rf, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Non-Diagnostic Medical Notice & Confirmed Facts */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Confirmed Medical Notice: Educational & Non-Diagnostic</span>
              </div>
              <p className="text-amber-900 leading-relaxed font-medium">
                {assessmentResult.nonDiagnosticNotice ||
                  'Important Medical Notice: This assessment is strictly educational and non-diagnostic. A photograph or symptom check is NOT clinical proof of a vitamin deficiency or disease. Laboratory diagnostic tests (e.g. serum ferritin, vitamin assays) and certified physician evaluation are required for medical diagnosis.'}
              </p>
              <div className="text-[11px] text-amber-800 pt-1.5 border-t border-amber-200/60 flex items-center gap-2">
                <span className="font-semibold shrink-0">Clinical confirmation:</span>
                <span>Physical signs often have multiple non-nutritional etiologies (dermatological, genetic, or environmental). Always consult a healthcare professional before altering medication or starting high-dose supplementation.</span>
              </div>
            </div>

            {/* Deep Links Navigation */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Link to="/food-explorer">
                  <Button variant="outline" size="sm" className="text-xs">
                    {t('bodyChangeAnalyzer.exploreFoods')}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
                <Link to="/vitamins">
                  <Button variant="outline" size="sm" className="text-xs">
                    {t('bodyChangeAnalyzer.checkVitamins')}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
                <Link to="/symptom-checker">
                  <Button variant="outline" size="sm" className="text-xs">
                    {t('bodyChangeAnalyzer.checkSymptoms')}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleReset}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                {t('bodyChangeAnalyzer.startNew')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Universal Camera Capture Modal */}
      <CameraModal
        isOpen={cameraActive}
        onClose={() => setCameraActive(false)}
        onCapture={(file, dataUrl) => {
          setSelectedFile(file);
          setPreviewUrl(dataUrl);
          setAiConsent(false);
        }}
        title="Capture Physical Sign Photo"
        guideType="oval"
        instruction="Align the physical sign (nail, hair, eye, mouth, skin) clearly inside the camera frame with good lighting."
        fileName="body-sign.jpg"
      />

      {/* Educational Modal: Understanding NutriVita Assessment & Analysis Modes */}
      <Modal
        isOpen={showModesModal}
        onClose={() => setShowModesModal(false)}
        title="NutriVita Assessment & Analysis Modes Explained"
        subtitle="Transparent guide to multimodal Vision AI, physical sign clinical analysis, and evidence-based nutrition"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs text-gray-700">
          {/* Current Vision AI API Status */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            analyzerStatus?.visionAiConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <Info className={`w-5 h-5 shrink-0 mt-0.5 ${analyzerStatus?.visionAiConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <span className="font-bold text-sm block">
                Current Vision AI Status: {analyzerStatus?.visionAiConfigured ? `Active & Configured (${analyzerStatus?.provider || 'Google Gemini Flash Vision AI'})` : 'Unconfigured in server/.env'}
              </span>
              <p className="mt-1 leading-relaxed">
                {analyzerStatus?.visionAiConfigured
                  ? 'Multimodal Vision AI is currently active. User-uploaded physical sign photos with consent are analyzed directly in-memory.'
                  : 'NutriVita operates with strict scientific integrity. When GEMINI_API_KEY is not configured in server/.env, no artificial intelligence is simulated or faked. The application runs transparently on verified clinical evidence rules and peer-reviewed medical nutrition literature.'}
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
                <span className="font-bold text-gray-900">1. Multimodal Vision AI ({analyzerStatus?.provider || 'Google Gemini Flash Vision AI'})</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${analyzerStatus?.visionAiConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                  {analyzerStatus?.visionAiConfigured ? 'Active' : 'Requires API Key'}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Observes visual features of uploaded images (nail spooning, pallor, angular cheilitis, hair brittleness, etc.). Enabled by adding <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">GEMINI_API_KEY</code> into <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">server/.env</code>. Photos are analyzed strictly in-memory and never stored on disk.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">2. Clinical Nutrition Rules Engine</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active (Deterministic)
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Grounds every assessment in peer-reviewed clinical literature (ICMR-NIN, WHO, Harrison's Internal Medicine). Maps selected anatomical areas, visible manifestations, and symptoms to correlated micronutrient deficiencies with confidence tiers and biological rationales.
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
                Provides authentic, laboratory-verified whole foods, fruits, vegetables, grains, and traditional South Indian preparations tailored to replenishing deficient nutrients.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">4. Nutrition Label OCR (Tesseract.js)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active (Label Lens)
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Extracts printed nutritional facts panels in Label Lens directly in the browser to evaluate dietary intakes against recommended daily allowances.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">5. Manual Nutrition & Physical Sign Entry</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Always Available
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Allows users, students, and clinical researchers to select physical manifestations directly without requiring a photo or camera, ensuring full privacy and universal device accessibility.
              </p>
            </div>
          </div>

          {/* Setup Guide */}
          {!analyzerStatus?.visionAiConfigured && (
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

export default BodyChangeAnalyzer;
