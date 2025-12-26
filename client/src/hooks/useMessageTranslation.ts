import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiRequest } from '@/lib/queryClient';

interface TranslationResult {
  translatedText: string;
  isTranslated: boolean;
}

/**
 * 检查是否是中文到粤语的翻译场景
 * @param sourceLanguage 源语言
 * @param targetLanguage 目标语言
 * @returns 是否是中文到粤语的翻译
 */
function isChineseToCantonese(sourceLanguage: string, targetLanguage: string): boolean {
  return (
    (sourceLanguage === 'zh' || sourceLanguage === 'zh_TW') && 
    (targetLanguage === 'zh_HK' || targetLanguage === 'yue')
  );
}

export function useMessageTranslation(
  text: string, 
  sourceLanguage: string = 'en',
  autoTranslate: boolean = true
) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset to original text when message changes
    setTranslatedText(text);
    setIsTranslated(false);
    
    // 检查是否需要从中文转换到粤语
    const needsChineseToCantonese = isChineseToCantonese(sourceLanguage, language);
    
    // Don't translate if auto translate is disabled or language is the same as source (unless Chinese to Cantonese)
    if (!autoTranslate || (language === sourceLanguage && !needsChineseToCantonese)) {
      console.log(`[useMessageTranslation] Skipping translation, languages match or auto-translate off: ${language}`);
      return;
    }

    const translateMessage = async () => {
      try {
        console.log(`[useMessageTranslation] Starting translation from ${sourceLanguage} to ${language}`);
        console.log(`[useMessageTranslation] Text to translate: "${text.substring(0, 30)}..."`);
        
        setIsTranslating(true);
        setError(null);
        
        const requestBody = {
          text,
          sourceLanguage,
          targetLanguage: language
        };
        
        console.log('[useMessageTranslation] Request body:', requestBody);
        
        const response = await apiRequest<TranslationResult>(
          '/api/translate',
          {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
          }
        );
        
        console.log('[useMessageTranslation] Translation response:', response);
        
        if (response && response.translatedText) {
          console.log(`[useMessageTranslation] Setting translated text: "${response.translatedText.substring(0, 30)}..."`);
          setTranslatedText(response.translatedText);
          setIsTranslated(true);
        } else {
          console.warn('[useMessageTranslation] No translated text received');
        }
      } catch (err) {
        console.error('[useMessageTranslation] Translation error:', err);
        setError('Failed to translate message');
        // Keep the original text on error
        setTranslatedText(text);
      } finally {
        setIsTranslating(false);
      }
    };

    // 翻译条件：有文本 且 (语言不同 或 是中文到粤语的转换)
    if (text && (language !== sourceLanguage || needsChineseToCantonese)) {
      console.log(`[useMessageTranslation] Translating to ${language}${needsChineseToCantonese ? ' (Chinese to Cantonese conversion)' : ''}`);
      translateMessage();
    } else {
      console.log(`[useMessageTranslation] No translation needed:`, { 
        text: !!text, 
        languagesDifferent: language !== sourceLanguage,
        needsChineseToCantonese
      });
    }
  }, [text, language, sourceLanguage, autoTranslate]);

  const translate = async () => {
    // 检查是否需要从中文转换到粤语
    const needsChineseToCantonese = isChineseToCantonese(sourceLanguage, language);
    
    // Skip if languages match (unless Chinese to Cantonese) or already translating/translated
    if ((language === sourceLanguage && !needsChineseToCantonese) || isTranslating || isTranslated) {
      return;
    }
    
    try {
      setIsTranslating(true);
      setError(null);
      
      const response = await apiRequest<TranslationResult>(
        '/api/translate',
        {
          method: 'POST',
          body: JSON.stringify({
            text,
            sourceLanguage,
            targetLanguage: language
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (response && response.translatedText) {
        setTranslatedText(response.translatedText);
        setIsTranslated(true);
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate message');
    } finally {
      setIsTranslating(false);
    }
  };
  
  const resetToOriginal = () => {
    setTranslatedText(text);
    setIsTranslated(false);
  };
  
  return { 
    translatedText, 
    originalText: text,
    isTranslating, 
    isTranslated,
    error, 
    translate, 
    resetToOriginal 
  };
}