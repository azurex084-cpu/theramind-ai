/**
 * 增强型模板系统的类型定义
 * 允许使用更复杂的个性表现模型
 */

/**
 * 增强型个性回复模板
 * 包含多种不同风格和情绪的模板片段
 */
export interface EnhancedPersonalityResponseTemplate {
  // 问候语 - 按从冷淡到热情的程度
  greetings_cold: string[];
  greetings_warm: string[];
  greetings_neutral: string[];
  
  // 理性/情感维度内容
  highly_rational: string[];  // 高度理性
  rational: string[];          // 理性
  balanced_rational: string[]; // 平衡的理性/情感
  emotional: string[];         // 情感
  highly_emotional: string[];  // 高度情感
  
  // 友好/严厉维度内容
  highly_strict: string[];      // 高度严厉
  strict: string[];              // 严厉
  balanced_friendly: string[];   // 平衡的友好/严厉
  friendly: string[];            // 友好
  highly_friendly: string[];     // 高度友好
  
  // 问题回答风格
  question_creative: string[];  // 创意风格
  question_practical: string[]; // 实用风格
  question_indirect: string[];  // 委婉风格
  question_direct: string[];    // 直接风格
  
  // 创意/实用维度内容
  highly_creative: string[];     // 高度创意
  creative: string[];            // 创意
  balanced_practical: string[];  // 平衡的创意/实用
  practical: string[];           // 实用
  highly_practical: string[];    // 高度实用
  
  // 直接/委婉维度内容
  highly_direct: string[];      // 高度直接
  direct: string[];             // 直接
  balanced_direct: string[];    // 平衡的直接/委婉
  indirect: string[];           // 委婉
  highly_indirect: string[];    // 高度委婉
  
  // 结论风格
  conclusions_challenging: string[]; // 挑战性结论
  conclusions_warm: string[];       // 温暖结论
  conclusions_neutral: string[];    // 中性结论
}