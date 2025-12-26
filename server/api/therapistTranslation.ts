import { translateText } from "./translation";
import { LanguageCode } from "./openai";
import { CustomTherapist } from "@shared/schema";

// 为了翻译需要的语言代码类型别名
export type AllLanguageCode = LanguageCode;
import type { ZodNullable } from "zod";

// 支持的所有语言代码
const SUPPORTED_LANGUAGES: LanguageCode[] = [
  'en', 'zh', 'zh_TW', 'es', 'fr', 'de', 'it', 'ja', 'pt', 'nl', 'ru', 'uk', 'ar'
];

// 语言代码映射（用于翻译API）
const LANGUAGE_CODE_MAP: Record<LanguageCode, string> = {
  'en': 'en',
  'zh': 'zh-CN',
  'zh_TW': 'zh-TW',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'ja': 'ja',
  'pt': 'pt',
  'nl': 'nl',
  'ru': 'ru',
  'uk': 'uk',
  'ar': 'ar'
};

// 要翻译的字段类型，添加严格的键类型确保类型安全
type TranslatableField = keyof Pick<CustomTherapist, 'name' | 'title' | 'description' | 'approach' | 'speakingStyle'>;

// 翻译结果类型，每个字段对应一个语言代码到翻译文本的映射
type TranslationResult = {
  [K in TranslatableField as `${K}Translations`]?: Record<LanguageCode, string>;
};

// 特殊模板标识符的前缀
const THERAPIST_STYLE_PREFIX = "THERAPIST_STYLE__";
const THERAPIST_PROMPT_PREFIX = "THERAPIST_PROMPT__";

// 风格和提示预设文本模板
type TherapistTemplateMap = Record<LanguageCode, Record<string, string>>;

// 预定义的风格和提示的本地化模板
const styleTemplates: TherapistTemplateMap = {
  en: {
    "therapist_style_template": "This therapist's communication style is {rational}, {friendly}, {practical}, and {direct}."
  },
  zh: {
    "therapist_style_template": "这位治疗师的沟通风格是{rational}、{friendly}、{practical}和{direct}。"
  },
  zh_TW: {
    "therapist_style_template": "該治療師的溝通風格是{rational}、{friendly}、{practical}和{direct}。"
  },
  es: {
    "therapist_style_template": "El estilo de comunicación de este terapeuta es {rational}, {friendly}, {practical} y {direct}."
  },
  fr: {
    "therapist_style_template": "Le style de communication de ce thérapeute est {rational}, {friendly}, {practical} et {direct}."
  },
  de: {
    "therapist_style_template": "Der Kommunikationsstil dieses Therapeuten ist {rational}, {friendly}, {practical} und {direct}."
  },
  it: {
    "therapist_style_template": "Lo stile di comunicazione di questo terapeuta è {rational}, {friendly}, {practical} e {direct}."
  },
  ja: {
    "therapist_style_template": "このセラピストのコミュニケーションスタイルは{rational}、{friendly}、{practical}、そして{direct}です。"
  },
  pt: {
    "therapist_style_template": "O estilo de comunicação deste terapeuta é {rational}, {friendly}, {practical} e {direct}."
  },
  nl: {
    "therapist_style_template": "De communicatiestijl van deze therapeut is {rational}, {friendly}, {practical} en {direct}."
  },
  ru: {
    "therapist_style_template": "Стиль общения этого терапевта {rational}, {friendly}, {practical} и {direct}."
  },
  uk: {
    "therapist_style_template": "Стиль спілкування цього терапевта {rational}, {friendly}, {practical} і {direct}."
  },
  ar: {
    "therapist_style_template": "أسلوب تواصل هذا المعالج {rational}، و{friendly}، و{practical}، و{direct}."
  }
};

