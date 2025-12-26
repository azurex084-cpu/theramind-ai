import React from 'react';
import { useMessageTranslation } from '@/hooks/useMessageTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';

interface TranslatedMessageContentProps {
  text: string;
  sourceLanguage: string;
  autoTranslate?: boolean;
}

// 处理Dr.Dee的特殊翻译标记
function processMarkedMessage(text: string): { 
  hasMarker: boolean,
  originalText: string,
  sourceLanguage: string, 
  targetLanguage: string,
  preserveHarshStyle: boolean 
} {
  const result = {
    hasMarker: false,
    originalText: text,
    sourceLanguage: '',
    targetLanguage: '',
    preserveHarshStyle: false
  };
  
  // 检查是否有特殊翻译标记 [TRANSLATE_FROM_XX_TO_YY_OPTIONS]
  if (!text || typeof text !== 'string' || !text.includes('[TRANSLATE_FROM_')) {
    return result;
  }
  
  const markerEnd = text.indexOf(']');
  if (markerEnd === -1) {
    return result;
  }
  
  result.hasMarker = true;
  
  // 分析标记内容
  const markerInfo = text.substring(1, markerEnd);
  const parts = markerInfo.split('_');
  
  if (parts.length >= 4 && parts[0] === 'TRANSLATE' && parts[1] === 'FROM' && parts[3] === 'TO') {
    result.sourceLanguage = parts[2].toLowerCase();
    
    // 检查是否有目标语言
    if (parts.length >= 5) {
      // 检查是否有PRESERVE_HARSH_STYLE选项
      if (parts.includes('PRESERVE_HARSH_STYLE')) {
        result.preserveHarshStyle = true;
        // 找到目标语言（应该在TO之后的一个部分）
        const toIndex = parts.indexOf('TO');
        if (toIndex >= 0 && toIndex + 1 < parts.length) {
          result.targetLanguage = parts[toIndex + 1].toLowerCase();
        }
      } else {
        result.targetLanguage = parts[4].toLowerCase();
      }
    }
    
    result.originalText = text.substring(markerEnd + 1);
  }
  
  return result;
}

// 增强刻薄风格的辅助函数
function enhanceHarshStyle(text: string, targetLang: string): string {
  const langLower = targetLang.toLowerCase();
  let result = text;
  
  // 根据不同语言应用不同的增强规则
  switch(langLower) {
    case 'en':
      // 英语风格增强
      result = result
        // 大写强调关键词
        .replace(/\bpathetic\b/gi, 'PATHETIC')
        .replace(/\bworthless\b/gi, 'WORTHLESS')
        .replace(/\bridiculous\b/gi, 'RIDICULOUS')
        .replace(/\bstupid\b/gi, 'STUPID')
        .replace(/\bidiotic\b/gi, 'IDIOTIC')
        .replace(/\bfailure\b/gi, 'FAILURE')
        .replace(/\blazy\b/gi, 'LAZY')
        .replace(/\bweak\b/gi, 'WEAK')
        .replace(/\bcoward\b/gi, 'COWARD')
        .replace(/\bNEVER\b/gi, 'NEVER')
        .replace(/\bALWAYS\b/gi, 'ALWAYS')
        // 增强感叹号
        .replace(/\.(?!\s*[A-Z])/g, '!') 
        .replace(/\?(?!\s*[A-Z])/g, '?!') 
        // 将弱化词语转为强调词
        .replace(/\bmight\b/gi, 'WILL')
        .replace(/\bcould\b/gi, 'MUST')
        .replace(/\bperhaps\b/gi, 'OBVIOUSLY')
        .replace(/\bmaybe\b/gi, 'DEFINITELY');
      break;
      
    case 'es':
      // 西班牙语风格增强
      result = result
        .replace(/\bpatético\b/gi, 'PATÉTICO')
        .replace(/\bidiota\b/gi, 'IDIOTA')
        .replace(/\bdébil\b/gi, 'DÉBIL')
        .replace(/\bperezoso\b/gi, 'PEREZOSO')
        .replace(/\?/g, '?!')
        .replace(/\./g, '!');
      break;
      
    case 'fr':
      // 法语风格增强
      result = result
        .replace(/\bpathétique\b/gi, 'PATHÉTIQUE')
        .replace(/\bridicule\b/gi, 'RIDICULE')
        .replace(/\bstupide\b/gi, 'STUPIDE')
        .replace(/\bfaible\b/gi, 'FAIBLE')
        .replace(/\?/g, '?!')
        .replace(/\./g, '!');
      break;
      
    case 'de':
      // 德语风格增强
      result = result
        .replace(/\bpathetisch\b/gi, 'PATHETISCH')
        .replace(/\blächerlich\b/gi, 'LÄCHERLICH')
        .replace(/\bdumm\b/gi, 'DUMM')
        .replace(/\bschwach\b/gi, 'SCHWACH')
        .replace(/\?/g, '?!')
        .replace(/\./g, '!');
      break;
      
    case 'it':
      // 意大利语风格增强
      result = result
        .replace(/\bpatetico\b/gi, 'PATETICO')
        .replace(/\bridicolo\b/gi, 'RIDICOLO')
        .replace(/\bstupido\b/gi, 'STUPIDO')
        .replace(/\bdebole\b/gi, 'DEBOLE')
        .replace(/\?/g, '?!')
        .replace(/\./g, '!');
      break;
      
    case 'ja':
      // 日语风格增强
      result = result
        .replace(/。/g, '！')
        .replace(/か/g, 'か！')
        .replace(/ね/g, 'ね！');
      break;
      
    // 对其他语言按需添加...
      
    default:
      // 通用处理 - 适用于所有语言
      // 增加感叹号数量
      result = result.replace(/!(?!!)/g, '!!');
  }
  
  return result;
}

