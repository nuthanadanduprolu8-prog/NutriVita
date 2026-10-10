import React, { useState } from 'react';
import { 
  CheckCircle, 
  Apple, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  HelpCircle,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { getVerifiedFoodImageUrl, handleFoodImgError } from '../../utils/foodImageFallback';

const parseNutrientNumber = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return Number.isFinite(val) ? val : null;
  if (typeof val === 'string') {
    const match = val.match(/[\d.]+/);
    if (match) {
      const num = parseFloat(match[0]);
      return Number.isFinite(num) ? num : null;
    }
  }
  return null;
};

// Safe nutrient resolver supporting both structured objects and AI text arrays
const resolveNutrient = (food, key, defaultUnit, adultRda) => {
  if (!food) return { value: null, display: 'Not reported', available: false, pctRda: 0 };

  // 1. Direct object lookup in minerals
  if (food.minerals && typeof food.minerals === 'object' && !Array.isArray(food.minerals)) {
    if (food.minerals[key] !== undefined && food.minerals[key] !== null) {
      const num = parseNutrientNumber(food.minerals[key]);
      if (num !== null) {
        const pct = adultRda ? Math.min(Math.round((num / adultRda) * 100), 150) : 0;
        return { value: num, display: `${num} ${defaultUnit}`, available: true, pctRda: pct };
      }
    }
  }

  // 2. Direct object lookup in vitamins
  if (food.vitamins && typeof food.vitamins === 'object' && !Array.isArray(food.vitamins)) {
    if (food.vitamins[key] !== undefined && food.vitamins[key] !== null) {
      const num = parseNutrientNumber(food.vitamins[key]);
      if (num !== null) {
        const pct = adultRda ? Math.min(Math.round((num / adultRda) * 100), 150) : 0;
        return { value: num, display: `${num} ${defaultUnit}`, available: true, pctRda: pct };
      }
    }
  }

  // 3. Search through array format (e.g. Gemini keyVitamins / keyMinerals array strings)
  const arraySources = [
    ...(Array.isArray(food.vitamins) ? food.vitamins : []),
    ...(Array.isArray(food.minerals) ? food.minerals : []),
    ...(Array.isArray(food.keyVitamins) ? food.keyVitamins : []),
    ...(Array.isArray(food.keyMinerals) ? food.keyMinerals : []),
  ];

  const searchKeywords = {
    iron: ['iron', 'fe'],
    calcium: ['calcium', 'ca'],
    vitaminC: ['vitamin c', 'ascorbic'],
    vitaminA: ['vitamin a', 'retinol', 'beta-carotene'],
    vitaminB9: ['vitamin b9', 'folate', 'folic'],
    vitaminB12: ['vitamin b12', 'cobalamin', 'b12'],
    vitaminD: ['vitamin d', 'calciferol'],
    vitaminE: ['vitamin e', 'tocopherol'],
    zinc: ['zinc', 'zn'],
    potassium: ['potassium', 'k'],
    sodium: ['sodium', 'na'],
  };

  const keywords = searchKeywords[key] || [key.toLowerCase()];

  for (const item of arraySources) {
    if (typeof item === 'string') {
      const lower = item.toLowerCase();
      if (keywords.some(kw => lower.includes(kw))) {
        const parsed = parseNutrientNumber(item);
        if (parsed !== null) {
          const pct = adultRda ? Math.min(Math.round((parsed / adultRda) * 100), 150) : 0;
          return { value: parsed, display: item, available: true, pctRda: pct };
        }
        return { value: null, display: item, available: true, pctRda: 0 };
      }
    }
  }

  return { value: null, display: 'Not reported', available: false, pctRda: 0 };
};