// 个性特质的本地化文本
const personalityTerms: TherapistTemplateMap = {
  en: {
    "rational_term": "uses technical terminology",
    "balanced_rational_emotional_term": "balances technical and accessible language",
    "emotional_term": "uses accessible language",
    "friendly_term": "friendly and supportive",
    "balanced_friendly_strict_term": "balances friendliness and directness",
    "strict_term": "strict and direct",
    "practical_term": "practical and solution-focused",
    "balanced_practical_creative_term": "balances practicality with creativity",
    "creative_term": "creative and innovative",
    "direct_term": "focused on rational analysis",
    "balanced_direct_indirect_term": "balances rational thinking and emotional connection",
    "indirect_term": "focused on emotional connection"
  },
  zh: {
    "rational_term": "使用专业术语",
    "balanced_rational_emotional_term": "平衡专业术语和通俗语言",
    "emotional_term": "使用通俗易懂的语言",
    "friendly_term": "友好且支持性强",
    "balanced_friendly_strict_term": "平衡友好和直接",
    "strict_term": "严格直接",
    "practical_term": "务实且关注解决方案",
    "balanced_practical_creative_term": "平衡实用性和创造性",
    "creative_term": "富有创意和创新",
    "direct_term": "专注于理性分析",
    "balanced_direct_indirect_term": "平衡理性思考和情感联系",
    "indirect_term": "专注于情感联系"
  },
  // 其他语言的映射可以根据需要添加
  zh_TW: {
    "rational_term": "使用專業術語",
    "balanced_rational_emotional_term": "平衡專業術語和通俗語言",
    "emotional_term": "使用通俗易懂的語言",
    "friendly_term": "友好且支持性強",
    "balanced_friendly_strict_term": "平衡友好和直接",
    "strict_term": "嚴格直接",
    "practical_term": "務實且關注解決方案",
    "balanced_practical_creative_term": "平衡實用性和創造性",
    "creative_term": "富有創意和創新",
    "direct_term": "專注於理性分析",
    "balanced_direct_indirect_term": "平衡理性思考和情感聯繫",
    "indirect_term": "專注於情感聯繫"
  },
  es: {
    "rational_term": "usa terminología técnica",
    "balanced_rational_emotional_term": "equilibra lenguaje técnico y accesible",
    "emotional_term": "usa lenguaje accesible",
    "friendly_term": "amigable y de apoyo",
    "balanced_friendly_strict_term": "equilibra amabilidad y franqueza",
    "strict_term": "estricto y directo",
    "practical_term": "práctico y centrado en soluciones",
    "balanced_practical_creative_term": "equilibra practicidad y creatividad",
    "creative_term": "creativo e innovador",
    "direct_term": "centrado en el análisis racional",
    "balanced_direct_indirect_term": "equilibra pensamiento racional y conexión emocional",
    "indirect_term": "centrado en la conexión emocional"
  },
  // 其他语言翻译
  fr: {
    "rational_term": "utilise une terminologie technique",
    "balanced_rational_emotional_term": "équilibre langage technique et accessible",
    "emotional_term": "utilise un langage accessible",
    "friendly_term": "amical et encourageant",
    "balanced_friendly_strict_term": "équilibre amabilité et franchise",
    "strict_term": "strict et direct",
    "practical_term": "pratique et axé sur les solutions",
    "balanced_practical_creative_term": "équilibre pragmatisme et créativité",
    "creative_term": "créatif et innovant",
    "direct_term": "centré sur l'analyse rationnelle",
    "balanced_direct_indirect_term": "équilibre pensée rationnelle et connexion émotionnelle",
    "indirect_term": "centré sur la connexion émotionnelle"
  }, 
  de: {
    "rational_term": "verwendet Fachterminologie",
    "balanced_rational_emotional_term": "balanciert Fachsprache und zugängliche Sprache",
    "emotional_term": "verwendet zugängliche Sprache",
    "friendly_term": "freundlich und unterstützend",
    "balanced_friendly_strict_term": "balanciert Freundlichkeit und Direktheit",
    "strict_term": "streng und direkt",
    "practical_term": "praktisch und lösungsorientiert",
    "balanced_practical_creative_term": "balanciert Praktikabilität und Kreativität",
    "creative_term": "kreativ und innovativ",
    "direct_term": "fokussiert auf rationale Analyse",
    "balanced_direct_indirect_term": "balanciert rationales Denken und emotionale Verbindung",
    "indirect_term": "fokussiert auf emotionale Verbindung"
  }, 
  it: {
    "rational_term": "usa terminologia tecnica",
    "balanced_rational_emotional_term": "bilancia linguaggio tecnico e accessibile",
    "emotional_term": "usa linguaggio accessibile",
    "friendly_term": "amichevole e di supporto",
    "balanced_friendly_strict_term": "bilancia gentilezza e franchezza",
    "strict_term": "severo e diretto",
    "practical_term": "pratico e orientato alle soluzioni",
    "balanced_practical_creative_term": "bilancia praticità e creatività",
    "creative_term": "creativo e innovativo",
    "direct_term": "concentrato sull'analisi razionale",
    "balanced_direct_indirect_term": "bilancia pensiero razionale e connessione emotiva",
    "indirect_term": "concentrato sulla connessione emotiva"
  }, 
  ja: {
    "rational_term": "専門用語を使用する",
    "balanced_rational_emotional_term": "専門的な言葉と分かりやすい言葉のバランスを取る",
    "emotional_term": "分かりやすい言葉を使用する",
    "friendly_term": "友好的で支持的",
    "balanced_friendly_strict_term": "親しみやすさと率直さのバランスを取る",
    "strict_term": "厳格で率直",
    "practical_term": "実用的で解決策重視",
    "balanced_practical_creative_term": "実用性と創造性のバランスを取る",
    "creative_term": "創造的で革新的",
    "direct_term": "合理的分析に焦点を当てる",
    "balanced_direct_indirect_term": "合理的思考と感情的つながりのバランスを取る",
    "indirect_term": "感情的つながりに焦点を当てる"
  }, 
  pt: {
    "rational_term": "usa terminologia técnica",
    "balanced_rational_emotional_term": "equilibra linguagem técnica e acessível",
    "emotional_term": "usa linguagem acessível",
    "friendly_term": "amigável e solidário",
    "balanced_friendly_strict_term": "equilibra simpatia e franqueza",
    "strict_term": "rigoroso e direto",
    "practical_term": "prático e focado em soluções",
    "balanced_practical_creative_term": "equilibra praticidade e criatividade",
    "creative_term": "criativo e inovador",
    "direct_term": "focado na análise racional",
    "balanced_direct_indirect_term": "equilibra pensamento racional e conexão emocional",
    "indirect_term": "focado na conexão emocional"
  }, 
  nl: {
    "rational_term": "gebruikt technische terminologie",
    "balanced_rational_emotional_term": "balanceert technische en toegankelijke taal",
    "emotional_term": "gebruikt toegankelijke taal",
    "friendly_term": "vriendelijk en ondersteunend",
    "balanced_friendly_strict_term": "balanceert vriendelijkheid en directheid",
    "strict_term": "strikt en direct",
    "practical_term": "praktisch en oplossingsgericht",
    "balanced_practical_creative_term": "balanceert praktisch nut en creativiteit",
    "creative_term": "creatief en innovatief",
    "direct_term": "gericht op rationele analyse",
    "balanced_direct_indirect_term": "balanceert rationeel denken en emotionele verbinding",
    "indirect_term": "gericht op emotionele verbinding"
  }, 
  ru: {
    "rational_term": "использует техническую терминологию",
    "balanced_rational_emotional_term": "сочетает технический и доступный язык",
    "emotional_term": "использует доступный язык",
    "friendly_term": "дружелюбный и поддерживающий",
    "balanced_friendly_strict_term": "сочетает дружелюбие и прямоту",
    "strict_term": "строгий и прямолинейный",
    "practical_term": "практичный и ориентированный на решения",
    "balanced_practical_creative_term": "сочетает практичность и творчество",
    "creative_term": "творческий и инновационный",
    "direct_term": "сосредоточен на рациональном анализе",
    "balanced_direct_indirect_term": "сочетает рациональное мышление и эмоциональную связь",
    "indirect_term": "сосредоточен на эмоциональной связи"
  }, 
  uk: {
    "rational_term": "використовує технічну термінологію",
    "balanced_rational_emotional_term": "поєднує технічну та доступну мову",
    "emotional_term": "використовує доступну мову",
    "friendly_term": "дружній та підтримуючий",
    "balanced_friendly_strict_term": "поєднує дружелюбність і прямоту",
    "strict_term": "суворий і прямолінійний",
    "practical_term": "практичний та орієнтований на рішення",
    "balanced_practical_creative_term": "поєднує практичність і творчість",
    "creative_term": "творчий та інноваційний",
    "direct_term": "зосереджений на раціональному аналізі",
    "balanced_direct_indirect_term": "поєднує раціональне мислення та емоційний зв'язок",
    "indirect_term": "зосереджений на емоційному зв'язку"
  }, 
  ar: {
    "rational_term": "يستخدم المصطلحات التقنية",
    "balanced_rational_emotional_term": "يوازن بين اللغة التقنية والمفهومة",
    "emotional_term": "يستخدم لغة سهلة الفهم",
    "friendly_term": "ودود وداعم",
    "balanced_friendly_strict_term": "يوازن بين الود والصراحة",
    "strict_term": "صارم ومباشر",
    "practical_term": "عملي ويركز على الحلول",
    "balanced_practical_creative_term": "يوازن بين العملية والإبداع",
    "creative_term": "مبدع ومبتكر",
    "direct_term": "يركز على التحليل العقلاني",
    "balanced_direct_indirect_term": "يوازن بين التفكير العقلاني والتواصل العاطفي",
    "indirect_term": "يركز على التواصل العاطفي"
  }
};

