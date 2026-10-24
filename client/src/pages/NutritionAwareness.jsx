import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Apple,
  Calendar,
  HelpCircle,
  Sparkles,
  Users,
  Search,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  ShieldCheck,
  ShieldAlert,
  Info,
  Printer,
  Copy,
  Check,
  RefreshCw,
  HeartHandshake,
  Utensils
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import BackButton from '../components/common/BackButton';
import { getVerifiedFoodImageUrl, handleFoodImgError } from '../utils/foodImageFallback';
import {
  awarenessArticles,
  superfoods,
  seasonalGuides,
  nutritionMyths,
  healthyHabits,
  communityActions,
  DISCLAIMER_EN,
  DISCLAIMER_TE,
  filterArticles,
  filterSuperfoods,
  filterMyths,
  validateCommunityPlan,
  createCommunityPlan
} from '../data/awarenessData';

const parseNutrientsList = (nutrients) => {
  if (Array.isArray(nutrients)) return nutrients;
  if (typeof nutrients === 'string') {
    return nutrients.split(',').map((n) => n.trim()).filter(Boolean);
  }
  return [];
};

const NutritionAwareness = () => {
  const { t, language } = useLanguage();
  const isTelugu = language === 'te';

  // ----------------------------------------------------
  // State: Search & Filters
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ----------------------------------------------------
  // State: Modals
  // ----------------------------------------------------
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedSuperfood, setSelectedSuperfood] = useState(null);

  // ----------------------------------------------------
  // State: Seasonal Tab
  // ----------------------------------------------------
  const [activeSeason, setActiveSeason] = useState('summer');

  // ----------------------------------------------------
  // State: Activity Planner Form
  // ----------------------------------------------------
  const [planForm, setPlanForm] = useState({
    title: '',
    targetAudience: '',
    date: '',
    organizer: '',
    steps: ''
  });
  const [planErrors, setPlanErrors] = useState({});
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [copied, setCopied] = useState(false);

  // ----------------------------------------------------
  // Data Filtering
  // ----------------------------------------------------
  const categories = [
    'All',
    'Fundamentals',
    'Micronutrients',
    'Macronutrients',
    'Bone Health',
    'Vitamins',
    'Label Literacy',
    'Community Wellness',
    'Youth & Focus'
  ];

  const filteredArticles = filterArticles(awarenessArticles, selectedCategory, searchQuery);
  const filteredSuperfoods = filterSuperfoods(superfoods, searchQuery);
  const filteredMyths = filterMyths(nutritionMyths, searchQuery);

  const activeSeasonData = seasonalGuides[activeSeason] || seasonalGuides.summer;

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const handlePlanInputChange = (e) => {
    const { name, value } = e.target;
    setPlanForm((prev) => ({ ...prev, [name]: value }));
    if (planErrors[name]) {
      setPlanErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    const validation = validateCommunityPlan(planForm);
    if (!validation.isValid) {
      setPlanErrors(validation.errors);
      return;
    }
    const newPlan = createCommunityPlan(planForm);
    setGeneratedPlan(newPlan);
    setPlanErrors({});
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    const textToCopy = `NutriVita Action Blueprint\n\nTitle: ${generatedPlan.title}\nTarget Audience: ${generatedPlan.targetAudience}\nDate: ${generatedPlan.date}\nLead Organizer: ${generatedPlan.organizer}\n\nObjectives & Implementation Steps:\n${generatedPlan.steps}\n\nGenerated via NutriVita Nutrition Awareness Hub`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPlan = () => {
    window.print();
  };

  const handleResetPlan = () => {
    setGeneratedPlan(null);
    setPlanForm({
      title: '',
      targetAudience: '',
      date: '',
      organizer: '',
      steps: ''
    });
    setPlanErrors({});
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* ========================================================
          1. HERO & LANDING SECTION
      ======================================================== */}
      <section className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation & Badge */}
          <div className="flex items-center gap-3 mb-4">
            <BackButton fallbackPath="/dashboard" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
              <HeartHandshake className="w-4 h-4 text-emerald-300" />
              <span>{t('nutritionAwareness.badge')}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {t('nutritionAwareness.title')}
          </h1>

          <p className="max-w-3xl text-emerald-100 text-base sm:text-lg leading-relaxed mb-8">
            {t('nutritionAwareness.subtitle')}
          </p>

          {/* Quick-Jump Cards */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: 'articles-section', label: t('nutritionAwareness.navArticles'), icon: BookOpen, count: '10 Articles' },
              { id: 'superfoods-section', label: t('nutritionAwareness.navSuperfoods'), icon: Apple, count: '12 Foods' },
              { id: 'seasonal-section', label: t('nutritionAwareness.navSeasonal'), icon: Calendar, count: '3 Seasons' },
              { id: 'myths-section', label: t('nutritionAwareness.navMyths'), icon: HelpCircle, count: '10 Facts' },
              { id: 'habits-section', label: t('nutritionAwareness.navHabits'), icon: Sparkles, count: '8 Habits' },
              { id: 'community-section', label: t('nutritionAwareness.navCommunity'), icon: Users, count: '7 Actions' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-3.5 text-left transition-all duration-200 group flex flex-col justify-between hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-emerald-300 group-hover:text-white transition-colors" />
                    <span className="text-[10px] text-emerald-200/80 font-medium">{item.count}</span>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-white block">{item.label}</span>
                    <span className="text-[10px] text-emerald-200/70">{t('nutritionAwareness.quickJump')} &rarr;</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SEARCH & CATEGORY FILTERING BAR
      ======================================================== */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nutritionAwareness.searchPlaceholder')}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat === 'All' ? t('nutritionAwareness.allCategories') : cat}
              </button>
            ))}

            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 shrink-0 flex items-center gap-1 ml-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t('nutritionAwareness.resetSearch')}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        {/* ========================================================
            2. NUTRITION ARTICLES SECTION
        ======================================================== */}
        <section id="articles-section" className="scroll-mt-36">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {isTelugu ? 'పోషకాహార విద్యా వ్యాసాలు' : 'Nutrition Education Articles'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isTelugu
                  ? 'శాస్త్రీయ ఆధారాలతో కూడిన 10 సమగ్ర పోషకాహార కథనాలు'
                  : 'Evidence-based deep dives into whole-food balance, micronutrient bioavailability, and preventive health.'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {filteredArticles.length} / {awarenessArticles.length}
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">{t('nutritionAwareness.noResults')}</p>
              <Button variant="secondary" size="sm" onClick={handleResetFilters} className="mt-3">
                {t('nutritionAwareness.resetSearch')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200/80 bg-white"
                >
                  <div>
                    {/* Header: Category & Read Time */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-emerald-700">
                      {isTelugu ? article.teluguTitle : article.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {isTelugu ? article.teluguDescription : article.shortDescription}
                    </p>

                    {/* Key takeaway preview */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 text-[11px] text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {isTelugu ? article.teluguKeyTakeaways[0] : article.keyTakeaways[0]}
                      </span>
                    </div>
                  </div>

                  {/* Read More Trigger */}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedArticle(article)}
                    className="w-full justify-center flex items-center gap-1.5"
                  >
                    <span>{t('nutritionAwareness.readArticle')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ========================================================
            3. LOCAL & INDIAN SUPERFOODS GUIDE
        ======================================================== */}
        <section id="superfoods-section" className="scroll-mt-36">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Apple className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t('nutritionAwareness.superfoodsTitle')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t('nutritionAwareness.superfoodsSubtitle')}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {filteredSuperfoods.length} / {superfoods.length}
            </span>
          </div>

          {filteredSuperfoods.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">{t('nutritionAwareness.noResults')}</p>
              <Button variant="secondary" size="sm" onClick={handleResetFilters} className="mt-3">
                {t('nutritionAwareness.resetSearch')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredSuperfoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => setSelectedSuperfood(food)}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={getVerifiedFoodImageUrl(food)}
                      alt={food.name}
                      onError={(e) => handleFoodImgError(e, food.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-black/60 text-white backdrop-blur-sm">
                        {food.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {food.name}
                      </h3>
                      <p className="text-xs text-emerald-700 font-medium mb-3">
                        {food.teluguName}
                      </p>

                      {/* Nutrient Pills */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {parseNutrientsList(food.nutrients).slice(0, 3).map((n) => (
                          <span
                            key={n}
                            className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
                          >
                            {n}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {Array.isArray(isTelugu ? food.teluguBenefits : food.benefits)
                          ? (isTelugu ? food.teluguBenefits[0] : food.benefits[0])
                          : (isTelugu ? food.teluguBenefits : food.benefits)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold group-hover:underline">
                      <span>{t('nutritionAwareness.viewSuperfood')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ========================================================
            4. SEASONAL NUTRITION HANDBOOK
        ======================================================== */}
        <section id="seasonal-section" className="scroll-mt-36">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t('nutritionAwareness.seasonalTitle')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t('nutritionAwareness.seasonalSubtitle')}
              </p>
            </div>
          </div>

          {/* Season Tab Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 flex gap-2 max-w-md mb-6 shadow-sm">
            {[
              { id: 'summer', label: isTelugu ? '☀️ ఎండాకాలం (Summer)' : '☀️ Summer', color: 'text-amber-600' },
              { id: 'monsoon', label: isTelugu ? '🌧️ వర్షాకాలం (Monsoon)' : '🌧️ Monsoon', color: 'text-sky-600' },
              { id: 'winter', label: isTelugu ? '❄️ శీతాకాలం (Winter)' : '❄️ Winter', color: 'text-indigo-600' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSeason(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeSeason === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Seasonal Handbook Card */}
          <Card className="bg-white border-slate-200/80 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {isTelugu ? activeSeasonData.teluguSeasonName : activeSeasonData.seasonName}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {isTelugu ? activeSeasonData.teluguTitle : activeSeasonData.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {isTelugu ? activeSeasonData.teluguFocus : activeSeasonData.focus}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hydration Guidance */}
              <div className="bg-sky-50/70 border border-sky-200/70 rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <Droplets className="w-5 h-5 text-sky-600" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    {t('nutritionAwareness.hydration')}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {isTelugu
                    ? activeSeasonData.teluguHydrationGuidance
                    : activeSeasonData.hydrationGuidance}
                </p>
              </div>

              {/* Food Hygiene & Seasonal Safety */}
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    {t('nutritionAwareness.foodSafety')}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {isTelugu
                    ? activeSeasonData.teluguFoodSafetyTips
                    : activeSeasonData.foodSafetyTips}
                </p>
              </div>
            </div>

            {/* Recommended Seasonal Foods */}
            <div className="mt-8">
              <h4 className="font-bold text-slate-900 text-sm mb-3">
                {t('nutritionAwareness.seasonalRecommended')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSeasonData.recommendedFoods.map((foodItem, idx) => {
                  const foodName = typeof foodItem === 'object'
                    ? (isTelugu && foodItem.teluguName ? `${foodItem.name} (${foodItem.teluguName})` : foodItem.name)
                    : foodItem;
                  const foodDesc = typeof foodItem === 'object' ? foodItem.desc : '';
                  const foodKey = typeof foodItem === 'object' ? (foodItem.name || idx) : `${foodItem}-${idx}`;

                  return (
                    <span
                      key={foodKey}
                      title={foodDesc}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold"
                    >
                      🌱 {foodName}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Seasonal Daily Habits */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-3">
                {t('nutritionAwareness.dailyHabits')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isTelugu ? activeSeasonData.teluguDailyHabits : activeSeasonData.dailyHabits).map((habit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{habit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* ========================================================
            5. MYTH VS FACT SECTION
        ======================================================== */}
        <section id="myths-section" className="scroll-mt-36">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t('nutritionAwareness.mythsTitle')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t('nutritionAwareness.mythsSubtitle')}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {filteredMyths.length} / {nutritionMyths.length}
            </span>
          </div>

          {filteredMyths.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">{t('nutritionAwareness.noResults')}</p>
              <Button variant="secondary" size="sm" onClick={handleResetFilters} className="mt-3">
                {t('nutritionAwareness.resetSearch')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMyths.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                    </div>

                    {/* Myth Box */}
                    <div className="p-3.5 bg-rose-50/80 border border-rose-200/70 rounded-xl">
                      <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">
                        <X className="w-4 h-4 text-rose-600" />
                        <span>{t('nutritionAwareness.myth')}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-rose-950 font-semibold leading-snug">
                        "{isTelugu ? item.teluguMyth : item.myth}"
                      </p>
                    </div>

                    {/* Fact Box */}
                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/70 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{t('nutritionAwareness.fact')}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-950 font-semibold leading-snug">
                        {isTelugu ? item.teluguFact : item.fact}
                      </p>
                    </div>

                    {/* Explanation */}
                    <div className="pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 flex items-start gap-2">
                      <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{isTelugu ? item.teluguExplanation : item.explanation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ========================================================
            6. HEALTHY DAILY HABITS
        ======================================================== */}
        <section id="habits-section" className="scroll-mt-36">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t('nutritionAwareness.habitsTitle')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t('nutritionAwareness.habitsSubtitle')}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              8 Habits
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {healthyHabits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-4 shadow-sm">
                    {habit.number}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {isTelugu ? habit.teluguTitle : habit.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {isTelugu ? habit.teluguExplanation : habit.explanation}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-emerald-800 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isTelugu ? habit.teluguAction : habit.action}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            7. COMMUNITY NUTRITION ACTIONS & PLANNER
        ======================================================== */}
        <section id="community-section" className="scroll-mt-36">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t('nutritionAwareness.actionsTitle')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t('nutritionAwareness.actionsSubtitle')}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              7 Blueprints
            </span>
          </div>

          {/* Pre-made Action Blueprints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {communityActions.map((action, idx) => (
              <Card
                key={action.id}
                className="bg-white border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      Campaign #{idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      🎯 {isTelugu ? action.teluguTargetAudience : action.targetAudience}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {isTelugu ? action.teluguName : action.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {isTelugu ? action.teluguPurpose : action.purpose}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700 mb-4">
                    <strong className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      {isTelugu ? 'నిర్వహణ విధానం (Execution):' : 'Execution Method:'}
                    </strong>
                    {isTelugu ? action.teluguHowToConduct : action.howToConduct}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
                  ✨ {action.expectedBenefit}
                </div>
              </Card>
            ))}
          </div>

          {/* Interactive Community Activity Planner Form */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-lg">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Interactive Toolkit
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-1">
                {t('nutritionAwareness.planActivity')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-8">
                {t('nutritionAwareness.planSubtitle')}
              </p>
            </div>

            {generatedPlan ? (
              /* Success / Generated Plan Card */
              <div className="bg-emerald-50/60 border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-emerald-200/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {t('nutritionAwareness.planSuccess')}
                      </h4>
                      <p className="text-xs text-emerald-800">
                        NutriVita Community Action Plan #{generatedPlan.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={handleCopyPlan} className="flex items-center gap-1.5">
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? t('nutritionAwareness.copied') : t('nutritionAwareness.copyPlan')}</span>
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handlePrintPlan} className="flex items-center gap-1.5">
                      <Printer className="w-4 h-4" />
                      <span>{t('nutritionAwareness.printPlan')}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleResetPlan}>
                      {t('nutritionAwareness.resetPlan')}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-emerald-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Campaign Title
                    </span>
                    <strong className="text-sm text-slate-900">{generatedPlan.title}</strong>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Target Community
                    </span>
                    <strong className="text-sm text-emerald-700">{generatedPlan.targetAudience}</strong>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Target Date & Organizer
                    </span>
                    <strong className="text-sm text-slate-900">
                      {generatedPlan.date} • {generatedPlan.organizer}
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-emerald-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Implementation Objectives & Notes
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {generatedPlan.steps}
                  </p>
                </div>
              </div>
            ) : (
              /* Planner Form */
              <form onSubmit={handlePlanSubmit} className="space-y-5 max-w-3xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('nutritionAwareness.activityTitle')} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={planForm.title}
                    onChange={handlePlanInputChange}
                    placeholder="e.g., Campus Iron & Superfood Awareness Day"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border ${
                      planErrors.title ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                    } focus:bg-white focus:outline-none focus:border-emerald-500`}
                  />
                  {planErrors.title && <p className="text-rose-500 text-xs mt-1">{planErrors.title}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t('nutritionAwareness.targetAudience')} *
                    </label>
                    <select
                      name="targetAudience"
                      value={planForm.targetAudience}
                      onChange={handlePlanInputChange}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm border ${
                        planErrors.targetAudience ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:outline-none focus:border-emerald-500`}
                    >
                      <option value="">-- {t('nutritionAwareness.selectAudience')} --</option>
                      <option value="School Children & Parents">School Children & Parents</option>
                      <option value="College Campus Students">College Campus Students</option>
                      <option value="Rural Village & Anganwadi">Rural Village & Anganwadi</option>
                      <option value="Residential Apartment Community">Residential Apartment Community</option>
                      <option value="Workplace Employees">Workplace Employees</option>
                      <option value="Family & Household">Family & Household</option>
                    </select>
                    {planErrors.targetAudience && (
                      <p className="text-rose-500 text-xs mt-1">{planErrors.targetAudience}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t('nutritionAwareness.activityDate')} *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={planForm.date}
                      onChange={handlePlanInputChange}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm border ${
                        planErrors.date ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:outline-none focus:border-emerald-500`}
                    />
                    {planErrors.date && <p className="text-rose-500 text-xs mt-1">{planErrors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t('nutritionAwareness.leadOrganizer')} *
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={planForm.organizer}
                      onChange={handlePlanInputChange}
                      placeholder="e.g., NSS Unit / Eco-Club"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm border ${
                        planErrors.organizer ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:outline-none focus:border-emerald-500`}
                    />
                    {planErrors.organizer && <p className="text-rose-500 text-xs mt-1">{planErrors.organizer}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('nutritionAwareness.actionSteps')} *
                  </label>
                  <textarea
                    rows={4}
                    name="steps"
                    value={planForm.steps}
                    onChange={handlePlanInputChange}
                    placeholder="List the key activities, e.g.:&#10;1. Set up Moringa and Amla recipe tasting table&#10;2. Demonstrate 50:25:25 steel plate model&#10;3. Conduct 10-minute quiz on Vitamin D and sunshine"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border ${
                      planErrors.steps ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50'
                    } focus:bg-white focus:outline-none focus:border-emerald-500`}
                  />
                  {planErrors.steps && <p className="text-rose-500 text-xs mt-1">{planErrors.steps}</p>}
                </div>

                <Button variant="primary" size="md" type="submit" className="w-full sm:w-auto px-8">
                  {t('nutritionAwareness.submitPlan')}
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* ========================================================
            8. BOTTOM DISCLAIMER & QUICK ACCESS
        ======================================================== */}
        <section className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200">
          <div className="flex items-start gap-3.5 mb-6">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong className="font-bold text-slate-800 block mb-1">
                {isTelugu ? 'శాశ్వత విద్యా నిరాకరణ' : 'NutriVita Educational Health Protocol'}
              </strong>
              {isTelugu ? DISCLAIMER_TE : DISCLAIMER_EN}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-500">
              {isTelugu ? 'సంబంధిత న్యూట్రివిటా మాడ్యూల్స్:' : 'Explore Connected Modules:'}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                to="/vita-quiz"
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-semibold transition-colors"
              >
                📝 VitaQuiz
              </Link>
              <Link
                to="/vitamate-ai"
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-semibold transition-colors"
              >
                ✨ VitaMate AI
              </Link>
              <Link
                to="/food-explorer"
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-semibold transition-colors"
              >
                🥗 Food Explorer
              </Link>
              <Link
                to="/vitamins"
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-semibold transition-colors"
              >
                🔬 Vitamin Encyclopedia
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================
          ARTICLE DETAIL MODAL
      ======================================================== */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={isTelugu ? selectedArticle.teluguTitle : selectedArticle.title}
          subtitle={`${selectedArticle.category} • ${selectedArticle.readTime}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-slate-700 text-xs sm:text-sm">
            {/* Full Content */}
            <div className="space-y-3 leading-relaxed whitespace-pre-line text-slate-800">
              {isTelugu ? selectedArticle.teluguContent : selectedArticle.content}
            </div>

            {/* Key Takeaways Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4">
              <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('nutritionAwareness.keyTakeaways')}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(isTelugu ? selectedArticle.teluguKeyTakeaways : selectedArticle.keyTakeaways).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Tips Box */}
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4">
              <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>{t('nutritionAwareness.practicalTips')}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(isTelugu ? selectedArticle.teluguPracticalTips : selectedArticle.practicalTips).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Close Button */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedArticle(null)}>
                {t('nutritionAwareness.closeArticle')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================
          SUPERFOOD DETAIL MODAL
      ======================================================== */}
      {selectedSuperfood && (
        <Modal
          isOpen={!!selectedSuperfood}
          onClose={() => setSelectedSuperfood(null)}
          title={`${selectedSuperfood.name} (${selectedSuperfood.teluguName})`}
          subtitle={`${selectedSuperfood.category} • Local Superfood`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            {/* Image */}
            <div className="h-48 w-full rounded-xl overflow-hidden bg-slate-100">
              <img
                src={getVerifiedFoodImageUrl(selectedSuperfood)}
                alt={selectedSuperfood.name}
                onError={(e) => handleFoodImgError(e, selectedSuperfood.id)}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Nutrients */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                {t('nutritionAwareness.nutrients')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {parseNutrientsList(selectedSuperfood.nutrients).map((n) => (
                  <span
                    key={n}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Health Benefits */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                {t('nutritionAwareness.benefits')}
              </span>
              {Array.isArray(isTelugu ? selectedSuperfood.teluguBenefits : selectedSuperfood.benefits) ? (
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {(isTelugu ? selectedSuperfood.teluguBenefits : selectedSuperfood.benefits).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isTelugu ? selectedSuperfood.teluguBenefits : selectedSuperfood.benefits}</span>
                </div>
              )}
            </div>

            {/* How to Eat */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                {t('nutritionAwareness.howToEat')}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {isTelugu ? selectedSuperfood.teluguHowToEat : selectedSuperfood.howToEat}
              </p>
            </div>

            {/* Budget Hack */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
              <strong className="block font-bold mb-0.5 text-amber-950">
                💰 {t('nutritionAwareness.communityTip')}:
              </strong>
              {isTelugu ? selectedSuperfood.teluguCommunityTip : selectedSuperfood.communityTip}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedSuperfood(null)}>
                {t('nutritionAwareness.closeSuperfood')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NutritionAwareness;
