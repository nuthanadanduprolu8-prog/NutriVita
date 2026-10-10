import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Menu, 
  X, 
  Globe, 
  User, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Apple, 
  Activity, 
  UtensilsCrossed,
  Scan,
  CalendarCheck,
  HeartPulse,
  Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../common/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrent = (path) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: Leaf },
    { name: t('nav.dashboard'), path: '/dashboard', icon: Activity, protected: true },
    { name: t('nav.vitamins'), path: '/vitamins', icon: BookOpen },
    { name: t('nav.foodExplorer'), path: '/food-explorer', icon: Apple },
    { name: t('nav.foodScanner'), path: '/food-scanner', icon: Camera },
    { name: t('nav.symptomChecker'), path: '/symptom-checker', icon: ShieldCheck },
    { name: language === 'te' ? 'శరీర మార్పులు' : 'Body Signs', path: '/body-change-analyzer', icon: HeartPulse },
    { name: t('nav.balanceMeal'), path: '/balance-my-meal', icon: UtensilsCrossed },
    { name: t('nav.mealPlanner'), path: '/meal-planner', icon: CalendarCheck },
    { name: t('nav.labelLens'), path: '/label-lens', icon: Scan },
    { name: t('nav.aiAssistant'), path: '/vitamate-ai', icon: Sparkles },
    { name: t('nav.quiz'), path: '/vita-quiz', icon: BookOpen },
    { name: t('nav.awareness'), path: '/nutrition-awareness', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Nutri<span className="text-emerald-600">Vita</span></span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none hidden sm:block">
                {language === 'te' ? 'పోషకాహార అవగాహన' : 'Nutrition Awareness'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.home')}
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isCurrent('/dashboard') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
            )}
            <Link
              to="/vitamins"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/vitamins') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.vitamins')}
            </Link>
            <Link
              to="/food-explorer"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/food-explorer') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.foodExplorer')}
            </Link>
            <Link
              to="/food-scanner"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/food-scanner') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.foodScanner')}
            </Link>
            <Link
              to="/symptom-checker"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/symptom-checker') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.symptomChecker')}
            </Link>
            <Link
              to="/balance-my-meal"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/balance-my-meal') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.balanceMeal')}
            </Link>
            <Link
              to="/label-lens"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/label-lens') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.labelLens')}
            </Link>
            <Link
              to="/vitamate-ai"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/vitamate-ai') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.aiAssistant')}
            </Link>
            <Link
              to="/vita-quiz"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/vita-quiz') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.quiz')}
            </Link>
            <Link
              to="/nutrition-awareness"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isCurrent('/nutrition-awareness') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.awareness')}
            </Link>
          </nav>

          {/* Right Action Tools: Language, Auth, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-700 text-xs font-medium transition-colors"
              title="Switch Language / భాషను మార్చండి"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 hidden md:block max-w-[100px] truncate">
                    {user?.name || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-medium"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('nav.dashboard')}</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-4">
            {navLinks.map((item) => {
              if (item.protected && !isAuthenticated) return null;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isCurrent(item.path)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl bg-slate-100"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{language === 'en' ? 'తెలుగుకు మారండి' : 'Switch to English'}</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 py-1.5 px-3 rounded-xl hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
