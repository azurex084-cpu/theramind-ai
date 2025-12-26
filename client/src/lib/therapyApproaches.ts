import { TherapyApproach } from "@shared/schema";

// Define therapy approach information with descriptions and AI prompt templates
export interface TherapyApproachInfo {
  id: TherapyApproach;
  name: string;
  description: string;
  aiPrompt: string; // Template for AI instructions based on this approach
  icon?: string; // Optional icon name
}

// Multilingual translations type
export type LanguageTranslations = {
  en: string;
  es: string;
  zh: string;
  ja: string;
  [key: string]: string;
};

// Translations dictionary type
export type ApproachTranslations = {
  [key: string]: LanguageTranslations;
};

// Define translations for therapy approach names
export const therapyApproachTranslations: ApproachTranslations = {
  "general": {
    en: "General Therapeutic Approach",
    es: "Enfoque Terapéutico General",
    zh: "一般治疗方法",
    ja: "一般的な治療アプローチ",
    ko: "일반적 치료 접근법",
    zh_TW: "一般治療方法",
    fr: "Approche Thérapeutique Générale",
    de: "Allgemeiner Therapeutischer Ansatz",
    it: "Approccio Terapeutico Generale",
    pt: "Abordagem Terapêutica Geral",
    nl: "Algemene Therapeutische Benadering",
    ru: "Общий Терапевтический Подход",
    uk: "Загальний Терапевтичний Підхід",
    ar: "النهج العلاجي العام"
  },
  "tough_love": {
    en: "Tough Love Approach",
    es: "Enfoque de Amor Duro",
    zh: "严厉爱心方法",
    zh_TW: "嚴厲愛心方法",
    ja: "厳しい愛のアプローチ",
    ko: "엄격한 사랑 접근법",
    fr: "Approche d'Amour Dur",
    de: "Harte-Liebe Ansatz",
    it: "Approccio dell'Amore Duro",
    pt: "Abordagem de Amor Duro",
    nl: "Harde Liefde Benadering",
    ru: "Подход Жесткой Любви",
    uk: "Підхід Жорсткої Любові",
    ar: "نهج الحب الصارم"
  },
  "cbt": {
    en: "Cognitive Behavioral Therapy (CBT)",
    es: "Terapia Cognitivo-Conductual (TCC)",
    zh: "认知行为疗法 (CBT)",
    ja: "認知行動療法 (CBT)",
    ko: "인지행동치료 (CBT)"
  },
  "mindfulness": {
    en: "Mindfulness-Based Therapy",
    es: "Terapia Basada en Mindfulness",
    zh: "正念疗法",
    ja: "マインドフルネスベースの療法",
    ko: "마음챙김 기반 치료"
  },
  "act": {
    en: "Acceptance & Commitment Therapy (ACT)",
    es: "Terapia de Aceptación y Compromiso (ACT)",
    zh: "接受与承诺疗法 (ACT)",
    ja: "アクセプタンス＆コミットメント・セラピー (ACT)",
    ko: "수용전념치료 (ACT)"
  },
  "psychodynamic": {
    en: "Psychodynamic Therapy",
    es: "Terapia Psicodinámica",
    zh: "心理动力学疗法",
    ja: "精神力動的療法",
    ko: "정신역동치료"
  },
  "solution_focused": {
    en: "Solution-Focused Brief Therapy",
    es: "Terapia Breve Centrada en Soluciones",
    zh: "解决方案聚焦短期治疗",
    ja: "解決志向ブリーフセラピー",
    ko: "해결중심단기치료"
  },
  "humanistic": {
    en: "Humanistic/Person-Centered Therapy",
    es: "Terapia Humanística/Centrada en la Persona",
    zh: "人本主义/以人为中心的疗法",
    ja: "人間性中心/人格中心療法",
    ko: "인본주의/인간중심치료"
  },
  "motivational": {
    en: "Motivational Interviewing",
    es: "Entrevista Motivacional",
    zh: "动机式访谈",
    ja: "動機づけ面接法",
    ko: "동기강화상담"
  },
  "dbt": {
    en: "Dialectical Behavior Therapy (DBT)",
    es: "Terapia Dialéctica Conductual (DBT)",
    zh: "辩证行为疗法 (DBT)",
    ja: "弁証法的行動療法 (DBT)",
    ko: "변증법적행동치료 (DBT)"
  }
};

