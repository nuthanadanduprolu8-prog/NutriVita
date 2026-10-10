import React from 'react';
import { BookOpen, Sparkles, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../common/Card';
import Badge from '../common/Badge';

const typeColors = {
  water_soluble: 'blue',
  fat_soluble: 'amber',
  mineral: 'emerald'
};

const VitaminCard = ({ vitamin, onSelect }) => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  const functions = (isTelugu && vitamin.primaryFunctionsTe?.length > 0)
    ? vitamin.primaryFunctionsTe
    : vitamin.primaryFunctionsEn || [];

  const symptoms = (isTelugu && vitamin.deficiencySymptomsTe?.length > 0)
    ? vitamin.deficiencySymptomsTe
    : vitamin.deficiencySymptomsEn || [];

  return (
    <Card hoverEffect className="flex flex-col justify-between group h-full">
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              {vitamin.chemicalName || 'Essential Micronutrient'}
            </span>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              {vitamin.nameEn}
            </h3>
            <p className="text-xs text-emerald-700 font-medium">
              {vitamin.nameTe}
            </p>
          </div>
          <Badge
            variant={typeColors[vitamin.type] || 'emerald'}
            size="sm"
            className="uppercase tracking-wider font-bold shrink-0"
          >
            {vitamin.type.replace('_', ' ')}
          </Badge>
        </div>

        {/* RDA Overview */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Adult RDA:</span>
          <span className="font-bold text-slate-800">
            {vitamin.rdaAdults?.female || vitamin.rdaAdults?.male || 'Consult Guidelines'}
          </span>
        </div>

        {/* Primary Function Bullet */}
        <div className="space-y-1">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isTelugu ? 'ప్రధాన విధులు' : 'Primary Biological Role'}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {functions[0] || 'Supports vital metabolic health.'}
          </p>
        </div>

        {/* Deficiency Warning Snippet */}
        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed line-clamp-2">
            <strong className="font-semibold">{isTelugu ? 'లోపం సంకేతాలు: ' : 'Deficiency Signs: '}</strong>
            {symptoms[0] || 'Fatigue and reduced immunity.'}
          </p>
        </div>

      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100">
        <button
          onClick={() => onSelect(vitamin)}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <span>{isTelugu ? 'పూర్తి విజ్ఞానం & ఆహారాలు' : 'Explore Deep Profile & Foods'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};

export default VitaminCard;
