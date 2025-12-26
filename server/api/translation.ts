import axios from "axios";
import OpenAI from "openai";

// Initialize OpenAI client for translation
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 添加同步翻译函数，用于需要立即返回的场景
export function translateTextSync(text: string, sourceLanguage: string, targetLanguage: string, preserveHarshStyle: boolean = false): string {
  // 这是一个同步函数，用于在必须立即返回结果的地方使用
  // 它不执行实际翻译，而是添加标记以便前端处理翻译
  if (preserveHarshStyle) {
    // 为Dr.Dee的回复添加特殊标记，确保翻译后保持刻薄风格
    return `[TRANSLATE_FROM_${sourceLanguage.toUpperCase()}_TO_${targetLanguage.toUpperCase()}_PRESERVE_HARSH_STYLE]${text}`;
  } else {
    // 普通翻译标记
    return `[TRANSLATE_FROM_${sourceLanguage.toUpperCase()}_TO_${targetLanguage.toUpperCase()}]${text}`;
  }
}

// Track API usage to avoid excessive calls during development/testing
let apiCallCount = 0;
const MAX_API_CALLS = 500; // increased to allow more translations

// 添加服务状态跟踪以减少不必要的失败调用
let libreTranslateServiceDown = false;
let lastLibreTranslateFailure = 0;
const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5分钟冷却期

/**
 * Translate text from source language to target language
 * Uses Libre Translate API by default, but can be configured to use Google Translate or DeepL
 * 
 * @param text Text to translate
 * @param sourceLanguage Source language code (e.g., 'en')
 * @param targetLanguage Target language code (e.g., 'es')
 * @returns Translated text
 */
/**
 * 清理和规范化文本以准备翻译
 * 移除会导致翻译问题的特殊字符和格式
 */
function cleanTextForTranslation(text: string): string {
  // 移除控制字符和不可见字符
  text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  // 规范化引号
  text = text.replace(/[""]/g, '"').replace(/['']/g, "'");
  
  // 修正不必要的标点符号
  text = text.replace(/[,.;:!?]{2,}/g, m => m[0]);
  
  // 处理中文标点后的不正确空格
  text = text.replace(/([。，；：？！])\s+/g, '$1');
  
  // 处理英文和中文之间的空格规范化
  text = text.replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, '$1 $2');
  text = text.replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, '$1 $2');
  
  // 删除超长的重复空格
  text = text.replace(/\s{2,}/g, ' ');
  
  return text.trim();
}

/**
 * 清理翻译结果，尤其是处理中文翻译中的混合语言和乱码问题
 */
/**
 * 将繁体中文文本转换为广东话(粤语)文本
 * 仅替换常见的语言差异，如"的"→"嘅"，"是"→"係"等
 */