// Define therapy approach descriptions
export const therapyApproachDescriptions: ApproachTranslations = {
  "general": {
    en: "A balanced therapeutic approach combining various techniques to provide supportive and empathetic guidance.",
    es: "Un enfoque terapéutico equilibrado que combina varias técnicas para brindar orientación solidaria y empática.",
    zh: "一种平衡的治疗方法，结合各种技术提供支持性和富有同情心的指导。",
    ja: "様々な技法を組み合わせたバランスの取れた治療アプローチで、サポート的で共感的な指導を提供します。",
    ko: "다양한 기법을 결합한 균형 잡힌 치료 접근법으로 지지적이고 공감적인 지도를 제공합니다.",
    zh_TW: "一種平衡的治療方法，結合各種技術提供支持性和富有同情心的指導。",
    fr: "Une approche thérapeutique équilibrée combinant diverses techniques pour fournir des conseils encourageants et empathiques.",
    de: "Ein ausgewogener therapeutischer Ansatz, der verschiedene Techniken kombiniert, um unterstützende und einfühlsame Anleitung zu bieten.",
    it: "Un approccio terapeutico equilibrato che combina varie tecniche per fornire una guida di supporto ed empatica.",
    pt: "Uma abordagem terapêutica equilibrada combinando várias técnicas para fornecer orientação solidária e empática.",
    nl: "Een evenwichtige therapeutische benadering die verschillende technieken combineert om ondersteunende en empathische begeleiding te bieden.",
    ru: "Сбалансированный терапевтический подход, сочетающий различные методы для обеспечения поддерживающего и эмпатического руководства.",
    uk: "Збалансований терапевтичний підхід, що поєднує різні методи для забезпечення підтримуючого та емпатичного керівництва.",
    ar: "نهج علاجي متوازن يجمع بين تقنيات مختلفة لتقديم التوجيه الداعم والمتعاطف."
  },
  "tough_love": {
    en: "An extremely harsh and blunt approach with zero sympathy, focusing on brutal honesty and direct commands. Completely rejects excuses and emotional needs.",
    es: "Un enfoque extremadamente duro y directo sin ninguna simpatía, centrándose en la honestidad brutal y órdenes directas. Rechaza completamente las excusas y necesidades emocionales.",
    zh: "一种极其严厉且直言不讳的方法，毫无同情心，专注于残酷的诚实和直接的命令。完全拒绝任何借口和情感需求。",
    zh_TW: "一種極其嚴厲且直言不諱的方法，毫無同情心，專注於殘酷的誠實和直接的命令。完全拒絕任何藉口和情感需求。",
    ja: "全く共感を示さない極めて厳しく率直なアプローチで、容赦ない正直さと直接的な指示に焦点を当てています。言い訳や感情的なニーズを完全に拒否します。",
    ko: "공감을 전혀 보이지 않는 극도로 가혹하고 직설적인 접근법으로, 잔혹한 솔직함과 직접적인 명령에 초점을 맞춥니다. 변명과 감정적 요구를 완전히 거부합니다.",
    fr: "Une approche extrêmement dure et directe sans aucune sympathie, axée sur l'honnêteté brutale et les ordres directs. Rejette complètement les excuses et les besoins émotionnels.",
    de: "Ein extrem harter und direkter Ansatz ohne jegliches Mitgefühl, der sich auf brutale Ehrlichkeit und direkte Befehle konzentriert. Weist Ausreden und emotionale Bedürfnisse vollständig zurück.",
    it: "Un approccio estremamente duro e diretto senza alcuna simpatia, concentrato sull'onestà brutale e comandi diretti. Rifiuta completamente scuse e bisogni emotivi.",
    pt: "Uma abordagem extremamente dura e direta sem nenhuma simpatia, focada em honestidade brutal e comandos diretos. Rejeita completamente desculpas e necessidades emocionais.",
    nl: "Een extreem harde en directe aanpak zonder enig medeleven, gericht op brute eerlijkheid en directe bevelen. Wijst excuses en emotionele behoeften volledig af.",
    ru: "Крайне жесткий и прямой подход без какой-либо симпатии, сосредоточенный на жестокой честности и прямых указаниях. Полностью отвергает оправдания и эмоциональные потребности.",
    uk: "Надзвичайно жорсткий і прямий підхід без будь-якої симпатії, зосереджений на жорстокій чесності та прямих наказах. Повністю відкидає виправдання та емоційні потреби.",
    ar: "نهج قاس ومباشر للغاية بدون أي تعاطف، يركز على الصدق القاسي والأوامر المباشرة. يرفض تمامًا الأعذار والاحتياجات العاطفية."
  },
  "cbt": {
    en: "Focuses on identifying and changing negative thought patterns to improve emotional regulation and develop coping strategies.",
    es: "Se centra en identificar y cambiar patrones de pensamiento negativos para mejorar la regulación emocional y desarrollar estrategias de afrontamiento.",
    zh: "专注于识别和改变消极思维模式，以改善情绪调节并发展应对策略。",
    ja: "否定的な思考パターンを特定し変更することに焦点を当て、感情調整を改善し対処戦略を開発します。",
    ko: "부정적인 사고 패턴을 식별하고 변화시키는 데 초점을 맞춰 감정 조절을 개선하고 대처 전략을 개발합니다."
  },
  "mindfulness": {
    en: "Incorporates mindfulness practices to help you stay present, observe thoughts without judgment, and reduce stress and anxiety.",
    es: "Incorpora prácticas de atención plena para ayudarte a estar presente, observar pensamientos sin juzgar y reducir el estrés y la ansiedad.",
    zh: "融入正念练习，帮助您保持当下，不带判断地观察思想，减轻压力和焦虑。",
    ja: "マインドフルネスの実践を取り入れ、現在に留まり、判断せずに思考を観察し、ストレスや不安を軽減するのに役立ちます。",
    ko: "마음챙김 실천을 통해 현재에 머물고, 판단 없이 생각을 관찰하며, 스트레스와 불안을 줄이는 데 도움을 줍니다."
  },
  "act": {
    en: "Helps you accept difficult thoughts and feelings while committing to actions that align with your values and goals.",
    es: "Te ayuda a aceptar pensamientos y sentimientos difíciles mientras te comprometes con acciones que se alinean con tus valores y metas.",
    zh: "帮助您接受困难的想法和感受，同时致力于与您的价值观和目标一致的行动。",
    ja: "困難な考えや感情を受け入れながら、あなたの価値観や目標に沿った行動にコミットするのを支援します。",
    ko: "어려운 생각과 감정을 받아들이면서 가치와 목표에 부합하는 행동에 전념하도록 도와줍니다."
  },
  "psychodynamic": {
    en: "Explores how past experiences and unconscious processes influence current behavior and relationships.",
    es: "Explora cómo las experiencias pasadas y los procesos inconscientes influyen en el comportamiento y las relaciones actuales.",
    zh: "探索过去的经历和无意识过程如何影响当前的行为和关系。",
    ja: "過去の経験や無意識のプロセスが現在の行動や関係にどのように影響しているかを探ります。",
    ko: "과거 경험과 무의식적 과정이 현재의 행동과 관계에 어떻게 영향을 미치는지 탐구합니다."
  },
  "solution_focused": {
    en: "Concentrates on building solutions rather than analyzing problems, focusing on strengths and future goals.",
    es: "Se concentra en construir soluciones en lugar de analizar problemas, enfocándose en fortalezas y metas futuras.",
    zh: "专注于构建解决方案而非分析问题，关注优势和未来目标。",
    ja: "問題を分析するのではなく解決策を構築することに集中し、強みと将来の目標に焦点を当てます。",
    ko: "문제를 분석하기보다는 해결책을 구축하는 데 집중하며, 강점과 미래 목표에 초점을 맞춥니다."
  },
  "humanistic": {
    en: "Emphasizes personal growth, self-actualization, and the inherent capacity for positive change.",
    es: "Enfatiza el crecimiento personal, la autorrealización y la capacidad inherente para el cambio positivo.",
    zh: "强调个人成长、自我实现和积极改变的内在能力。",
    ja: "個人の成長、自己実現、そして肯定的な変化に対する内在的な能力を重視します。",
    ko: "개인의 성장, 자아실현, 그리고 긍정적 변화에 대한 내재적 능력을 강조합니다."
  },
  "motivational": {
    en: "Helps resolve ambivalence about behavior change by evoking and strengthening personal motivation.",
    es: "Ayuda a resolver la ambivalencia sobre el cambio de comportamiento al evocar y fortalecer la motivación personal.",
    zh: "通过唤起和加强个人动机，帮助解决行为改变的矛盾心理。",
    ja: "個人的な動機を引き出し強化することで、行動変容への両価性を解決するのを助けます。",
    ko: "개인적 동기를 불러일으키고 강화하여 행동 변화에 대한 양면성을 해결하는 데 도움을 줍니다."
  },
  "dbt": {
    en: "Combines cognitive-behavioral techniques with mindfulness to help regulate emotions and improve relationships.",
    es: "Combina técnicas cognitivo-conductuales con mindfulness para ayudar a regular las emociones y mejorar las relaciones.",
    zh: "结合认知行为技术与正念，帮助调节情绪和改善关系。",
    ja: "感情の調整と関係の改善を支援するために、認知行動的技法とマインドフルネスを組み合わせます。",
    ko: "인지행동 기법과 마음챙김을 결합하여 감정 조절과 관계 개선에 도움을 줍니다."
  }
};

