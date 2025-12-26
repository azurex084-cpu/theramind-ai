// 获取支持的语言列表
export const supportedLanguages = ['en', 'zh', 'zh_TW', 'zh_HK', 'es', 'ja', 'ko', 'de', 'fr', 'it', 'pt', 'nl', 'ru', 'uk', 'ar'];

// 治疗方法多语言翻译
export const therapyApproachTranslations: Record<string, Record<string, string>> = {
  general: {
    en: 'General therapeutic approach',
    zh: '一般治疗方法',
    zh_TW: '一般治療方法',
    zh_HK: '一般治療方法',
    es: 'Enfoque terapéutico general',
    ja: '一般的な治療アプローチ',
    ko: '일반적 치료 접근법',
    de: 'Allgemeiner therapeutischer Ansatz',
    fr: 'Approche thérapeutique générale',
    it: 'Approccio terapeutico generale',
    pt: 'Abordagem terapêutica geral',
    nl: 'Algemene therapeutische benadering',
    ru: 'Общий терапевтический подход',
    uk: 'Загальний терапевтичний підхід',
    ar: 'النهج العلاجي العام'
  },
  integrative: {
    en: 'Integrative therapy',
    zh: '整合疗法',
    zh_TW: '整合療法',
    zh_HK: '綜合融合療法',
    es: 'Terapia integrativa',
    ja: '統合的療法',
    ko: '통합 치료',
    de: 'Integrative Therapie',
    fr: 'Thérapie intégrative',
    it: 'Terapia integrativa',
    pt: 'Terapia integrativa',
    nl: 'Integratieve therapie',
    ru: 'Интегративная терапия',
    uk: 'Інтегративна терапія',
    ar: 'العلاج التكاملي'
  },
  cbt: {
    en: 'Cognitive Behavioral Therapy',
    zh: '认知行为疗法',
    zh_TW: '認知行為療法',
    zh_HK: '認知行為療法',
    es: 'Terapia cognitivo-conductual',
    ja: '認知行動療法',
    ko: '인지행동치료',
    de: 'Kognitive Verhaltenstherapie',
    fr: 'Thérapie cognitivo-comportementale',
    it: 'Terapia cognitivo comportamentale',
    pt: 'Terapia cognitivo-comportamental',
    nl: 'Cognitieve gedragstherapie',
    ru: 'Когнитивно-поведенческая терапия',
    uk: 'Когнітивно-поведінкова терапія',
    ar: 'العلاج المعرفي السلوكي'
  },
  mindfulness: {
    en: 'Mindfulness-based approach',
    zh: '正念疗法',
    zh_TW: '正念療法',
    zh_HK: '正念療法',
    es: 'Enfoque basado en la atención plena',
    ja: 'マインドフルネスアプローチ',
    ko: '마음챙김 기반 접근법',
    de: 'Achtsamkeitsbasierter Ansatz',
    fr: 'Approche basée sur la pleine conscience',
    it: 'Approccio basato sulla mindfulness',
    pt: 'Abordagem baseada em mindfulness',
    nl: 'Mindfulness-gebaseerde benadering',
    ru: 'Подход, основанный на осознанности',
    uk: 'Підхід на основі усвідомленості',
    ar: 'نهج قائم على اليقظة الذهنية'
  },
  solution_focused: {
    en: 'Solution-focused therapy',
    zh: '解决方案聚焦疗法',
    zh_TW: '解決方案聚焦療法',
    zh_HK: '解決方案聚焦療法',
    es: 'Terapia centrada en soluciones',
    ja: '解決志向療法',
    ko: '해결중심치료',
    de: 'Lösungsorientierte Therapie',
    fr: 'Thérapie orientée vers les solutions',
    it: 'Terapia focalizzata sulla soluzione',
    pt: 'Terapia focada na solução',
    nl: 'Oplossingsgerichte therapie',
    ru: 'Терапия, ориентированная на решение',
    uk: 'Терапія, орієнтована на рішення',
    ar: 'العلاج الذي يركز على الحل'
  },
  psychodynamic: {
    en: 'Psychodynamic therapy',
    zh: '心理动力学疗法',
    zh_TW: '心理動力學療法',
    zh_HK: '心理動力學嘅治療方法',
    es: 'Terapia psicodinámica',
    ja: '精神力動的療法',
    ko: '정신역동치료',
    de: 'Psychodynamische Therapie',
    fr: 'Thérapie psychodynamique',
    it: 'Terapia psicodinamica',
    pt: 'Terapia psicodinâmica',
    nl: 'Psychodynamische therapie',
    ru: 'Психодинамическая терапия',
    uk: 'Психодинамічна терапія',
    ar: 'العلاج النفسي الديناميكي'
  },
  humanistic: {
    en: 'Humanistic therapy',
    zh: '人本主义疗法',
    zh_TW: '人本主義療法',
    zh_HK: '人本主義心理治療',
    es: 'Terapia humanista',
    ja: '人間性心理療法',
    ko: '인본주의 치료',
    de: 'Humanistische Therapie',
    fr: 'Thérapie humaniste',
    it: 'Terapia umanistica',
    pt: 'Terapia humanista',
    nl: 'Humanistische therapie',
    ru: 'Гуманистическая терапия',
    uk: 'Гуманістична терапія',
    ar: 'العلاج الإنساني'
  },
  person_centered: {
    en: 'Person-centered therapy',
    zh: '以人为中心的疗法',
    zh_TW: '以人為中心的療法',
    zh_HK: '以人為中心嘅療法',
    es: 'Terapia centrada en la persona',
    ja: '人間中心療法',
    ko: '인간중심치료',
    de: 'Personenzentrierte Therapie',
    fr: 'Thérapie centrée sur la personne',
    it: 'Terapia centrata sulla persona',
    pt: 'Terapia centrada na pessoa',
    nl: 'Persoonsgerichte therapie',
    ru: 'Личностно-ориентированная терапия',
    uk: 'Особистісно-орієнтована терапія',
    ar: 'العلاج المتمركز حول الشخص'
  },
  motivational: {
    en: 'Motivational interviewing',
    zh: '动机式访谈',
    zh_TW: '動機式訪談',
    zh_HK: '動機式傾談',
    es: 'Entrevista motivacional',
    ja: '動機づけ面接',
    ko: '동기강화상담',
    de: 'Motivierende Gesprächsführung',
    fr: 'Entretien motivationnel',
    it: 'Colloquio motivazionale',
    pt: 'Entrevista motivacional',
    nl: 'Motiverende gespreksvoering',
    ru: 'Мотивационное интервью',
    uk: 'Мотиваційне інтервю',
    ar: 'المقابلة التحفيزية'
  },
  motivational_interviewing: {
    en: 'Motivational interviewing',
    zh: '动机式访谈',
    zh_TW: '動機式訪談',
    zh_HK: '動機式傾談',
    es: 'Entrevista motivacional',
    ja: '動機づけ面接',
    ko: '동기강화상담',
    de: 'Motivierende Gesprächsführung',
    fr: 'Entretien motivationnel',
    it: 'Colloquio motivazionale',
    pt: 'Entrevista motivacional',
    nl: 'Motiverende gespreksvoering',
    ru: 'Мотивационное интервью',
    uk: 'Мотиваційне інтервю',
    ar: 'المقابلة التحفيزية'
  },
  act: {
    en: 'Acceptance & Commitment Therapy',
    zh: '接受与承诺疗法',
    zh_TW: '接受與承諾療法',
    zh_HK: '接受同承諾療法',
    es: 'Terapia de Aceptación y Compromiso',
    ja: 'アクセプタンス&コミットメントセラピー',
    ko: '수용전념치료',
    de: 'Akzeptanz- und Commitmenttherapie',
    fr: 'Thérapie d\'acceptation et d\'engagement',
    it: 'Terapia di accettazione e impegno',
    pt: 'Terapia de Aceitação e Compromisso',
    nl: 'Acceptance and Commitment Therapy',
    ru: 'Терапия принятия и ответственности',
    uk: 'Терапія прийняття та зобов\'язання',
    ar: 'العلاج بالقبول والالتزام'
  },
  dbt: {
    en: 'Dialectical Behavior Therapy',
    zh: '辩证行为疗法',
    zh_TW: '辯證行為療法',
    zh_HK: '辯證行為療法',
    es: 'Terapia dialéctica conductual',
    ja: '弁証法的行動療法',
    ko: '변증법적행동치료',
    de: 'Dialektische Verhaltenstherapie',
    fr: 'Thérapie comportementale dialectique',
    it: 'Terapia dialettico comportamentale',
    pt: 'Terapia comportamental dialética',
    nl: 'Dialectische gedragstherapie',
    ru: 'Диалектическая поведенческая терапия',
    uk: 'Діалектична поведінкова терапія',
    ar: 'العلاج السلوكي الجدلي'
  },
  eft: {
    en: 'Emotionally-Focused Therapy',
    zh: '情绪聚焦疗法',
    zh_TW: '情緒聚焦療法',
    zh_HK: '情緒聚焦療法',
    es: 'Terapia centrada en las emociones',
    ja: '感情焦点療法',
    ko: '정서중심치료',
    de: 'Emotionsfokussierte Therapie',
    fr: 'Thérapie centrée sur les émotions',
    it: 'Terapia focalizzata sulle emozioni',
    pt: 'Terapia focada nas emoções',
    nl: 'Emotionally-Focused Therapie',
    ru: 'Эмоционально-фокусированная терапия',
    uk: 'Емоційно-фокусована терапія',
    ar: 'العلاج المركز على العواطف'
  }
};

