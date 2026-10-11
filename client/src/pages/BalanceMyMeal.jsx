import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { 
  UtensilsCrossed, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  Scale, 
  ArrowRight,
  Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import mealService from '../services/mealService';
import foodService from '../services/foodService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const BalanceMyMeal = () => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  // All foods for selector
  const [availableFoods, setAvailableFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const location = useLocation();

  // Plate items state: array of { foodId, quantity: 100 }
  const [plateItems, setPlateItems] = useState([
    { foodId: 'spinach', quantity: 100 },
    { foodId: 'lentils', quantity: 150 },
    { foodId: 'ragi_sangati', quantity: 100 },
    { foodId: 'curd', quantity: 100 },
  ]);

  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Cross-feature ingestion: if navigated from Food Scanner or Saved Plans
  useEffect(() => {
    if (location.state?.addFood) {
      const food = location.state.addFood;
      const targetId = food.id || food._id;
      const targetQty = location.state.quantity || 100;
      if (targetId) {
        setPlateItems((prev) => {
          const exists = prev.find((p) => p.foodId === targetId);
          if (exists) {
            return prev.map((p) => (p.foodId === targetId ? { ...p, quantity: p.quantity + targetQty } : p));
          }
          return [...prev, { foodId: targetId, quantity: targetQty }];
        });
      }
    } else if (location.state?.loadPlanMeals) {
      const allPlanItems = [];
      const m = location.state.loadPlanMeals;
      ['breakfast', 'lunch', 'snack', 'dinner'].forEach((slot) => {
        if (Array.isArray(m[slot])) {
          m[slot].forEach((item) => {
            if (item.foodId) {
              allPlanItems.push({ foodId: item.foodId, quantity: 100 });
            }
          });
        }
      });
      if (allPlanItems.length > 0) {
        setPlateItems(allPlanItems);
      }
    }
  }, [location.state]);

  useEffect(() => {
    // Load foods list for picker
    foodService.getFoods({ limit: 100 })
      .then(res => setAvailableFoods(res.data || []))
      .catch(() => {});
  }, []);

  const evaluatePlate = useCallback(async (itemsToEvaluate) => {
    const items = itemsToEvaluate || plateItems;
    if (!items || items.length === 0) {
      setAnalysis(null);
      return;
    }
    setLoadingAnalysis(true);
    try {
      const res = await mealService.balanceMeal(items);
      setAnalysis(res);
    } catch {
      // Handled gracefully
    } finally {
      setLoadingAnalysis(false);
    }
  }, [plateItems]);

  useEffect(() => {
    evaluatePlate();
  }, [evaluatePlate]);

  const handleAddFood = (foodId) => {
    const existing = plateItems.find(p => p.foodId === foodId);
    if (existing) {
      setPlateItems(plateItems.map(p => p.foodId === foodId ? { ...p, quantity: p.quantity + 50 } : p));
    } else {
      setPlateItems([...plateItems, { foodId, quantity: 100 }]);
    }
  };

  const handleUpdateQuantity = (foodId, delta) => {
    setPlateItems(plateItems.map(p => {
      if (p.foodId === foodId) {
        const newQty = Math.max(p.quantity + delta, 25);
        return { ...p, quantity: newQty };
      }
      return p;
    }));
  };

  const handleRemoveFood = (foodId) => {
    setPlateItems(plateItems.filter(p => p.foodId !== foodId));
  };

  const handleClearPlate = () => {
    setPlateItems([]);
  };

  const handleLoadSamplePlate = () => {
    setPlateItems([
      { foodId: 'spinach', quantity: 100 },
      { foodId: 'lentils', quantity: 150 },
      { foodId: 'ragi_sangati', quantity: 100 },
      { foodId: 'curd', quantity: 100 },
      { foodId: 'amla', quantity: 30 },
    ]);
  };

  // Filter available foods for drawer
  const filteredFoods = availableFoods.filter(f => {
    const matchesSearch = !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()) || (f.teluguName && f.teluguName.includes(searchTerm));
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BackButton fallbackPath="/dashboard" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              NutriVita Meal Balancer
            </span>
            <span className="text-xs text-slate-400">• Real-Time Plate Scoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTelugu ? 'సమతుల్య భోజన విశ్లేషణ' : 'Balance My Meal (Plate Visualizer)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {isTelugu
              ? 'మీ ప్లేట్‌కు వివిధ ఆహారాలను జోడించి, వాటి సమ్మేళన పోషకాలు, కేలరీలు మరియు పోషక సమతుల్యతను తనిఖీ చేయండి.'
              : 'Add whole foods to your virtual plate to calculate combined macronutrients, essential vitamins, absorption synergies, and preventive balance score.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSamplePlate}
            className="border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50 text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>Load Sample Balanced Plate</span>
          </Button>
          {plateItems.length > 0 && (
            <button
              onClick={handleClearPlate}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
            >
              Clear Plate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Plate & Added Items (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Your Virtual Meal Plate</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                {loadingAnalysis ? 'Balancing Plate...' : `${plateItems.length} Food Items Selected`}
              </span>
            </div>

            {/* Empty Plate Notice */}
            {plateItems.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-slate-50/70 rounded-2xl border-2 border-dashed border-slate-200">
                <UtensilsCrossed className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">Your plate is currently empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Pick foods from the catalog below or load our sample balanced plate to start calculating nutrition.
                </p>
                <Button variant="primary" size="sm" onClick={handleLoadSamplePlate}>
                  Load Sample Plate
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {analysis?.nutrition?.itemsDetailed.map((item) => (
                  <div
                    key={item.foodId}
                    className="p-3 bg-slate-50/80 hover:bg-emerald-50/30 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&auto=format&fit=crop&q=80';
                        }}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {item.calories} kcal • {item.protein}g Protein • {item.iron}mg Iron
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Portion Adjuster */}
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
                        <button
                          onClick={() => handleUpdateQuantity(item.foodId, -25)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 text-xs font-bold"
                          title="Decrease 25g"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-700 min-w-[45px] text-center">
                          {item.quantity}g
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.foodId, 25)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 text-xs font-bold"
                          title="Increase 25g"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFood(item.foodId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from meal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Food Catalog Add Selector */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add More Foods from Database</span>
              </h3>
              <span className="text-[10px] text-slate-400">{filteredFoods.length} foods available</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Quick search foods to add..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="vegetables">Vegetables & Greens</option>
                <option value="fruits">Fruits & Citrus</option>
                <option value="grains_millets">Millets & Grains</option>
                <option value="pulses_legumes">Pulses & Dal</option>
                <option value="dairy">Dairy & Curd</option>
                <option value="nuts_seeds">Nuts & Seeds</option>
                <option value="eggs_poultry_fish">Eggs & Proteins</option>
              </select>
            </div>

            {/* Fast Select Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pt-1 pr-1">
              {filteredFoods.slice(0, 15).map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleAddFood(f.id)}
                  className="p-2 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 flex items-center gap-2 text-left transition-all group"
                >
                  <img
                    src={f.imageUrl}
                    alt={f.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&auto=format&fit=crop&q=80';
                    }}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-emerald-700">
                      {f.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{f.calories} kcal</p>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-emerald-600 opacity-60 group-hover:opacity-100 shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Combined Nutrition, Balance Gauge & Suggestions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {analysis?.nutrition ? (
            <div className="space-y-6">
              
              {/* Balance Evaluation Card */}
              <Card className="p-6 space-y-5 border-emerald-100 shadow-soft-lg">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Meal Balance Score</h3>
                    <p className="text-[11px] text-slate-400">Preventive nutrition breakdown</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${analysis.evaluation.isBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {analysis.evaluation.statusText}
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Nutritional Adequacy</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{analysis.evaluation.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${analysis.evaluation.score >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${analysis.evaluation.score}%` }}
                    />
                  </div>
                </div>

                {/* Total Calories & Macro Split */}
                <div className="grid grid-cols-4 gap-2 text-center pt-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-medium block">Energy</span>
                    <span className="text-xs font-bold text-slate-800">{analysis.nutrition.totalCalories} kcal</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl">
                    <span className="text-[10px] text-emerald-700 font-medium block">Protein</span>
                    <span className="text-xs font-bold text-emerald-900">{analysis.nutrition.protein}g</span>
                  </div>
                  <div className="p-2.5 bg-teal-50/60 rounded-xl">
                    <span className="text-[10px] text-teal-700 font-medium block">Carbs</span>
                    <span className="text-xs font-bold text-teal-900">{analysis.nutrition.carbs}g</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/60 rounded-xl">
                    <span className="text-[10px] text-amber-700 font-medium block">Fats</span>
                    <span className="text-xs font-bold text-amber-900">{analysis.nutrition.fats}g</span>
                  </div>
                </div>

                {/* Key Micronutrients */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Combined Micronutrients in this Meal:
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Iron</span>
                      <strong className="text-slate-900">{analysis.nutrition.iron} mg</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Calcium</span>
                      <strong className="text-slate-900">{analysis.nutrition.calcium} mg</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Vit C</span>
                      <strong className="text-slate-900">{analysis.nutrition.vitaminC} mg</strong>
                    </div>
                  </div>
                </div>

                {/* Next Action: Send to Meal Planner */}
                <div className="pt-3 border-t border-slate-100">
                  <Link to="/meal-planner">
                    <Button variant="primary" size="md" className="w-full font-bold shadow-md">
                      <span>Incorporate into Smart Meal Planner</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Actionable Suggestions & Synergies Card */}
              {analysis.evaluation.suggestions.length > 0 && (
                <Card className="p-5 space-y-3 bg-amber-50/60 border-amber-200/70">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Nutrition Gaps & Synergy Advice</span>
                  </div>

                  <div className="space-y-2.5">
                    {analysis.evaluation.suggestions.map((sug, idx) => (
                      <div key={idx} className="p-3 bg-white/90 rounded-xl border border-amber-200/50 space-y-1">
                        <strong className="text-xs text-amber-900 block font-semibold">{sug.gap}</strong>
                        <p className="text-xs text-slate-600 leading-relaxed">{sug.tip}</p>
                        {sug.foodId && (
                          <button
                            onClick={() => handleAddFood(sug.foodId)}
                            className="text-[11px] font-bold text-emerald-700 hover:underline pt-1 inline-flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add {sug.foodId} to fix this gap</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Strengths Card */}
              {analysis.evaluation.strengths.length > 0 && (
                <Card className="p-5 space-y-2 bg-emerald-50/60 border-emerald-100 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Meal Nutritional Strengths</span>
                  </div>
                  <ul className="space-y-1 pl-4 list-disc text-emerald-900">
                    {analysis.evaluation.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </Card>
              )}

            </div>
          ) : (
            <Card className="p-8 text-center space-y-3 bg-slate-50/60 border-dashed border-slate-200">
              <Scale className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-sm text-slate-700">Plate Analysis Ready</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Add food items to your plate on the left to view instant calories, vitamins, and absorption recommendations.
              </p>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
};

export default BalanceMyMeal;
