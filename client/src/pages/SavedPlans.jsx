import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Trash2, 
  CalendarCheck, 
  RefreshCw, 
  UtensilsCrossed,
  Edit3,
  Eye,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import mealService from '../services/mealService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import BackButton from '../components/common/BackButton';

const SavedPlans = () => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';
  const navigate = useNavigate();

  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePlanModal, setActivePlanModal] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await mealService.getSavedPlans();
      setSavedPlans(res.data || []);
    } catch (err) {
      setError('Could not load saved meal plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    try {
      await mealService.deletePlan(planId);
      setSavedPlans(savedPlans.filter(p => p.id !== planId && p._id !== planId));
    } catch (err) {
      // Handled
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BackButton fallbackPath="/meal-planner" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Profile Archive
            </span>
            <span className="text-xs text-slate-400">• Persistent Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTelugu ? 'భద్రపరిచిన భోజన ప్రణాళికలు' : 'Saved Meal Plans'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {isTelugu
              ? 'మీరు రూపొందించి భద్రపరచిన రోజువారీ పోషకాహార ప్రణాళికల జాబితా.'
              : 'Review your previously designed daily meal schedules, macro distributions, and nutrient targets.'}
          </p>
        </div>

        <Link to="/meal-planner">
          <Button variant="primary" size="sm" className="font-bold">
            <CalendarCheck className="w-4 h-4 mr-1.5" />
            <span>Create New Meal Plan</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading your saved plans...</p>
        </div>
      ) : savedPlans.length === 0 ? (
        <Card className="p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-800">No Saved Plans Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Design a 1-day meal plan using the Smart Meal Planner and click "Save Plan to Profile" to archive it here.
            </p>
          </div>
          <Link to="/meal-planner">
            <Button variant="primary" size="md" className="w-full">
              Open Smart Meal Planner
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedPlans.map((plan) => {
            const planId = plan.id || plan._id;
            const breakfastCount = plan.meals?.breakfast?.length || 0;
            const lunchCount = plan.meals?.lunch?.length || 0;
            const snackCount = plan.meals?.snack?.length || 0;
            const dinnerCount = plan.meals?.dinner?.length || 0;

            return (
              <Card key={planId} hoverEffect className="p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Saved: {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                      <h3 className="font-bold text-base text-slate-900">{plan.title}</h3>
                      <p className="text-xs text-emerald-700 font-semibold capitalize mt-0.5">
                        {plan.dietaryPreference?.replace('_', ' ')} • {plan.targetCalories} kcal goal
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(planId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete saved plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Meal Breakdown Preview */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Breakfast</span>
                      <strong className="text-slate-800">{breakfastCount} items</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Lunch</span>
                      <strong className="text-slate-800">{lunchCount} items</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Snack</span>
                      <strong className="text-slate-800">{snackCount} items</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Dinner</span>
                      <strong className="text-slate-800">{dinnerCount} items</strong>
                    </div>
                  </div>

                  {/* Daily Nutrient Totals */}
                  {plan.dailyTotals && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-700 font-medium block">Total Energy</span>
                        <strong className="text-emerald-950 font-bold">{plan.dailyTotals.calories} kcal</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-medium block">Protein</span>
                        <strong className="text-emerald-950 font-bold">{plan.dailyTotals.protein}g</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-medium block">Iron</span>
                        <strong className="text-emerald-950 font-bold">{plan.dailyTotals.iron}mg</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 font-medium block">Calcium</span>
                        <strong className="text-emerald-950 font-bold">{plan.dailyTotals.calcium}mg</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setActivePlanModal(plan)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Menu</span>
                  </button>

                  <button
                    onClick={() => navigate('/meal-planner', { state: { loadPlan: plan } })}
                    className="flex-1 py-1.5 px-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Edit in Planner</span>
                  </button>

                  <button
                    onClick={() => navigate('/balance-my-meal', { state: { loadPlanMeals: plan.meals } })}
                    className="flex-1 py-1.5 px-2.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-teal-600" />
                    <span>Balance Plate</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Full Menu Details Modal */}
      {activePlanModal && (
        <Modal
          isOpen={!!activePlanModal}
          onClose={() => setActivePlanModal(null)}
          title={activePlanModal.title || 'Saved Meal Plan'}
          subtitle={`${activePlanModal.dietaryPreference?.replace('_', ' ')} • Target: ${activePlanModal.targetCalories || 2000} kcal`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            {['breakfast', 'lunch', 'snack', 'dinner'].map((slot) => {
              const items = activePlanModal.meals?.[slot] || [];
              const slotTitles = {
                breakfast: isTelugu ? 'ఉదయం అల్పాహారం (Breakfast)' : 'Morning Breakfast',
                lunch: isTelugu ? 'మధ్యాహ్న భోజనం (Lunch)' : 'Nutrient-Dense Lunch',
                snack: isTelugu ? 'సాయంత్రం స్నాక్ (Evening Snack)' : 'Evening Snack',
                dinner: isTelugu ? 'రాత్రి భోజనం (Dinner)' : 'Light Dinner',
              };

              return (
                <div key={slot} className="space-y-2 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {slotTitles[slot]}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {items.length} items
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No foods in this meal slot.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=200&auto=format&fit=crop&q=80';
                                }}
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{item.portion || '1 serving'}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-slate-700 shrink-0 ml-2">
                            {item.calories} kcal
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  const planToEdit = activePlanModal;
                  setActivePlanModal(null);
                  navigate('/meal-planner', { state: { loadPlan: planToEdit } });
                }}
                className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit this Plan in Planner</span>
              </button>

              <button
                onClick={() => setActivePlanModal(null)}
                className="py-2 px-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default SavedPlans;