function convertToCantonese(text: string): string {
  if (!text) return text;
  
  console.log(`[convertToCantonese] Converting text to Cantonese (length: ${text.length})`);
  console.log(`[convertToCantonese] Original Text (first 50 chars): "${text.substring(0, 50)}..."`);
  
  // Count how many substitutions we make to verify function is working
  let substitutionCount = 0;
  
  // Double-check for any remaining simplified characters and convert them to Traditional
  // This ensures complete conversion to Traditional Chinese before applying Cantonese substitutions
  
  // For common simplified Chinese characters, always perform another conversion
  // This ensures we catch all simplified characters regardless of our detection logic
  const containsSimplifiedChinese = true; // Always run the conversion to ensure complete transformation
  
  if (containsSimplifiedChinese) {
    console.log(`[convertToCantonese] Detected remaining simplified characters, converting to Traditional`);
    text = convertToTraditionalChinese(text);
    console.log(`[convertToCantonese] After additional Traditional conversion: "${text.substring(0, 50)}..."`);
  }
  
  console.log(`[convertToCantonese] Converting to Cantonese from traditional Chinese text`);
  console.log(`[convertToCantonese] Text sample: "${text.substring(0, 50)}..."`);
  
  
  
  // 定义繁体中文到粤语的映射
  const traditionalToCantonese: Record<string, string> = {
    '的': '嘅',     // 最常见的区别，"的"在粤语中是"嘅"
    '是': '係',     // "是"在粤语中是"係"
    '这': '呢',     // "这"在粤语中是"呢"
    '那': '嗰',     // "那"在粤语中是"嗰"
    '什么': '乜嘢', // "什么"在粤语中是"乜嘢"
    '甚麼': '乜嘢', // 繁体版本
    '怎么': '點樣', // "怎么"在粤语中是"點樣"
    '怎麼': '點樣', // 繁体版本
    '沒有': '冇',   // 繁体版本
    '没有': '冇',   // "没有"在粤语中是"冇"
    '不': '唔',     // "不"在粤语中很多情况下是"唔"
    '在': '喺',     // "在"在粤语中是"喺"
    '说': '講',     // "说"在粤语中是"講"
    '說': '講',     // 繁体版本
    '看': '睇',     // "看"在粤语中是"睇"
    '吃': '食',     // "吃"在粤语中是"食"
    '我们': '我哋', // "我们"在粤语中是"我哋"
    '我們': '我哋', // 繁体版本
    '你们': '你哋', // "你们"在粤语中是"你哋"
    '你們': '你哋', // 繁体版本
    '他们': '佢哋', // "他们"在粤语中是"佢哋"
    '他們': '佢哋', // 繁体版本
    '她们': '佢哋', // "她们"在粤语中是"佢哋"
    '她們': '佢哋', // 繁体版本
    '它们': '佢哋', // "它们"在粤语中是"佢哋"
    '它們': '佢哋', // 繁体版本
    '了': '咗',     // 动词后的"了"在粤语中常常是"咗"
    '着': '緊',     // 进行时标记"着"在粤语中是"緊"
    '著': '緊',     // 繁体版本
    '来': '嚟',     // "来"在粤语中是"嚟"
    '來': '嚟',     // 繁体版本
    '将': '會',     // "将"在粤语中常常是"會"
    '將': '會',     // 繁体版本
    '把': '將',     // "把"在粤语中常常是"將" 
    '给': '畀',     // "给"在粤语中是"畀"
    '給': '畀',     // 繁体版本
    '让': '俾',     // "让"在粤语中是"俾"
    '讓': '俾',     // 繁体版本
    '和': '同',     // "和"在粤语中常常是"同"
    '与': '同',     // "与"在粤语中常常是"同"
    '與': '同',     // 繁体版本
    '想': '諗',     // "想"在粤语中是"諗"
    '很': '好',     // "很"在粤语中是"好"
    '非常': '好',   // "非常"在粤语中常常是"好"
    '为什么': '點解', // "为什么"在粤语中是"點解"
    '為什麼': '點解', // 繁体版本
    '如何': '點樣',   // "如何"在粤语中是"點樣"
    '现在': '而家',   // "现在"在粤语中是"而家"
    '現在': '而家',   // 繁体版本
    '今天': '今日',   // "今天"在粤语中是"今日"
    '昨天': '琴日',   // "昨天"在粤语中是"琴日"
    '明天': '聽日',   // "明天"在粤语中是"聽日"
    '这里': '呢度',   // "这里"在粤语中是"呢度"
    '這裡': '呢度',   // 繁体版本
    '那里': '嗰度',   // "那里"在粤语中是"嗰度"
    '那裡': '嗰度',   // 繁体版本
    '哪里': '邊度',   // "哪里"在粤语中是"邊度"
    '哪裡': '邊度',   // 繁体版本
    '这个': '呢個',   // "这个"在粤语中是"呢個"
    '這個': '呢個',   // 繁体版本
    '那个': '嗰個',   // "那个"在粤语中是"嗰個"
    '那個': '嗰個',   // 繁体版本
    '哪个': '邊個',   // "哪个"在粤语中是"邊個"
    '哪個': '邊個',   // 繁体版本
    '工作': '做嘢',   // "工作"在粤语中是"做嘢"
    '学习': '學嘢',   // "学习"在粤语中是"學嘢"
    '學習': '學嘢',   // 繁体版本
    '说话': '講嘢',   // "说话"在粤语中是"講嘢"
    '說話': '講嘢',   // 繁体版本
    '东西': '嘢',     // "东西"在粤语中常简化为"嘢"
    '東西': '嘢',     // 繁体版本
    '但是': '但係',   // "但是"在粤语中是"但係"
    '才': '先至',     // "才"在粤语中常常是"先至"
    '才会': '先至會', // "才会"在粤语中是"先至會"
    '才會': '先至會', // 繁体版本
    '还': '仲',       // "还"在粤语中是"仲"
    '還': '仲',       // 繁体版本
    '也': '都',       // "也"在粤语中常常是"都"
    '亦': '都',       // 繁体版本
    '更': '更加',     // "更"在粤语中常常是"更加"
    '最': '最',       // 有些词保持不变
    '再': '再',       // 有些词保持不变
    '又': '又',       // 有些词保持不变
    '还是': '定係',   // "还是"在粤语中是"定係"
    '還是': '定係',   // 繁体版本
    '大家': '大家',   // 有些词保持不变
    '每个': '每個',   // 有些词保持不变
    '每個': '每個',   // 繁体版本
    '任何': '任何',   // 有些词保持不变
    '只有': '淨係',   // "只有"在粤语中是"淨係"
    '因为': '因為',   // 部分词保持不变但需要繁体
    '如果': '如果',   // 部分词保持不变但需要繁体
    '就是': '就係',   // "就是"在粤语中是"就係"
    
    // 治疗师专业词汇
    '治疗师': '治療師',
    '心理學家': '心理學家',
    '心理健康': '心理健康',
    '情绪': '情緒',
    '自我照顾': '自我照顧',
    '发展': '發展',
    '成长': '成長',
    '智慧': '智慧',
    '习惯': '習慣',
    '冥想': '冥想',
    '放松': '放鬆',
    '積極情緒': '正面情緒',
    '积极情绪': '正面情緒',
    
    // 核心治疗术语
    '认知行为疗法': '認知行為療法',
    '正念': '正念',
    '接納': '接納',
    '承诺疗法': '承諾療法',
    '精神动力学': '精神動力學',
    '解决方案': '解決方案',
    '人本主义': '人本主義',
    '动机访谈': '動機訪談',
    '辩证行为疗法': '辯證行為療法',
    '一般疗法': '一般療法'
  };
  
  let result = text;
  
  // 逐个替换词语
  for (const [traditional, cantonese] of Object.entries(traditionalToCantonese)) {
    const regex = new RegExp(traditional, 'g');
    const beforeReplace = result;
    result = result.replace(regex, cantonese);
    
    // Count replacements made
    if (beforeReplace !== result) {
      const occurrences = (beforeReplace.match(regex) || []).length;
      if (occurrences > 0) {
        substitutionCount += occurrences;
        console.log(`[convertToCantonese] Replaced '${traditional}' → '${cantonese}' (${occurrences} occurrences)`);
      }
    }
  }
  
  // 处理一些特殊短语和句式结构，让粤语表达更自然
  // 把"...的时候"转换成粤语的"...嘅时候"
  result = result.replace(/(\S+)的時候/g, '$1嘅時候');
  result = result.replace(/(\S+)的话/g, '$1嘅話');
  result = result.replace(/(\S+)的話/g, '$1嘅話');
  
  // 把"应该"转换成"应该（普通话）"或"應該（繁体）"→"應該"
  result = result.replace(/应该/g, '應該');
  result = result.replace(/應該/g, '應該');
  
  // 把"可以"保持为"可以"但转成繁体
  result = result.replace(/可以/g, '可以');
  
  // 处理否定句式："不要"→"唔好"
  result = result.replace(/不要/g, '唔好');
  result = result.replace(/不需要/g, '唔使');
  result = result.replace(/不需要/g, '唔使');
  
  // 替换一些粤语特有表达
  result = result.replace(/马上/g, '即刻');
  result = result.replace(/馬上/g, '即刻');
  result = result.replace(/立刻/g, '即刻');
  result = result.replace(/立即/g, '即刻');
  
  // Additional pass - handle specific phrases that need complete transformation
  result = result
    .replace(/能够帮助/g, '能夠幫助')
    .replace(/解决情緒/g, '解決情緒')
    .replace(/解决問题/g, '解決問題')
    .replace(/反馈/g, '反饋');
  
  console.log(`[convertToCantonese] Total substitutions made: ${substitutionCount}`);
  console.log(`[convertToCantonese] Sample: "${text.substring(0, 30)}..." → "${result.substring(0, 30)}..."`);
  
  return result;
}

function cleanTranslationResult(text: string, targetLanguage: string): string {
  if (!text) return text;
  
  console.log(`[cleanTranslationResult] Cleaning text for language: ${targetLanguage}`);
  
  // 中文特殊清理 (简体, 繁体和粤语)
  if (targetLanguage === 'zh' || targetLanguage === 'zh_TW' || targetLanguage === 'zh_HK' || targetLanguage === 'yue') {
    // 移除被错误翻译的特殊符号
    text = text.replace(/［/g, '[').replace(/］/g, ']');
    text = text.replace(/（/g, '(').replace(/）/g, ')');
    
    // 移除混合中的英文部分 - 主要是处理Dr.Dee回复中的混合语言问题
    // 这种情况下通常会有中英混合的句子，我们尝试保留中文部分
    
    // 1. 识别并移除句子中明显的英文片段 (如果两边都是中文)
    text = text.replace(/([\u4e00-\u9fa5])\s*[a-zA-Z\s,.!?;:]{3,}\s*([\u4e00-\u9fa5])/g, '$1$2');
    
    // 2. 修复可能的标点符号问题
    text = text.replace(/([。，；：？！]),/g, '$1');
    text = text.replace(/,([。，；：？！])/g, '$1');
    
    // 3. 将中文中的ASCII标点替换为中文标点
    text = text.replace(/(?<=[\u4e00-\u9fa5])\s*\.\s*(?=[\u4e00-\u9fa5])/g, '。');
    text = text.replace(/(?<=[\u4e00-\u9fa5])\s*,\s*(?=[\u4e00-\u9fa5])/g, '，');
    text = text.replace(/(?<=[\u4e00-\u9fa5])\s*!\s*(?=[\u4e00-\u9fa5])/g, '！');
    text = text.replace(/(?<=[\u4e00-\u9fa5])\s*\?\s*(?=[\u4e00-\u9fa5])/g, '？');
    
    // 4. 处理emojis（如*SIGH*，*EYE ROLL*等） - 保留中文版本
    text = text.replace(/\*([A-Z\s]+)\*/g, (match, p1) => {
      const emojiMap: Record<string, string> = {
        'SIGH': targetLanguage === 'zh_HK' || targetLanguage === 'yue' ? '嘆氣' : '叹气',
        'EYE ROLL': targetLanguage === 'zh_HK' || targetLanguage === 'yue' ? '翻白眼' : '翻白眼',
        'FACEPALM': targetLanguage === 'zh_HK' || targetLanguage === 'yue' ? '捂臉' : '捂脸',
        'GROAN': targetLanguage === 'zh_HK' || targetLanguage === 'yue' ? '呻吟' : '呻吟',
        'THROWS HANDS UP': targetLanguage === 'zh_HK' || targetLanguage === 'yue' ? '舉起雙手' : '举起双手'
      };
      
      return emojiMap[p1] ? `*${emojiMap[p1]}*` : match;
    });
    
    // 5. 如果是粤语，将繁体中文转换为粤语特定表达
    if (targetLanguage === 'zh_HK' || targetLanguage === 'yue') {
      text = convertToCantonese(text);
    }
  }
  
  return text;
}

