import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  CalendarCheck, 
  Scan, 
  BookOpen, 
  User, 
  Sparkles,
  ShieldCheck,
  HelpCircle,
  HeartPulse
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = () => {
  const { t, language } = useLanguage();

  const links = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/symptom-checker', label: t('nav.symptomChecker'), icon: ShieldCheck },
    { to: '/body-change-analyzer', label: language === 'te' ? 'శరీర మార్పులు' : 'Body Signs', icon: HeartPulse },
    { to: '/balance-my-meal', label: t('nav.balanceMeal'), icon: UtensilsCrossed },
    { to: '/meal-planner', label: t('nav.mealPlanner'), icon: CalendarCheck },
    { to: '/label-lens', label: t('nav.labelLens'), icon: Scan },
    { to: '/vitamate-ai', label: t('nav.aiAssistant'), icon: Sparkles },
    { to: '/vita-quiz', label: t('nav.quiz'), icon: HelpCircle },
    { to: '/nutrition-awareness', label: t('nav.awareness'), icon: ShieldCheck },
    { to: '/saved-plans', label: t('nav.savedPlans'), icon: BookOpen },
    { to: '/profile', label: t('nav.profile'), icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 p-4 hidden lg:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          User Dashboard
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Helpful CSP Tip Card */}
      <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs text-emerald-900 mt-6">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Daily Wellness</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Aim for 5 portions of colorful vegetables & fruits daily to naturally meet your micronutrient needs!
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
