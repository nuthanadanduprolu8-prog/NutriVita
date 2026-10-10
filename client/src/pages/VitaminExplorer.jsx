import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import vitaminService from '../services/vitaminService';
import VitaminCard from '../components/vitamin/VitaminCard';
import VitaminDetailModal from '../components/vitamin/VitaminDetailModal';
import FoodDetailModal from '../components/food/FoodDetailModal';
import BackButton from '../components/common/BackButton';
import Card from '../components/common/Card';

const VitaminExplorer = () => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  const [vitamins, setVitamins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const [activeVitamin, setActiveVitamin] = useState(null);
  const [activeFood, setActiveFood] = useState(null);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedType && selectedType !== 'all') params.type = selectedType;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedType, setSearchParams]);

  useEffect(() => {
    fetchVitamins();
  }, [selectedType, searchTerm]);

  const fetchVitamins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vitaminService.getVitamins({
        type: selectedType,
        search: searchTerm,
      });
      setVitamins(res.data || []);
    } catch (err) {
      setError('Could not load vitamin profiles. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVitamin = async (vitamin) => {
    try {
      const res = await vitaminService.getVitaminById(vitamin.vitaminId);
      setActiveVitamin(res.data);
    } catch (err) {
      setActiveVitamin(vitamin);
    }
  };

  const types = [
    { id: 'all', label: isTelugu ? 'అన్నీ' : 'All Nutrients' },
    { id: 'water_soluble', label: isTelugu ? 'నీటిలో కరిగే విటమిన్లు' : 'Water-Soluble (B-Complex, C)' },
    { id: 'fat_soluble', label: isTelugu ? 'కొవ్వులో కరిగే విటమిన్లు' : 'Fat-Soluble (A, D, E, K)' },
    { id: 'mineral', label: isTelugu ? 'ఖనిజ లవణాలు' : 'Essential Minerals (Iron, Calcium)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BackButton fallbackPath="/dashboard" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              NutriVita Encyclopedia
            </span>
            <span className="text-xs text-slate-400">• Evidence-Based</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTelugu ? 'విటమిన్ & మినరల్ విజ్ఞాన సర్వస్వం' : 'Vitamin & Mineral Encyclopedia'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {isTelugu
              ? 'శరీరానికి అవసరమైన ముఖ్య విటమిన్లు, వాటి రోజువారీ మోతాదు, లోప లక్షణాలు మరియు సహజ ఆహారాల సమగ్ర గైడ్.'
              : 'Explore the definitive reference guide to essential micronutrients, daily Recommended Dietary Allowances (RDA), and natural dietary food sources.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            {vitamins.length} Micronutrients Cataloged
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isTelugu ? 'విటమిన్ పేరు లేదా లక్షణం ద్వారా శోధించండి (ఉదా. fatigue, gums, A)...' : 'Search by name, chemical term, or symptom (e.g. fatigue, gums, calcium)...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Quick Clear */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter By Type:
          </span>
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === t.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Grid of Vitamins */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading verified micronutrient profiles...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
          <p className="text-xs font-semibold text-rose-800">{error}</p>
          <button
            onClick={fetchVitamins}
            className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg"
          >
            Retry Loading
          </button>
        </div>
      ) : vitamins.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Micronutrients Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No matching vitamins or minerals matched your search criteria. Try a different search query or reset your filters.
          </p>
          <button
            onClick={() => { setSelectedType('all'); setSearchTerm(''); }}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vitamins.map((vit) => (
            <VitaminCard
              key={vit.vitaminId}
              vitamin={vit}
              onSelect={handleOpenVitamin}
            />
          ))}
        </div>
      )}

      {/* Active Vitamin Deep Detail Modal */}
      <VitaminDetailModal
        vitamin={activeVitamin}
        isOpen={!!activeVitamin}
        onClose={() => setActiveVitamin(null)}
        onSelectFood={(food) => setActiveFood(food)}
      />

      {/* Cross-linking Food Detail Modal */}
      <FoodDetailModal
        food={activeFood}
        isOpen={!!activeFood}
        onClose={() => setActiveFood(null)}
      />

    </div>
  );
};

export default VitaminExplorer;