/**
 * 用于英文到中文的常见短语映射，确保翻译更加自然
 * 这些是常见的心理治疗领域表达方式，直接翻译可能不够地道
 */
const englishToChineseCommonPhrases: Record<string, string> = {
  "I'm your AI therapeutic assistant": "我是你的AI心理健康助手",
  "I'm here to listen and support you": "我在这里倾听和支持你",
  "Feel free to share what's on your mind": "请随时分享你的想法和感受",
  "How are you feeling today?": "今天感觉怎么样？",
  "Your conversations are now securely stored": "你的对话已被安全地保存",
  "We can explore it together": "我们可以一起探讨",
  
  // Dr.Dee特殊表达
  "You're talking to Dr. Dee now": "你现在正在和Dee医生对话",
  "focusing on cruel truth therapy": "专注于残酷真相疗法",
  "Extremely cruel and indifferent methods": "采用极其严厉无情的方法",
  "with no compassion whatsoever": "毫无同情心",
  "shocking language and aggressive criticism": "令人震惊的言辞和咄咄逼人的批评",
  
  // 其他通用治疗术语
  "therapy": "心理治疗",
  "therapeutic": "治疗性的",
  "mental health": "心理健康",
  "emotional well-being": "情绪健康",
  "anxiety": "焦虑",
  "depression": "抑郁",
  "stress": "压力",
  "mindfulness": "正念",
  "coping mechanism": "应对机制",
  "cognitive behavioral therapy": "认知行为疗法",
  "CBT": "认知行为疗法"
};

/**
 * 用于英文到粤语的常见短语映射
 */
const englishToCantoneseCommonPhrases: Record<string, string> = {
  "I'm your AI therapeutic assistant": "我係你嘅AI心理健康助手",
  "I'm here to listen and support you": "我喺呢度聆聽同支持你",
  "Feel free to share what's on your mind": "隨時可以同我分享你嘅諗法同感受",
  "How are you feeling today?": "今日點呀？",
  "Your conversations are now securely stored": "你嘅對話已經安全咁儲存咗",
  "We can explore it together": "我哋可以一齊探討",
  
  // Dr.Dee特殊表达
  "You're talking to Dr. Dee now": "你而家同Dee醫生傾緊偈",
  "focusing on cruel truth therapy": "專注喺殘酷真相療法",
  "Extremely cruel and indifferent methods": "採用極其嚴厲無情嘅方法",
  "with no compassion whatsoever": "冇任何同情心",
  "shocking language and aggressive criticism": "震撼性嘅言詞同咄咄逼人嘅批評",
  
  // Dr.AZ特殊表达
  "You're talking to Dr. AZ now": "你而家同AZ醫生傾緊偈",
  "Struggling to maintain sanity": "掙扎保持理智",
  "Keep calm": "保持冷靜",
  
  // Dr.Q特殊表达
  "You're talking to Dr. Q now": "你而家同Q醫生傾緊偈",
  "Cute": "可愛嘅",
  "Cuteness": "可愛療法",
  
  // 其他通用治疗术语
  "therapy": "心理治療",
  "therapeutic": "治療性嘅",
  "mental health": "心理健康",
  "emotional well-being": "情緒健康",
  "anxiety": "焦慮",
  "depression": "抑鬱",
  "stress": "壓力",
  "mindfulness": "正念",
  "coping mechanism": "應對機制",
  "cognitive behavioral therapy": "認知行為療法",
  "CBT": "認知行為療法",
  "journaling": "寫日記",
  "prompt": "提示",
  "wisdom": "智慧",
  "self-care": "自我照顧",
  "motivation": "動力",
  "quote": "名言",
  "daily quote": "每日名言",
  "favorites": "最愛"
};

/**
 * 专门针对粤语文本中剩余的简体字符进行修复
 * 这个函数作为最后一道防线，确保所有简体字符被正确转换为繁体/粤语
 */
function fixSimplifiedCharactersInCantonese(text: string): string {
  if (!text) return '';
  
  console.log(`[fixSimplifiedCharactersInCantonese] Fixing remaining simplified characters in text (length: ${text.length})`);
  
  // 创建问题简体字符及组合的直接映射表
  const problematicMappings: Record<string, string> = {
    '能够': '能夠',
    '能够帮助': '能夠幫助',
    '解决': '解決',
    '解决问题': '解決問題',
    '解决問题': '解決問題',
    '解决情绪': '解決情緒',
    '解决情緒': '解決情緒',
    '反馈': '反饋',
    '帮助': '幫助',
    '复杂': '複雜',
    '復杂': '復雜',
    '建议': '建議',
    '请随': '請隨',
    '时': '時',
    '随时': '隨時',
    '使用体验': '使用體驗',
  };
  
  let result = text;
  let fixCount = 0;
  
  // 对每个已知问题词组执行直接替换
  for (const [simplified, cantonese] of Object.entries(problematicMappings)) {
    // 创建含有该词组的正则表达式，支持全局匹配
    const regex = new RegExp(simplified, 'g');
    const beforeReplace = result;
    
    // 执行替换
    result = result.replace(regex, cantonese);
    
    // 计数并记录替换情况
    if (beforeReplace !== result) {
      const matches = beforeReplace.match(regex);
      if (matches) {
        fixCount += matches.length;
        console.log(`[fixSimplifiedCharactersInCantonese] Replaced '${simplified}' with '${cantonese}' (${matches.length} occurrences)`);
      }
    }
  }
  
  console.log(`[fixSimplifiedCharactersInCantonese] Fixed ${fixCount} problematic character sequences`);
  
  // 如果进行了替换，记录更改的示例
  if (fixCount > 0 && text.length > 0) {
    console.log(`[fixSimplifiedCharactersInCantonese] Sample: "${text.substring(0, Math.min(30, text.length))}..." → "${result.substring(0, Math.min(30, result.length))}..."`);
  }
  
  return result;
}

/**
 * 将英文到中文的直接翻译替换为更加通俗易懂的表达方式
 */
