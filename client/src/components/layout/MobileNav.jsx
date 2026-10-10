import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Leaf, Scan, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const MobileNav = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-3 py-2 flex items-center justify-around shadow-lg">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Leaf className="w-5 h-5" />
        <span>{t('nav.home')}</span>
      </NavLink>

      {isAuthenticated && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{t('nav.dashboard')}</span>
        </NavLink>
      )}

      <NavLink
        to="/label-lens"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Scan className="w-5 h-5" />
        <span>{t('nav.labelLens')}</span>
      </NavLink>

      <NavLink
        to="/vitamate-ai"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Sparkles className="w-5 h-5" />
        <span>VitaMate</span>
      </NavLink>

      <NavLink
        to={isAuthenticated ? '/profile' : '/login'}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <User className="w-5 h-5" />
        <span>{isAuthenticated ? t('nav.profile') : t('nav.login')}</span>
      </NavLink>
    </div>
  );
};

export default MobileNav;
