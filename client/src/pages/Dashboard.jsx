import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Flame, 
  Heart, 
  ShieldCheck, 
  UtensilsCrossed, 
  Scan, 
  Sparkles, 
  BookOpen, 
  Apple, 
  TrendingUp,
  Award,
  HeartPulse,
  Camera,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import foodService from '../services/foodService';
import vitaminService from '../services/vitaminService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressBar from '../components/common/ProgressBar';
import FoodDetailModal from '../components/food/FoodDetailModal';
import VitaminDetailModal from '../components/vitamin/VitaminDetailModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isTelugu = language === 'te';

  // Live database data state
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [totalFoodCount, setTotalFoodCount] = useState(25);
  const [totalVitaminCount, setTotalVitaminCount] = useState(13);

  // Active modals state
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedVitamin, setSelectedVitamin] = useState(null);

  useEffect(() => {
    // Fetch live foods & vitamins from API
    foodService.getFoods({ limit: 4 })
      .then(res => {
        if (res.data) setFeaturedFoods(res.data);
        if (res.total) setTotalFoodCount(res.total);
      })
      .catch(() => {});

    vitaminService.getVitamins()
      .then(res => {
        if (res.count) setTotalVitaminCount(res.count);
      })
      .catch(() => {});
  }, []);

  // Calculate approximate BMR/TDEE target calories based on user profile
  const baseCalories = user?.gender === 'female' ? 1800 : 2100;
  const activityMultiplier = user?.activityLevel === 'active' ? 1.2 : user?.activityLevel === 'sedentary' ? 0.9 : 1.0;
  const targetCalories = Math.round(baseCalories * activityMultiplier);

  const quickActions = [
    {
      title: isTelugu ? "విటమిన్ విజ్ఞాన సర్వస్వం" : "Vitamin Encyclopedia",
      desc: isTelugu ? "13 ముఖ్య విటమిన్లు, RDA మరియు లోప సంకేతాలు" : "Browse all essential vitamins & RDA targets",
      icon: BookOpen,
      link: "/vitamins",
      color: "emerald"
    },
    {
      title: isTelugu ? "ఆహార సమాచార కేంద్రం" : "Verified Food Explorer",
      desc: isTelugu ? "నిజమైన ఫోటోలతో ఆహారాల పోషక విశ్లేషణ" : "Explore foods with real verified photography",
      icon: Apple,
      link: "/food-explorer",
      color: "teal"
    },
    {
      title: isTelugu ? "లక్షణాల ఆధారిత విశ్లేషణ" : "Check Deficiency Signs",
      desc: isTelugu ? "శరీర సంకేతాల ద్వారా విటమిన్ లోపాలను విశ్లేషించండి" : "Identify potential micronutrient gaps",
      icon: ShieldCheck,
      link: "/symptom-checker",
      color: "amber"
    },
    {
      title: isTelugu ? "సమతుల్య భోజన ప్లేట్" : "Balance My Meal",
      desc: isTelugu ? "50:25:25 నిష్పత్తిలో పోషకాహార ప్లేట్ నిర్మించండి" : "Build and balance your daily macro/micro plate",
      icon: UtensilsCrossed,
      link: "/balance-my-meal",
      color: "blue"
    },
    {
      title: isTelugu ? "లేబుల్ లెన్స్ స్కానర్" : "Label Lens (OCR)",
      desc: isTelugu ? "ప్యాక్డ్ ఫుడ్ లేబుల్స్ స్కాన్ చేసి న్యూట్రి-గ్రేడ్ పొందండి" : "Scan packaged nutrition facts or enter manually",
      icon: Scan,
      link: "/label-lens",
      color: "purple"
    },
    {
      title: isTelugu ? "విటామేట్ AI అసిస్టెంట్" : "VitaMate AI Assistant",
      desc: isTelugu ? "వాయిస్ సపోర్ట్‌తో పోషకాహార సలహాలు పొందండి" : "Ask nutrition questions with bilingual voice",
      icon: Sparkles,
      link: "/vitamate-ai",
      color: "rose"
    },
    {
      title: isTelugu ? "విటాక్విజ్ ఛాలెంజ్" : "VitaQuiz Challenge",
      desc: isTelugu ? "పోషకాహార క్విజ్ పూర్తి చేసి సర్టిఫికేట్ పొందండి" : "Test nutrition knowledge & earn a verified certificate",
      icon: Award,
      link: "/vita-quiz",
      color: "amber"
    },
    {
      title: isTelugu ? "పోషకాహార అవగాహన" : "Nutrition Awareness Hub",
      desc: isTelugu ? "ఆరోగ్య మార్గదర్శకాలు & సూపర్ ఫుడ్స్" : "Evidence-based guides, Indian superfoods & habits",
      icon: Heart,
      link: "/nutrition-awareness",
      color: "teal"
    },
    {
      title: isTelugu ? "శరీర మార్పుల విశ్లేషణ" : "Body Change Analyzer",
      desc: isTelugu ? "గోర్లు, జుట్టు, చర్మం వంటి శారీరక సంకేతాల ద్వారా పోషక లోపాల పరిశీలన" : "Assess physical signs across nails, hair, eyes & skin for nutritional gaps",
      icon: HeartPulse,
      link: "/body-change-analyzer",
      color: "purple"
    },
    {
      title: isTelugu ? "AI ఆహార స్కానర్" : "AI Food Vision Scanner",
      desc: isTelugu ? "కెమెరా లేదా ఫోటో ద్వారా ఆహారం మరియు పోషకాలను తక్షణమే విశ్లేషించండి" : "Capture or upload food photo for instant macro & micro analysis",
      icon: Camera,
      link: "/food-scanner",
      color: "emerald"
    },
    {
      title: isTelugu ? "స్మార్ట్ మీల్ ప్లానర్" : "Smart Meal Planner",
      desc: isTelugu ? "మీ అవసరాలకు తగిన సమతుల్య రోజువారీ ఆహార ప్రణాళికను సిద్ధం చేయండి" : "Customize & save personalized daily meal plans with macros",
      icon: CalendarCheck,
      link: "/meal-planner",
      color: "blue"
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-700/80 text-emerald-200 uppercase tracking-wider">
                {user?.dietaryPreference?.replace('_', ' ') || 'Vegetarian'}
              </span>
              <span className="text-xs text-emerald-200">
                • {user?.activityLevel || 'Moderate'} Activity
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('dashboard.welcome')}, <span className="text-emerald-300">{user?.name || 'Explorer'}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/food-explorer">
              <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Apple className="w-4 h-4 mr-1.5" />
                <span>Food Explorer</span>
              </Button>
            </Link>
            <Link to="/vitamins">
              <Button variant="primary" size="sm" className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold">
                <BookOpen className="w-4 h-4 mr-1.5" />
                <span>Vitamins Catalog</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Vitality Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">{t('dashboard.targetCalories')}</p>
            <h3 className="text-xl font-bold text-slate-900">{targetCalories} <span className="text-xs font-normal text-slate-400">kcal/day</span></h3>
            <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Personalized Target
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Food Database</p>
            <h3 className="text-xl font-bold text-slate-900">{totalFoodCount} <span className="text-xs font-normal text-slate-400">Whole Foods</span></h3>
            <span className="text-[10px] text-teal-600 font-medium">Verified photography linked</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">{t('dashboard.vitaminsTracked')}</p>
            <h3 className="text-xl font-bold text-slate-900">{totalVitaminCount} <span className="text-xs font-normal text-slate-400">Nutrients</span></h3>
            <span className="text-[10px] text-amber-600 font-medium">Full scientific profiles</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Nutritional Health Status</p>
            <h3 className="text-xl font-bold text-slate-900">Preventive</h3>
            <span className="text-[10px] text-sky-600 font-medium">Non-diagnostic platform</span>
          </div>
        </Card>

      </div>

      {/* Featured Superfoods of the Day (Live Database Connection) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Featured Nutrient Powerhouses</h2>
            <p className="text-xs text-slate-500">Staple Indian & regional superfoods rich in essential micronutrients</p>
          </div>
          <Link to="/food-explorer" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            View All ({totalFoodCount}) Foods →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredFoods.map((f) => (
            <Card key={f.id} hoverEffect padding="p-0" className="overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={f.imageUrl}
                    alt={f.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/90 text-slate-800 shadow-xs">
                      {f.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                      {f.calories} kcal
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {f.name}
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-medium truncate">
                    {f.teluguName}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {isTelugu && f.descriptionTe ? f.descriptionTe : f.descriptionEn}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <button
                  onClick={() => setSelectedFood(f)}
                  className="w-full py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-semibold transition-colors"
                >
                  Inspect Nutrition
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Nutrient Readiness & Synergy Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Breakdown */}
        <Card className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Key Micronutrient Daily Progress</h2>
              <p className="text-xs text-slate-500">Track daily consumption towards Recommended Dietary Allowances (RDA)</p>
            </div>
            <Link to="/vitamins" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View All Vitamins →
            </Link>
          </div>

          <div className="space-y-4">
            <ProgressBar label="Vitamin A (Vision & Immune Barrier)" value={85} max={100} valueText="765 / 900 mcg (85%)" color="emerald" />
            <ProgressBar label="Vitamin C (Immunity & Iron Absorption)" value={95} max={100} valueText="85 / 90 mg (95%)" color="teal" />
            <ProgressBar label="Vitamin D (Bone Strength & Mood)" value={60} max={100} valueText="360 / 600 IU (60%)" color="amber" />
            <ProgressBar label="Iron (Hemoglobin & Energy Vitality)" value={80} max={100} valueText="14.4 / 18 mg (80%)" color="emerald" />
            <ProgressBar label="Calcium (Bone & Nerve Transmission)" value={75} max={100} valueText="750 / 1000 mg (75%)" color="teal" />
          </div>
        </Card>

        {/* Today's Preventive Health Tip */}
        <Card className="flex flex-col justify-between bg-gradient-to-br from-emerald-50/60 to-white border-emerald-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isTelugu ? "నేటి ఆరోగ్య చిట్కా" : "NutriVita Synergy Tip"}</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              {isTelugu ? "ఐరన్ శోషణకు విటమిన్ సి జోడించండి" : "Boost Iron Absorption with Vitamin C"}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTelugu
                ? "పాలకూర, పప్పులు వంటి శాఖాహార ఐరన్ వనరులను తీసుకునేటప్పుడు కాస్త నిమ్మరసం లేదా ఉసిరికాయ కలపడం వల్ల శరీరంలో ఐరన్ శోషణ 300% వరకు పెరుగుతుంది!"
                : "Plant-based non-heme iron (from spinach, lentils, ragi) is absorbed up to 3 times more efficiently when consumed alongside Vitamin C rich foods like lemon or amla."}
            </p>
          </div>

          <div className="pt-4 border-t border-emerald-100 mt-4">
            <Link to="/food-explorer" className="w-full">
              <Button variant="outline" size="sm" className="w-full border-emerald-300 text-emerald-700 bg-white">
                <Apple className="w-3.5 h-3.5 mr-1.5" />
                <span>Find Vitamin C Foods</span>
              </Button>
            </Link>
          </div>
        </Card>

      </div>

      {/* Quick Action Interactive Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t('dashboard.quickActions')}</h2>
          <p className="text-xs text-slate-500">Instant access to all NutriVita interactive tools and checkers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.link} className="group">
                <Card hoverEffect className="h-full flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {action.desc}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Selected Modals */}
      <FoodDetailModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />

      <VitaminDetailModal
        vitamin={selectedVitamin}
        isOpen={!!selectedVitamin}
        onClose={() => setSelectedVitamin(null)}
        onSelectFood={(f) => setSelectedFood(f)}
      />

    </div>
  );
};

export default Dashboard;