/**
 * 处理特殊模板格式的翻译
 * @param text 原文本
 * @param langCode 目标语言代码
 * @returns 处理后的文本
 */
async function processTemplateText(text: string, langCode: LanguageCode): Promise<string> {
  // 调试当前输入
  console.log(`[processTemplateText] 处理speakingStyle翻译，源文本:`, text.substring(0, 50) + (text.length > 50 ? '...' : ''));
  console.log(`[processTemplateText] 目标语言代码:`, langCode);
  
  // 特殊处理中文目标语言和中文源文本
  const isChinese = /[\u4e00-\u9fa5]/.test(text);
  const isTargetChinese = langCode === 'zh' || langCode === 'zh_TW';
  
  // 如果目标是中文语言
  if (isTargetChinese) {
    // 如果源文本已经是中文
    if (isChinese) {
      console.log('[processTemplateText] 源文本和目标都是中文，检查是否需要简繁转换');
      // 如果目标和源文本类型一致，直接返回
      if (langCode === 'zh' && !/[\u7e41-\u9fff]/.test(text)) {
        console.log('[processTemplateText] 目标和源都是简体中文，无需翻译');
        return text;
      } else if (langCode === 'zh_TW' && /[\u7e41-\u9fff]/.test(text)) {
        console.log('[processTemplateText] 目标和源都是繁体中文，无需翻译');
        return text;
      } else {
        // 需要进行简繁转换
        console.log('[processTemplateText] 需要进行简繁转换');
        try {
          const sourceLang = langCode === 'zh' ? 'zh_TW' : 'zh';
          const result = await translateText(
            text, 
            sourceLang as AllLanguageCode, 
            langCode as AllLanguageCode
          );
          console.log('[processTemplateText] 简繁转换结果:', result.translatedText.substring(0, 30) + '...');
          return result.translatedText;
        } catch (error) {
          console.error('[processTemplateText] 简繁转换失败:', error);
          return text;
        }
      }
    } else {
      // 源文本是英文或其他语言，目标是中文
      console.log(`[processTemplateText] 源文本非中文，但目标是${langCode === 'zh' ? '简体中文' : '繁体中文'}`);
      try {
        // 直接从英文翻译到中文
        const targetLangCode = langCode === 'zh' ? 'zh-CN' as AllLanguageCode : 'zh-TW' as AllLanguageCode;
        const result = await translateText(
          text,
          'en' as AllLanguageCode,
          targetLangCode
        );
        console.log(`[processTemplateText] 从英文翻译到${langCode}结果:`, result.translatedText.substring(0, 30) + '...');
        return result.translatedText;
      } catch (error) {
        console.error(`[processTemplateText] 从英文翻译到${langCode}失败:`, error);
        return text;
      }
    }
  }
  
  // 如果源文本是中文但目标不是中文
  if (isChinese && !isTargetChinese) {
    console.log('[processTemplateText] 检测到中文文本，目标是非中文语言');
    try {
      console.log(`[processTemplateText] 从中文翻译到 ${langCode}`);
      const result = await translateText(
        text,
        'zh' as AllLanguageCode, // 从中文
        langCode // 到目标语言
      );
      console.log(`[processTemplateText] 从中文翻译到 ${langCode} 成功`);
      return result.translatedText;
    } catch (error) {
      console.error(`[processTemplateText] 从中文翻译到 ${langCode} 失败:`, error);
      return text; // 失败时返回原文
    }
  }
  
  // 处理旧格式模板（带前缀标识符）
  if (text.startsWith(THERAPIST_STYLE_PREFIX) || text.startsWith(THERAPIST_PROMPT_PREFIX)) {
    try {
      const parts = text.split('\n\n');
      // 如果有第二部分，直接使用它（人类可读部分）
      if (parts.length > 1) {
        const humanReadableText = parts[1];
        console.log(`[processTemplateText] 从旧格式中提取人类可读文本: ${humanReadableText}`);
        
        // 直接翻译人类可读部分
        const result = await translateText(
          humanReadableText,
          LANGUAGE_CODE_MAP.en,
          LANGUAGE_CODE_MAP[langCode]
        );
        console.log(`[processTemplateText] 旧格式文本翻译结果:`, result.translatedText.substring(0, 30) + '...');
        return result.translatedText;
      }
    } catch (error) {
      console.error('[processTemplateText] 处理旧模板文本出错:', error);
    }
  }
  
  // 新格式：直接翻译整个文本
  try {
    console.log(`[processTemplateText] 翻译纯文本: ${text.substring(0, 50)}...`);
    const result = await translateText(
      text, 
      LANGUAGE_CODE_MAP.en, 
      LANGUAGE_CODE_MAP[langCode]
    );
    console.log(`[processTemplateText] 翻译结果:`, result.translatedText.substring(0, 30) + '...');
    return result.translatedText;
  } catch (error) {
    console.error(`[processTemplateText] 翻译失败:`, error);
    return text; // 失败时返回原文
  }
}

