import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';

interface TranslationResult {
  translatedText: string;
  isTranslated: boolean;
}

export function useQuoteTranslation(text: string, sourceLanguage: string = 'en') {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset to original text when changing quotes
    setTranslatedText(text);
    
    // Don't translate if the language is the same as the source
    if (language === sourceLanguage) {
      console.log(`[useQuoteTranslation] Skipping translation, languages match: ${language}`);
      return;
    }

    const translateQuote = async () => {
      try {
        console.log(`[useQuoteTranslation] Starting translation from ${sourceLanguage} to ${language}`);
        console.log(`[useQuoteTranslation] Text to translate: "${text.substring(0, 30)}..."`);
        
        setIsLoading(true);
        setError(null);
        
        const requestBody = {
          text,
          sourceLanguage,
          targetLanguage: language
        };
        
        console.log('[useQuoteTranslation] Request body:', requestBody);
        
        const response = await apiRequest<TranslationResult>(
          '/api/translate',
          {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
          }
        );
        
        console.log('[useQuoteTranslation] Translation response:', response);
        
        if (response && response.translatedText) {
          console.log(`[useQuoteTranslation] Setting translated text: "${response.translatedText.substring(0, 30)}..."`);
          setTranslatedText(response.translatedText);
        } else {
          console.warn('[useQuoteTranslation] No translated text received');
        }
      } catch (err) {
        console.error('[useQuoteTranslation] Translation error:', err);
        setError('Failed to translate quote');
        // Keep the original text on error
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    console.log(`[useQuoteTranslation] Translating to ${language}`);
    translateQuote();
  }, [text, language, sourceLanguage]);

  return { translatedText, isLoading, error };
}