import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">Nutri<span className="text-emerald-400">Vita</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {language === 'te'
                ? 'విటమిన్ లోపాల నివారణ అవగాహన మరియు ఆరోగ్యకరమైన ఆహార సిఫార్సుల వేదిక.'
                : 'An educational initiative empowering individuals with vitamin deficiency awareness, plate balancing, and preventive nutrition.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[11px] font-semibold">
              <Heart className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              <span>NutriVita Nutrition Initiative</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Core Features</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/vitamins" className="hover:text-emerald-400 transition-colors">
                  {t('nav.vitamins')}
                </Link>
              </li>
              <li>
                <Link to="/food-explorer" className="hover:text-emerald-400 transition-colors">
                  {t('nav.foodExplorer')}
                </Link>
              </li>
              <li>
                <Link to="/symptom-checker" className="hover:text-emerald-400 transition-colors">
                  {t('nav.symptomChecker')}
                </Link>
              </li>
              <li>
                <Link to="/balance-my-meal" className="hover:text-emerald-400 transition-colors">
                  {t('nav.balanceMeal')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Smart Tools */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Smart Tools</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/meal-planner" className="hover:text-emerald-400 transition-colors">
                  {t('nav.mealPlanner')}
                </Link>
              </li>
              <li>
                <Link to="/label-lens" className="hover:text-emerald-400 transition-colors">
                  {t('nav.labelLens')}
                </Link>
              </li>
              <li>
                <Link to="/vitamate-ai" className="hover:text-emerald-400 transition-colors">
                  {t('nav.aiAssistant')}
                </Link>
              </li>
              <li>
                <Link to="/vita-quiz" className="hover:text-emerald-400 transition-colors">
                  {t('nav.quiz')}
                </Link>
              </li>
              <li>
                <Link to="/nutrition-awareness" className="hover:text-emerald-400 transition-colors">
                  {t('nav.awareness')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Medical & CSP Notice */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Medical & Health Notice</span>
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              {language === 'te'
                ? 'గమనిక: ఈ ప్రాజెక్ట్ నివారణ ఆహార అవగాహన కోసం మాత్రమే ఉద్దేశించబడింది. ఇది ఏ రకమైన వైద్య నిర్ధారణ కాదు. తీవ్రమైన లక్షణాలు ఉంటే దయచేసి అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.'
                : 'NutriVita is an educational awareness tool for nutrition education and preventive dietary planning. It is not intended as a substitute for professional medical advice, clinical diagnosis, or treatment.'}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} NutriVita. Built for preventive nutritional wellness.</p>
          <div className="flex items-center gap-4">
            <Link to="/nutrition-awareness" className="hover:text-slate-300 transition-colors">Awareness Hub</Link>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Bilingual EN / TE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