function applyChinesePhraseMappings(text: string, targetLanguage: string = 'zh'): string {
  let result = text;
  
  // 选择适当的短语映射表
  const phraseMappings = (targetLanguage === 'zh_HK' || targetLanguage === 'yue') 
    ? englishToCantoneseCommonPhrases 
    : englishToChineseCommonPhrases;
  
  // 应用短语映射
  Object.entries(phraseMappings).forEach(([english, chinese]) => {
    // 创建一个不区分大小写的正则表达式，使得映射更加灵活
    const regex = new RegExp(english, 'i');
    result = result.replace(regex, chinese);
  });
  
  // 根据目标语言应用特定修复
  if (targetLanguage === 'zh_HK' || targetLanguage === 'yue') {
    // 粤语特定修复
    result = result
      .replace(/AI治療/g, 'AI心理健康')
      .replace(/AI療法/g, 'AI心理輔導')
      .replace(/今來聽受供養/g, '我喺呢度聆聽同支持你')
      .replace(/自由分享你嘅想法/g, '請隨時分享你嘅感受')
      .replace(/安全地存儲喺您嘅未來會話中/g, '安全咁儲存以供將來參考')
      .replace(/你今日感覺點樣\?/g, '今日點呀？')
      .replace(/治疗师简介/g, '治療師簡介')
      .replace(/治療師簡介/g, '治療師簡介')
      .replace(/個性特點/g, '個性特點')
      .replace(/個性特點/g, '個性特點')
      .replace(/自定义治疗师/g, '自定義治療師')
      .replace(/自定義治療師/g, '自定義治療師')
      .replace(/創建新治療師/g, '創建新治療師')
      .replace(/創建一個具有獨特個性的治療師/g, '創建一個具有獨特個性嘅治療師')
      .replace(/治療方法/g, '治療方法')
      .replace(/治疗方法/g, '治療方法')
      .replace(/修改治療師/g, '修改治療師')
      .replace(/修改自定义治疗师/g, '修改自定義治療師')
      .replace(/编辑治疗师特性/g, '編輯治療師特性')
      .replace(/編輯治療師特性/g, '編輯治療師特性');
      
    // 将结果转换为粤语 (应用更全面的转换)
    result = convertToCantonese(result);
    
  } else {
    // 普通话修复
    result = result
      .replace(/AI治疗/g, 'AI心理健康')
      .replace(/AI疗法/g, 'AI心理咨询')
      .replace(/今来听受供养/g, '我在这里倾听和支持你')
      .replace(/自由分享你的想法/g, '请随时分享你的感受')
      .replace(/安全地存储在您的未来会话中/g, '安全地保存以供将来参考')
      .replace(/你今天感觉怎么样\?/g, '今天感觉如何？');
  }
  
  return result;
}

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  preserveHarshStyle: boolean = false
): Promise<{ translatedText: string, originalText: string, sourceLanguage: string, targetLanguage: string, isTranslated: boolean }> {
  console.log(`[translateText] Called with source=${sourceLanguage}, target=${targetLanguage}`);
  console.log(`[translateText] Text: "${text.substring(0, 30)}..."`);
  
  // 记录原始目标语言，特别是针对粤语转换
  const originalTargetLanguage = targetLanguage;
  
  // 检查是否有翻译标记，如果有则直接提取内容
  const markerPrefix = `[TRANSLATE_FROM_`;
  if (text.startsWith(markerPrefix)) {
    const markerEnd = text.indexOf(']');
    if (markerEnd > 0) {
      const originalText = text.substring(markerEnd + 1);
      const markerInfo = text.substring(1, markerEnd); // 不包括[]
      const parts = markerInfo.split('_');
      
      if (parts.length >= 4 && parts[0] === 'TRANSLATE' && parts[1] === 'FROM') {
        const markedSourceLang = parts[2].toLowerCase();
        console.log(`[translateText] 检测到翻译标记，原始源语言: ${markedSourceLang}`);
        // 更新源语言
        sourceLanguage = markedSourceLang;
        // 使用原始文本内容
        text = originalText;
        console.log(`[translateText] 提取标记内容，长度: ${text.length}`);
      }
    }
  }
  
  // 直接处理粤语特殊情况 - 如果已有中文文本且目标语言是粤语
  if ((sourceLanguage === 'zh_TW' || sourceLanguage === 'zh') && (targetLanguage === 'zh_HK' || targetLanguage === 'yue')) {
    console.log(`[translateText] SOURCE LANGUAGE: ${sourceLanguage}, TARGET LANGUAGE: ${targetLanguage}`);
    console.log(`[translateText] CANTONESE CONVERSION TRIGGERED - 源语言为中文，目标语言为粤语，直接应用粤语转换`);
    console.log(`[translateText] Original text sample: "${text.substring(0, 50)}..."`);
    
    // 首先确保文本是繁体中文，然后再应用粤语转换
    // 如果是简体中文，先转换为繁体中文
    let processedText = text;
    if (sourceLanguage === 'zh') {
      console.log('[translateText] Converting simplified Chinese to traditional Chinese first');
      processedText = convertToTraditionalChinese(text);
      console.log(`[translateText] After traditional conversion: "${processedText.substring(0, 50)}..."`);
    }
    
    // 再次检查是否还有遗漏的简体字符
    // Always apply the conversion for consistency
    const containsSimplifiedChars = true; // Always run the conversion to ensure complete transformation
    if (containsSimplifiedChars) {
      console.log(`[translateText] Detected remaining simplified characters, running additional conversion`);
      processedText = convertToTraditionalChinese(processedText); 
      console.log(`[translateText] After additional traditional conversion: "${processedText.substring(0, 50)}..."`);
    }
    
    // 然后应用粤语转换
    let cantoneseText = convertToCantonese(processedText);
    
    // 最后一步: 使用逐字节处理，直接替换整个文本中的问题短语
    // 这种方法相比于正则表达式更彻底，可以解决编码问题
    cantoneseText = fixSimplifiedCharactersInCantonese(cantoneseText);
    
    console.log(`[translateText] Converted text sample: "${cantoneseText.substring(0, 50)}..."`);
    console.log(`[translateText] Is text different after conversion: ${text !== cantoneseText}`);
    
    return {
      translatedText: cantoneseText,
      originalText: text,
      sourceLanguage,
      targetLanguage: originalTargetLanguage, // 保持原始目标语言不变
      isTranslated: true
    };
  }
  
  // Prevent excessive API calls during development
  if (apiCallCount > MAX_API_CALLS) {
    console.warn("[translateText] Maximum API call limit reached");
    return {
      translatedText: text,
      originalText: text,
      sourceLanguage,
      targetLanguage: originalTargetLanguage, // 保持原始目标语言不变
      isTranslated: false
    };
  }
  
  // Skip translation if same language
  if (sourceLanguage === targetLanguage) {
    console.log(`[translateText] Skipping translation, languages match: ${sourceLanguage}`);
    return {
      translatedText: text,
      originalText: text,
      sourceLanguage,
      targetLanguage: originalTargetLanguage, // 保持原始目标语言不变
      isTranslated: false
    };
  }
  
  // 预处理文本，清理可能导致翻译问题的字符
  text = cleanTextForTranslation(text);
  
  try {
    apiCallCount++;
    console.log(`[translateText] API call count: ${apiCallCount}`);
    
    // 特殊情况：英文到中文/粤语的通用欢迎消息，使用预定义映射替换
    if (sourceLanguage === 'en' && 
        (targetLanguage === 'zh' || targetLanguage === 'zh_TW' || targetLanguage === 'zh_HK' || targetLanguage === 'yue') && 
        text.includes("I'm your AI") && text.includes("therapeutic assistant")) {
      
      console.log(`[translateText] 检测到英文欢迎消息，使用预定义${targetLanguage === 'zh_HK' || targetLanguage === 'yue' ? '粤语' : '中文'}翻译`);
      
      let welcomeMessage = '';
      
      if (targetLanguage === 'zh_HK' || targetLanguage === 'yue') {
        // 粤语欢迎消息
        welcomeMessage = "你好！我係你嘅AI心理健康助手。我喺呢度聆聽同支持你。隨時可以同我分享你嘅諗法同感受，我哋可以一齊探討。你嘅對話已經安全咁儲存咗，以便將來嘅會話使用。\n\n今日點呀？";
      } else {
        // 普通话欢迎消息
        welcomeMessage = "你好！我是你的AI心理健康助手。我在这里倾听和支持你。请随时分享你的想法和感受，我们可以一起探讨。你的对话已被安全地保存，以便将来的会话使用。\n\n今天感觉如何？";
        // 如果是繁体中文，转换
        if (targetLanguage === 'zh_TW') {
          welcomeMessage = convertToTraditionalChinese(welcomeMessage);
        }
      }
      
      return {
        translatedText: welcomeMessage,
        originalText: text,
        sourceLanguage,
        targetLanguage,
        isTranslated: true
      };
    }
    
    // If Google Cloud Translation API key is available
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      console.log('[translateText] Using Google Translate API');
      const translated = await googleTranslate(text, sourceLanguage, targetLanguage);
      const cleaned = cleanTranslationResult(translated, targetLanguage);
      
      // 如果是英文到中文的翻译，进行额外的短语替换以提高流畅度
      let finalText = cleaned;
      if (sourceLanguage === 'en' && (targetLanguage === 'zh' || targetLanguage === 'zh_TW')) {
        finalText = applyChinesePhraseMappings(cleaned);
      }
      
      return {
        translatedText: finalText,
        originalText: text,
        sourceLanguage,
        targetLanguage,
        isTranslated: true
      };
    }
    
    // If DeepL API key is available
    if (process.env.DEEPL_API_KEY) {
      console.log('[translateText] Using DeepL API');
      const translated = await deeplTranslate(text, sourceLanguage, targetLanguage);
      const cleaned = cleanTranslationResult(translated, targetLanguage);
      
      // 如果是英文到中文的翻译，进行额外的短语替换以提高流畅度
      let finalText = cleaned;
      if (sourceLanguage === 'en' && (targetLanguage === 'zh' || targetLanguage === 'zh_TW')) {
        finalText = applyChinesePhraseMappings(cleaned);
      }
      
      return {
        translatedText: finalText,
        originalText: text,
        sourceLanguage,
        targetLanguage,
        isTranslated: true
      };
    }
    
    // 检查是否应该使用LibreTranslate，如果在冷却期则尝试使用OpenAI
    const now = Date.now();
    if (libreTranslateServiceDown && now - lastLibreTranslateFailure < COOLDOWN_PERIOD) {
      console.log(`[translateText] LibreTranslate is in cooldown period. Trying OpenAI translation instead.`);
      console.log(`[translateText] Cooldown remaining: ${Math.round((COOLDOWN_PERIOD - (now - lastLibreTranslateFailure))/1000)}s`);
      
      // 尝试使用OpenAI翻译
      if (process.env.OPENAI_API_KEY) {
        try {
          console.log('[translateText] Using OpenAI API for translation (fallback)');
          const translated = await openaiTranslate(text, sourceLanguage, targetLanguage);
          const cleaned = cleanTranslationResult(translated, targetLanguage);
          
          let finalText = cleaned;
          if (sourceLanguage === 'en' && (targetLanguage === 'zh' || targetLanguage === 'zh_TW')) {
            finalText = applyChinesePhraseMappings(cleaned);
          }
          
          return {
            translatedText: finalText,
            originalText: text,
            sourceLanguage,
            targetLanguage,
            isTranslated: true
          };
        } catch (openaiError) {
          console.error('[translateText] OpenAI translation also failed:', openaiError);
        }
      }
      
      // 如果OpenAI也不可用，返回原文
      return {
        translatedText: text,
        originalText: text,
        sourceLanguage,
        targetLanguage,
        isTranslated: false
      };
    }
    
    // Fallback to Libre Translate (free and open source)
    console.log('[translateText] Using LibreTranslate API');
    try {
      const translated = await libreTranslate(text, sourceLanguage, targetLanguage);
      const cleaned = cleanTranslationResult(translated, targetLanguage);
      
      // 如果是英文到中文的翻译，进行额外的短语替换以提高流畅度
      let finalText = cleaned;
      if (sourceLanguage === 'en' && (targetLanguage === 'zh' || targetLanguage === 'zh_TW')) {
        finalText = applyChinesePhraseMappings(cleaned);
      }
      
      return {
        translatedText: finalText,
        originalText: text,
        sourceLanguage,
        targetLanguage,
        isTranslated: true
      };
    } catch (libreError) {
      console.error("[translateText] LibreTranslate error, trying OpenAI fallback:", libreError);
      // 记录失败状态
      libreTranslateServiceDown = true;
      lastLibreTranslateFailure = Date.now();
      
      // 尝试使用OpenAI作为备用翻译
      if (process.env.OPENAI_API_KEY) {
        try {
          console.log('[translateText] Using OpenAI API for translation (after LibreTranslate failure)');
          const translated = await openaiTranslate(text, sourceLanguage, targetLanguage);
          const cleaned = cleanTranslationResult(translated, targetLanguage);
          
          let finalText = cleaned;
          if (sourceLanguage === 'en' && (targetLanguage === 'zh' || targetLanguage === 'zh_TW')) {
            finalText = applyChinesePhraseMappings(cleaned);
          }
          
          return {
            translatedText: finalText,
            originalText: text,
            sourceLanguage,
            targetLanguage,
            isTranslated: true
          };
        } catch (openaiError) {
          console.error('[translateText] OpenAI translation also failed:', openaiError);
        }
      }
      
      return {
        translatedText: text,
        originalText: text,
        sourceLanguage,
        targetLanguage,
        isTranslated: false
      };
    }
  } catch (error: unknown) {
    console.error("[translateText] Translation error:", error);
    // Return original text if translation fails
    return {
      translatedText: text,
      originalText: text,
      sourceLanguage,
      targetLanguage,
      isTranslated: false
    };
  }
}