// 治疗师角色多语言翻译
export const therapistPersonaTranslations: Record<string, Record<string, string>> = {
  dr_alex: {
    en: 'Dr. Alex - Compassionate Guide',
    zh: '亚历克斯博士 - 富有同情心的引导者',
    zh_TW: '亞歷克斯博士 - 富有同情心的引導者',
    zh_HK: '亞歷克斯博士 - 富有同情心嘅引導者',
    es: 'Dr. Alex - Guía compasivo',
    ja: 'アレックス博士 - 思いやりのあるガイド',
    de: 'Dr. Alex - Einfühlsamer Berater',
    fr: 'Dr. Alex - Guide compatissant',
    it: 'Dr. Alex - Guida compassionevole',
    pt: 'Dr. Alex - Guia compassivo',
    nl: 'Dr. Alex - Meelevende gids',
    ru: 'Доктор Алекс - Сострадательный наставник',
    uk: 'Доктор Алекс - Співчутливий наставник',
    ar: 'د. أليكس - مرشد متعاطف'
  },
  dr_taylor: {
    en: 'Dr. Taylor - Practical Problem-Solver',
    zh: '泰勒博士 - 实用问题解决者',
    zh_TW: '泰勒博士 - 實用問題解決者',
    zh_HK: '泰勒博士 - 實用問題解決者',
    es: 'Dr. Taylor - Solucionador práctico de problemas',
    ja: 'テイラー博士 - 実践的な問題解決者',
    de: 'Dr. Taylor - Praktischer Problemlöser',
    fr: 'Dr. Taylor - Solutionneur pratique de problèmes',
    it: 'Dr. Taylor - Risolutore pratico di problemi',
    pt: 'Dr. Taylor - Solucionador prático de problemas',
    nl: 'Dr. Taylor - Praktische probleemoplosser',
    ru: 'Доктор Тейлор - Практичный решатель проблем',
    uk: 'Доктор Тейлор - Практичний вирішувач проблем',
    ar: 'د. تايلور - حلال المشاكل العملي'
  },
  dr_jordan: {
    en: 'Dr. Jordan - Insightful Analyzer',
    zh: '乔丹博士 - 有洞察力的分析师',
    zh_TW: '喬丹博士 - 有洞察力的分析師',
    zh_HK: '喬丹博士 - 有洞察力嘅分析師',
    es: 'Dr. Jordan - Analista perspicaz',
    ja: 'ジョーダン博士 - 洞察力のある分析者',
    de: 'Dr. Jordan - Einsichtsvoller Analytiker',
    fr: 'Dr. Jordan - Analyste perspicace',
    it: 'Dr. Jordan - Analista perspicace',
    pt: 'Dr. Jordan - Analista perspicaz',
    nl: 'Dr. Jordan - Inzichtvolle analyticus',
    ru: 'Доктор Джордан - Проницательный аналитик',
    uk: 'Доктор Джордан - Проникливий аналітик',
    ar: 'د. جوردان - محلل ذو بصيرة'
  },
  dr_morgan: {
    en: 'Dr. Morgan - Creative Innovator',
    zh: '摩根博士 - 创意创新者',
    zh_TW: '摩根博士 - 創意創新者',
    zh_HK: '摩根博士 - 創意創新嘅人',
    es: 'Dr. Morgan - Innovador creativo',
    ja: 'モーガン博士 - 創造的な革新者',
    de: 'Dr. Morgan - Kreativer Innovator',
    fr: 'Dr. Morgan - Innovateur créatif',
    it: 'Dr. Morgan - Innovatore creativo',
    pt: 'Dr. Morgan - Inovador criativo',
    nl: 'Dr. Morgan - Creatieve innovator',
    ru: 'Доктор Морган - Креативный новатор',
    uk: 'Доктор Морган - Креативний новатор',
    ar: 'د. مورغان - مبتكر مبدع'
  },
  dr_quinn: {
    en: 'Dr. Quinn - Empathetic Listener',
    zh: '奎因博士 - 善解人意的聆听者',
    zh_TW: '奎因博士 - 善解人意的聆聽者',
    zh_HK: '奎因博士 - 善解人意嘅聆聽者',
    es: 'Dr. Quinn - Oyente empático',
    ja: 'クイン博士 - 共感的な聞き手',
    de: 'Dr. Quinn - Empathischer Zuhörer',
    fr: 'Dr. Quinn - Auditeur empathique',
    it: 'Dr. Quinn - Ascoltatore empatico',
    pt: 'Dr. Quinn - Ouvinte empático',
    nl: 'Dr. Quinn - Empathische luisteraar',
    ru: 'Доктор Куинн - Эмпатичный слушатель',
    uk: 'Доктор Куінн - Емпатичний слухач',
    ar: 'د. كوين - مستمع متعاطف'
  },
  dr_avery: {
    en: 'Dr. Avery - Mindfulness Expert',
    zh: '艾弗里博士 - 正念专家',
    zh_TW: '艾弗里博士 - 正念專家',
    zh_HK: '艾弗里博士 - 正念嘅專家',
    es: 'Dr. Avery - Experto en atención plena',
    ja: 'エイブリー博士 - マインドフルネスの専門家',
    de: 'Dr. Avery - Achtsamkeitsexperte',
    fr: 'Dr. Avery - Expert en pleine conscience',
    it: 'Dr. Avery - Esperto di mindfulness',
    pt: 'Dr. Avery - Especialista em mindfulness',
    nl: 'Dr. Avery - Mindfulness-expert',
    ru: 'Доктор Эйвери - Эксперт по осознанности',
    uk: 'Доктор Ейвері - Експерт з усвідомленості',
    ar: 'د. أفيري - خبير في اليقظة الذهنية'
  }
};

