/**
 * 治疗师人格回复模板类型定义
 */

export interface PersonalityResponseTemplate {
  greetings: string[];
  short_responses: string[];
  criticism: string[];
  mockery: string[];
  advice: string[];
  questions: string[];
  conclusion: string[];
  emojis: string[];
}