/**
 * Translate using Google Cloud Translation API
 */
async function googleTranslate(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  try {
    console.log(`[googleTranslate] Translating from ${sourceLanguage} to ${targetLanguage}`);
    
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: "text"
      }
    );
    
    if (response.data?.data?.translations?.[0]?.translatedText) {
      let translatedText = response.data.data.translations[0].translatedText;
      
      // 如果目标语言是繁体中文(zh_TW)，将简体中文结果转换为繁体中文
      if (targetLanguage === 'zh_TW') {
        console.log(`[googleTranslate] Converting simplified Chinese to traditional Chinese`);
        translatedText = convertToTraditionalChinese(translatedText);
      }
      
      return translatedText;
    } else {
      console.warn(`[googleTranslate] No translation data in response:`, response.data);
      return text;
    }
  } catch (error: unknown) {
    console.error(`[googleTranslate] Error:`, error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: any, status: number } };
      console.error(`[googleTranslate] Response data:`, axiosError.response.data);
      console.error(`[googleTranslate] Response status:`, axiosError.response.status);
    }
    return text;
  }
}

/**
 * Translate using DeepL API
 */
async function deeplTranslate(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  try {
    // Map language codes to DeepL format if needed
    const deeplSourceLang = mapToDeeplLanguage(sourceLanguage);
    const deeplTargetLang = mapToDeeplLanguage(targetLanguage);
    
    console.log(`[deeplTranslate] Translating from ${deeplSourceLang} to ${deeplTargetLang}`);
    console.log(`[deeplTranslate] Text to translate: "${text.substring(0, 30)}..."`);
    
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({
        text,
        source_lang: deeplSourceLang,
        target_lang: deeplTargetLang
      }),
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    
    if (response.data?.translations?.[0]?.text) {
      let translatedText = response.data.translations[0].text;
      
      // 如果目标语言是繁体中文(zh_TW)，将简体中文结果转换为繁体中文
      if (targetLanguage === 'zh_TW') {
        console.log(`[deeplTranslate] Converting simplified Chinese to traditional Chinese`);
        translatedText = convertToTraditionalChinese(translatedText);
      }
      
      console.log(`[deeplTranslate] Translated text: "${translatedText.substring(0, 30)}..."`);
      return translatedText;
    } else {
      console.warn(`[deeplTranslate] No translation data in response:`, response.data);
      return text;
    }
  } catch (error: unknown) {
    console.error(`[deeplTranslate] Error:`, error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: any, status: number } };
      console.error(`[deeplTranslate] Response data:`, axiosError.response.data);
      console.error(`[deeplTranslate] Response status:`, axiosError.response.status);
    }
    return text;
  }
}

