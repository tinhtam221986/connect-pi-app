"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  useEffect(() => {
    // 1. Auto-detect from browser
    const browserLang = navigator.language;
    console.log("Detected Browser Language:", browserLang);
    if (browserLang.startsWith('en')) {
      setLanguage('en');
    } else {
      setLanguage('vi'); // Default to Vietnamese if not English
    }
  }, []);

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to Vietnamese if missing in current language? Or just return key.
        // Let's try to find in 'vi' as fallback.
        if (language !== 'vi') {
            let fallback: any = translations['vi'];
            let found = true;
            for (const k of keys) {
                if (fallback[k] === undefined) { found = false; break; }
                fallback = fallback[k];
            }
            if (found) return fallback;
        }
        return path;
      }
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
