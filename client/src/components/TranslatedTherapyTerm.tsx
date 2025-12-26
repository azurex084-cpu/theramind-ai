import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTherapyApproachName, getTherapistPersonaName } from '@/lib/therapyTerms';
import type { TranslationType } from '@/lib/getTranslatedTerm';

interface TranslatedTherapyTermProps {
  term: string;
  type: TranslationType;
  fallbackLanguage?: string; // 提供一个可选的备用语言
}

export function TranslatedTherapyTerm({ term, type, fallbackLanguage = 'en' }: TranslatedTherapyTermProps) {
  // 尝试使用 useLanguage hook
  let currentLanguage = fallbackLanguage;
  
  try {
    const { language } = useLanguage();
    if (language) {
      currentLanguage = language;
    }
  } catch (error) {
    // 如果 useLanguage 失败，使用备用语言
    console.warn('TranslatedTherapyTerm: Could not access language context, using fallback', fallbackLanguage);
  }
  
  // 翻译术语
  const translatedTerm = type === 'approach' 
    ? getTherapyApproachName(term, currentLanguage)
    : getTherapistPersonaName(term, currentLanguage);
  
  return <span>{translatedTerm}</span>;
}

export default TranslatedTherapyTerm;