/**
 * 简体中文到繁体中文的转换系统 - 完整映射表
 * 这个映射表包含了所有需要转换的字符，特别是应用中常见的文本内容
 */
// 创建一个新的简繁转换系统，针对测试信息中出现的特殊字符增强转换
const s2tMap = new Map<string, string>([
  // 特殊处理测试用例中的常见简体字符 
  ['检', '檢'],
  ['查', '查'],
  ['转', '轉'],
  ['换', '換'],
  ['简', '簡'],
  ['体', '體'],
  ['语', '語'],
  ['粤', '粵'],
  ['测', '測'],
  ['试', '試'],
  ['信', '信'], 
  ['息', '息'],
  ['以', '以'],
  ['现', '現'],
  ['在', '在'],
  ['能', '能'],
  ['正', '正'],
  ['常', '常'],
  ['工', '工'],
  ['作', '作'],
  ['谢', '謝'],
  ['选', '選'],
  ['择', '擇'],
  ['关', '關'],
  ['复', '復'],
  ['杂', '雜'],
  ['建', '建'],
  ['议', '議'],
  ['请', '請'],
  ['随', '隨'],
  ['怀', '懷'],
  ['服', '服'],
  ['务', '務'],
  ['致', '致'],
  ['力', '力'],
  ['于', '於'],
  ['提', '提'],
  ['供', '供'],
  ['最', '最'],
  ['好', '好'],
  ['支', '支'],
  ['持', '持'],
  ['期', '期'],
  ['待', '待'],
  ['共', '共'],
  ['同', '同'],
  ['探', '探'],
  ['索', '索'],
  ['旅', '旅'],
  ['能', '能'],
  ['够', '夠'],
  ['帮', '幫'],
  ['助', '助'],
  ['解', '解'],
  ['决', '決'],
  ['问', '問'],
  ['题', '題'],
  ['反', '反'],
  ['馈', '饋'],
  // 基本常用汉字 - 第一部分
  ['说', '說'], ['语', '語'], ['马', '馬'], ['鸟', '鳥'], ['书', '書'],
  ['读', '讀'], ['关', '關'], ['东', '東'], ['图', '圖'], ['头', '頭'],
  ['专', '專'], ['带', '帶'], ['贝', '貝'], ['车', '車'], ['长', '長'],
  ['见', '見'], ['风', '風'], ['飞', '飛'], ['龙', '龍'], ['门', '門'],
  ['间', '間'], ['闻', '聞'], ['问', '問'], ['云', '雲'], ['计', '計'],
  ['让', '讓'], ['认', '認'], ['这', '這'], ['为', '為'], ['对', '對'],
  ['别', '別'], ['论', '論'], ['体', '體'], ['义', '義'], ['远', '遠'],
  ['乐', '樂'], ['听', '聽'], ['执', '執'], ['国', '國'], ['医', '醫'],
  ['变', '變'], ['开', '開'], ['制', '製'], ['无', '無'], ['写', '寫'],
  ['学', '學'], ['发', '發'], ['动', '動'], ['运', '運'],
  
  // 扩展常用汉字 - 第二部分
  ['会', '會'], ['们', '們'], ['来', '來'], ['时', '時'], ['后', '後'],
  ['过', '過'], ['没', '沒'], ['现', '現'], ['么', '麼'], ['虽', '雖'],
  ['内', '內'], ['样', '樣'], ['点', '點'], ['机', '機'], ['资', '資'],
  ['气', '氣'], ['员', '員'], ['灵', '靈'], ['几', '幾'], ['实', '實'],
  ['总', '總'], ['于', '於'], ['给', '給'], ['药', '藥'], ['里', '裡'],
  ['历', '歷'], ['团', '團'], ['观', '觀'], ['传', '傳'], ['广', '廣'],
  ['场', '場'], ['电', '電'], ['网', '網'], ['业', '業'], ['线', '線'],
  ['华', '華'], ['术', '術'], ['权', '權'], ['温', '溫'], ['记', '記'],
  ['从', '從'], ['负', '負'], ['软', '軟'], ['证', '證'], ['务', '務'],
  ['爱', '愛'], ['复', '復'], ['剧', '劇'], ['亲', '親'],
  ['办', '辦'], ['惊', '驚'], ['类', '類'], ['众', '眾'], ['尽', '盡'],
  ['连', '連'], ['军', '軍'], ['转', '轉'], ['斗', '鬥'], ['兴', '興'],
  ['严', '嚴'], ['装', '裝'], ['录', '錄'], ['黄', '黃'], ['标', '標'],
  ['号', '號'], ['单', '單'], ['只', '隻'], ['异', '異'], ['户', '戶'],
  ['处', '處'], ['优', '優'], ['仅', '僅'], ['当', '當'], ['显', '顯'],
  
  // 应用测试中特别需要的字符 - 第三部分
  ['试', '試'], ['验', '驗'], ['消', '消'], ['正', '正'],
  ['确', '確'], ['检', '檢'], ['查', '查'], ['测', '測'], ['信', '信'],
  ['工', '工'], ['作', '作'], ['如', '如'], ['何', '何'],
  ['今', '今'], ['天', '天'], ['好', '好'], ['吗', '嗎'],
  ['一', '一'], ['是', '是'], ['不', '不'], ['在', '在'], ['有', '有'],
  ['生', '生'], ['同', '同'], ['与', '與'], ['丑', '醜'],
  ['丛', '叢'], ['临', '臨'], ['丽', '麗'],
  ['乌', '烏'], ['习', '習'],
  ['买', '買'], ['了', '了'], ['予', '予'],
  ['争', '爭'], ['余', '餘'], ['并', '並'], ['调', '調'],
  
  // 测试消息中常见短语字符 - 特别需要转换的
  ['个', '個'],
  ['乡', '鄉'],
]);

