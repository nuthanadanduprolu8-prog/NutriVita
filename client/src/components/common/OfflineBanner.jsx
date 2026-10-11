import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineBanner = () => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true
  );
  const [showRestored, setShowRestored] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showRestored) {
    return (
      <aside
        aria-live="polite"
        className="bg-emerald-600 text-white text-xs font-medium py-2 px-4 shadow-sm flex items-center justify-center gap-2 transition-all duration-300 animate-fadeIn"
      >
        <Wifi className="w-3.5 h-3.5 flex-shrink-0" />
        <span>
          {isTelugu ? '✓ మీరు తిరిగి ఆన్‌లైన్‌కి వచ్చారు. అన్ని ఫీచర్లు అందుబాటులో ఉన్నాయి.' : "✓ You're back online. All online features are available."}
        </span>
      </aside>
    );
  }

  if (isOnline || dismissed) {
    return null;
  }

  return (
    <aside
      role="alert"
      aria-live="assertive"
      className="bg-amber-500 text-slate-900 text-xs py-2 px-3 sm:px-4 shadow-md flex items-center justify-between gap-2 border-b border-amber-600 transition-all duration-300"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <WifiOff className="w-4 h-4 flex-shrink-0 text-amber-950" />
        <span className="font-semibold text-amber-950">
          {isTelugu ? 'ఆఫ్‌లైన్ మోడ్:' : 'Offline Notice:'}
        </span>
        <span className="text-amber-900">
          {isTelugu
            ? 'ఇంటర్నెట్ కనెక్షన్ లేదు. విద్యా విషయాలు చూడవచ్చు; ఆహార స్కానర్, లేబుల్ లెన్స్ & AI సహాయకుడికి ఇంటర్నెట్ అవసరం.'
            : 'No internet connection. You can view cached guides; Food Scanner, Label Lens, and VitaMate AI require an active connection.'}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1 rounded-md text-amber-950 hover:bg-amber-600/30 transition-colors cursor-pointer flex-shrink-0"
        aria-label="Dismiss offline banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};

export default OfflineBanner;
