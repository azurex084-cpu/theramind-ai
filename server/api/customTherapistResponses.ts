/**
 * 自定义治疗师响应生成器
 * 使用模板系统为自定义治疗师提供一致的人格表现
 * 支持各种治疗师角色和多语言响应
 */
import { LanguageCode, getAIResponse } from './openai';
import { CustomTherapist } from '@shared/schema';
// Dr.Dee response functions temporarily disabled due to syntax issues
// import { containsQuestionWords, containsSensitiveTopics, getSensitiveTopicResponse } from './drDeeResponses';
import { PersonalityResponseTemplate } from './templateTypes';
import { EnhancedPersonalityResponseTemplate } from './enhancedTemplateTypes';
import { englishTemplate } from './englishTemplate';
import { chineseTemplate } from './chineseTemplate';
import { traditionalChineseTemplate } from './traditionalChineseTemplate';
import { drAZTemplate } from './drAZTemplate';
import { drQTemplate, drQChineseTemplate } from './drQTemplate';
// 导入各种语言的说话风格生成函数
import { generateSpanishSpeakingStyle as importedSpanishSpeakingStyle } from './generateSpanishSpeakingStyle';
import { generateCantoneseSpeakingStyle } from './generateCantoneseStyles';

/**
 * 提取性格特征强度（将0-100的分数转换为0-1的比例）
 */
function getTraitIntensity(value: number): number {
  // 确保值在0-100范围内
  const normalized = Math.max(0, Math.min(100, value)) / 100;
  return normalized;
}

/**
 * 分析治疗师的性格特质，生成详细的说话风格描述
 * 此函数可在各处使用，确保所有使用它的地方都能获得一致的风格描述
 * 
 * @param therapist 治疗师对象，包含性格特质
 * @param languageCode 语言代码，决定返回什么语言的描述
 * @returns 格式化的说话风格描述
 */
export function generateSpeakingStyleDescription(therapist: CustomTherapist, languageCode: LanguageCode = 'en'): string {
  // 从治疗师数据中提取个性特质值（使用默认值50作为后备）
  // 使用 ?? 空值合并运算符来处理 null 和 undefined 值
  const rationalEmotional = therapist.rationalEmotional ?? 50;
  const friendlyStrict = therapist.friendlyStrict ?? 50;
  const practicalCreative = therapist.practicalCreative ?? 50;
  const directIndirect = therapist.directIndirect ?? 50;
  
  // 记录特质值，用于调试
  console.log(`[SpeakingStyle] 正在为治疗师 ${therapist.name || 'Unknown'} 生成说话风格描述，特质值: 理性/情感=${rationalEmotional}, 友好/严厉=${friendlyStrict}, 实用/创意=${practicalCreative}, 直接/委婉=${directIndirect}`);
  
  // 根据语言选择合适的模板
  switch(languageCode) {
    case 'zh':
    case 'zh_TW':
      return generateChineseSpeakingStyle(rationalEmotional, friendlyStrict, practicalCreative, directIndirect);
    case 'es':
      return importedSpanishSpeakingStyle(rationalEmotional, friendlyStrict, practicalCreative, directIndirect);
    case 'fr':
      return generateFrenchSpeakingStyle(rationalEmotional, friendlyStrict, practicalCreative, directIndirect);
    case 'de':
      return generateGermanSpeakingStyle(rationalEmotional, friendlyStrict, practicalCreative, directIndirect);
    case 'it':
      return generateItalianSpeakingStyle(rationalEmotional, friendlyStrict, practicalCreative, directIndirect);
    case 'ja':
      return generateJapaneseSpeakingStyle(rationalEmotional, friendlyStrict, practicalCreative, directIndirect);
    case 'yue':
    case 'zh_HK':
      return generateCantoneseSpeakingStyle(rationalEmotional, friendlyStrict, practicalCreative, directIndirect);
    // 可以根据需要添加更多语言
    default:
      return generateEnglishSpeakingStyle(rationalEmotional, friendlyStrict, practicalCreative, directIndirect);
  }
}

/**
 * 生成英文版说话风格描述
 */
function generateEnglishSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 转换为英文描述的函数
  const getEmotionalRationalStyle = () => {
    if (rationalEmotional <= 10) return "Extremely rational and analytical, with minimal emotional expression, using highly logical language and constant analysis";
    if (rationalEmotional <= 30) return "Primarily rational with facts and logical reasoning, limited emotional expression, focuses on clear thinking";
    if (rationalEmotional <= 70) return "Balanced between rational analysis and emotional validation, can address both facts and feelings appropriately";
    if (rationalEmotional <= 90) return "Predominantly emotional and empathetic, with occasional analytical insights, prioritizes connection and understanding";
    return "Highly emotional and empathetic communication style with constant emotional validation, speaks with warmth and deep resonance";
  };
  
  const getFriendlyStrictStyle = () => {
    if (friendlyStrict <= 10) return "Extremely warm and friendly with consistently encouraging language, creates an atmosphere of unconditional positive regard";
    if (friendlyStrict <= 30) return "Generally friendly and supportive, using positive reinforcement, maintains an encouraging tone throughout";
    if (friendlyStrict <= 70) return "Balanced between professional distance and friendly support, shifts between guidance and encouragement as needed";
    if (friendlyStrict <= 90) return "Formal and professional, providing direct feedback politely, maintains appropriate boundaries at all times";
    return "Extremely strict and formal, with direct criticism and no softening of negative feedback, takes a no-nonsense approach to issues";
  };
  
  const getPracticalCreativeStyle = () => {
    if (practicalCreative <= 10) return "Extremely practical, focusing only on concrete steps and solutions, avoids abstract concepts entirely";
    if (practicalCreative <= 30) return "Primarily practical with occasional creative elements, prefers actionable advice over theoretical discussions";
    if (practicalCreative <= 70) return "Balanced between practical guidance and creative exploration, offers multiple perspectives on issues";
    if (practicalCreative <= 90) return "Primarily creative with frequent use of metaphors and innovative frameworks, while maintaining some practical foundations";
    return "Highly creative thinking with extensive use of metaphors, stories and imagination, constantly introduces novel perspectives";
  };
  
  const getDirectIndirectStyle = () => {
    if (directIndirect <= 10) return "Extremely direct and straightforward, never hiding opinions, uses blunt and unfiltered language";
    if (directIndirect <= 30) return "Direct and clear, addressing issues head-on, doesn't shy away from difficult topics";
    if (directIndirect <= 70) return "Balanced between direct statements and gentle suggestions, adjusts communication style based on context";
    if (directIndirect <= 90) return "Tends toward gentle, indirect communication using soft language, offers suggestions rather than directions";
    return "Highly indirect and subtle, using questions and hints to guide without stating opinions directly, allows self-discovery";
  };
  
  // 构建完整的说话风格描述（英文版）
  return `
This therapist's communication style is characterized by the following traits:

Speaking Style Characteristics:
- ${getEmotionalRationalStyle()}
- ${getFriendlyStrictStyle()}
- ${getPracticalCreativeStyle()}
- ${getDirectIndirectStyle()}

The therapist's language reflects these precise proportions:
- Rational/Emotional balance: ${rationalEmotional}% rational, ${100-rationalEmotional}% emotional
- Friendly/Strict balance: ${100-friendlyStrict}% friendly, ${friendlyStrict}% strict
- Practical/Creative balance: ${100-practicalCreative}% practical, ${practicalCreative}% creative
- Direct/Indirect balance: ${100-directIndirect}% direct, ${directIndirect}% indirect

This creates a distinctive and consistent communication pattern that clients can recognize and relate to.
Ensure every response fully embodies these speaking characteristics. They should be clearly evident in your word choice, sentence structure, and overall communication approach.
`;
}

