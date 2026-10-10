import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import te from '../locales/te.json';

const translations = { en, te };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('nutrivita_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'te') {
      setLanguageState(lang);
      localStorage.setItem('nutrivita_lang', lang);
    }
  };

  // Helper function to resolve dot-notated paths: t('nav.home')
  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if key missing in current language
        let fallbackVal = translations['en'];
        for (const fbKey of keys) {
          if (fallbackVal && fallbackVal[fbKey] !== undefined) {
            fallbackVal = fallbackVal[fbKey];
          } else {
            return fallback || path;
          }
        }
        return fallbackVal || fallback || path;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
