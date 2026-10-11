import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PWAInstallPrompt = () => {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  });
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('nutrivita_pwa_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent automatic mini-infobar on mobile Chrome
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[NutriVita PWA] App was successfully installed.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[NutriVita PWA] User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('[NutriVita PWA] User dismissed the install prompt');
      }
    } catch (err) {
      console.warn('[NutriVita PWA] Install prompt exception:', err);
    } finally {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('nutrivita_pwa_dismissed', 'true');
    } catch {}
  };

  // Do not render if not installable, already installed, or dismissed
  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Install NutriVita App"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 bg-white border border-emerald-200/90 rounded-2xl p-4 shadow-xl shadow-emerald-900/10 flex items-center gap-3.5 backdrop-blur-md animate-slideUp"
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
        <Smartphone className="w-5 h-5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
          <span>{isTelugu ? 'NutriVita యాప్ ఇన్‌స్టాల్ చేయండి' : 'Install NutriVita App'}</span>
          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            PWA
          </span>
        </h4>
        <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
          {isTelugu
            ? 'హోమ్ స్క్రీన్ నుండి వేగవంతమైన యాక్సెస్ మరియు ఆఫ్‌లైన్ గైడ్స్ కోసం ఇన్‌స్టాల్ చేసుకోండి.'
            : 'Fast home screen access and instant offline reference without an app store.'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isTelugu ? 'ఇన్‌స్టాల్' : 'Install'}</span>
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default PWAInstallPrompt;