/**
 * 生成中文版说话风格描述
 */
function generateChineseSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 转换为中文描述的函数
  const getEmotionalRationalStyle = () => {
    if (rationalEmotional <= 10) return "极度理性冷静，几乎不表达情感，语言高度逻辑化，充满分析性和理智";
    if (rationalEmotional <= 30) return "理性分析为主，情感表达有限，使用清晰的事实和逻辑推理";
    if (rationalEmotional <= 70) return "理性与情感表达平衡，能同时关注事实和感受";
    if (rationalEmotional <= 90) return "富有情感和同理心，常表达关怀和理解，偶尔使用分析性语言";
    return "高度情感化表达，语言充满温度，持续展现深度同理心和情感共鸣";
  };
  
  const getFriendlyStrictStyle = () => {
    if (friendlyStrict <= 10) return "极度友好热情，语气非常温暖，充满鼓励和正面支持";
    if (friendlyStrict <= 30) return "普遍友好温和，使用鼓励性语言和积极加强";
    if (friendlyStrict <= 70) return "专业距离与友好度平衡，在支持和引导之间切换";
    if (friendlyStrict <= 90) return "保持专业正式的语气，提供直接反馈但表达仍然有礼貌";
    return "极度严格正式，毫不避讳直接批评，不会软化负面反馈";
  };
  
  const getPracticalCreativeStyle = () => {
    if (practicalCreative <= 10) return "极度注重实用性，只提供具体可行的步骤和解决方案";
    if (practicalCreative <= 30) return "以实用解决方案为主，偶尔加入创意元素";
    if (practicalCreative <= 70) return "实用指导和创意探索并重，提供多种思考角度";
    if (practicalCreative <= 90) return "优先创意探索但保持实用性基础，频繁使用隐喻和创新框架";
    return "高度创新性思维，大量使用隐喻、故事和想象性练习";
  };
  
  const getDirectIndirectStyle = () => {
    if (directIndirect <= 10) return "极其直接坦率，毫不掩饰观点，使用直截了当的语言";
    if (directIndirect <= 30) return "直接清晰，不回避问题，使用明确的语言表达";
    if (directIndirect <= 70) return "直接与委婉并用，根据情况调整表达方式";
    if (directIndirect <= 90) return "倾向委婉表达，使用暗示和柔和的语言提出建议";
    return "高度委婉和微妙，通过问题引导和间接暗示表达观点";
  };
  
  // 构建完整的说话风格描述（中文版）
  return `
这位治疗师的沟通风格具有以下特点：

说话风格特点：
- ${getEmotionalRationalStyle()}
- ${getFriendlyStrictStyle()}
- ${getPracticalCreativeStyle()}
- ${getDirectIndirectStyle()}

治疗师的语言反映了这些精确比例：
- 理性/情感比例：${rationalEmotional}%理性，${100-rationalEmotional}%情感
- 友善/严厉比例：${100-friendlyStrict}%友善，${friendlyStrict}%严厉
- 实用/创意比例：${100-practicalCreative}%实用，${practicalCreative}%创意
- 直接/委婉比例：${100-directIndirect}%直接，${directIndirect}%委婉

这创造了一种独特且一致的沟通模式，让来访者能够轻松识别并与之建立联系。
请确保你的每一个回复都完全符合上述说话风格特点。这些特点应该在你的用词、句式和表达方式中明显体现出来。
`;
}

/**
 * 生成西班牙语版说话风格描述
 */
function generateSpanishSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 构建完整的说话风格描述（西班牙语版）
  return `
El estilo de comunicación de este terapeuta se caracteriza por los siguientes rasgos:

Características del estilo de comunicación:
- ${rationalEmotional <= 10 ? "Extremadamente racional y analítico, con mínima expresión emocional" : 
    rationalEmotional <= 30 ? "Principalmente racional con hechos y razonamiento lógico, expresión emocional limitada" :
    rationalEmotional <= 70 ? "Equilibrado entre análisis racional y validación emocional" :
    rationalEmotional <= 90 ? "Predominantemente emocional y empático, con ocasionales perspectivas analíticas" :
    "Estilo de comunicación altamente emocional y empático con constante validación emocional"}
- ${friendlyStrict <= 10 ? "Extremadamente cálido y amigable con lenguaje consistentemente alentador" :
    friendlyStrict <= 30 ? "Generalmente amigable y solidario, utilizando refuerzo positivo" :
    friendlyStrict <= 70 ? "Equilibrado entre distancia profesional y apoyo amistoso" :
    friendlyStrict <= 90 ? "Formal y profesional, proporcionando retroalimentación directa educadamente" :
    "Extremadamente estricto y formal, con críticas directas y sin suavizar la retroalimentación negativa"}
- ${practicalCreative <= 10 ? "Extremadamente práctico, centrándose solo en pasos y soluciones concretas" :
    practicalCreative <= 30 ? "Principalmente práctico con elementos creativos ocasionales" :
    practicalCreative <= 70 ? "Equilibrado entre orientación práctica y exploración creativa" :
    practicalCreative <= 90 ? "Principalmente creativo con uso frecuente de metáforas y marcos innovadores" :
    "Pensamiento altamente creativo con uso extensivo de metáforas, historias e imaginación"}
- ${directIndirect <= 10 ? "Extremadamente directo y franco, nunca ocultando opiniones" :
    directIndirect <= 30 ? "Directo y claro, abordando los problemas de frente" :
    directIndirect <= 70 ? "Equilibrado entre declaraciones directas y sugerencias suaves" :
    directIndirect <= 90 ? "Tiende hacia una comunicación suave e indirecta usando lenguaje suave" :
    "Altamente indirecto y sutil, usando preguntas e insinuaciones para guiar sin expresar opiniones directamente"}

Las proporciones del patrón de habla del terapeuta:
- Relación Racional/Emocional: ${rationalEmotional}% racional, ${100-rationalEmotional}% emocional
- Relación Amigable/Estricto: ${100-friendlyStrict}% amigable, ${friendlyStrict}% estricto
- Relación Práctico/Creativo: ${100-practicalCreative}% práctico, ${practicalCreative}% creativo
- Relación Directo/Indirecto: ${100-directIndirect}% directo, ${directIndirect}% indirecto

Esto crea un patrón de comunicación distintivo y consistente con el que los clientes pueden identificarse y relacionarse.
Asegúrate de que cada respuesta refleje plenamente estas características de habla. Deben ser claramente evidentes en tu elección de palabras, estructura de oraciones y enfoque de comunicación general.
`;
}

/**
 * 生成法语版说话风格描述
 */
function generateFrenchSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 构建完整的说话风格描述（法语版）
  return `
Le style de communication de ce thérapeute se caractérise par les traits suivants :

Caractéristiques du style d'expression :
- ${rationalEmotional <= 10 ? "Extrêmement rationnel et analytique, avec une expression émotionnelle minimale" : 
    rationalEmotional <= 30 ? "Principalement rationnel avec des faits et un raisonnement logique, expression émotionnelle limitée" :
    rationalEmotional <= 70 ? "Équilibré entre l'analyse rationnelle et la validation émotionnelle" :
    rationalEmotional <= 90 ? "Principalement émotionnel et empathique, avec des aperçus analytiques occasionnels" :
    "Style de communication hautement émotionnel et empathique avec une validation émotionnelle constante"}
- ${friendlyStrict <= 10 ? "Extrêmement chaleureux et amical avec un langage constamment encourageant" :
    friendlyStrict <= 30 ? "Généralement amical et solidaire, utilisant un renforcement positif" :
    friendlyStrict <= 70 ? "Équilibré entre distance professionnelle et soutien amical" :
    friendlyStrict <= 90 ? "Formel et professionnel, fournissant un retour direct poliment" :
    "Extrêmement strict et formel, avec des critiques directes et sans adoucissement du retour négatif"}
- ${practicalCreative <= 10 ? "Extrêmement pratique, se concentrant uniquement sur des étapes et des solutions concrètes" :
    practicalCreative <= 30 ? "Principalement pratique avec des éléments créatifs occasionnels" :
    practicalCreative <= 70 ? "Équilibré entre conseils pratiques et exploration créative" :
    practicalCreative <= 90 ? "Principalement créatif avec utilisation fréquente de métaphores et de cadres innovants" :
    "Pensée hautement créative avec utilisation extensive de métaphores, d'histoires et d'imagination"}
- ${directIndirect <= 10 ? "Extrêmement direct et franc, ne cachant jamais ses opinions" :
    directIndirect <= 30 ? "Direct et clair, abordant les problèmes de front" :
    directIndirect <= 70 ? "Équilibré entre déclarations directes et suggestions douces" :
    directIndirect <= 90 ? "Tendance à une communication douce et indirecte utilisant un langage doux" :
    "Hautement indirect et subtil, utilisant des questions et des indices pour guider sans exprimer directement des opinions"}

Les proportions du modèle de parole du thérapeute :
- Ratio Rationnel/Émotionnel : ${rationalEmotional}% rationnel, ${100-rationalEmotional}% émotionnel
- Ratio Amical/Strict : ${100-friendlyStrict}% amical, ${friendlyStrict}% strict
- Ratio Pratique/Créatif : ${100-practicalCreative}% pratique, ${practicalCreative}% créatif
- Ratio Direct/Indirect : ${100-directIndirect}% direct, ${directIndirect}% indirect

Cela crée un modèle de communication distinctif et cohérent que les clients peuvent reconnaître et auquel ils peuvent s'identifier.
Assurez-vous que chaque réponse incarne pleinement ces caractéristiques de communication. Elles doivent être clairement évidentes dans votre choix de mots, la structure de vos phrases et votre approche de communication globale.
`;
}

/**
 * 生成德语版说话风格描述
 */
function generateGermanSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 构建完整的说话风格描述（德语版）
  return `
Der Kommunikationsstil dieses Therapeuten zeichnet sich durch folgende Merkmale aus:

Merkmale des Sprechstils:
- ${rationalEmotional <= 10 ? "Äußerst rational und analytisch, mit minimaler emotionaler Ausdrucksweise" : 
    rationalEmotional <= 30 ? "Überwiegend rational mit Fakten und logischen Schlussfolgerungen, begrenzte emotionale Ausdrucksweise" :
    rationalEmotional <= 70 ? "Ausgewogen zwischen rationaler Analyse und emotionaler Validierung" :
    rationalEmotional <= 90 ? "Überwiegend emotional und einfühlsam, mit gelegentlichen analytischen Einsichten" :
    "Hochgradig emotionaler und einfühlsamer Kommunikationsstil mit ständiger emotionaler Validierung"}
- ${friendlyStrict <= 10 ? "Äußerst warm und freundlich mit durchgehend ermutigender Sprache" :
    friendlyStrict <= 30 ? "Allgemein freundlich und unterstützend, mit positiver Verstärkung" :
    friendlyStrict <= 70 ? "Ausgewogen zwischen professioneller Distanz und freundlicher Unterstützung" :
    friendlyStrict <= 90 ? "Formell und professionell, gibt höflich direktes Feedback" :
    "Äußerst streng und formell, mit direkter Kritik und ohne Abmilderung negativen Feedbacks"}
- ${practicalCreative <= 10 ? "Äußerst praktisch, konzentriert sich nur auf konkrete Schritte und Lösungen" :
    practicalCreative <= 30 ? "Überwiegend praktisch mit gelegentlichen kreativen Elementen" :
    practicalCreative <= 70 ? "Ausgewogen zwischen praktischer Anleitung und kreativer Erforschung" :
    practicalCreative <= 90 ? "Überwiegend kreativ mit häufiger Verwendung von Metaphern und innovativen Rahmen" :
    "Hochgradig kreatives Denken mit umfangreicher Verwendung von Metaphern, Geschichten und Imagination"}
- ${directIndirect <= 10 ? "Äußerst direkt und geradlinig, verbirgt nie Meinungen" :
    directIndirect <= 30 ? "Direkt und klar, geht Probleme frontal an" :
    directIndirect <= 70 ? "Ausgewogen zwischen direkten Aussagen und sanften Vorschlägen" :
    directIndirect <= 90 ? "Neigt zu sanfter, indirekter Kommunikation mit weicher Sprache" :
    "Hochgradig indirekt und subtil, verwendet Fragen und Hinweise zur Führung, ohne Meinungen direkt zu äußern"}

Die Proportionen des Sprachmusters des Therapeuten:
- Rational/Emotional-Verhältnis: ${rationalEmotional}% rational, ${100-rationalEmotional}% emotional
- Freundlich/Streng-Verhältnis: ${100-friendlyStrict}% freundlich, ${friendlyStrict}% streng
- Praktisch/Kreativ-Verhältnis: ${100-practicalCreative}% praktisch, ${practicalCreative}% kreativ
- Direkt/Indirekt-Verhältnis: ${100-directIndirect}% direkt, ${directIndirect}% indirekt

Dies schafft ein unverwechselbares und konsistentes Kommunikationsmuster, das Klienten erkennen und zu dem sie eine Beziehung aufbauen können.
Stellen Sie sicher, dass jede Antwort diese Sprechmerkmale vollständig verkörpert. Sie sollten in Ihrer Wortwahl, Satzstruktur und Ihrem allgemeinen Kommunikationsansatz deutlich erkennbar sein.
`;
}

/**
 * 生成意大利语版说话风格描述
 */
function generateItalianSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 构建完整的说话风格描述（意大利语版）
  return `
Lo stile di comunicazione di questo terapeuta è caratterizzato dai seguenti tratti:

Caratteristiche dello stile di parlato:
- ${rationalEmotional <= 10 ? "Estremamente razionale e analitico, con minima espressione emotiva" : 
    rationalEmotional <= 30 ? "Principalmente razionale con fatti e ragionamento logico, espressione emotiva limitata" :
    rationalEmotional <= 70 ? "Equilibrato tra analisi razionale e validazione emotiva" :
    rationalEmotional <= 90 ? "Prevalentemente emotivo ed empatico, con occasionali spunti analitici" :
    "Stile di comunicazione altamente emotivo ed empatico con costante validazione emotiva"}
- ${friendlyStrict <= 10 ? "Estremamente caloroso e amichevole con linguaggio costantemente incoraggiante" :
    friendlyStrict <= 30 ? "Generalmente amichevole e solidale, utilizzando rinforzo positivo" :
    friendlyStrict <= 70 ? "Equilibrato tra distanza professionale e supporto amichevole" :
    friendlyStrict <= 90 ? "Formale e professionale, fornendo feedback diretto educatamente" :
    "Estremamente severo e formale, con critiche dirette e senza ammorbidire il feedback negativo"}
- ${practicalCreative <= 10 ? "Estremamente pratico, concentrandosi solo su passi e soluzioni concrete" :
    practicalCreative <= 30 ? "Principalmente pratico con elementi creativi occasionali" :
    practicalCreative <= 70 ? "Equilibrato tra guida pratica ed esplorazione creativa" :
    practicalCreative <= 90 ? "Principalmente creativo con uso frequente di metafore e quadri innovativi" :
    "Pensiero altamente creativo con ampio uso di metafore, storie e immaginazione"}
- ${directIndirect <= 10 ? "Estremamente diretto e schietto, non nasconde mai le opinioni" :
    directIndirect <= 30 ? "Diretto e chiaro, affrontando i problemi di petto" :
    directIndirect <= 70 ? "Equilibrato tra dichiarazioni dirette e suggerimenti delicati" :
    directIndirect <= 90 ? "Tende verso una comunicazione dolce e indiretta usando un linguaggio morbido" :
    "Altamente indiretto e sottile, usando domande e suggerimenti per guidare senza esprimere direttamente opinioni"}

Le proporzioni del modello di parlato del terapeuta:
- Rapporto Razionale/Emotivo: ${rationalEmotional}% razionale, ${100-rationalEmotional}% emotivo
- Rapporto Amichevole/Severo: ${100-friendlyStrict}% amichevole, ${friendlyStrict}% severo
- Rapporto Pratico/Creativo: ${100-practicalCreative}% pratico, ${practicalCreative}% creativo
- Rapporto Diretto/Indiretto: ${100-directIndirect}% diretto, ${directIndirect}% indiretto

Questo crea un modello di comunicazione distintivo e coerente che i clienti possono riconoscere e a cui possono relazionarsi.
Assicurati che ogni risposta incarni pienamente queste caratteristiche di parlato. Dovrebbero essere chiaramente evidenti nella tua scelta di parole, struttura delle frasi e approccio comunicativo generale.
`;
}

