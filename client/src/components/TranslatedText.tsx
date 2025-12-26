import React from 'react';
import { useMessageTranslation } from '@/hooks/useMessageTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { RotateCw } from 'lucide-react';

interface TranslatedTextProps {
  text: string;
  sourceLanguage?: string;
  autoTranslate?: boolean;
  className?: string;
}

export function TranslatedText({
  text,
  sourceLanguage = 'en',
  autoTranslate = true,
  className = '',
}: TranslatedTextProps) {
  const { language } = useLanguage();

  const {
    translatedText,
    isTranslating,
    isTranslated,
    error
  } = useMessageTranslation(text, sourceLanguage, autoTranslate);

  // 检查是否需要从中文转换到粤语
  const isChineseToCantonese = (
    (sourceLanguage === 'zh' || sourceLanguage === 'zh_TW') && 
    (language === 'zh_HK' || language === 'yue')
  );
  
  // 在同一语言之间不显示翻译相关内容 (除非是中文到粤语的转换)
  if (language === sourceLanguage && !isChineseToCantonese) {
    return <span className={className}>{text}</span>;
  }

  // 处理加载中状态
  if (isTranslating) {
    return (
      <span className={`flex items-center space-x-1 ${className}`}>
        <RotateCw className="animate-spin h-3 w-3" />
        <span className="text-muted-foreground text-sm opacity-70">{text}</span>
      </span>
    );
  }

  // 显示翻译结果
  return <span className={className}>{translatedText}</span>;
}

export default TranslatedText;