/**
 * 为自定义治疗师生成多语言翻译
 * @param therapist 治疗师数据
 * @returns 带有翻译的治疗师数据，每个字段对应一个 "字段名Translations" 键
 */
export async function generateTherapistTranslations(therapist: Partial<CustomTherapist>): Promise<TranslationResult> {
  const translations: TranslationResult = {};
  // 声明为 any 然后断言为正确类型
  const sourceLanguage = ('en' as any) as LanguageCode; // 默认源语言为英语
  
  console.log(`[generateTherapistTranslations] 开始为治疗师 "${therapist.name || '未命名'}" 生成翻译`);
  
  // 要翻译的所有字段
  const fieldsToTranslate: TranslatableField[] = ['name', 'title', 'description', 'approach', 'speakingStyle'];
  
  // 为每个字段创建一个翻译对象
  for (const field of fieldsToTranslate) {
    // 安全地获取字段值
    const fieldValue = therapist[field];
    
    // 只处理非空字符串值
    if (!fieldValue || typeof fieldValue !== 'string') {
      continue;
    }
    
    // 创建翻译结果对象
    const fieldTranslations: Record<string, string> = {};
    
    // 特殊处理 speakingStyle 字段
    if (field === 'speakingStyle') {
      console.log(`[generateTherapistTranslations] 处理自定义治疗师的 speakingStyle 字段，解析基于个性特质的样式`);
      
      // 从风格文本中识别个性特质模式
      const rationalPattern = /(I use highly logical|I prioritize logical|I balance logical|I prioritize emotional|I use highly empathetic)/;
      const friendlyPattern = /(My tone is very warm|I maintain a generally warm|I balance professional|I maintain a predominantly formal|I maintain strict|I use deliberately shocking)/;
      const practicalPattern = /(I focus exclusively on practical|I prioritize practical solutions|I balance practical guidance|I prioritize creative exploration|I focus extensively on creative)/;
      const directPattern = /(I am extremely direct|I communicate mostly directly|I balance directness|I use gentle, indirect|I am very indirect|I am BRUTALLY DIRECT)/;
      
      // 提取个性特质描述
      const rationalMatch = fieldValue.match(rationalPattern);
      const friendlyMatch = fieldValue.match(friendlyPattern);
      const practicalMatch = fieldValue.match(practicalPattern);
      const directMatch = fieldValue.match(directPattern);
      
      // 如果成功识别出个性特质描述，则为每种语言生成适当的本地化版本
      if (rationalMatch && friendlyMatch && practicalMatch && directMatch) {
        console.log(`[generateTherapistTranslations] 成功识别出所有个性特质描述，生成本地化版本`);
        
        // 映射英文模式到本地化术语的键
        // 理性 vs 情感
        let rationalTermKey = "balanced_rational_emotional_term"; // 默认平衡
        if (rationalMatch[0].includes("highly logical")) rationalTermKey = "rational_term";
        else if (rationalMatch[0].includes("prioritize logical")) rationalTermKey = "rational_term";
        else if (rationalMatch[0].includes("prioritize emotional")) rationalTermKey = "emotional_term";
        else if (rationalMatch[0].includes("highly empathetic")) rationalTermKey = "emotional_term";
        
        // 友好 vs 严格
        let friendlyTermKey = "balanced_friendly_strict_term"; // 默认平衡
        if (friendlyMatch[0].includes("very warm")) friendlyTermKey = "friendly_term";
        else if (friendlyMatch[0].includes("generally warm")) friendlyTermKey = "friendly_term";
        else if (friendlyMatch[0].includes("predominantly formal")) friendlyTermKey = "strict_term";
        else if (friendlyMatch[0].includes("strict,")) friendlyTermKey = "strict_term";
        else if (friendlyMatch[0].includes("deliberately shocking")) friendlyTermKey = "strict_term";
        
        // 实用 vs 创意
        let practicalTermKey = "balanced_practical_creative_term"; // 默认平衡
        if (practicalMatch[0].includes("exclusively on practical")) practicalTermKey = "practical_term";
        else if (practicalMatch[0].includes("prioritize practical")) practicalTermKey = "practical_term";
        else if (practicalMatch[0].includes("prioritize creative")) practicalTermKey = "creative_term";
        else if (practicalMatch[0].includes("extensively on creative")) practicalTermKey = "creative_term";
        
        // 直接 vs 间接
        let directTermKey = "balanced_direct_indirect_term"; // 默认平衡
        if (directMatch[0].includes("extremely direct")) directTermKey = "direct_term";
        else if (directMatch[0].includes("mostly directly")) directTermKey = "direct_term";
        else if (directMatch[0].includes("gentle, indirect")) directTermKey = "indirect_term";
        else if (directMatch[0].includes("very indirect")) directTermKey = "indirect_term";
        else if (directMatch[0].includes("BRUTALLY DIRECT")) directTermKey = "direct_term";
        
        // 为每种支持的语言生成本地化版本
        for (const langCode of SUPPORTED_LANGUAGES) {
          try {
            // 1. 如果是英语，使用原始的详细描述
            if (langCode === 'en') {
              fieldTranslations[langCode] = fieldValue;
              continue;
            }
            
            // 2. 对于其他语言，生成基于模板的本地化版本
            
            // 获取当前语言的模板和术语
            const languageTemplate = styleTemplates[langCode]?.["therapist_style_template"] || styleTemplates.en["therapist_style_template"];
            
            // 获取对应语言的特质术语，如果没有，回退到英文
            const getTermForLanguage = (termKey: string, langCode: LanguageCode): string => {
              // 如果当前语言有该术语的翻译，使用它
              if (personalityTerms[langCode] && personalityTerms[langCode][termKey]) {
                return personalityTerms[langCode][termKey];
              }
              // 中文和繁体中文可以共享翻译
              else if ((langCode === 'zh_TW' || langCode === 'zh') && 
                       (personalityTerms.zh[termKey] || personalityTerms.zh_TW[termKey])) {
                return personalityTerms.zh[termKey] || personalityTerms.zh_TW[termKey];
              }
              // 最后回退到英文
              else {
                return personalityTerms.en[termKey];
              }
            };
            
            // 获取各特质的本地化术语
            const rationalTerm = getTermForLanguage(rationalTermKey, langCode);
            const friendlyTerm = getTermForLanguage(friendlyTermKey, langCode);
            const practicalTerm = getTermForLanguage(practicalTermKey, langCode);
            const directTerm = getTermForLanguage(directTermKey, langCode);
            
            // 使用模板生成完整的本地化描述
            let localizedStyle = languageTemplate
              .replace('{rational}', rationalTerm)
              .replace('{friendly}', friendlyTerm)
              .replace('{practical}', practicalTerm)
              .replace('{direct}', directTerm);
            
            // 如果包含用户提供的额外描述，也需要翻译
            if (fieldValue.includes("Additionally:")) {
              const parts = fieldValue.split("Additionally:");
              if (parts.length > 1 && parts[0].trim().length > 10) {
                try {
                  const userDescription = parts[0].trim();
                  const translatedUserDesc = await translateText(userDescription, 'en' as AllLanguageCode, langCode);
                  // 在本地化风格前加上翻译后的用户描述
                  localizedStyle = `${translatedUserDesc.translatedText}. ${localizedStyle}`;
                } catch (error) {
                  console.error(`[generateTherapistTranslations] 翻译用户自定义描述失败:`, error);
                }
              }
            }
            
            fieldTranslations[langCode] = localizedStyle;
            console.log(`[generateTherapistTranslations] 为 ${langCode} 生成了基于模板的风格描述: "${localizedStyle.substring(0, 40)}..."`);
          } catch (templateError) {
            console.error(`[generateTherapistTranslations] 生成 ${langCode} 的模板风格失败:`, templateError);
            
            // 出错时尝试直接翻译
            try {
              const result = await translateText(fieldValue, 'en' as AllLanguageCode, langCode);
              fieldTranslations[langCode] = result.translatedText;
              console.log(`[generateTherapistTranslations] 回退到直接翻译 speakingStyle 到 ${langCode}: "${result.translatedText.substring(0, 30)}..."`);
            } catch (translateError) {
              console.error(`[generateTherapistTranslations] 直接翻译也失败:`, translateError);
              fieldTranslations[langCode] = fieldValue; // 保留原文
            }
          }
        }
      } else {
        // 无法识别出特质描述模式，使用常规翻译处理
        console.log(`[generateTherapistTranslations] 未能识别出个性特质描述，使用常规翻译处理`);
        
        // 使用常量定义语言代码，以便在整个函数中使用
        const LANG_EN = 'en';
        const LANG_ZH = 'zh';
        const LANG_ZH_TW = 'zh_TW';
        
        // 为每种支持的语言生成翻译
        for (const langCode of SUPPORTED_LANGUAGES) {
          // 将langCode转换为字符串类型，避免类型比较错误
          const currentLang = String(langCode) as string;
          
          // 使用字符串字面量比较
          if (currentLang === 'en') {
            fieldTranslations[currentLang as string] = fieldValue;
            continue;
          }
          
          // 对说话风格进行常规处理
          const isChinese = /[\u4e00-\u9fa5]/.test(fieldValue);
          
          if (isChinese) {
            // 如果是中文源文本，处理中文到其他语言的转换
            console.log(`[generateTherapistTranslations] 中文speakingStyle检测到，处理中文翻译`);
            try {
              // 使用字符串字面量比较
              // 处理各种语言情况
              if (currentLang === 'en') {
                // 中文到英文 - 跳过，因为英文已在前面处理
                continue;
              } else if (currentLang === LANG_ZH_TW && !/[\u7e41-\u9fff]/.test(fieldValue)) {
                // 从简体中文到繁体中文
                const result = await translateText(
                  fieldValue, 
                  LANG_ZH as LanguageCode, 
                  LANG_ZH_TW as LanguageCode
                );
                fieldTranslations[LANG_ZH_TW] = result.translatedText;
              } else if (currentLang === LANG_ZH && /[\u7e41-\u9fff]/.test(fieldValue)) {
                // 从繁体中文到简体中文
                const result = await translateText(
                  fieldValue, 
                  LANG_ZH_TW as LanguageCode, 
                  LANG_ZH as LanguageCode
                );
                fieldTranslations[LANG_ZH] = result.translatedText;
              } else {
                // 从中文到其他语言，使用英文作为中间语言
                const englishResult = await translateText(
                  fieldValue, 
                  LANG_ZH as LanguageCode, 
                  LANG_EN as LanguageCode
                );
                const finalResult = await translateText(
                  englishResult.translatedText, 
                  LANG_EN as LanguageCode, 
                  currentLang
                );
                fieldTranslations[currentLang as LanguageCode] = finalResult.translatedText;
              }
            } catch (error) {
              console.error(`[generateTherapistTranslations] 中文speakingStyle翻译失败:`, error);
              fieldTranslations[currentLang as string] = fieldValue; // 保留原文
            }
          } else {
            // 英文或其他语言源文本
            try {
              const result = await translateText(
                fieldValue, 
                LANG_EN as LanguageCode, 
                currentLang
              );
              fieldTranslations[currentLang as string] = result.translatedText;
              console.log(`[generateTherapistTranslations] ${field} 翻译到 ${currentLang}: "${fieldTranslations[currentLang as string].substring(0, 30)}..."`);
            } catch (error) {
              console.error(`[generateTherapistTranslations] 翻译 ${field} 到 ${currentLang} 失败:`, error);
              fieldTranslations[currentLang as string] = fieldValue; // 保留原文
            }
          }
        }
      }
    } else {
      // 其他普通字段的翻译处理
      // 为每种支持的语言生成翻译
      for (const langCode of SUPPORTED_LANGUAGES) {
        // 如果是英语，直接使用原文
        if (langCode === 'en') {
          fieldTranslations[langCode] = fieldValue;
          continue;
        }
        
        // 否则，翻译文本
        try {
          const result = await translateText(
            fieldValue,
            LANGUAGE_CODE_MAP[sourceLanguage],
            LANGUAGE_CODE_MAP[langCode]
          );
          fieldTranslations[langCode] = result.translatedText;
          console.log(`[generateTherapistTranslations] ${field} 翻译到 ${langCode}: "${result.translatedText.substring(0, 30)}..."`);
        } catch (error) {
          console.error(`[generateTherapistTranslations] 翻译 ${field} 到 ${langCode} 失败:`, error);
          // 如果翻译失败，使用原文
          fieldTranslations[langCode] = fieldValue;
        }
      }
    }
    
    // 添加到翻译对象，使用正确的类型转换
    const translationKey = `${field}Translations` as keyof TranslationResult;
    // 直接存储翻译对象，不再转换为字符串
    // @ts-ignore 类型忽略，因为我们知道这是安全的
    translations[translationKey] = fieldTranslations;
  }
  
  console.log(`[generateTherapistTranslations] 完成治疗师 "${therapist.name || '未命名'}" 的翻译`);
  return translations;
}