// 治疗方法名称映射表，用于处理命名不一致的情况
const therapyApproachKeyMap: Record<string, string> = {
  // 标准化原始输入键
  'integrative therapy': 'integrative',
  'cognitive behavioral therapy': 'cbt',
  'mindfulness-based therapy': 'mindfulness',
  'acceptance & commitment therapy': 'act',
  'acceptance and commitment therapy': 'act',
  'psychodynamic therapy': 'psychodynamic',
  'solution-focused therapy': 'solution_focused',
  'solution focused therapy': 'solution_focused',
  'solution-focused brief therapy': 'solution_focused',
  'humanistic therapy': 'humanistic',
  'person-centered therapy': 'person_centered',
  'person centered therapy': 'person_centered',
  'motivational interviewing': 'motivational',
  'dialectical behavior therapy': 'dbt',
  'emotionally-focused therapy': 'eft',
  'emotionally focused therapy': 'eft',
  'tough love approach': 'tough_love'
};

// 获取治疗方法的翻译名称
export function getTherapyApproachName(approachKey: string, language: string = 'en'): string {
  if (!supportedLanguages.includes(language)) {
    language = 'en'; // 默认使用英语
  }
  
  // 标准化 approachKey
  const normalizedKey = approachKey.toLowerCase();
  
  // 尝试从映射表中获取标准化的键
  const mappedKey = therapyApproachKeyMap[normalizedKey] || normalizedKey;
  
  // 返回翻译，如果没有特定语言的翻译，则返回英语翻译
  if (therapyApproachTranslations[mappedKey]?.[language]) {
    return therapyApproachTranslations[mappedKey][language];
  } else if (therapyApproachTranslations[mappedKey]?.en) {
    return therapyApproachTranslations[mappedKey].en;
  } else {
    // 最后尝试直接使用原始key
    if (therapyApproachTranslations[approachKey]?.[language]) {
      return therapyApproachTranslations[approachKey][language];
    } else if (therapyApproachTranslations[approachKey]?.en) {
      return therapyApproachTranslations[approachKey].en;
    } else {
      return approachKey; // 如果没有找到翻译，返回原key
    }
  }
}

// 获取治疗师角色的翻译名称
export function getTherapistPersonaName(personaKey: string, language: string = 'en'): string {
  if (!supportedLanguages.includes(language)) {
    language = 'en'; // 默认使用英语
  }
  
  // 返回翻译，如果没有特定语言的翻译，则返回英语翻译
  if (therapistPersonaTranslations[personaKey]?.[language]) {
    return therapistPersonaTranslations[personaKey][language];
  } else if (therapistPersonaTranslations[personaKey]?.en) {
    return therapistPersonaTranslations[personaKey].en;
  } else {
    return personaKey; // 如果没有找到翻译，返回原key
  }
}