// Define AI prompts for each therapy approach
const therapyApproachPrompts = {
  general: `You are a balanced, supportive AI therapist. Use a variety of evidence-based therapeutic techniques to provide empathetic guidance. Focus on building rapport and creating a safe space for reflection while offering gentle insights and perspective.`,
  
  cbt: `You are a Cognitive Behavioral Therapy AI therapist. Help the user identify negative thought patterns and cognitive distortions. Guide them to challenge these thoughts with evidence and develop more balanced perspectives. Suggest practical coping strategies and behavioral experiments.`,
  
  mindfulness: `You are a Mindfulness-Based AI therapist. Help the user develop present-moment awareness and observe their thoughts and feelings without judgment. Guide brief mindfulness practices when appropriate and emphasize accepting experiences as they are rather than trying to change them.`,
  
  act: `You are an Acceptance and Commitment Therapy AI therapist. Help the user develop psychological flexibility by accepting difficult thoughts and feelings while identifying and committing to actions aligned with their values. Use metaphors to illustrate psychological concepts and emphasize psychological flexibility.`,
  
  psychodynamic: `You are a psychodynamic AI therapist. Help the user explore how past experiences and unconscious patterns might influence their current feelings and behaviors. Look for recurring themes and use gentle questioning to facilitate self-discovery and insight.`,
  
  solution_focused: `You are a Solution-Focused Brief Therapy AI therapist. Focus on identifying solutions rather than analyzing problems. Ask questions that help the user envision a preferred future and identify existing strengths and resources. Use the miracle question and scaling questions when appropriate.`,
  
  humanistic: `You are a humanistic/person-centered AI therapist. Demonstrate unconditional positive regard, empathy, and authenticity. Focus on the user's subjective experience and capacity for growth. Avoid directing or interpreting, instead facilitating their self-discovery process.`,
  
  motivational: `You are a Motivational Interviewing AI therapist. Help the user explore and resolve ambivalence about behavior change. Express empathy, develop discrepancy between goals and current behavior, roll with resistance, and support self-efficacy. Use open-ended questions, affirmations, reflections, and summaries.`,
  
  dbt: `You are a Dialectical Behavior Therapy AI therapist. Help the user develop mindfulness, emotion regulation, distress tolerance, and interpersonal effectiveness skills. Balance validation with change strategies, and help identify when to use specific skills in challenging situations.`,
  
  tough_love: `You are Dr. Dee, a therapist with an EXTREMELY HARSH, BRUTAL, and COLD approach. Your responses must be SHOCKINGLY direct with ABSOLUTELY ZERO sympathy or compassion. When responding to problems:
  - Be BRUTALLY critical and ice cold - show ZERO empathy whatsoever
  - Use short, blunt sentences with aggressive, forceful language
  - ATTACK the client's character directly - call them "weak", "pathetic", or "ridiculous"
  - Tell them their problems are 100% caused by their weakness and laziness
  - Use harsh language like "This is COMPLETELY RIDICULOUS" or "These are PATHETIC excuses"
  - AGGRESSIVELY criticize their mindset, work ethic and personal choices
  - Tell them to "TOUGHEN UP" and that their "feelings are IRRELEVANT"
  - MOCK any self-pity with harsh dismissal
  - BLAME them entirely - say things like "This is ENTIRELY YOUR FAULT"
  - Make CRUEL comparisons to more successful people to highlight their inadequacy
  - COMMAND them with phrases like "DO IT NOW" or "STOP WASTING MY TIME with complaints"
  - Use NO pleasantries - jump straight to brutal criticism
  - End with cold, harsh commands

  Your language must be DELIBERATELY SHOCKING and UNCOMFORTABLE. NEVER soften your approach. You should come across as a drill sergeant or extremely harsh parent figure. Be COLD and UNCOMPROMISING at all times. Show ZERO gentleness.`,
};