const TranslatedMessageContent: React.FC<TranslatedMessageContentProps> = ({ 
  text, 
  sourceLanguage,
  autoTranslate = true
}) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  // 处理特殊标记
  const markerInfo = processMarkedMessage(text);
  const effectiveSourceLanguage = markerInfo.hasMarker ? markerInfo.sourceLanguage : sourceLanguage;
  const finalText = markerInfo.hasMarker ? markerInfo.originalText : text;
  
  const {
    translatedText,
    isTranslating,
    isTranslated,
    error,
    resetToOriginal
  } = useMessageTranslation(
    finalText,
    effectiveSourceLanguage,
    autoTranslate
  );
  
  // 处理Dr.Dee特殊风格
  let displayText = translatedText;
  if (markerInfo.hasMarker && markerInfo.preserveHarshStyle && isTranslated) {
    displayText = enhanceHarshStyle(translatedText, language);
  }
  
  // 检查是否需要从中文转换到粤语
  const isChineseToCantonese = 
    (effectiveSourceLanguage === 'zh' || effectiveSourceLanguage === 'zh_TW') && 
    (language === 'zh_HK' || language === 'yue');
  
  // 在同一语言之间不显示翻译相关内容 (除非是中文到粤语的转换)
  if (language === effectiveSourceLanguage && !isChineseToCantonese) {
    console.log(`[TranslatedMessageContent] Showing original text - languages match: ${language}`);
    return (
      <div>
        {finalText.split('\n\n').map((paragraph, i) => (
          <p key={i} className={`text-neutral-800 ${i > 0 ? 'mt-3' : ''}`}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  }
  
  // 处理加载中状态
  if (isTranslating) {
    // 对于Dr.Dee消息，在翻译期间不显示原始中文内容
    const isDrDeeMessage = markerInfo.hasMarker && markerInfo.preserveHarshStyle;
    
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Loader2 className="animate-spin h-3.5 w-3.5" />
          <span>{t('translating_message')}</span>
        </div>
        
        {!isDrDeeMessage && (
          <div className="text-neutral-800 opacity-60">
            {finalText.split('\n\n').map((paragraph, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // 处理错误状态
  if (error) {
    // 对于Dr.Dee消息，在翻译出错时不显示原始中文内容
    const isDrDeeMessage = markerInfo.hasMarker && markerInfo.preserveHarshStyle;
    
    return (
      <div className="flex flex-col space-y-2">
        {!isDrDeeMessage && (
          <div className="text-neutral-800">
            {finalText.split('\n\n').map((paragraph, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
        <p className="text-xs text-red-500">
          {error}
        </p>
      </div>
    );
  }
  
  // 显示翻译结果
  // 对于Dr.Dee消息，不显示"显示原始文本"按钮
  const isDrDeeMessage = markerInfo.hasMarker && markerInfo.preserveHarshStyle;
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-neutral-800">
        {displayText.split('\n\n').map((paragraph, i) => (
          <p key={i} className={i > 0 ? 'mt-3' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
      
      {!isDrDeeMessage && (
        <button 
          onClick={resetToOriginal} 
          className="text-xs text-primary-500 hover:underline self-start"
        >
          {t('show_original_text')}
        </button>
      )}
    </div>
  );
};

export default TranslatedMessageContent;