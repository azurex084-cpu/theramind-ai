import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supportedLanguages } from '@/lib/translations';
import { TranslationKey, getTranslation } from '@/lib/translations';

// 默认语言
const DEFAULT_LANGUAGE = 'en';

// 存储在localStorage中的键名
const LANGUAGE_STORAGE_KEY = 'preferredLanguage';
const TRANSLATION_ACTIVE_KEY = 'isTranslationActive';

// 定义语言类型
export type Language = {
  code: string;
  name: string;
};

// 定义上下文类型
type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  isTranslationActive: boolean;
  setIsTranslationActive: (active: boolean) => void;
  supportedLanguages: Language[];
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
};

// 创建上下文
export const LanguageContext = createContext<LanguageContextType | null>(null);

// Props 类型
type LanguageProviderProps = {
  children: ReactNode;
};

// 提供者组件
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // 从本地存储或浏览器语言设置获取初始语言
  const getInitialLanguage = (): string => {
    // 首先尝试从localStorage获取
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && supportedLanguages.some(lang => lang.code === storedLanguage)) {
      return storedLanguage;
    }
    
    // 尝试从浏览器语言设置获取
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.some(lang => lang.code === browserLang)) {
      return browserLang;
    }
    
    // 默认返回英语
    return DEFAULT_LANGUAGE;
  };
  
  // 从本地存储获取翻译状态
  const getInitialTranslationActive = (): boolean => {
    const stored = localStorage.getItem(TRANSLATION_ACTIVE_KEY);
    return stored === null ? true : stored === 'true';
  };
  
  const [language, setLanguageState] = useState<string>(getInitialLanguage);
  const [isTranslationActive, setIsTranslationActiveState] = useState<boolean>(getInitialTranslationActive);
  
  // 设置语言并保存到本地存储
  const setLanguage = (lang: string) => {
    if (supportedLanguages.some(l => l.code === lang)) {
      setLanguageState(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };
  
  // 设置翻译状态并保存到本地存储
  const setIsTranslationActive = (active: boolean) => {
    setIsTranslationActiveState(active);
    localStorage.setItem(TRANSLATION_ACTIVE_KEY, String(active));
  };
  
  // 当语言变更时，更新文档语言
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  /**
   * Translate a key into the current language
   * @param key Translation key
   * @param variables Optional variables to replace in the translation
   * @returns Translated string
   */
  const t = (key: TranslationKey, variables?: Record<string, string | number>): string => {
    return getTranslation(key, language, variables);
  };

  // 提供上下文值
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    isTranslationActive,
    setIsTranslationActive,
    supportedLanguages,
    t
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for accessing the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}