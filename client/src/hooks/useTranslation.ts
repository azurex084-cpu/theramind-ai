import { useContext } from 'react';
import { LanguageContext } from "../contexts/LanguageContext";
import { TranslationKey, getTranslation } from "@/lib/translations";

export function useTranslation() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  const { language } = context;

  /**
   * Translate a key into the current language
   * @param key Translation key
   * @param variables Optional variables to replace in the translation
   * @returns Translated string
   */
  const t = (key: TranslationKey, variables?: Record<string, string | number>): string => {
    return getTranslation(key, language, variables);
  };

  return { t, language };
}