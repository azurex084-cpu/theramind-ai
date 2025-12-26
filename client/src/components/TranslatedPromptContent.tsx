import React from 'react';
import { usePromptTranslation } from '@/hooks/usePromptTranslation';
import { RotateCw } from 'lucide-react';

interface TranslatedPromptContentProps {
  text: string;
  sourceLanguage?: string;
}

export function TranslatedPromptContent({ text, sourceLanguage = 'en' }: TranslatedPromptContentProps) {
  const { translatedText, isLoading: isTranslating, error } = usePromptTranslation(text, sourceLanguage);
  
  if (isTranslating) {
    return (
      <div className="mb-1 font-medium relative flex items-center space-x-2">
        <RotateCw className="animate-spin h-4 w-4" />
        <span className="text-muted-foreground">{text}</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mb-1 font-medium relative">
        <span className="text-amber-500">{text}</span>
        <span className="text-xs text-destructive">{error}</span>
      </div>
    );
  }
  
  return (
    <p className="mb-1 font-medium relative">
      {translatedText}
    </p>
  );
}

export default TranslatedPromptContent;