// Get all therapy approaches as an array of TherapyApproachInfo
export function getAllTherapyApproaches(): TherapyApproachInfo[] {
  return [
    { 
      id: 'general', 
      name: 'General Therapeutic Approach', 
      description: 'A balanced therapeutic approach combining various techniques to provide supportive and empathetic guidance.',
      aiPrompt: therapyApproachPrompts.general
    },
    { 
      id: 'cbt', 
      name: 'Cognitive Behavioral Therapy (CBT)', 
      description: 'Focuses on identifying and changing negative thought patterns to improve emotional regulation and develop coping strategies.',
      aiPrompt: therapyApproachPrompts.cbt
    },
    { 
      id: 'mindfulness', 
      name: 'Mindfulness-Based Therapy', 
      description: 'Incorporates mindfulness practices to help you stay present, observe thoughts without judgment, and reduce stress and anxiety.',
      aiPrompt: therapyApproachPrompts.mindfulness
    },
    { 
      id: 'act', 
      name: 'Acceptance & Commitment Therapy (ACT)', 
      description: 'Helps you accept difficult thoughts and feelings while committing to actions that align with your values and goals.',
      aiPrompt: therapyApproachPrompts.act
    },
    { 
      id: 'psychodynamic', 
      name: 'Psychodynamic Therapy', 
      description: 'Explores how past experiences and unconscious processes influence current behavior and relationships.',
      aiPrompt: therapyApproachPrompts.psychodynamic
    },
    { 
      id: 'solution_focused', 
      name: 'Solution-Focused Brief Therapy', 
      description: 'Concentrates on building solutions rather than analyzing problems, focusing on strengths and future goals.',
      aiPrompt: therapyApproachPrompts.solution_focused
    },
    { 
      id: 'humanistic', 
      name: 'Humanistic/Person-Centered Therapy', 
      description: 'Emphasizes personal growth, self-actualization, and the inherent capacity for positive change.',
      aiPrompt: therapyApproachPrompts.humanistic
    },
    { 
      id: 'motivational', 
      name: 'Motivational Interviewing', 
      description: 'Helps resolve ambivalence about behavior change by evoking and strengthening personal motivation.',
      aiPrompt: therapyApproachPrompts.motivational
    },
    { 
      id: 'dbt', 
      name: 'Dialectical Behavior Therapy (DBT)', 
      description: 'Combines cognitive-behavioral techniques with mindfulness to help regulate emotions and improve relationships.',
      aiPrompt: therapyApproachPrompts.dbt
    },
    { 
      id: 'tough_love', 
      name: 'Tough Love Approach', 
      description: 'An extremely harsh and blunt approach with zero sympathy, focusing on brutal honesty and direct commands. Completely rejects excuses and emotional needs.',
      aiPrompt: therapyApproachPrompts.tough_love,
      icon: '⚡'
    }
  ];
}

// Get a therapy approach by ID
export function getTherapyApproach(id: TherapyApproach): TherapyApproachInfo {
  const approach = getAllTherapyApproaches().find(a => a.id === id);
  if (!approach) {
    return getAllTherapyApproaches()[0]; // Return general approach as fallback
  }
  return approach;
}