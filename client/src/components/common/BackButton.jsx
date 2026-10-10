import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Universal Back Button component for NutriVita.
 * Navigates to previous location in browser history if history exists in this session,
 * otherwise smoothly navigates to fallbackPath to prevent dead-ends.
 */
const BackButton = ({ fallbackPath = '/', label, className = '' }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  const defaultLabel = isTelugu ? 'వెనుకకు' : 'Back';
  const buttonLabel = label || defaultLabel;

  const handleBack = () => {
    // If the user has navigation history in this SPA session, use browser history
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // Safe fallback when accessed via direct bookmark, reload, or new tab
      navigate(fallbackPath);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${className}`}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
      <span>{buttonLabel}</span>
    </button>
  );
};

export default BackButton;
