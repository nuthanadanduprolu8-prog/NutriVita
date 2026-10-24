import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Search, 
  Mic, 
  MicOff, 
  X, 
  RotateCcw, 
  Activity, 
  BatteryLow, 
  Eye, 
  Smile, 
  Scissors, 
  Sun, 
  Zap, 
  Thermometer, 
  Brain, 
  RotateCw, 
  Frown, 
  HelpCircle,
  ExternalLink,
  BookOpen,
  Apple,
  Info,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import symptomService from '../services/symptomService';
import foodService from '../services/foodService';
import vitaminService from '../services/vitaminService';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import FoodDetailModal from '../components/food/FoodDetailModal';
import VitaminDetailModal from '../components/vitamin/VitaminDetailModal';
import BackButton from '../components/common/BackButton';

// Map iconName string from dataset to Lucide icon component
const getSymptomIcon = (iconName) => {
  switch (iconName) {
    case 'battery-low': return BatteryLow;
    case 'activity': return Activity;
    case 'eye': return Eye;
    case 'smile': return Smile;
    case 'scissors': return Scissors;
    case 'sun': return Sun;
    case 'zap': return Zap;
    case 'thermometer': return Thermometer;
    case 'brain': return Brain;
    case 'rotate-cw': return RotateCw;
    case 'frown': return Frown;
    case 'sparkles': return Sparkles;
    default: return Activity;
  }
};