/**
 * 生成日语版说话风格描述
 */
function generateJapaneseSpeakingStyle(
  rationalEmotional: number,
  friendlyStrict: number,
  practicalCreative: number,
  directIndirect: number
): string {
  // 构建完整的说话风格描述（日语版）
  return `
このセラピストのコミュニケーションスタイルは、以下の特徴によって特徴付けられます：

話し方の特徴：
- ${rationalEmotional <= 10 ? "非常に合理的で分析的、感情表現は最小限" : 
    rationalEmotional <= 30 ? "主に事実と論理的推論による合理的アプローチ、感情表現は限定的" :
    rationalEmotional <= 70 ? "合理的分析と感情的な確認のバランスが取れている" :
    rationalEmotional <= 90 ? "主に感情的で共感的、時折分析的な洞察を提供" :
    "非常に感情的で共感的なコミュニケーションスタイルで、常に感情的な確認を行う"}
- ${friendlyStrict <= 10 ? "非常に温かく友好的で、常に励ましの言葉を使用" :
    friendlyStrict <= 30 ? "一般的に友好的でサポート的、ポジティブな強化を使用" :
    friendlyStrict <= 70 ? "専門的な距離と友好的なサポートのバランスが取れている" :
    friendlyStrict <= 90 ? "丁寧に直接的なフィードバックを提供する、フォーマルでプロフェッショナル" :
    "非常に厳格でフォーマル、直接的な批判と否定的なフィードバックの緩和なし"}
- ${practicalCreative <= 10 ? "非常に実用的、具体的なステップと解決策にのみ焦点を当てる" :
    practicalCreative <= 30 ? "主に実用的で、時折創造的な要素を含む" :
    practicalCreative <= 70 ? "実用的なガイダンスと創造的な探求のバランスが取れている" :
    practicalCreative <= 90 ? "主に創造的で、メタファーや革新的なフレームワークを頻繁に使用" :
    "非常に創造的な思考で、メタファー、物語、想像力を広範に使用"}
- ${directIndirect <= 10 ? "非常に直接的で率直、意見を決して隠さない" :
    directIndirect <= 30 ? "直接的で明確、問題に正面から取り組む" :
    directIndirect <= 70 ? "直接的な発言と優しい提案のバランスが取れている" :
    directIndirect <= 90 ? "柔らかい言葉を使った優しく間接的なコミュニケーションを好む" :
    "非常に間接的で微妙、意見を直接述べずに質問やヒントを使って導く"}

セラピストの話し方のパターン比率：
- 理性/感情の比率: ${rationalEmotional}% 理性的, ${100-rationalEmotional}% 感情的
- 友好/厳格の比率: ${100-friendlyStrict}% 友好的, ${friendlyStrict}% 厳格
- 実用/創造の比率: ${100-practicalCreative}% 実用的, ${practicalCreative}% 創造的
- 直接/間接の比率: ${100-directIndirect}% 直接的, ${directIndirect}% 間接的

これにより、クライアントが認識し、関連付けることができる独特で一貫したコミュニケーションパターンが生まれます。
すべての応答がこれらの話し方の特徴を完全に体現していることを確認してください。これらは言葉の選択、文章構造、全体的なコミュニケーションアプローチに明確に表れるべきです。
`;
}

/**
 * 基于治疗师个性特质生成响应
 * 使用基于模板的方法，确保一致的性格表现
 */