const FoodDetailModal = ({ food, isOpen, onClose }) => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' or 'cards'

  if (!food) return null;

  // Safe Category Normalization
  const categoryLabel = food.category
    ? String(food.category).replace(/_/g, ' ')
    : 'Whole Food';

  // Safe Benefits Normalization (handles both array and single string from AI)
  const rawBenefits = (isTelugu && food.benefitsTe)
    ? food.benefitsTe
    : (food.benefitsEn || food.benefits || []);
  
  const benefitsList = Array.isArray(rawBenefits)
    ? rawBenefits.filter(Boolean)
    : typeof rawBenefits === 'string' && rawBenefits.trim()
    ? [rawBenefits.trim()]
    : [];

  // Safe Description
  const descriptionText = isTelugu
    ? (food.descriptionTe || food.visualObservations || food.servingGuidance || '')
    : (food.descriptionEn || food.visualObservations || food.preparationNotes || food.servingGuidance || 'Nutritional composition breakdown.');

  // Safe Macronutrients
  const proteinVal = food.macronutrients?.protein ?? '--';
  const carbsVal = food.macronutrients?.carbs ?? '--';
  const fatsVal = food.macronutrients?.fats ?? '--';
  const fiberVal = food.macronutrients?.fiber ?? '--';

  // 6 Primary Radar Axes (RDA reference for adults)
  const radarAxes = [
    { label: 'Vit C', fullName: 'Vitamin C', key: 'vitaminC', unit: 'mg', rda: 90 },
    { label: 'Iron (Fe)', fullName: 'Dietary Iron', key: 'iron', unit: 'mg', rda: 18 },
    { label: 'Calcium (Ca)', fullName: 'Calcium', key: 'calcium', unit: 'mg', rda: 1000 },
    { label: 'Vit A', fullName: 'Vitamin A', key: 'vitaminA', unit: 'mcg', rda: 900 },
    { label: 'Folate B9', fullName: 'Folate (B9)', key: 'vitaminB9', unit: 'mcg', rda: 400 },
    { label: 'Vit B12', fullName: 'Vitamin B12', key: 'vitaminB12', unit: 'mcg', rda: 2.4 },
  ];

  // Resolve values for all 6 radar axes
  const resolvedRadar = radarAxes.map(axis => {
    const res = resolveNutrient(food, axis.key, axis.unit, axis.rda);
    return {
      ...axis,
      ...res,
    };
  });

  // Additional Secondary Micronutrients
  const secondaryNutrients = [
    { label: 'Vitamin D', key: 'vitaminD', unit: 'IU', rda: 600 },
    { label: 'Vitamin E', key: 'vitaminE', unit: 'mg', rda: 15 },
    { label: 'Potassium (K)', key: 'potassium', unit: 'mg', rda: 3500 },
    { label: 'Sodium (Na)', key: 'sodium', unit: 'mg', rda: 2000 },
  ].map(item => ({
    ...item,
    ...resolveNutrient(food, item.key, item.unit, item.rda),
  }));

  // SVG Radar Dimensions
  const cx = 140;
  const cy = 135;
  const maxR = 90;
  const numAxes = radarAxes.length;

  // Compute polygon points for the food
  const polygonPoints = resolvedRadar.map((axis, i) => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    // Map % of RDA (capped at 100% for chart radius)
    const ratio = axis.available && axis.pctRda > 0
      ? Math.min(axis.pctRda / 100, 1.0)
      : 0.05; // tiny anchor if 0 or unmeasured
    const r = Math.max(ratio * maxR, 6);
    const x = (cx + r * Math.cos(angle)).toFixed(1);
    const y = (cy + r * Math.sin(angle)).toFixed(1);
    return `${x},${y}`;
  }).join(' ');

  // Concentric web polygons for 25%, 50%, 75%, 100%
  const webLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={food.name || 'Food Nutrition Analysis'}
      subtitle={food.teluguName || ''}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Top Header with Image & Overview */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-full sm:w-44 h-40 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative shadow-sm">
            {!imgError ? (
              <img
                src={getVerifiedFoodImageUrl(food)}
                alt={food.name || 'Food image'}
                onError={(e) => {
                  handleFoodImgError(e, food.id);
                  setImgError(true);
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-700">
                <Apple className="w-12 h-12 mb-1" />
                <span className="text-xs font-semibold">{food.name}</span>
              </div>
            )}
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
              Per {food.servingSize || (food.servingWeightGrams ? `${food.servingWeightGrams}g` : '100g')}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald" size="md" className="capitalize">
                {categoryLabel}
              </Badge>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {Number(food.calories) || 0} Calories
              </span>
              {food.isVerifiedDatabase && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Database</span>
                </span>
              )}
              {food.isAiEstimated && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>Vision AI Estimated</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {descriptionText}
            </p>

            {/* Quick Macronutrient Row */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium">Protein</p>
                <p className="text-xs font-bold text-slate-800">{proteinVal}{proteinVal !== '--' ? 'g' : ''}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium">Carbs</p>
                <p className="text-xs font-bold text-slate-800">{carbsVal}{carbsVal !== '--' ? 'g' : ''}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium">Fats</p>
                <p className="text-xs font-bold text-slate-800">{fatsVal}{fatsVal !== '--' ? 'g' : ''}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium">Fiber</p>
                <p className="text-xs font-bold text-slate-800">{fiberVal}{fiberVal !== '--' ? 'g' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Micronutrient Radar Section */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Complete Micronutrient Radar</span>
              </h4>
              <p className="text-[10px] text-slate-400">
                Micronutrient density relative to Adult Daily Recommended Allowances (RDA)
              </p>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setActiveTab('radar')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'radar' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Radar Chart
              </button>
              <button
                onClick={() => setActiveTab('cards')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'cards' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Grid Breakdown
              </button>
            </div>
          </div>

          {/* TAB 1: SVG Radar Chart */}
          {activeTab === 'radar' && (
            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row items-center gap-6">
              
              {/* Radar Graphic */}
              <div className="relative shrink-0 flex items-center justify-center">
                <svg width="280" height="270" className="overflow-visible">
                  {/* Concentric Web Grid */}
                  {webLevels.map((lvl, idx) => {
                    const pts = radarAxes.map((_, i) => {
                      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                      const r = maxR * lvl;
                      const x = (cx + r * Math.cos(angle)).toFixed(1);
                      const y = (cy + r * Math.sin(angle)).toFixed(1);
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <polygon
                        key={idx}
                        points={pts}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray={idx === webLevels.length - 1 ? 'none' : '2,2'}
                      />
                    );
                  })}

                  {/* Axis Spokes & Labels */}
                  {resolvedRadar.map((axis, i) => {
                    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                    const x2 = cx + maxR * Math.cos(angle);
                    const y2 = cy + maxR * Math.sin(angle);
                    
                    // Label position slightly outside the polygon
                    const labelR = maxR + 18;
                    const lx = cx + labelR * Math.cos(angle);
                    const ly = cy + labelR * Math.sin(angle);

                    return (
                      <g key={i}>
                        <line
                          x1={cx}
                          y1={cy}
                          x2={x2}
                          y2={y2}
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                        <text
                          x={lx}
                          y={ly}
                          fontSize="9"
                          fontWeight="600"
                          fill={axis.available ? '#334155' : '#94a3b8'}
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {axis.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Food Micronutrient Filled Area */}
                  <polygon
                    points={polygonPoints}
                    fill="rgba(16, 185, 129, 0.25)"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {resolvedRadar.map((axis, i) => {
                    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                    const ratio = axis.available && axis.pctRda > 0
                      ? Math.min(axis.pctRda / 100, 1.0)
                      : 0.05;
                    const r = Math.max(ratio * maxR, 6);
                    const px = cx + r * Math.cos(angle);
                    const py = cy + r * Math.sin(angle);

                    return (
                      <circle
                        key={i}
                        cx={px}
                        cy={py}
                        r={axis.available ? 3.5 : 2}
                        fill={axis.available ? '#059669' : '#cbd5e1'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* Center Hub */}
                  <circle cx={cx} cy={cy} r="3" fill="#64748b" />
                </svg>
              </div>

              {/* Radar Legend & Summary */}
              <div className="flex-1 space-y-2.5 w-full text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span>Radar RDA Footprint</span>
                    </span>
                    <span className="text-slate-400">Adult Daily Targets</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Outer perimeter represents 100% of adult daily micronutrient recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {resolvedRadar.map((axis, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg border text-[11px] ${
                        axis.available
                          ? axis.pctRda >= 25
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 font-semibold'
                            : 'bg-white border-slate-100 text-slate-700'
                          : 'bg-slate-100/60 border-dashed border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{axis.label}</span>
                        {axis.available ? (
                          <span className="text-[10px] text-emerald-700 font-bold">
                            {axis.pctRda}% RDA
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">Not tested</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {axis.display}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2 / Secondary Grid: Full Detailed Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {resolvedRadar.concat(secondaryNutrients).map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border transition-all ${
                  item.available
                    ? item.pctRda >= 20
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-slate-50 border-slate-100'
                    : 'bg-slate-50/60 border-dashed border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    {item.fullName || item.label}
                  </span>
                  {item.available && item.pctRda >= 20 && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Rich Source
                    </span>
                  )}
                  {!item.available && (
                    <span className="text-[9px] text-slate-400 italic">
                      N/A
                    </span>
                  )}
                </div>
                <span className={`text-sm font-bold block mt-0.5 ${item.available ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.display}
                </span>
                {item.available && item.pctRda > 0 && (
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    ~{item.pctRda}% Daily Value
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* AI Identified Key Micronutrients Badges if present */}
          {Array.isArray(food.keyNutrients) && food.keyNutrients.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                Identified Highlights:
              </span>
              {food.keyNutrients.map((kn, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-medium"
                >
                  {kn}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Health Benefits Section */}
        {benefitsList.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isTelugu ? 'ఆరోగ్య ప్రయోజనాలు' : 'Documented Health Benefits'}
            </h4>
            <div className="space-y-1.5">
              {benefitsList.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Buttons with Clear Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Nutritional values are reference estimates for dietary education.</span>
          </p>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Scanner Result</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default FoodDetailModal;