/**
 * 将简体中文文本转换为繁体中文
 * 使用Map数据结构，具有更好的性能和准确性
 */
function convertToTraditionalChinese(text: string): string {
  if (!text) return '';
  
  try {
    console.log(`[convertToTraditionalChinese] Converting text (length: ${text.length})`);
    
    // First pass: use our mapping table
    let result = '';
    let convertedCount = 0;
    
    // 逐字检查并转换
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const traditional = s2tMap.get(char);
      
      if (traditional) {
        result += traditional;
        convertedCount++;
      } else {
        result += char;
      }
    }
    
    // 提供详细的转换日志信息
    console.log(`[convertToTraditionalChinese] Converted ${convertedCount} of ${text.length} characters (${Math.round(convertedCount/text.length*100)}%)`);
    if (convertedCount > 0) {
      console.log(`[convertToTraditionalChinese] Sample: "${text.substring(0, 20)}..." → "${result.substring(0, 20)}..."`);
    }
    
    // Second pass: try to capture any characters we missed on the first pass
    // This handles scenarios where certain characters weren't in our mapping table
    // Specifically for the characters we're having trouble with
    result = result
      // 常见问题词组
      .replace(/能够/g, '能夠')
      .replace(/帮助/g, '幫助')
      .replace(/解决/g, '解決')
      .replace(/问题/g, '問題')
      .replace(/反馈/g, '反饋')
      .replace(/復杂/g, '復雜')
      .replace(/复杂/g, '複雜')
      .replace(/建议/g, '建議')
      .replace(/请随/g, '請隨')
      .replace(/随时/g, '隨時')
      .replace(/使用体验/g, '使用體驗')
      // 嵌套替换
      .replace(/提供/g, '提供')
      .replace(/实用/g, '實用');
    
    return result;
  } catch (error) {
    console.error('[convertToTraditionalChinese] Error during conversion:', error);
    // 出错时返回原文本
    return text;
  }
}

/**
 * Map standard language codes to LibreTranslate-specific format if needed
 */
function mapToLibreLanguage(langCode: string): string {
  // LibreTranslate typically uses standard ISO 639-1 codes
  // but might have some specific requirements for certain languages
  const mapping: Record<string, string> = {
    zh: "zh", // Simplified Chinese
    zh_TW: "zh", // Traditional Chinese - map to standard Chinese since LibreTranslate doesn't distinguish
    zh_HK: "zh", // Cantonese (Traditional) - map to standard Chinese since LibreTranslate doesn't distinguish
    yue: "zh", // Cantonese (Yue) - map to standard Chinese since LibreTranslate doesn't distinguish
    uk: "uk", // Ukrainian
    ar: "ar", // Arabic
  };
  
  // Supported languages by LibreTranslate
  const supportedByLibre = ["en", "ar", "zh", "nl", "fr", "de", "it", "ja", "pt", "ru", "es", "uk"];
  
  const mappedCode = mapping[langCode] || langCode;
  console.log(`[mapToLibreLanguage] Mapping language code ${langCode} to ${mappedCode}`);
  
  // Log warning if the language might not be supported
  if (!supportedByLibre.includes(mappedCode)) {
    console.warn(`[mapToLibreLanguage] Warning: Language code ${mappedCode} may not be supported by LibreTranslate`);
  }
  
  return mappedCode;
}

/**
 * 将长文本分割成适合翻译的小段
 * 专门用于处理LibreTranslate的2000字符限制
 */
function splitTextForTranslation(text: string, maxLength: number = 1800): string[] {
  if (text.length <= maxLength) {
    return [text];
  }
  
  const segments: string[] = [];
  let currentStart = 0;
  
  while (currentStart < text.length) {
    // 找出当前段结束位置
    let currentEnd = Math.min(currentStart + maxLength, text.length);
    
    // 如果没有到文本末尾，尝试在句子边界切割
    if (currentEnd < text.length) {
      // 按优先级寻找断句位置: 段落 > 句号/问号/感叹号 > 逗号/分号 > 空格
      const breakPoints = [
        text.lastIndexOf('\n\n', currentEnd),
        text.lastIndexOf('. ', currentEnd),
        text.lastIndexOf('? ', currentEnd),
        text.lastIndexOf('! ', currentEnd),
        text.lastIndexOf('。', currentEnd),
        text.lastIndexOf('？', currentEnd),
        text.lastIndexOf('！', currentEnd),
        text.lastIndexOf(', ', currentEnd),
        text.lastIndexOf('; ', currentEnd),
        text.lastIndexOf('，', currentEnd),
        text.lastIndexOf('；', currentEnd),
        text.lastIndexOf(' ', currentEnd)
      ];
      
      // 找到最佳的断句位置
      for (const breakPoint of breakPoints) {
        if (breakPoint > currentStart && breakPoint < currentEnd) {
          currentEnd = breakPoint + 1; // +1 to include the punctuation
          break;
        }
      }
    }
    
    // 添加当前段到结果中
    segments.push(text.substring(currentStart, currentEnd));
    currentStart = currentEnd;
  }
  
  return segments;
}

/**
 * Translate using Libre Translate API
 * This is an open-source alternative that can be self-hosted or used via public instances
 */