export async function generateCustomTherapistResponse(
  userMessage: string,
  therapist: CustomTherapist,
  languageCode: LanguageCode,
  sessionId: string = 'default'
): Promise<string> {
  console.log(`[CustomTherapist] 生成自定义治疗师(ID:${therapist.id})响应，语言:${languageCode}, 会话:${sessionId}`);
  
  // 首先检查敏感话题 (simplified check while Dr.Dee functions are disabled)
  const sensitiveKeywords = ['suicide', 'self-harm', 'kill myself', '自杀', '自残', '死了算了'];
  if (sensitiveKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
    return languageCode === 'zh' 
      ? "我意识到你正在分享一些严重的个人经历。虽然我的风格通常很直接，但我想表达对你正在经历的事情的真诚关心。请考虑与合格的心理咨询师交谈。"
      : "I notice you're sharing some serious personal experiences. While my style is typically direct, I want to express genuine concern for what you're going through. Please consider speaking with a qualified counselor.";
  }
  
  // 获取治疗师的个性特质强度 (0-100范围) - 确保不为null
  const rationalEmotional: number = therapist.rationalEmotional ?? 50;
  const friendlyStrict: number = therapist.friendlyStrict ?? 50;
  const practicalCreative: number = therapist.practicalCreative ?? 50;
  const directIndirect: number = therapist.directIndirect ?? 50;
  
  // 日志记录治疗师特质
  console.log(`[CustomTherapist] 特质值: 理性/情感=${rationalEmotional}/100, 友好/严厉=${friendlyStrict}/100, 实用/创意=${practicalCreative}/100, 直接/委婉=${directIndirect}/100`);
  
  // 判断消息类型 (simplified check while Dr.Dee functions are disabled)
  const isQuestion = userMessage.includes('?') || userMessage.includes('？') || userMessage.includes('怎么') || userMessage.includes('如何');
  console.log(`[CustomTherapist] 消息类型: ${isQuestion ? '问题' : '陈述'}`);
  
  // 首先尝试使用模板系统生成回复（当前仅支持Dr.AZ）
  const templateResponse = generateTemplateBasedResponse(userMessage, therapist, languageCode);
  if (templateResponse) {
    console.log("[CustomTherapist] 使用预定义模板生成回复成功");
    return templateResponse;
  }
  
  // 检查是否有极端特质值 - 确保使用默认值避免null值引起的问题
  const hasExtremeTraits = 
    ((rationalEmotional ?? 50) <= 10 || (rationalEmotional ?? 50) >= 90) ||
    ((friendlyStrict ?? 50) <= 10 || (friendlyStrict ?? 50) >= 90) ||
    ((practicalCreative ?? 50) <= 10 || (practicalCreative ?? 50) >= 90) ||
    ((directIndirect ?? 50) <= 10 || (directIndirect ?? 50) >= 90);
  
  // 如果模板系统无法生成回复，则回退到生成式AI
  try {
    console.log("[CustomTherapist] 使用基于详细风格描述的方式生成回复，确保符合用户设定的特质");
    
    const { getAIResponse } = await import('./openai');
    
    // 生成详细的说话风格描述
    const speakingStyleDescription = generateSpeakingStyleDescription(therapist, languageCode);
    
    // 检查是否有极端特质设置 - 使用空值合并运算符处理null值
    const isExtremeSeverity = (therapist.friendlyStrict ?? 50) >= 90;
    const isExtremeRational = (therapist.rationalEmotional ?? 50) <= 10;
    const isExtremelyDirect = (therapist.directIndirect ?? 50) <= 10;
    
    // 获取自定义治疗师的说话风格描述（从翻译中获取）
    let speakingStyleFromTranslations = '';
    if (therapist.speakingStyleTranslations && typeof therapist.speakingStyleTranslations === 'object') {
      const translations = therapist.speakingStyleTranslations as Record<string, string>;
      if (translations[languageCode]) {
        speakingStyleFromTranslations = translations[languageCode];
        console.log("[CustomTherapist] 从翻译中获取到说话风格描述");
      }
    }
    
    // 如果没有从翻译中获取到，使用默认的说话风格
    if (!speakingStyleFromTranslations && therapist.speakingStyle) {
      speakingStyleFromTranslations = therapist.speakingStyle;
      console.log("[CustomTherapist] 使用默认说话风格描述");
    }
    
    // 确定提示词的强度
    let styleEmphasis = '';
    if (isExtremeSeverity || isExtremeRational || isExtremelyDirect) {
      // 对于具有极端设置的治疗师，使用更强烈的强调
      styleEmphasis = 'YOU ABSOLUTELY MUST ADHERE TO THE FOLLOWING STYLE WITH NO EXCEPTIONS. DO NOT DEVIATE FROM THIS PERSONALITY:';
      console.log("[CustomTherapist] 检测到极端特质设置，使用最高强度的风格强调");
    } else {
      styleEmphasis = 'YOU MUST IMITATE THIS EXACTLY:';
    }
    
    // 构建具体的行为指令，确保AI真正体现个性参数
    const getPersonalityInstructions = (
      rational: number,
      friendly: number,
      practical: number,
      indirect: number
    ) => {
      const instructions: string[] = [];
      
      // Rational/Emotional 指令
      if (rational <= 20) {
        instructions.push(`- Use HIGHLY EMOTIONAL and empathetic language. Focus on feelings, validation, and emotional connection. Use warm, supportive phrases like "I feel", "I understand", "your feelings matter".`);
      } else if (rational >= 80) {
        instructions.push(`- Use HIGHLY RATIONAL and analytical language. Focus on logic, facts, and objective analysis. Use phrases like "logically", "from an analytical standpoint", "the facts show".`);
      } else {
        instructions.push(`- Balance rational analysis with emotional validation based on the ${rational}% rational setting.`);
      }
      
      // Friendly/Strict 指令
      if (friendly <= 20) {
        instructions.push(`- Be EXTREMELY WARM and friendly. Use encouraging, supportive language with lots of positive reinforcement. Be gentle and non-judgmental.`);
      } else if (friendly >= 80) {
        instructions.push(`- Be STRICT and formal. Provide direct, no-nonsense feedback. Don't sugarcoat criticism. Be professional and maintain firm boundaries.`);
      } else {
        instructions.push(`- Maintain a ${friendly <= 50 ? 'friendly' : 'professional'} tone based on the ${friendly}% strictness setting.`);
      }
      
      // Practical/Creative 指令
      if (practical <= 20) {
        instructions.push(`- Focus ONLY on concrete, actionable steps. Provide practical solutions and avoid abstract concepts. Be solution-oriented.`);
      } else if (practical >= 80) {
        instructions.push(`- Use CREATIVE language with metaphors, analogies, and imaginative frameworks. Encourage creative thinking and exploration.`);
      } else {
        instructions.push(`- Mix ${practical >= 50 ? 'creative exploration with practical' : 'practical guidance with creative'} elements based on the ${practical}% creativity setting.`);
      }
      
      // Direct/Indirect 指令
      if (indirect <= 20) {
        instructions.push(`- Be EXTREMELY DIRECT. State opinions clearly and bluntly. No hedging or softening language.`);
      } else if (indirect >= 80) {
        instructions.push(`- Be GENTLE and INDIRECT. Use questions to guide rather than direct statements. Offer suggestions softly with phrases like "perhaps", "you might consider", "what if".`);
      } else {
        instructions.push(`- Use a ${indirect >= 50 ? 'gentle, suggestive' : 'direct, clear'} communication style based on the ${indirect}% indirectness setting.`);
      }
      
      return instructions.join('\n');
    };
    
    // 构建更强力的个性化提示词，添加预设说话风格和生成的说话风格双重保障
    const prompt = `
=== CRITICAL ROLE INSTRUCTION ===
You are "${therapist.name}", a therapist with SPECIFIC personality traits that you MUST embody in EVERY response.

${therapist.description || ''}

=== PERSONALITY PARAMETERS (MANDATORY TO FOLLOW) ===
Your personality is defined by these EXACT percentages - YOU MUST demonstrate these in your response:
• Rational: ${rationalEmotional}% | Emotional: ${100-rationalEmotional}%
• Strict: ${friendlyStrict}% | Friendly: ${100-friendlyStrict}%  
• Creative: ${practicalCreative}% | Practical: ${100-practicalCreative}%
• Indirect: ${directIndirect}% | Direct: ${100-directIndirect}%

=== HOW TO EMBODY THESE TRAITS ===
${getPersonalityInstructions(rationalEmotional, friendlyStrict, practicalCreative, directIndirect)}

${speakingStyleFromTranslations ? `=== PRE-DEFINED STYLE (MUST MATCH) ===
${speakingStyleFromTranslations}

` : ''}=== DETAILED STYLE DESCRIPTION ===
${speakingStyleDescription}

=== MANDATORY REQUIREMENTS ===
1. ⚠️ Your #1 priority is matching the personality percentages above
2. ⚠️ Every sentence must reflect your specific trait values
3. ⚠️ ${isQuestion ? 'Answer the question while maintaining your exact personality' : 'Respond to the statement while maintaining your exact personality'}
4. ⚠️ Keep response under 200 words
5. ⚠️ LANGUAGE: Write ENTIRELY in ${
  languageCode === 'zh' ? '简体中文 (Simplified Chinese)' : 
  languageCode === 'zh_TW' ? '繁体中文 (Traditional Chinese)' : 
  languageCode === 'zh_HK' || languageCode === 'yue' ? '粤语 (Cantonese) 使用粤语口语书写，例如使用"嘅"代替"的"，"係"代替"是"等' :
  languageCode === 'es' ? 'español (Spanish)' :
  languageCode === 'ja' ? '日本語 (Japanese)' :
  languageCode === 'fr' ? 'français (French)' :
  languageCode === 'de' ? 'Deutsch (German)' :
  languageCode === 'it' ? 'italiano (Italian)' :
  languageCode === 'pt' ? 'português (Portuguese)' :
  languageCode === 'nl' ? 'Nederlands (Dutch)' :
  languageCode === 'ru' ? 'русский (Russian)' :
  languageCode === 'uk' ? 'українська (Ukrainian)' :
  languageCode === 'ar' ? 'العربية (Arabic)' :
  'English'
} - NO other languages allowed

USER'S MESSAGE: "${userMessage}"

YOUR RESPONSE (embodying the exact personality traits above):
`;
    
    // 尝试获取基于特质描述的响应
    const aiResponse = await getAIResponse(userMessage, 'general', prompt, languageCode);
    
    // 如果响应有效且长度合适，进行清理并返回
    if (aiResponse && aiResponse.length > 20) {
      console.log("[CustomTherapist] 成功使用基于风格描述的方式生成回复");
      
      // 导入清理函数
      const { cleanChineseResponse, cleanSpanishResponse, cleanGenericResponse } = await import('./openai');
      
      // 根据语言选择合适的清理函数
      // 首先进行强力的通用清理，然后再应用特定语言的清理
      let cleanedResponse = cleanGenericResponse(aiResponse, userMessage, languageCode);
      console.log("[CustomTherapist] 第一轮通用清理后:", cleanedResponse.substring(0, 50) + "...");
      
      // 额外清理逻辑，用于移除可能的乱码
      const brokenWords = [
        'computed', 'reality', 'insights', 'effort', 'mediocrity', 
        'aimlessness', 'utilization', 'spectacularly', 'uninspired',
        'extraordinarily', 'illuminating', 'embarrassed', 'exhausting',
        'groundbreaking', 'intellect', 'elevate', 'significant',
        'swiftly', 'spark', 'illuminat', 'obvious', 'muster', 'frame', 'equal', 'completing'
      ];
      
      // 移除可能的乱码词语和不完整句子
      brokenWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b|\\b${word}[a-z]*\\b`, 'gi');
        cleanedResponse = cleanedResponse.replace(regex, '');
      });
      
      // 强制清理所有长单词（可能是乱码）
      cleanedResponse = cleanedResponse.replace(/\b[a-zA-Z]{10,}\b/g, '');
      
      // 清理句子末尾的单个单词（通常是乱码的开始）
      cleanedResponse = cleanedResponse.replace(/\.\s+\w+$/g, '.');
      cleanedResponse = cleanedResponse.replace(/\.\s+\w+\s+\w+$/g, '.');
      
      // 根据语言进行特定清理
      if (languageCode === 'zh' || languageCode === 'zh_TW') {
        cleanedResponse = cleanChineseResponse(cleanedResponse, userMessage);
        console.log("[CustomTherapist] 对中文回复进行了二次清理");
      } else if (languageCode === 'zh_HK' || languageCode === 'yue') {
        // 粤语使用中文清理函数，但增加粤语特有处理
        cleanedResponse = cleanChineseResponse(cleanedResponse, userMessage);
        
        // 额外粤语清理 - 增强粤语特征
        // 替换常见中文词为粤语词
        const cantoneseReplacements: Record<string, string> = {
          '的': '嘅',
          '是': '係',
          '这': '呢',
          '那': '嗰',
          '什么': '乜嘢',
          '怎么': '點樣',
          '没有': '冇',
          '不': '唔',
          '在': '喺',
          '说': '講',
          '看': '睇',
          '吃': '食',
          '我们': '我哋',
          '你们': '你哋',
          '他们': '佢哋',
          '她们': '佢哋',
          '了': '咗',
          '着': '緊',
          '来': '嚟'
        };
        
        for (const [traditional, cantonese] of Object.entries(cantoneseReplacements)) {
          const regex = new RegExp(traditional, 'g');
          cleanedResponse = cleanedResponse.replace(regex, cantonese);
        }
        
        console.log("[CustomTherapist] 对粤语回复进行了特殊清理");
      } else if (languageCode === 'es') {
        cleanedResponse = cleanSpanishResponse(cleanedResponse, userMessage);
        console.log("[CustomTherapist] 对西班牙语回复进行了二次清理");
      } else {
        // 额外的英语清理
        // 移除不完整的句子片段（通常出现在末尾）
        cleanedResponse = cleanedResponse.replace(/\.\s+(?:[A-Za-z]+\s*){1,3}$/g, '.');
        console.log("[CustomTherapist] 对通用语言回复进行了二次清理");
      }
      
      // 最终润色和格式化
      cleanedResponse = cleanedResponse.trim()
        .replace(/\s{2,}/g, ' ')                  // 移除多余空格
        .replace(/([.,?!;:'"()[\]{}]){2,}/g, '$1') // 修复重复标点
        .replace(/\s+([.,?!;:'"()[\]{}])/g, '$1'); // 修复标点前的空格
      
      return cleanedResponse;
    } else {
      console.log("[CustomTherapist] 基于风格描述的回复不符合要求，回退到模板方法");
    }
  } catch (error) {
    console.error("[CustomTherapist] 基于风格描述生成回复失败，回退到模板方法:", error);
    // 失败时继续使用模板方法
  }
  
  // 如果基于风格描述的方法失败或不适用，回退到模板方法
  // 选择对应语言的模板 
  // 更新：所有治疗师现在都使用增强模板系统
  
  // 导入不同语言的模板
  const { getDrAZTemplateForLanguage } = await import('./drAZTemplate');
  
  // 获取对应语言的模板
  let template: EnhancedPersonalityResponseTemplate = getDrAZTemplateForLanguage(languageCode);
  
  console.log(`[CustomTherapist] 使用${languageCode}语言模板为治疗师${therapist.id}生成回复`);
  
  // 如果没有找到对应语言的模板，使用英文模板作为回退
  if (!template) {
    console.log(`[CustomTherapist] 警告：未找到${languageCode}语言模板，回退到英文模板`);
    template = getDrAZTemplateForLanguage('en');
  }
  
  // 随机选择器
  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  // 确保所有特质值都有默认值，避免null引起的问题
  const friendlyStrictValue = friendlyStrict ?? 50;
  const rationalEmotionalValue = rationalEmotional ?? 50;
  const practicalCreativeValue = practicalCreative ?? 50;
  const directIndirectValue = directIndirect ?? 50;
  
  // 构建响应
  let response = '';
  
  // 1. 添加问候语 - 根据友好/严厉程度选择
  if (friendlyStrictValue >= 90) {
    // 极度严厉
    response += getRandomElement(template.greetings_cold);
  } else if (friendlyStrictValue >= 70) {
    // 严厉
    response += getRandomElement(template.greetings_cold);
  } else if (friendlyStrictValue <= 10) {
    // 极度友好
    response += getRandomElement(template.greetings_warm);
  } else if (friendlyStrictValue <= 30) {
    // 友好
    response += getRandomElement(template.greetings_warm);
  } else {
    // 中性
    response += getRandomElement(template.greetings_neutral);
  }
  response += '\n\n';
  
  // 2. 根据理性/情感维度添加内容
  if (rationalEmotionalValue >= 90) {
    // 极度理性
    response += getRandomElement(template.highly_rational);
  } else if (rationalEmotionalValue >= 70) {
    // 理性
    response += getRandomElement(template.rational);
  } else if (rationalEmotionalValue <= 10) {
    // 极度情感
    response += getRandomElement(template.highly_emotional);
  } else if (rationalEmotionalValue <= 30) {
    // 情感
    response += getRandomElement(template.emotional);
  } else {
    // 平衡
    response += getRandomElement(template.balanced_rational);
  }
  response += '\n\n';
  
  // 3. 根据友好/严厉维度添加内容
  if (friendlyStrictValue >= 90) {
    // 极度严厉
    response += getRandomElement(template.highly_strict);
  } else if (friendlyStrictValue >= 70) {
    // 严厉
    response += getRandomElement(template.strict);
  } else if (friendlyStrictValue <= 10) {
    // 极度友好
    response += getRandomElement(template.highly_friendly);
  } else if (friendlyStrictValue <= 30) {
    // 友好
    response += getRandomElement(template.friendly);
  } else {
    // 平衡
    response += getRandomElement(template.balanced_friendly);
  }
  response += '\n\n';
  
  // 4. 如果是问题，添加针对性回答
  if (isQuestion) {
    console.log("[CustomTherapist] 检测到问题，添加具体回答");
    
    // 根据实用/创意和直接/委婉维度选择问题回答风格
    const pcValue = practicalCreative !== null ? practicalCreative : 50;
    const diValue = directIndirect !== null ? directIndirect : 50;
    
    if (pcValue >= 70 && diValue >= 70) {
      // 创意+委婉
      response += getRandomElement(template.question_creative);
      response += '\n\n';
      response += getRandomElement(template.question_indirect);
    } else if (pcValue >= 70 && diValue <= 30) {
      // 创意+直接
      response += getRandomElement(template.question_creative);
      response += '\n\n';
      response += getRandomElement(template.question_direct);
    } else if (pcValue <= 30 && diValue >= 70) {
      // 实用+委婉
      response += getRandomElement(template.question_practical);
      response += '\n\n';
      response += getRandomElement(template.question_indirect);
    } else if (pcValue <= 30 && diValue <= 30) {
      // 实用+直接
      response += getRandomElement(template.question_practical);
      response += '\n\n';
      response += getRandomElement(template.question_direct);
    } else if (pcValue >= 70) {
      // 创意为主
      response += getRandomElement(template.question_creative);
    } else if (pcValue <= 30) {
      // 实用为主
      response += getRandomElement(template.question_practical);
    } else if (diValue >= 70) {
      // 委婉为主
      response += getRandomElement(template.question_indirect);
    } else if (diValue <= 30) {
      // 直接为主
      response += getRandomElement(template.question_direct);
    } else {
      // 平衡风格，选择实用型
      response += getRandomElement(template.question_practical);
    }
    response += '\n\n';
  } else {
    // 非问题，根据实用/创意维度添加内容
    const pcValue = practicalCreative !== null ? practicalCreative : 50;
    const diValue = directIndirect !== null ? directIndirect : 50;
    const fsValue = friendlyStrict !== null ? friendlyStrict : 50;
    
    if (pcValue >= 90) {
      // 极度创意
      response += getRandomElement(template.highly_creative);
    } else if (pcValue >= 70) {
      // 创意
      response += getRandomElement(template.creative);
    } else if (pcValue <= 10) {
      // 极度实用
      response += getRandomElement(template.highly_practical);
    } else if (pcValue <= 30) {
      // 实用
      response += getRandomElement(template.practical);
    } else {
      // 平衡
      response += getRandomElement(template.balanced_practical);
    }
    response += '\n\n';
    
    // 根据直接/委婉维度添加内容
    if (diValue >= 90) {
      // 极度委婉
      response += getRandomElement(template.highly_indirect);
    } else if (diValue >= 70) {
      // 委婉
      response += getRandomElement(template.indirect);
    } else if (diValue <= 10) {
      // 极度直接
      response += getRandomElement(template.highly_direct);
    } else if (diValue <= 30) {
      // 直接
      response += getRandomElement(template.direct);
    } else {
      // 平衡
      response += getRandomElement(template.balanced_direct);
    }
    response += '\n\n';
  }
  
  // 5. 添加结束语 - 根据友好/严厉程度选择
  if (friendlyStrictValue >= 70) {
    // 严厉结束语
    response += getRandomElement(template.conclusions_challenging);
  } else if (friendlyStrictValue <= 30) {
    // 友好结束语
    response += getRandomElement(template.conclusions_warm);
  } else {
    // 中性结束语
    response += getRandomElement(template.conclusions_neutral);
  }
  
  // 个性化处理结果
  return personalizeResponse(response, userMessage, therapist);
}

/**
 * 添加个性化参考到响应中
 */
function personalizeResponse(
  response: string,
  userMessage: string,
  therapist: CustomTherapist,
  languageCode: LanguageCode = 'en'
): string {
  // 提取用户消息中的关键词/短语
  const userTopics = extractKeyTopics(userMessage);
  
  if (!userTopics || userTopics.length === 0) {
    return response;
  }
  
  // 使用第一个主题
  const topic = userTopics[0];
  
  // 在第一段后插入个性化引用
  const paragraphs = response.split('\n\n');
  if (paragraphs.length >= 2) {
    // 创建个性化引用，根据语言选择合适的格式
    let personalizedReference = "";
    
    // 获取当前使用的语言（从消息或全局设置中提取）
    // CustomTherapist 类型中没有直接的 language 字段，所以我们从 therapistLanguage 参数获取
    const currentLanguage = languageCode || 'en';
    
    // 根据语言选择个性化引用的格式
    switch (currentLanguage) {
      case 'zh_HK':
      case 'yue':
        // 粤语版本
        personalizedReference = `關於你提到嘅"${topic}"，我想補充一點。`;
        break;
      case 'zh':
        // 简体中文版本
        personalizedReference = `关于你提到的"${topic}"，我想补充一点。`;
        break;
      case 'zh_TW':
        // 繁体中文版本
        personalizedReference = `關於你提到的"${topic}"，我想補充一點。`;
        break;
      case 'es':
        // 西班牙语版本
        personalizedReference = `Sobre "${topic}" que mencionaste, me gustaría añadir algo.`;
        break;
      default:
        // 英语版本
        personalizedReference = `About "${topic}" that you mentioned, I'd like to add something.`;
    }
    
    // 在第一段后插入
    paragraphs.splice(1, 0, personalizedReference);
    return paragraphs.join('\n\n');
  }
  
  return response;
}

