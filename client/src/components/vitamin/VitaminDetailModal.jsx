import React from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Apple, 
  Heart,
  Scale
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const VitaminDetailModal = ({ vitamin, isOpen, onClose, onSelectFood }) => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  if (!vitamin) return null;

  const functions = (isTelugu && vitamin.primaryFunctionsTe?.length > 0)
    ? vitamin.primaryFunctionsTe
    : vitamin.primaryFunctionsEn || [];

  const symptoms = (isTelugu && vitamin.deficiencySymptomsTe?.length > 0)
    ? vitamin.deficiencySymptomsTe
    : vitamin.deficiencySymptomsEn || [];

  const tips = (isTelugu && vitamin.preventiveTipsTe?.length > 0)
    ? vitamin.preventiveTipsTe
    : vitamin.preventiveTipsEn || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vitamin.nameEn}
      subtitle={vitamin.nameTe}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Top Badges & Chemical Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Chemical Compound:</span>
            <span className="text-xs font-bold text-slate-800">{vitamin.chemicalName || 'Essential Micronutrient'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="teal" size="md">
              {vitamin.type.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* RDA Target Benchmarks */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recommended Dietary Allowances (RDA)</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
            <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 font-medium block">Adult Men</span>
              <span className="text-xs font-bold text-emerald-900">{vitamin.rdaAdults?.male || 'Varies'}</span>
            </div>
            <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 font-medium block">Adult Women</span>
              <span className="text-xs font-bold text-emerald-900">{vitamin.rdaAdults?.female || 'Varies'}</span>
            </div>
            <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 font-medium block">Pregnancy / Lactation</span>
              <span className="text-xs font-bold text-emerald-900">{vitamin.rdaAdults?.pregnancy || 'Higher Need'}</span>
            </div>
            <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 font-medium block">Units</span>
              <span className="text-xs font-bold text-emerald-900">{vitamin.rdaAdults?.unit || 'mg / mcg'}</span>
            </div>
          </div>
        </div>

        {/* Biological Functions */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isTelugu ? 'శరీరంలో ప్రధాన విధులు' : 'Key Biological Roles & Benefits'}
          </h4>
          <div className="space-y-1.5">
            {functions.map((fn, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{fn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deficiency Symptoms (Preventive CSP Awareness) */}
        <div className="space-y-2 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isTelugu ? 'లోప లక్షణాలు మరియు హెచ్చరికలు' : 'Deficiency Awareness & Warning Signs'}</span>
          </h4>
          <div className="space-y-1.5 pt-1">
            {symptoms.map((sym, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-amber-900">
                <span className="text-amber-500 font-bold">•</span>
                <span className="leading-relaxed">{sym}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Synergistic Absorption Pairs */}
        {vitamin.synergisticPairs?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nutrient Absorption Synergy</span>
            </h4>
            <div className="space-y-2">
              {vitamin.synergisticPairs.map((pair, idx) => (
                <div key={idx} className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-teal-950">
                  <strong className="font-semibold block mb-0.5 text-teal-800">
                    Pair with: {pair.partnerNutrient}
                  </strong>
                  <p className="leading-relaxed text-slate-600">
                    {isTelugu && pair.explanationTe ? pair.explanationTe : pair.explanationEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Natural Food Sources with Live Clickable Thumbnails */}
        {vitamin.richFoodDetails?.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-emerald-600" />
                <span>Top Natural Food Sources</span>
              </h4>
              <span className="text-[10px] text-slate-400">Click any food to inspect</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vitamin.richFoodDetails.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    onClose();
                    if (onSelectFood) onSelectFood(f);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-300 transition-all text-left group"
                >
                  <img
                    src={f.imageUrl}
                    alt={f.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&auto=format&fit=crop&q=80';
                    }}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                      {f.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {f.calories} kcal • {f.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preventive Lifestyle Tips */}
        {tips.length > 0 && (
          <div className="space-y-1.5 p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs text-emerald-950">
            <h5 className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider">
              {isTelugu ? 'జీవనశైలి & నివారణ సూచనలు' : 'Preventive Dietary Guidance'}
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              {tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default VitaminDetailModal;
