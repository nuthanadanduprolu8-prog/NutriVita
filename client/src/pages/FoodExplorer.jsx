import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Apple, 
  PlusCircle, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import foodService from '../services/foodService';
import FoodCard from '../components/food/FoodCard';
import FoodDetailModal from '../components/food/FoodDetailModal';
import BackButton from '../components/common/BackButton';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const FoodExplorer = () => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting State (URL-synchronized for persistent back/forward navigation)
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedRichIn, setSelectedRichIn] = useState(searchParams.get('richIn') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || '');

  // Keep URL search query updated
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedRichIn) params.richIn = selectedRichIn;
    if (selectedSort) params.sort = selectedSort;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, selectedRichIn, selectedSort, setSearchParams]);

  // Selected food for detail view
  const [activeFood, setActiveFood] = useState(null);

  // Add food modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFoodData, setNewFoodData] = useState({
    name: '',
    teluguName: '',
    category: 'vegetables',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber: '',
    iron: '',
    calcium: '',
    vitaminC: '',
    vitaminA: '',
    imageUrl: '',
    descriptionEn: '',
    benefitsEn: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addMessage, setAddMessage] = useState('');

  useEffect(() => {
    fetchFoods();
  }, [searchTerm, selectedCategory, selectedRichIn, selectedSort]);

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await foodService.getFoods({
        search: searchTerm,
        category: selectedCategory,
        richIn: selectedRichIn,
        sort: selectedSort,
        limit: 100,
      });
      setFoods(res.data || []);
    } catch (err) {
      setError('Could not load food database. Please check server status.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: isTelugu ? 'అన్ని ఆహారాలు' : 'All Foods' },
    { id: 'vegetables', label: isTelugu ? 'కూరగాయలు & ఆకుకూరలు' : 'Leafy Greens & Veggies' },
    { id: 'fruits', label: isTelugu ? 'పండ్లు & సూపర్ ఫ్రూట్స్' : 'Fruits & Citrus' },
    { id: 'grains_millets', label: isTelugu ? 'చిరుధాన్యాలు & ధాన్యాలు' : 'Millets & Whole Grains' },
    { id: 'pulses_legumes', label: isTelugu ? 'పప్పులు & గింజలు' : 'Pulses & Legumes' },
    { id: 'nuts_seeds', label: isTelugu ? 'నట్స్ & విత్తనాలు' : 'Nuts & Seeds' },
    { id: 'dairy', label: isTelugu ? 'పాల ఉత్పత్తులు' : 'Dairy & Curd' },
    { id: 'eggs_poultry_fish', label: isTelugu ? 'గుడ్లు & చేపలు' : 'Eggs & Healthy Proteins' },
    { id: 'snack', label: isTelugu ? 'స్నాక్స్' : 'Healthy Snacks' },
  ];

  const richInFilters = [
    { id: '', label: 'Any Nutrient' },
    { id: 'iron', label: 'Rich in Iron (Fe)' },
    { id: 'calcium', label: 'Rich in Calcium (Ca)' },
    { id: 'vitamin_c', label: 'Rich in Vitamin C' },
    { id: 'vitamin_a', label: 'Rich in Vitamin A' },
    { id: 'protein', label: 'High Protein (≥10g)' },
    { id: 'b12', label: 'Contains B12' },
  ];

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddMessage('');

    try {
      await foodService.addFood({
        name: newFoodData.name,
        teluguName: newFoodData.teluguName || newFoodData.name,
        category: newFoodData.category,
        calories: Number(newFoodData.calories),
        macronutrients: {
          protein: Number(newFoodData.protein) || 0,
          carbs: Number(newFoodData.carbs) || 0,
          fats: Number(newFoodData.fats) || 0,
          fiber: Number(newFoodData.fiber) || 0,
        },
        vitamins: {
          vitaminA: Number(newFoodData.vitaminA) || 0,
          vitaminC: Number(newFoodData.vitaminC) || 0,
        },
        minerals: {
          iron: Number(newFoodData.iron) || 0,
          calcium: Number(newFoodData.calcium) || 0,
        },
        imageUrl: newFoodData.imageUrl || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
        descriptionEn: newFoodData.descriptionEn || 'Nutritious whole food item.',
        benefitsEn: newFoodData.benefitsEn ? newFoodData.benefitsEn.split(',').map(s => s.trim()) : ['Supports general wellness'],
      });

      setAddMessage('Food item added successfully!');
      setTimeout(() => {
        setIsAddModalOpen(false);
        setNewFoodData({
          name: '',
          teluguName: '',
          category: 'vegetables',
          calories: '',
          protein: '',
          carbs: '',
          fats: '',
          fiber: '',
          iron: '',
          calcium: '',
          vitaminC: '',
          vitaminA: '',
          imageUrl: '',
          descriptionEn: '',
          benefitsEn: '',
        });
        fetchFoods();
      }, 900);
    } catch (err) {
      setAddMessage('Failed to add food. Please verify required fields.');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BackButton fallbackPath="/dashboard" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Food Directory
            </span>
            <span className="text-xs text-slate-400">• Verified Nutrition Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTelugu ? 'ఆహార సమాచార కేంద్రం' : 'Verified Food Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {isTelugu
              ? 'నిజమైన ఛాయాచిత్రాలు, సంపూర్ణ విటమిన్లు మరియు ఖనిజాల విశ్లేషణతో కూడిన భారతీయ మరియు ప్రాంతీయ ఆహార సమాచారం.'
              : 'Discover whole foods, Indian millets, leafy greens, and nutrient powerhouses with real verified photography and complete micro/macronutrient facts.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>Add New Food</span>
          </Button>
          <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
            {foods.length} Foods Listed
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <Card className="p-4 space-y-4">
        
        {/* Top Controls Row */}
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Live Search Field */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isTelugu ? 'ఆహారం పేరు శోధించండి (ఉదా. పాలకూర, Ragi, Amla, Curd)...' : 'Search foods by name or tag (e.g. spinach, ragi, amla, curd, almonds)...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Standout Nutrient Filter */}
          <div className="w-full md:w-56 shrink-0">
            <select
              value={selectedRichIn}
              onChange={(e) => setSelectedRichIn(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {richInFilters.map((rf) => (
                <option key={rf.id} value={rf.id}>{rf.label}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-52 shrink-0">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="">Sort: Default</option>
              <option value="iron_desc">Iron (High to Low)</option>
              <option value="calcium_desc">Calcium (High to Low)</option>
              <option value="vitaminc_desc">Vitamin C (High to Low)</option>
              <option value="protein_desc">Protein (High to Low)</option>
              <option value="calories_asc">Calories (Low to High)</option>
              <option value="calories_desc">Calories (High to Low)</option>
              <option value="name_asc">Name (A to Z)</option>
            </select>
          </div>

          {/* Clear Button */}
          {(searchTerm || selectedRichIn || selectedSort || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedRichIn('');
                setSelectedSort('');
              }}
              className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl shrink-0 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Foods Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Retrieving verified food database...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
          <p className="text-xs font-semibold text-rose-800">{error}</p>
          <button
            onClick={fetchFoods}
            className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg"
          >
            Retry Loading
          </button>
        </div>
      ) : foods.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Apple className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Foods Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No matching food items were found matching your current filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedRichIn('');
              setSelectedSort('');
            }}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard
              key={food.id || food._id}
              food={food}
              onSelect={(f) => setActiveFood(f)}
            />
          ))}
        </div>
      )}

      {/* Food Details Modal */}
      <FoodDetailModal
        food={activeFood}
        isOpen={!!activeFood}
        onClose={() => setActiveFood(null)}
      />

      {/* Add New Food Modal (Scalable Database Capability) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Food to Reusable Database"
        subtitle="Expand NutriVita's directory with regional and nutritious foods"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {addMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${addMessage.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              <span>{addMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Food Name (English)"
              value={newFoodData.name}
              onChange={(e) => setNewFoodData({ ...newFoodData, name: e.target.value })}
              placeholder="e.g. Guava"
              required
            />
            <Input
              label="Name in Telugu"
              value={newFoodData.teluguName}
              onChange={(e) => setNewFoodData({ ...newFoodData, teluguName: e.target.value })}
              placeholder="e.g. జామకాయ"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={newFoodData.category}
                onChange={(e) => setNewFoodData({ ...newFoodData, category: e.target.value })}
                className="block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm bg-white"
              >
                <option value="vegetables">Vegetables & Leafy Greens</option>
                <option value="fruits">Fruits & Citrus</option>
                <option value="grains_millets">Millets & Grains</option>
                <option value="pulses_legumes">Pulses & Legumes</option>
                <option value="nuts_seeds">Nuts & Seeds</option>
                <option value="dairy">Dairy Products</option>
                <option value="eggs_poultry_fish">Eggs & Lean Proteins</option>
                <option value="snack">Healthy Snacks</option>
              </select>
            </div>

            <Input
              label="Calories (kcal per 100g)"
              type="number"
              value={newFoodData.calories}
              onChange={(e) => setNewFoodData({ ...newFoodData, calories: e.target.value })}
              placeholder="e.g. 68"
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Input
              label="Protein (g)"
              type="number"
              value={newFoodData.protein}
              onChange={(e) => setNewFoodData({ ...newFoodData, protein: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Carbs (g)"
              type="number"
              value={newFoodData.carbs}
              onChange={(e) => setNewFoodData({ ...newFoodData, carbs: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Fats (g)"
              type="number"
              value={newFoodData.fats}
              onChange={(e) => setNewFoodData({ ...newFoodData, fats: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Fiber (g)"
              type="number"
              value={newFoodData.fiber}
              onChange={(e) => setNewFoodData({ ...newFoodData, fiber: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Input
              label="Iron (mg)"
              type="number"
              value={newFoodData.iron}
              onChange={(e) => setNewFoodData({ ...newFoodData, iron: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Calcium (mg)"
              type="number"
              value={newFoodData.calcium}
              onChange={(e) => setNewFoodData({ ...newFoodData, calcium: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Vit C (mg)"
              type="number"
              value={newFoodData.vitaminC}
              onChange={(e) => setNewFoodData({ ...newFoodData, vitaminC: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Vit A (mcg)"
              type="number"
              value={newFoodData.vitaminA}
              onChange={(e) => setNewFoodData({ ...newFoodData, vitaminA: e.target.value })}
              placeholder="0"
            />
          </div>

          <Input
            label="Verified Real Food Photo Image URL"
            value={newFoodData.imageUrl}
            onChange={(e) => setNewFoodData({ ...newFoodData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/photo-..."
            required
          />

          <Input
            label="Health Benefits (comma-separated)"
            value={newFoodData.benefitsEn}
            onChange={(e) => setNewFoodData({ ...newFoodData, benefitsEn: e.target.value })}
            placeholder="High fiber, Boosts immunity, Heart healthy"
          />

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={addLoading}
            >
              Save to Database
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default FoodExplorer;
