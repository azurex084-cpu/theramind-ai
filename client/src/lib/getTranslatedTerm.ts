import { getTherapyApproachName, getTherapistPersonaName } from './therapyTerms';

export type TranslationType = 'approach' | 'persona';

// 导出一个简单的函数用于在不使用React组件的场景下获取翻译
export function getTranslatedTerm(term: string, type: TranslationType, language: string = 'en'): string {
  return type === 'approach' 
    ? getTherapyApproachName(term, language)
    : getTherapistPersonaName(term, language);
}