import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Bookmark, 
  Flame, 
  CheckCircle, 
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import mealService from '../services/mealService';
import foodService from '../services/foodService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { getVerifiedFoodImageUrl, handleFoodImgError } from '../utils/foodImageFallback';

const SmartMealPlanner = () => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';
  const { user } = useAuth();
  const location = useLocation();

  // Settings
  const [planTitle, setPlanTitle] = useState(
    user?.name ? `${user.name}'s Daily Wellness Plan` : 'Personalized Daily Wellness Plan'
  );
  const [dietaryPref, setDietaryPref] = useState(user?.dietaryPreference || 'vegetarian');
  const [targetCalories, setTargetCalories] = useState(2000);

  // Meals state
  const [meals, setMeals] = useState({
    breakfast: [
      { foodId: 'ragi_sangati', name: 'Finger Millet (Ragi Porridge / Mudde)', portion: '1 bowl (150g)', calories: 328, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', protein: 7.3, iron: 3.9, calcium: 344 },
      { foodId: 'banana', name: 'Fresh Banana', portion: '1 whole (100g)', calories: 89, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80', protein: 1.1, iron: 0.3, calcium: 5 },
    ],
    lunch: [
      { foodId: 'whole_wheat', name: 'Whole Wheat Roti', portion: '2 rotis (100g)', calories: 340, imageUrl: '/images/foods/whole_wheat.jpg', protein: 13.2, iron: 3.6, calcium: 34 },
      { foodId: 'lentils', name: 'Toor Dal (Cooked)', portion: '1 cup (150g)', calories: 343, imageUrl: '/images/foods/lentils.jpg', protein: 21.7, iron: 5.2, calcium: 130 },
      { foodId: 'spinach', name: 'Spinach Curry (Palak)', portion: '1 bowl (120g)', calories: 23, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', protein: 2.9, iron: 2.7, calcium: 99 },
      { foodId: 'curd', name: 'Fresh Curd (Dahi)', portion: '1 bowl (100g)', calories: 61, imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80', protein: 3.5, iron: 0.1, calcium: 121 },
    ],
    snack: [
      { foodId: 'almonds', name: 'Soaked Almonds (Badam)', portion: 'Handful (30g)', calories: 174, imageUrl: '/images/foods/almonds.jpg', protein: 6.4, iron: 1.1, calcium: 81 },
      { foodId: 'guava', name: 'Fresh Guava', portion: '1 piece (100g)', calories: 68, imageUrl: '/images/foods/guava.jpg', protein: 2.6, iron: 0.3, calcium: 18 },
    ],
    dinner: [
      { foodId: 'paneer', name: 'Cottage Cheese (Paneer)', portion: '100g', calories: 265, imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', protein: 18.3, iron: 0.2, calcium: 480 },
      { foodId: 'sweet_potato', name: 'Steamed Sweet Potato', portion: '100g', calories: 86, imageUrl: '/images/foods/sweet_potato.jpg', protein: 1.6, iron: 0.6, calcium: 30 },
    ],
  });

  // Food Picker Modal state
  const [activeSlotForAdd, setActiveSlotForAdd] = useState(null);
  const [availableFoods, setAvailableFoods] = useState([]);
  const [pickerSearch, setPickerSearch] = useState('');

  // Status & loading states
  const [generateLoading, setGenerateLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Ingest existing plan if passed from Saved Plans
  useEffect(() => {
    if (location.state?.loadPlan) {
      const p = location.state.loadPlan;
      if (p.meals && typeof p.meals === 'object') {
        setMeals({
          breakfast: Array.isArray(p.meals.breakfast) ? p.meals.breakfast : [],
          lunch: Array.isArray(p.meals.lunch) ? p.meals.lunch : [],
          snack: Array.isArray(p.meals.snack) ? p.meals.snack : [],
          dinner: Array.isArray(p.meals.dinner) ? p.meals.dinner : [],
        });
      }
      if (p.title) setPlanTitle(p.title);
      if (p.targetCalories) setTargetCalories(Number(p.targetCalories) || 2000);
      if (p.dietaryPreference) setDietaryPref(p.dietaryPreference);
    } else if (user?.name) {
      setPlanTitle(`${user.name}'s Daily Wellness Plan`);
    }
  }, [location.state, user]);

  useEffect(() => {
    foodService.getFoods({ limit: 100 })
      .then(res => setAvailableFoods(res.data || []))
      .catch(() => {});
  }, []);

  // Compute daily totals safely
  const allItems = [
    ...(Array.isArray(meals?.breakfast) ? meals.breakfast : []),
    ...(Array.isArray(meals?.lunch) ? meals.lunch : []),
    ...(Array.isArray(meals?.snack) ? meals.snack : []),
    ...(Array.isArray(meals?.dinner) ? meals.dinner : []),
  ];

  const totalCalories = allItems.reduce((acc, item) => acc + (item.calories || 0), 0);
  const totalProtein = Number(allItems.reduce((acc, item) => acc + (item.protein || 0), 0).toFixed(1));
  const totalIron = Number(allItems.reduce((acc, item) => acc + (item.iron || 0), 0).toFixed(1));
  const totalCalcium = Math.round(allItems.reduce((acc, item) => acc + (item.calcium || 0), 0));

  const handleAutoGenerate = async () => {
    setGenerateLoading(true);
    setSaveMessage('');
    try {
      const res = await mealService.generatePlan({
        dietaryPreference: dietaryPref,
        targetCalories: Number(targetCalories),
      });
      if (res.data?.meals) {
        setMeals(res.data.meals);
        setPlanTitle(res.data.title || 'Balanced Daily Nutrition Plan');
      }
    } catch (err) {
      // Graceful fallback
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleRemoveFromSlot = (slot, index) => {
    setMeals(prev => ({
      ...prev,
      [slot]: (Array.isArray(prev[slot]) ? prev[slot] : []).filter((_, i) => i !== index),
    }));
  };

  const handleAddFoodToSlot = (food) => {
    if (!activeSlotForAdd) return;

    const newItem = {
      foodId: food.id,
      name: food.name,
      portion: '100g serving',
      calories: food.calories || 0,
      imageUrl: getVerifiedFoodImageUrl(food),
      protein: food.macronutrients?.protein || 0,
      iron: food.minerals?.iron || 0,
      calcium: food.minerals?.calcium || 0,
    };

    setMeals(prev => ({
      ...prev,
      [activeSlotForAdd]: [...(Array.isArray(prev[activeSlotForAdd]) ? prev[activeSlotForAdd] : []), newItem],
    }));

    setActiveSlotForAdd(null);
  };

  const handleSavePlan = async () => {
    setSaveLoading(true);
    setSaveMessage('');

    try {
      await mealService.savePlan({
        title: planTitle,
        targetCalories: Number(targetCalories),
        dietaryPreference: dietaryPref,
        meals,
        dailyTotals: {
          calories: totalCalories,
          protein: totalProtein,
          iron: totalIron,
          calcium: totalCalcium,
        },
      });

      setSaveMessage('Meal plan saved successfully! You can review it anytime in Saved Plans.');
    } catch (err) {
      setSaveMessage('Failed to save meal plan.');
    } finally {
      setSaveLoading(false);
    }
  };

  const filteredPickerFoods = availableFoods.filter(f =>
    !pickerSearch ||
    f.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    (f.teluguName && f.teluguName.includes(pickerSearch))
  );

  const slots = [
    { id: 'breakfast', title: isTelugu ? 'ఉదయం అల్పాహారం (Breakfast)' : 'Morning Breakfast', time: '8:00 AM - 9:00 AM' },
    { id: 'lunch', title: isTelugu ? 'మధ్యాహ్న భోజనం (Lunch)' : 'Nutrient-Dense Lunch', time: '1:00 PM - 2:00 PM' },
    { id: 'snack', title: isTelugu ? 'సాయంత్రం స్నాక్ (Evening Snack)' : 'Healthy Evening Snack', time: '4:30 PM - 5:30 PM' },
    { id: 'dinner', title: isTelugu ? 'రాత్రి భోజనం (Dinner)' : 'Light Evening Dinner', time: '7:30 PM - 8:30 PM' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BackButton fallbackPath="/dashboard" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Smart Meal Scheduler
            </span>
            <span className="text-xs text-slate-400">• Goal-Oriented Planning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTelugu ? 'స్మార్ట్ భోజన ప్రణాళిక' : 'Smart Meal Planner'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {isTelugu
              ? 'మీ శరీర అవసరాలకు సరిపడే సమతుల్య భోజన ప్రణాళికను రూపొందించి, భద్రపరుచుకోండి.'
              : 'Construct structured daily meal plans across breakfast, lunch, snack, and dinner. Auto-generate tailored plans and save them for routine wellness tracking.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/saved-plans">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <Bookmark className="w-4 h-4 mr-1.5" />
              <span>View Saved Plans</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAutoGenerate}
            loading={generateLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>Auto-Generate Balanced Day</span>
          </Button>
        </div>
      </div>

      {/* Plan Configuration & Targets Bar */}
      <Card className="p-5 space-y-4 bg-white border-emerald-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Plan Title
            </label>
            <input
              type="text"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Dietary Preference
            </label>
            <select
              value={dietaryPref}
              onChange={(e) => setDietaryPref(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="vegetarian">Vegetarian (Includes Dairy)</option>
              <option value="vegan">100% Plant-Based (Vegan)</option>
              <option value="non_vegetarian">Non-Vegetarian (Eggs & Fish)</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Daily Target Calories
            </label>
            <select
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="1600">1600 kcal (Light)</option>
              <option value="1800">1800 kcal (Moderate Female)</option>
              <option value="2000">2000 kcal (Standard)</option>
              <option value="2200">2200 kcal (Active Male)</option>
              <option value="2500">2500 kcal (High Activity)</option>
            </select>
          </div>
        </div>

        {/* Real-time Summary Gauges */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-slate-500">Daily Calories:</span>
              <strong className="text-slate-900">{totalCalories} / {targetCalories} kcal</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Protein:</span>
              <strong className="text-emerald-700">{totalProtein}g</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Iron:</span>
              <strong className="text-emerald-700">{totalIron}mg</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Calcium:</span>
              <strong className="text-emerald-700">{totalCalcium}mg</strong>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSavePlan}
            loading={saveLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save Plan to Profile</span>
          </Button>
        </div>

        {saveMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${saveMessage.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}
      </Card>

      {/* 4 Meal Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slots.map((slot) => {
          const slotItems = Array.isArray(meals?.[slot.id]) ? meals[slot.id] : [];
          const slotCalories = slotItems.reduce((acc, item) => acc + (item.calories || 0), 0);

          return (
            <Card key={slot.id} className="p-6 space-y-4 flex flex-col justify-between">
              <div>
                {/* Slot Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{slot.title}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{slot.time}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                    {slotCalories} kcal
                  </span>
                </div>

                {/* Items in Slot */}
                <div className="space-y-2.5 pt-3">
                  {slotItems.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                      No foods added to this meal yet.
                    </div>
                  ) : (
                    slotItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50/90 hover:bg-emerald-50/30 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={getVerifiedFoodImageUrl({ id: item.foodId, imageUrl: item.imageUrl })}
                            alt={item.name}
                            onError={(e) => handleFoodImgError(e, item.foodId)}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                            <p className="text-[10px] text-slate-500">
                              {item.portion} • {item.calories} kcal
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveFromSlot(slot.id, idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Food to Slot Button */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveSlotForAdd(slot.id);
                    setPickerSearch('');
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Food to {slot.title.split(' ')[0]}</span>
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Food Modal Picker */}
      <Modal
        isOpen={!!activeSlotForAdd}
        onClose={() => setActiveSlotForAdd(null)}
        title="Choose Food from Reusable Database"
        subtitle={`Select an item to add to ${activeSlotForAdd?.toUpperCase()}`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            placeholder="Search foods (e.g. spinach, ragi, dal, curd, egg)..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredPickerFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => handleAddFoodToSlot(food)}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 flex items-center gap-2.5 text-left transition-all group"
              >
                <img
                  src={getVerifiedFoodImageUrl(food)}
                  alt={food.name}
                  onError={(e) => handleFoodImgError(e, food.id)}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                    {food.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {food.calories} kcal • {food.category}
                  </p>
                </div>
                <Plus className="w-4 h-4 text-emerald-600 opacity-60 group-hover:opacity-100 shrink-0" />
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveSlotForAdd(null)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default SmartMealPlanner;
