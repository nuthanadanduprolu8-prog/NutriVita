import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Apple, 
  UtensilsCrossed, 
  Scan, 
  ArrowRight,
  Heart,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const isTelugu = language === 'te';

  const featureCards = [
    {
      title: isTelugu ? "విటమిన్ విజ్ఞాన సర్వస్వం" : "Vitamin Encyclopedia",
      desc: isTelugu 
        ? "శరీరానికి అవసరమైన 13 ముఖ్య విటమిన్లు, వాటి రోజువారీ మోతాదు మరియు లోపాల వివరాలు." 
        : "Complete scientific guide to all 13 essential vitamins, daily RDAs, and rich natural food sources.",
      icon: BookOpen,
      link: "/vitamins",
      tag: "Science-Backed",
      color: "emerald"
    },
    {
      title: isTelugu ? "లక్షణాల ఆధారిత విశ్లేషణ" : "Symptom Deficiency Checker",
      desc: isTelugu
        ? "అలసట, జుట్టు రాలడం, చర్మ సమస్యల ఆధారంగా పోషక లోపాలపై ముందస్తు అవగాహన."
        : "Identify potential micronutrient deficiencies through body signs and preventive dietary adjustments.",
      icon: ShieldCheck,
      link: "/symptom-checker",
      tag: "Preventive Health",
      color: "teal"
    },
    {
      title: isTelugu ? "సమతుల్య భోజన విశ్లేషణ" : "Balance My Meal",
      desc: isTelugu
        ? "మీ ప్లేట్‌ను 50% కూరగాయలు, 25% ప్రొటీన్, 25% ధాన్యాలతో సమతుల్యంగా రూపొందించండి."
        : "Interactive plate balancer ensuring healthy macronutrient splits and synergistic nutrient absorption.",
      icon: UtensilsCrossed,
      link: "/balance-my-meal",
      tag: "Interactive Tool",
      color: "amber"
    },
    {
      title: isTelugu ? "లేబుల్ లెన్స్ (OCR)" : "Label Lens Scanner",
      desc: isTelugu
        ? "ప్యాక్ చేసిన ఆహార లేబుల్స్ స్కాన్ చేసి, దాగి ఉన్న చక్కెరలు మరియు ఉప్పుపై స్పష్టత పొందండి."
        : "OCR nutrition label scanner with instant Nutri-Grade ratings, red-flag alerts, and manual entry fallback.",
      icon: Scan,
      link: "/label-lens",
      tag: "Smart Scanner",
      color: "rose"
    },
    {
      title: isTelugu ? "విటామేట్ AI అసిస్టెంట్" : "VitaMate AI Assistant",
      desc: isTelugu
        ? "తెలుగు మరియు ఇంగ్లీష్ వాయిస్ సపోర్ట్‌తో మీ వ్యక్తిగత పోషకాహార ప్రశ్నలకు సమాధానాలు."
        : "Conversational nutrition guidance with dual-engine intelligence and bilingual voice interaction.",
      icon: Sparkles,
      link: "/vitamate-ai",
      tag: "Bilingual Voice",
      color: "purple"
    },
    {
      title: isTelugu ? "ఆహార సమాచార కేంద్రం" : "Verified Food Explorer",
      desc: isTelugu
        ? "నిజమైన ఫోటోలు, ఖచ్చితమైన విటమిన్ల విశ్లేషణతో కూడిన విస్తృత ఆహార సమాచారం."
        : "Explore foods with verified photography, micro/macronutrient data, and local superfoods.",
      icon: Apple,
      link: "/food-explorer",
      tag: "Rich Database",
      color: "blue"
    }
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
          {/* Background decorative patterns */}
          <div className="absolute -right-16 -top-16 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-24 w-80 h-80 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
              <span>{isTelugu ? "పోషకాహార అవగాహన వేదిక" : "Nutrition Awareness Initiative"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {isTelugu ? (
                <>పోషకాహార సమతుల్యతతో <span className="text-emerald-300">ఆరోగ్యవంతమైన జీవనం</span></>
              ) : (
                <>Detect Deficiencies, <span className="text-emerald-300">Nourish Naturally</span>.</>
              )}
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              {isTelugu ? (
                "విటమిన్ లోపాలను ప్రారంభంలోనే గుర్తించి, సహజ ఆహారాల ద్వారా నివారించండి. వైద్య నిర్ధారణకు బదులుగా సమతుల్య పోషకాహార అవగాహనను పెంపొందించే ఆధునిక వేదిక."
              ) : (
                "Empower your daily wellness with evidence-based vitamin awareness, plate balancing, label scanning, and personalized preventive nutrition recommendations."
              )}
            </p>

            {/* Call to action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button variant="primary" size="lg" className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold shadow-lg shadow-emerald-950/20">
                  <span>{isAuthenticated ? t('nav.dashboard') : t('nav.register')}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/symptom-checker">
                <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  <span>{isTelugu ? "లక్షణాలు తనిఖీ చేయండి" : "Check Deficiency Signs"}</span>
                </Button>
              </Link>
            </div>

            {/* Quick feature checklist */}
            <div className="pt-4 flex flex-wrap gap-4 text-xs text-emerald-200/90">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>100% Preventive Focus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Bilingual (English & తెలుగు)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Voice & OCR Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition Education Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>{isTelugu ? "పోషకాహార అవగాహన లక్ష్యం" : "Nutrition Education Mission"}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isTelugu ? "పోషకాహార అవగాహన ద్వారా ఆరోగ్యం" : "Promoting Preventive Nutritional Awareness"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isTelugu
                ? "రక్తహీనత, విటమిన్ డి లోపం మరియు పోషకాహార లోపాలను సరైన స్థానిక ఆహారాల ద్వారా నివారించడమే మా ప్రాథమిక లక్ష్యం. ఇది ఎలాంటి వాణిజ్య ప్రకటనలు లేకుండా కేవలం ప్రజారోగ్య అవగాహన కోసం నిర్మించబడింది."
                : "NutriVita bridges the information gap between clinical nutrition research and everyday dietary choices. Our goal is to eradicate hidden hunger and prevent micronutrient deficiencies using locally accessible, affordable superfoods."}
            </p>
          </div>
          <Link to="/nutrition-awareness" className="shrink-0">
            <Button variant="secondary" size="md">
              <span>{isTelugu ? "అవగాహన వ్యాసాలు చదవండి" : "Explore Awareness Hub"}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isTelugu ? "సమగ్ర పోషకాహార సాధనాలు" : "Comprehensive Nutrition Architecture"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isTelugu
              ? "మీ రోజువారీ ఆహారాన్ని ఆరోగ్యకరంగా మార్చే సాధనాల సమాహారం"
              : "Explore our modular health suite designed for education, analysis, and meal planning."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} hoverEffect className="flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {feat.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <Link
                    to={feat.link}
                    className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 gap-1.5 group/link"
                  >
                    <span>{isTelugu ? "ప్రారంభించండి" : "Launch Feature"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Preventive Nutrition Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              {isTelugu ? "పోషకాహార అవగాహన క్విజ్ రాయండి!" : "Test Your Nutrition Knowledge"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              {isTelugu
                ? "15 ఆసక్తికరమైన ప్రశ్నలతో మీ విటమిన్ విజ్ఞానాన్ని పరీక్షించి, సర్టిఫికెట్ పొందండి."
                : "Take the 15-question interactive VitaQuiz to test your deficiency awareness and earn a downloadable wellness certificate."}
            </p>
          </div>
          <Link to="/vita-quiz" className="shrink-0">
            <Button variant="primary" size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
              <span>{isTelugu ? "క్విజ్ ప్రారంభించండి" : "Take VitaQuiz"}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