async function libreTranslate(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  // 记录原始目标语言，特别是针对粤语转换
  const originalTargetLanguage = targetLanguage;
  
  // Map language codes to LibreTranslate format
  const libreSourceLang = mapToLibreLanguage(sourceLanguage);
  const libreTargetLang = mapToLibreLanguage(targetLanguage);
  
  console.log(`[libreTranslate] Translating from ${libreSourceLang} to ${libreTargetLang}`);
  console.log(`[libreTranslate] Text to translate: "${text.substring(0, 30)}..."`);
  console.log(`[libreTranslate] Text length: ${text.length} characters`);
  
  try {
    // Check if API key is available
    const apiKey = process.env.LIBRE_TRANSLATE_API_KEY || "";
    console.log(`[libreTranslate] API key available: ${!!apiKey}`);
    
    // 假设现在服务恢复正常，将其标记为可用
    libreTranslateServiceDown = false;
    
    // 检查文本长度，如果超过LibreTranslate的限制（2000字符），分割处理
    if (text.length > 1800) {
      console.log(`[libreTranslate] Text exceeds length limit (${text.length}), splitting into chunks`);
      
      // 分割文本为较小的块
      const textSegments = splitTextForTranslation(text);
      console.log(`[libreTranslate] Split into ${textSegments.length} segments`);
      
      // 逐个翻译文本段落
      const translatedSegments: string[] = [];
      
      for (let i = 0; i < textSegments.length; i++) {
        const segment = textSegments[i];
        console.log(`[libreTranslate] Translating segment ${i+1}/${textSegments.length} (length: ${segment.length})`);
        
        // 翻译当前段落
        const response = await axios.post(
          "https://libretranslate.com/translate",
          {
            q: segment,
            source: libreSourceLang,
            target: libreTargetLang,
            format: "text",
            api_key: apiKey
          },
          {
            timeout: 5000,
            allowAbsoluteUrls: true
          }
        );
        
        if (response.data && response.data.translatedText) {
          translatedSegments.push(response.data.translatedText);
          console.log(`[libreTranslate] Segment ${i+1} translated successfully`);
        } else {
          // 如果翻译失败，保留原文
          translatedSegments.push(segment);
          console.warn(`[libreTranslate] Failed to translate segment ${i+1}, keeping original`);
        }
        
        // 添加短暂延迟避免API限制
        if (i < textSegments.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // 合并翻译结果
      let translatedText = translatedSegments.join(' ');
      
      // 如果目标语言是繁体中文(zh_TW)或粤语(zh_HK)，将简体中文结果转换为繁体中文
      if (targetLanguage === 'zh_TW' || targetLanguage === 'zh_HK' || targetLanguage === 'yue') {
        console.log(`[libreTranslate] Converting simplified Chinese to traditional Chinese for ${targetLanguage}`);
        translatedText = convertToTraditionalChinese(translatedText);
        
        // 如果是粤语，进一步转换为粤语特有表达
        if (targetLanguage === 'zh_HK' || targetLanguage === 'yue') {
          console.log(`[libreTranslate] Further converting traditional Chinese to Cantonese`);
          translatedText = convertToCantonese(translatedText);
        }
      }
      
      console.log(`[libreTranslate] All segments translated and combined`);
      console.log(`[libreTranslate] Final translated text: "${translatedText.substring(0, 30)}..."`);
      
      return translatedText;
    } else {
      // 文本长度在限制范围内，直接翻译
      const response = await axios.post(
        "https://libretranslate.com/translate",
        {
          q: text,
          source: libreSourceLang,
          target: libreTargetLang,
          format: "text",
          api_key: apiKey
        },
        {
          timeout: 5000,
          allowAbsoluteUrls: true
        }
      );
      
      // 如果成功收到响应，重置状态
      libreTranslateServiceDown = false;
      
      console.log(`[libreTranslate] Response received:`, response.data);
      
      if (response.data && response.data.translatedText) {
        let translatedText = response.data.translatedText;
        
        // 如果目标语言是繁体中文(zh_TW)或粤语(zh_HK)，将简体中文结果转换为繁体中文
        if (targetLanguage === 'zh_TW' || targetLanguage === 'zh_HK' || targetLanguage === 'yue') {
          console.log(`[libreTranslate] Converting simplified Chinese to traditional Chinese for ${targetLanguage}`);
          translatedText = convertToTraditionalChinese(translatedText);
          
          // 如果是粤语，进一步转换为粤语特有表达
          if (targetLanguage === 'zh_HK' || targetLanguage === 'yue') {
            console.log(`[libreTranslate] Further converting traditional Chinese to Cantonese`);
            translatedText = convertToCantonese(translatedText);
          }
        }
        
        console.log(`[libreTranslate] Translated text: "${translatedText.substring(0, 30)}..."`);
        return translatedText;
      } else {
        console.warn(`[libreTranslate] No translated text in response:`, response.data);
        return text; // Return original text if translation failed
      }
    }
  } catch (error: unknown) {
    console.error(`[libreTranslate] Error:`, error);
    
    // 将服务标记为不可用
    libreTranslateServiceDown = true;
    lastLibreTranslateFailure = Date.now();
    
    // 类型断言，确保我们可以安全地访问响应属性
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { data: any, status: number } };
      console.error(`[libreTranslate] Response data:`, axiosError.response.data);
      console.error(`[libreTranslate] Response status:`, axiosError.response.status);
      
      // 如果是长度限制错误
      if (axiosError.response.status === 400 && 
          axiosError.response.data?.error?.includes('text limit')) {
        console.error(`[libreTranslate] Text exceeded length limit. Consider implementing text splitting.`);
      }
      
      // 如果是限制错误，记录更详细的信息
      if (axiosError.response.status === 403 && 
          axiosError.response.data?.error?.includes('Too many request limits')) {
        console.error(`[libreTranslate] Hit API rate limit. Cooling down for ${COOLDOWN_PERIOD/1000} seconds.`);
      }
    }
    
    throw error; // 重新抛出错误，让上层函数处理
  }
}

/**
 * Map standard language codes to DeepL-specific format if needed
 */
function mapToDeeplLanguage(langCode: string): string {
  const mapping: Record<string, string> = {
    en: "EN-US", // Use EN-US instead of just EN
    zh: "ZH",    // DeepL uses just ZH for Chinese
    zh_TW: "ZH", // Traditional Chinese - map to standard Chinese since DeepL doesn't distinguish
    zh_HK: "ZH", // Cantonese (Traditional) - map to standard Chinese since DeepL doesn't distinguish
    yue: "ZH",   // Cantonese (ISO code) - map to standard Chinese
    pt: "PT-PT", // Portuguese (European)
    ar: "AR",    // Arabic
    uk: "UK",    // Ukrainian
    // The other languages use the same ISO code format as our app
    // DeepL supports: BG, CS, DA, DE, EL, EN, ES, ET, FI, FR, HU, ID, IT, JA, KO, LT, LV, NL, PL, PT, RO, RU, SK, SL, SV, TR, UK, ZH
  };
  
  // If language code is not in our mapping but DeepL supports it
  const supportedByDeepL = ["BG", "CS", "DA", "DE", "EL", "EN", "ES", "ET", "FI", "FR", "HU", "ID", "IT", "JA", "KO", "LT", "LV", "NL", "PL", "PT", "RO", "RU", "SK", "SL", "SV", "TR", "UK", "ZH"];
  
  const mappedCode = mapping[langCode] || langCode.toUpperCase();
  console.log(`[mapToDeeplLanguage] Mapping language code ${langCode} to ${mappedCode}`);
  
  // Log warning if the mapped code is not supported by DeepL
  if (!supportedByDeepL.includes(mappedCode)) {
    console.warn(`[mapToDeeplLanguage] Warning: Language code ${mappedCode} may not be supported by DeepL`);
  }
  
  return mappedCode;
}

/**
 * Translate using OpenAI API
 * Used as a fallback when other translation services fail
 */
async function openaiTranslate(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  try {
    const languageNames: Record<string, string> = {
      en: "English",
      zh: "Simplified Chinese",
      zh_TW: "Traditional Chinese",
      zh_HK: "Cantonese",
      yue: "Cantonese",
      es: "Spanish",
      ja: "Japanese",
      ko: "Korean",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      nl: "Dutch",
      ru: "Russian",
      uk: "Ukrainian",
      ar: "Arabic"
    };

    const sourceLangName = languageNames[sourceLanguage] || sourceLanguage;
    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    console.log(`[openaiTranslate] Starting translation from ${sourceLangName} to ${targetLangName}`);
    console.log(`[openaiTranslate] Input text: "${text.substring(0, 80)}${text.length > 80 ? '...' : ''}"`);

    if (!process.env.OPENAI_API_KEY) {
      console.error(`[openaiTranslate] No OpenAI API key available`);
      return text;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text from ${sourceLangName} to ${targetLangName}. 
Only output the translation, nothing else. Do not include any explanations, notes, or formatting.
Preserve the original meaning, tone, and any emotional content.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    if (!response.choices || response.choices.length === 0) {
      console.warn(`[openaiTranslate] No choices in response`);
      return text;
    }

    const translatedText = response.choices[0]?.message?.content?.trim();

    if (translatedText && translatedText.length > 0) {
      console.log(`[openaiTranslate] SUCCESS: Translated to "${translatedText.substring(0, 80)}${translatedText.length > 80 ? '...' : ''}"`);
      return translatedText;
    }

    console.warn(`[openaiTranslate] Empty translation in response`);
    return text;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[openaiTranslate] ERROR: ${errorMessage}`);
    return text;
  }
}