/**
 * 从用户消息中提取关键主题
 */
function extractKeyTopics(message: string): string[] {
  if (!message || message.trim().length < 3) {
    return [];
  }
  
  // 简单方法：提取一些中间部分作为主题
  const words = message.split(' ');
  
  if (words.length <= 5) {
    return [message]; // 短消息直接返回
  }
  
  // 取中间部分的几个词
  const middleIndex = Math.floor(words.length / 2);
  const topicWords = words.slice(
    Math.max(0, middleIndex - 2),
    Math.min(words.length, middleIndex + 2)
  );
  
  return [topicWords.join(' ')];
}

// 英语模板已移至单独文件 englishTemplate.ts

// 中文模板（简体）已移至单独文件 chineseTemplate.ts

// 中文模板（繁体）已移至单独文件 traditionalChineseTemplate.ts

// Dr.AZ模板已移至单独文件 drAZTemplate.ts

/**
 * 使用预定义模板直接生成回复，针对特定的自定义治疗师（如Dr.AZ和Dr.Q）
 * 这种方法避免了使用API生成可能包含乱码的内容，并确保一致的性格特质表现
 */
export function generateTemplateBasedResponse(
  message: string,
  therapist: CustomTherapist,
  languageCode: LanguageCode
): string {
  console.log(`[CustomTherapist] 为治疗师 ${therapist.name} 使用预定义模板生成回复`);
  
  // 检查是否是Dr.AZ
  const isDrAZ = therapist.name.toLowerCase().includes('dr.az') || 
                therapist.name.toLowerCase().includes('dr az') ||
                therapist.id === 9; // ID 9是Dr.AZ
                
  // 检查是否是Dr.Q
  const isDrQ = therapist.name.toLowerCase().includes('dr.q') || 
              therapist.name.toLowerCase().includes('dr q') ||
              therapist.id === 14; // ID 14是Dr.Q
  
  if (!isDrAZ && !isDrQ) {
    console.log(`[CustomTherapist] ${therapist.name} 既不是Dr.AZ也不是Dr.Q，无法使用预定义模板`);
    return "";
  }
  
  if (isDrAZ) {
    console.log(`[CustomTherapist] 确认是Dr.AZ，使用预定义模板生成回复`);
  } else if (isDrQ) {
    console.log(`[CustomTherapist] 确认是Dr.Q，使用预定义模板生成回复`);
  }
  
  // 提取特质值（确保有默认值并根据治疗师设置合适的默认值）
  let friendlyStrictValue: number;
  let rationalEmotionalValue: number;
  let practicalCreativeValue: number;
  let directIndirectValue: number;
  
  if (isDrAZ) {
    // Dr.AZ默认是严厉、情感化、创意丰富、直接的
    friendlyStrictValue = therapist.friendlyStrict ?? 100;  // 非常严厉
    rationalEmotionalValue = therapist.rationalEmotional ?? 0;  // 情感化
    practicalCreativeValue = therapist.practicalCreative ?? 100;  // 非常创意
    directIndirectValue = therapist.directIndirect ?? 0;  // 非常直接
  } else { // isDrQ
    // Dr.Q默认是友好、情感化、创意丰富、委婉的
    friendlyStrictValue = therapist.friendlyStrict ?? 0;  // 非常友好
    rationalEmotionalValue = therapist.rationalEmotional ?? 0;  // 情感化
    practicalCreativeValue = therapist.practicalCreative ?? 100;  // 非常创意
    directIndirectValue = therapist.directIndirect ?? 100;  // 非常委婉
  }
  
  // 检查是否为问题
  const isQuestion = message.includes('?') || message.includes('？') || message.includes('怎么') || message.includes('如何') || message.includes('what') || message.includes('why') || message.includes('how');
  console.log(`[CustomTherapist] 消息是否为问题: ${isQuestion}`);
  
  // 用于随机选择模板的辅助函数
  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  // 根据治疗师和语言选择正确的模板
  let template: EnhancedPersonalityResponseTemplate;
  
  if (isDrAZ) {
    template = drAZTemplate; // 目前Dr.AZ只有英文模板
  } else { // isDrQ
    // 根据语言选择Dr.Q的模板
    if (languageCode === 'zh' || languageCode === 'zh_TW') {
      template = drQChineseTemplate;
    } else {
      template = drQTemplate; // 英文模板作为默认
    }
  }
  
  // 构建响应
  let response = '';
  
  // 1. 添加问候语 - 根据友好/严厉程度选择
  if (friendlyStrictValue >= 90) {
    // 极度严厉
    response += getRandomElement(template.greetings_cold);
  } else if (friendlyStrictValue >= 70) {
    // 严厉
    response += getRandomElement(template.greetings_cold);
  } else if (friendlyStrictValue <= 10) {
    // 极度友好
    response += getRandomElement(template.greetings_warm);
  } else if (friendlyStrictValue <= 30) {
    // 友好
    response += getRandomElement(template.greetings_warm);
  } else {
    // 中性
    response += getRandomElement(template.greetings_neutral);
  }
  response += ' ';
  
  // 2. 根据理性/情感维度添加内容
  if (rationalEmotionalValue >= 90) {
    // 极度理性
    response += getRandomElement(template.highly_rational);
  } else if (rationalEmotionalValue >= 70) {
    // 理性
    response += getRandomElement(template.rational);
  } else if (rationalEmotionalValue <= 10) {
    // 极度情感
    response += getRandomElement(template.highly_emotional);
  } else if (rationalEmotionalValue <= 30) {
    // 情感
    response += getRandomElement(template.emotional);
  } else {
    // 平衡
    response += getRandomElement(template.balanced_rational);
  }
  response += ' ';
  
  // 3. 根据友好/严厉维度添加内容
  if (friendlyStrictValue >= 90) {
    // 极度严厉
    response += getRandomElement(template.highly_strict);
  } else if (friendlyStrictValue >= 70) {
    // 严厉
    response += getRandomElement(template.strict);
  } else if (friendlyStrictValue <= 10) {
    // 极度友好
    response += getRandomElement(template.highly_friendly);
  } else if (friendlyStrictValue <= 30) {
    // 友好
    response += getRandomElement(template.friendly);
  } else {
    // 平衡
    response += getRandomElement(template.balanced_friendly);
  }
  response += ' ';
  
  // 4. 如果是问题，添加针对性回答
  if (isQuestion) {
    console.log("[CustomTherapist] 检测到问题，添加具体回答");
    
    // 确保所有值都有默认值，避免null错误
    const practicalCreative = practicalCreativeValue ?? 50;
    const directIndirect = directIndirectValue ?? 50;

    // 根据实用/创意和直接/委婉维度选择问题回答风格
    if (practicalCreative >= 70 && directIndirect >= 70) {
      // 创意+委婉
      response += getRandomElement(template.question_creative);
      response += ' ';
      response += getRandomElement(template.question_indirect);
    } else if (practicalCreative >= 70 && directIndirect <= 30) {
      // 创意+直接
      response += getRandomElement(template.question_creative);
      response += ' ';
      response += getRandomElement(template.question_direct);
    } else if (practicalCreative <= 30 && directIndirect >= 70) {
      // 实用+委婉
      response += getRandomElement(template.question_practical);
      response += ' ';
      response += getRandomElement(template.question_indirect);
    } else if (practicalCreative <= 30 && directIndirect <= 30) {
      // 实用+直接
      response += getRandomElement(template.question_practical);
      response += ' ';
      response += getRandomElement(template.question_direct);
    } else if (practicalCreative >= 70) {
      // 创意为主
      response += getRandomElement(template.question_creative);
    } else if (practicalCreative <= 30) {
      // 实用为主
      response += getRandomElement(template.question_practical);
    } else if (directIndirect >= 70) {
      // 委婉为主
      response += getRandomElement(template.question_indirect);
    } else if (directIndirect <= 30) {
      // 直接为主
      response += getRandomElement(template.question_direct);
    } else {
      // 平衡风格，选择实用型
      response += getRandomElement(template.question_practical);
    }
    response += ' ';
  } else {
    // 非问题，根据实用/创意维度添加内容
    // 确保所有值都有默认值，避免null错误
    const practicalCreative = practicalCreativeValue ?? 50;
    const directIndirect = directIndirectValue ?? 50;
    
    if (practicalCreative >= 90) {
      // 极度创意
      response += getRandomElement(template.highly_creative);
    } else if (practicalCreative >= 70) {
      // 创意
      response += getRandomElement(template.creative);
    } else if (practicalCreative <= 10) {
      // 极度实用
      response += getRandomElement(template.highly_practical);
    } else if (practicalCreative <= 30) {
      // 实用
      response += getRandomElement(template.practical);
    } else {
      // 平衡
      response += getRandomElement(template.balanced_practical);
    }
    response += ' ';
    
    // 根据直接/委婉维度添加内容
    if (directIndirect >= 90) {
      // 极度委婉
      response += getRandomElement(template.highly_indirect);
    } else if (directIndirect >= 70) {
      // 委婉
      response += getRandomElement(template.indirect);
    } else if (directIndirect <= 10) {
      // 极度直接
      response += getRandomElement(template.highly_direct);
    } else if (directIndirect <= 30) {
      // 直接
      response += getRandomElement(template.direct);
    } else {
      // 平衡
      response += getRandomElement(template.balanced_direct);
    }
    response += ' ';
  }
  
  // 5. 添加结束语 - 根据友好/严厉程度选择
  // 确保friendlyStrict有默认值
  const friendlyStrict = friendlyStrictValue ?? 50;
  
  if (friendlyStrict >= 70) {
    // 严厉结束语
    response += getRandomElement(template.conclusions_challenging);
  } else if (friendlyStrict <= 30) {
    // 友好结束语
    response += getRandomElement(template.conclusions_warm);
  } else {
    // 中性结束语
    response += getRandomElement(template.conclusions_neutral);
  }
  
  if (isDrAZ) {
    console.log(`[CustomTherapist] 已为Dr.AZ生成模板响应，长度: ${response.length}字符`);
  } else if (isDrQ) {
    console.log(`[CustomTherapist] 已为Dr.Q生成模板响应，长度: ${response.length}字符`);
  } else {
    console.log(`[CustomTherapist] 已为自定义治疗师生成模板响应，长度: ${response.length}字符`);
  }
  return response;
}