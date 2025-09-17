import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations } from '../services/i18n';

type Language = 'en' | 'fr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
        const savedLang = localStorage.getItem('language');
        return (savedLang && ['en', 'fr', 'de'].includes(savedLang)) ? savedLang as Language : 'en';
    } catch {
        return 'en';
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    } catch (e) {
        console.error("Failed to save language preference", e);
    }
  }, [language]);

  const t = (key: string, variables?: { [key: string]: string | number }): string => {
    let translation = translations[language]?.[key] || translations['en']?.[key] || key;
    if (variables) {
        Object.keys(variables).forEach(varKey => {
            const regex = new RegExp(`{${varKey}}`, 'g');
            translation = translation.replace(regex, String(variables[varKey]));
        });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
