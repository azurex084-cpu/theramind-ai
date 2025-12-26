import React from 'react';
import { useMessageTranslation } from '@/hooks/useMessageTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { RotateCw } from 'lucide-react';

interface TranslatedMessageContentProps {
  text: string;
  sourceLanguage?: string;
  autoTranslate?: boolean;
}

export function TranslatedMessageContent({ 
  text, 
  sourceLanguage = 'en',
  autoTranslate = true
}: TranslatedMessageContentProps) {
  const { language, t } = useLanguage();
  
  const { 
    translatedText, 
    isTranslating, 
    isTranslated,
    error, 
    translate 
  } = useMessageTranslation(text, sourceLanguage, autoTranslate);
  
  // 在同一语言之间不显示翻译相关内容
  if (language === sourceLanguage) {
    return (
      <div>
        {text.split('\n\n').map((paragraph, i) => (
          <p key={i} className={`text-neutral-800 ${i > 0 ? 'mt-3' : ''}`}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  }
  
  // 处理加载中状态
  if (isTranslating) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <RotateCw className="animate-spin h-3.5 w-3.5" />
          <span>{t('translating_message')}</span>
        </div>
        <div className="text-neutral-800 opacity-60">
          {text.split('\n\n').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  }
  
  // 处理错误状态
  if (error) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="text-neutral-800">
          {text.split('\n\n').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-red-500">{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={translate}
            className="py-1 h-7 text-xs"
          >
            {t('try_again')}
          </Button>
        </div>
      </div>
    );
  }
  
  // 显示翻译结果，不显示切换按钮
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-neutral-800">
        {translatedText.split('\n\n').map((paragraph, i) => (
          <p key={i} className={i > 0 ? 'mt-3' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export default TranslatedMessageContent;