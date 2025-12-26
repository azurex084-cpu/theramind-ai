import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiRequest } from '@/lib/queryClient';

interface TranslationResult {
  translatedText: string;
  isTranslated: boolean;
}

export function usePromptTranslation(text: string, sourceLanguage: string = 'en') {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset to original text when changing prompts
    setTranslatedText(text);
    
    // Check for Chinese-to-Cantonese conversion case
    const isChineseToCantonese = (
      (sourceLanguage === 'zh' || sourceLanguage === 'zh_TW') && 
      (language === 'zh_HK' || language === 'yue')
    );
    
    // Don't translate if the language is the same as the source (unless it's Chinese to Cantonese)
    if (language === sourceLanguage && !isChineseToCantonese) {
      console.log(`[usePromptTranslation] Skipping translation, languages match: ${language}`);
      return;
    }

    const translatePrompt = async () => {
      try {
        console.log(`[usePromptTranslation] Starting translation from ${sourceLanguage} to ${language}`);
        console.log(`[usePromptTranslation] Text to translate: "${text.substring(0, 30)}..."`);
        
        setIsLoading(true);
        setError(null);
        
        const requestBody = {
          text,
          sourceLanguage,
          targetLanguage: language
        };
        
        console.log('[usePromptTranslation] Request body:', requestBody);
        
        const response = await apiRequest<TranslationResult>(
          '/api/translate',
          {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
          }
        );
        
        console.log('[usePromptTranslation] Translation response:', response);
        
        if (response && response.translatedText) {
          console.log(`[usePromptTranslation] Setting translated text: "${response.translatedText.substring(0, 30)}..."`);
          setTranslatedText(response.translatedText);
        } else {
          console.warn('[usePromptTranslation] No translated text received');
        }
      } catch (err) {
        console.error('[usePromptTranslation] Translation error:', err);
        setError('Failed to translate prompt');
        // Keep the original text on error
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    // Check for Chinese-to-Cantonese conversion case again for clarity
    const needsChineseToCantonese = (
      (sourceLanguage === 'zh' || sourceLanguage === 'zh_TW') && 
      (language === 'zh_HK' || language === 'yue')
    );
    
    // Only translate if we have text and (the target language is different OR it's a Chinese-to-Cantonese case)
    if (text && (language !== sourceLanguage || needsChineseToCantonese)) {
      console.log(`[usePromptTranslation] Translating to ${language}${needsChineseToCantonese ? ' (Chinese to Cantonese)' : ''}`);
      translatePrompt();
    } else {
      console.log(`[usePromptTranslation] No translation needed:`, { 
        text: !!text, 
        languagesDifferent: language !== sourceLanguage,
        isChineseToCantonese: needsChineseToCantonese
      });
    }
  }, [text, language, sourceLanguage]);

  return { translatedText, isLoading, error };
}