const SymptomChecker = () => {
  const { t, language } = useLanguage();
  const isTelugu = language === 'te';
  const { user } = useAuth();

  // Data states
  const [symptomsList, setSymptomsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  // Selection states
  const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);

  // Voice proposed symptoms for user confirmation
  const [proposedVoiceSymptoms, setProposedVoiceSymptoms] = useState([]);
  const [voiceNotice, setVoiceNotice] = useState('');

  // Assessment results state
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [assessmentError, setAssessmentError] = useState('');

  // Modal inspection states
  const [selectedFoodModal, setSelectedFoodModal] = useState(null);
  const [selectedVitaminModal, setSelectedVitaminModal] = useState(null);

  const resultsRef = useRef(null);

  // Load symptoms catalog
  useEffect(() => {
    symptomService.getSymptoms()
      .then((res) => {
        if (res.data) setSymptomsList(res.data);
        if (res.categories) setCategories(res.categories);
      })
      .catch((err) => {
        console.error('Failed to load symptoms:', err);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, []);

  // Voice Recognition Integration
  const {
    isSupported: isSpeechSupported,
    isListening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    language,
    onFinalTranscript: (transcript) => {
      if (!transcript || !transcript.trim()) return;
      handleVoiceTranscript(transcript.trim());
    },
  });

  // Match spoken words against symptoms catalog and propose for user confirmation
  const handleVoiceTranscript = (text) => {
    setVoiceNotice(`Heard: "${text}"`);
    const qLower = text.toLowerCase();
    const tokens = qLower.replace(/[^\w\s\u0C00-\u0C7F]/gi, ' ').split(/\s+/).filter(Boolean);

    const matches = symptomsList.filter((symptom) => {
      // Don't propose if already selected
      if (selectedSymptomIds.includes(symptom.symptomId)) return false;

      const titleEn = symptom.titleEn.toLowerCase();
      const titleTe = (symptom.titleTe || '').toLowerCase();
      const sId = symptom.symptomId.toLowerCase();

      // Check full string match
      if (titleEn.includes(qLower) || titleTe.includes(qLower)) return true;

      // Check token match
      return tokens.some((token) => {
        if (token.length < 3) return false;
        return titleEn.includes(token) || titleTe.includes(token) || sId.includes(token);
      });
    });

    if (matches.length > 0) {
      setProposedVoiceSymptoms(matches);
    } else {
      setVoiceNotice(
        isTelugu
          ? `"${text}" కు సంబంధించి నేరుగా లక్షణాలు కనుగొనబడలేదు. దయచేసి క్రింది జాబితా నుండి ఎంచుకోండి.`
          : `No direct symptom match found for "${text}". Please choose from the list below.`
      );
    }
  };

  // Toggle selection of a symptom
  const handleToggleSymptom = (id) => {
    setSelectedSymptomIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    // Clear previous assessment when selection changes
    if (assessmentResult) {
      setAssessmentResult(null);
    }
  };

  // Clear all selected symptoms
  const handleClearAll = () => {
    setSelectedSymptomIds([]);
    setProposedVoiceSymptoms([]);
    setAssessmentResult(null);
    setAssessmentError('');
    setVoiceNotice('');
  };

  // Confirm adding proposed voice symptoms
  const handleConfirmVoiceSymptoms = () => {
    const newIds = proposedVoiceSymptoms.map((s) => s.symptomId);
    setSelectedSymptomIds((prev) => Array.from(new Set([...prev, ...newIds])));
    setProposedVoiceSymptoms([]);
    setVoiceNotice('');
  };

  // Submit assessment
  const handleAssess = async () => {
    if (selectedSymptomIds.length === 0) return;

    setLoadingAssessment(true);
    setAssessmentError('');

    try {
      const res = await symptomService.assessSymptoms({
        symptoms: selectedSymptomIds,
        language,
        userId: user?._id || user?.id,
      });

      setAssessmentResult(res);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Assessment failed:', err);
      setAssessmentError(
        err.response?.data?.message || (
          isTelugu
            ? 'పోషకాహార విశ్లేషణలో లోపం ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
            : 'Could not complete nutritional assessment. Please try again.'
        )
      );
    } finally {
      setLoadingAssessment(false);
    }
  };

  // Open food modal
  const handleOpenFood = async (foodId) => {
    try {
      const res = await foodService.getFoodById(foodId);
      if (res.data) setSelectedFoodModal(res.data);
    } catch (e) {
      console.warn('Could not load food modal:', e);
    }
  };

  // Open vitamin modal
  const handleOpenVitamin = async (vitaminId) => {
    try {
      const res = await vitaminService.getVitaminById(vitaminId);
      if (res.data) setSelectedVitaminModal(res.data);
    } catch (e) {
      console.warn('Could not load vitamin modal:', e);
    }
  };

  // Filter symptoms by category and search term
  const filteredSymptoms = symptomsList.filter((symptom) => {
    if (selectedCategory !== 'all' && symptom.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const matchEn = symptom.titleEn.toLowerCase().includes(q);
      const matchTe = (symptom.titleTe || '').toLowerCase().includes(q);
      const matchDesc = (symptom.shortDescriptionEn || '').toLowerCase().includes(q);
      return matchEn || matchTe || matchDesc;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BackButton fallbackPath="/dashboard" />
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('symptomChecker.badge')}</span>
              </span>
              <span className="text-xs text-slate-400">• Evidence-Based Guidance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('symptomChecker.headerTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {t('symptomChecker.subtitle')}
            </p>
          </div>

          {/* Status Badge */}
          {selectedSymptomIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{selectedSymptomIds.length} {t('symptomChecker.selectedBadge')}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-slate-500 hover:text-rose-600 hover:border-rose-300"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                <span>{t('symptomChecker.clearAll')}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Voice Recognition Proposed Confirmation Banner */}
      {proposedVoiceSymptoms.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t('symptomChecker.voiceMatchedHeading')}</span>
            </h4>
            <button
              onClick={() => setProposedVoiceSymptoms([])}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {proposedVoiceSymptoms.map((s) => (
              <span
                key={s.symptomId}
                className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-emerald-900 shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{isTelugu ? s.titleTe : s.titleEn}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmVoiceSymptoms}
              className="text-xs font-bold"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>{t('symptomChecker.confirmAdd')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProposedVoiceSymptoms([])}
              className="text-xs text-slate-600"
            >
              <span>{t('symptomChecker.dismissVoice')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Voice Transcript / Status Notice */}
      {voiceNotice && (
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between">
          <span>{voiceNotice}</span>
          <button onClick={() => setVoiceNotice('')} className="text-blue-500 hover:text-blue-700">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* STEP 1: What have you noticed? */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('symptomChecker.step1Title')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 ml-8">
              {t('symptomChecker.step1Subtitle')}
            </p>
          </div>

          {/* Search bar & Voice mic button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('symptomChecker.searchPlaceholder')}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Voice Symptom Input Button */}
            {isSpeechSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : () => startListening(language)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-2 ring-rose-200 animate-pulse'
                    : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                }`}
                title={t('symptomChecker.voiceMicTitle')}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {isTelugu ? cat.nameTe : cat.nameEn}
            </button>
          ))}
        </div>

        {/* Selectable Symptoms Cards Grid */}
        {loadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse h-28" />
            ))}
          </div>
        ) : filteredSymptoms.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">
              {isTelugu ? 'ఎలాంటి లక్షణాలు కనుగొనబడలేదు.' : 'No symptoms match your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSymptoms.map((symptom) => {
              const isSelected = selectedSymptomIds.includes(symptom.symptomId);
              const IconComp = getSymptomIcon(symptom.iconName);

              return (
                <div
                  key={symptom.symptomId}
                  onClick={() => handleToggleSymptom(symptom.symptomId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleSymptom(symptom.symptomId);
                    }
                  }}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={isSelected}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none text-left flex items-start gap-3.5 group focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isSelected ? 'text-emerald-950' : 'text-slate-800'
                        }`}
                      >
                        {isTelugu ? symptom.titleTe : symptom.titleEn}
                      </h3>
                      {/* Checkbox indicator */}
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">
                      {isTelugu ? symptom.shortDescriptionTe : symptom.shortDescriptionEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* STEP 2: Review Selection (Sticky / Visible Bar) */}
      {selectedSymptomIds.length > 0 && (
        <section className="space-y-3 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {t('symptomChecker.step2Title')} ({selectedSymptomIds.length})
              </h3>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              {t('symptomChecker.clearAll')}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {selectedSymptomIds.map((id) => {
              const symptom = symptomsList.find((s) => s.symptomId === id);
              if (!symptom) return null;

              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900"
                >
                  <span>{isTelugu ? symptom.titleTe : symptom.titleEn}</span>
                  <button
                    onClick={() => handleToggleSymptom(id)}
                    className="w-4 h-4 rounded-full hover:bg-emerald-200 flex items-center justify-center text-emerald-700"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>

          {/* STEP 3 Trigger Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              {isTelugu
                ? 'తదుపరి దశ: పోషకాహార సంబంధాలు మరియు సిఫార్సు చేసిన సహజ ఆహారాలను చూడండి.'
                : 'Next step: Review potential nutritional connections and whole-food recommendations.'}
            </p>

            <Button
              variant="primary"
              onClick={handleAssess}
              disabled={loadingAssessment || selectedSymptomIds.length === 0}
              className="font-bold text-xs sm:text-sm px-6 py-2.5 shadow-md shadow-emerald-600/20"
            >
              {loadingAssessment ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  <span>{t('symptomChecker.analyzing')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>{t('symptomChecker.checkInsights')}</span>
                </>
              )}
            </Button>
          </div>
        </section>
      )}

      {/* Assessment Error Banner */}
      {assessmentError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2">
          <span>{assessmentError}</span>
          <Button variant="outline" size="sm" onClick={handleAssess} className="text-xs">
            {t('symptomChecker.retry')}
          </Button>
        </div>
      )}

      {/* RESULTS SECTION */}
      {assessmentResult && (
        <section ref={resultsRef} className="space-y-8 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Results Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Nutrition Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('symptomChecker.resultsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              {t('symptomChecker.resultsSubtitle')}
            </p>
          </div>

          {/* Ranked Nutrient Connection Cards */}
          <div className="space-y-5">
            {assessmentResult.nutritionConnections.map((nutrient, idx) => (
              <Card
                key={nutrient.vitaminId}
                className="p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4"
              >
                {/* Nutrient Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isTelugu ? nutrient.nameTe : nutrient.nameEn}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {nutrient.type?.replace('_', ' ').toUpperCase()} • {nutrient.rdaAdults?.male || 'Daily RDA Varies'}
                      </p>
                    </div>
                  </div>

                  {/* Relevance Tier Badge & Modal Button */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        nutrient.relevanceTier === 'high'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : nutrient.relevanceTier === 'moderate'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {nutrient.relevanceLabel}
                    </span>

                    <button
                      onClick={() => handleOpenVitamin(nutrient.vitaminId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-xs text-slate-600 font-semibold transition-colors"
                      title={t('symptomChecker.viewVitamin')}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      <span className="hidden sm:inline">{t('symptomChecker.viewVitamin')}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>
                  </div>
                </div>

                {/* Narrative Explanation */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                    {t('symptomChecker.whyRelevant')}
                  </span>
                  <p className="leading-relaxed">
                    {nutrient.educationalExplanation}
                  </p>
                </div>

                {/* Recommended Food Sources Grid */}
                {nutrient.recommendedFoods && nutrient.recommendedFoods.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Apple className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('symptomChecker.recommendedFoods')}:</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {nutrient.recommendedFoods.map((food) => (
                        <div
                          key={food.id}
                          onClick={() => handleOpenFood(food.id)}
                          className="flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm cursor-pointer transition-all group"
                        >
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                              {food.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              {food.teluguName || `${food.calories} kcal`}
                            </p>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 shrink-0 mr-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* EMERGENCY & MEDICAL SAFETY GUIDANCE */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold">
                {assessmentResult.safetyGuidance.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              {assessmentResult.safetyGuidance.guidance}
            </p>

            <ul className="space-y-1.5 pl-1 text-xs text-amber-900">
              {assessmentResult.safetyGuidance.redFlags.map((flag, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>

            <div className="p-3 rounded-2xl bg-white/80 border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed">
              {assessmentResult.safetyGuidance.recommendation}
            </div>
          </div>
        </section>
      )}

      {/* Populated Food Detail Modal */}
      {selectedFoodModal && (
        <FoodDetailModal
          food={selectedFoodModal}
          isOpen={!!selectedFoodModal}
          onClose={() => setSelectedFoodModal(null)}
        />
      )}

      {/* Populated Vitamin Detail Modal */}
      {selectedVitaminModal && (
        <VitaminDetailModal
          vitamin={selectedVitaminModal}
          isOpen={!!selectedVitaminModal}
          onClose={() => setSelectedVitaminModal(null)}
        />
      )}
    </div>
  );
};

export default SymptomChecker;
