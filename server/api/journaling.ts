import { InsertJournalingPrompt, JournalingPrompt, JournalingPromptCategory } from '@shared/schema';
import { storage } from '../storage';
import { getAIResponse } from './openai';

// Description and examples for each category
export const promptCategoryDetails: Record<JournalingPromptCategory, { 
  name: string; 
  description: string;
  examples: string[];
}> = {
  self_reflection: {
    name: 'Self Reflection',
    description: 'Help you deeply reflect on your thoughts, behaviors, and values',
    examples: [
      'What made you feel proud recently, and why?',
      'What was the most important lesson you learned in the past week?',
      'What is the biggest challenge in your life right now, and how are you dealing with it?'
    ]
  },
  gratitude: {
    name: 'Gratitude',
    description: 'Focus on things worth appreciating in life to cultivate a positive mindset',
    examples: [
      'What are three small things you feel grateful for today?',
      'Who has supported you in your life that you haven\'t thanked enough?',
      'During difficult times, what things or relationships have been your pillars?'
    ]
  },
  emotional_awareness: {
    name: 'Emotional Awareness',
    description: 'Help identify and understand your emotional patterns',
    examples: [
      'When did your emotions feel strongest today? What happened then?',
      'What situations consistently trigger specific emotional reactions in you?',
      'How does your body respond when you feel anxious or depressed?'
    ]
  },
  goal_setting: {
    name: 'Goal Setting',
    description: 'Help clarify and achieve personal goals',
    examples: [
      'What do you hope to accomplish in a month? What specific steps do you need to take?',
      'What is hindering you from achieving your goals? How can you overcome these obstacles?',
      'If you knew you wouldn\'t fail, what goal would you set?'
    ]
  },
  stress_management: {
    name: 'Stress Management',
    description: 'Identify sources of stress and develop coping strategies',
    examples: [
      'When did you feel most calm this week? What created that feeling?',
      'Which stress management techniques work best for you? Why?',
      'How can you reorganize your daily activities to reduce stress?'
    ]
  },
  personal_growth: {
    name: 'Personal Growth',
    description: 'Promote self-improvement and life goal exploration',
    examples: [
      'What qualities do you admire most about yourself? How can you better promote them?',
      'What kind of person do you want to be in five years? What steps can you take now to move in that direction?',
      'What do you need to release in your life to create more space for growth?'
    ]
  }
};

/**
 * Use AI to generate personalized journaling prompts
 */
export async function generateJournalingPrompt(
  userId: number, 
  category: JournalingPromptCategory = 'self_reflection',
  recentMessages: string[] = []
): Promise<JournalingPrompt> {
  console.log(`Starting generateJournalingPrompt: userId=${userId}, category=${category}`);
  try {
    // Get category details
    const categoryInfo = promptCategoryDetails[category];
    console.log("Using category info:", categoryInfo);
    
    // Build AI prompt
    let prompt = `Generate a thoughtful journaling prompt about ${categoryInfo.name} (${categoryInfo.description}).`;
    
    // If there are recent messages, use them to personalize the prompt
    if (recentMessages && recentMessages.length > 0) {
      prompt += `\n\nBased on the user's recent conversations: ${recentMessages.join(' ')}`;
    }
    
    prompt += `\n\nThe prompt should be a thoughtful question that encourages self-reflection and exploration. Make sure the prompt is open-ended and leads to meaningful contemplation.`;
    prompt += `\n\nExamples of such prompts:\n- ${categoryInfo.examples.join('\n- ')}`;
    
    console.log("Sending prompt to OpenAI:", prompt.substring(0, 100) + "...");
    
    // Get AI response
    const response = await getAIResponse(prompt);
    console.log("Received AI response:", response.substring(0, 100) + "...");
    
    // Create journaling prompt object
    const journalingPrompt: InsertJournalingPrompt = {
      userId,
      category,
      text: response,
      isCustom: false,
      aiGenerated: true,
    };
    
    console.log("Saving journaling prompt to database...");
    // Store prompt in database
    const result = await storage.createJournalingPrompt(journalingPrompt);
    console.log("Successfully created journaling prompt:", result.id);
    
    return result;
  } catch (error) {
    console.error('Error generating journaling prompt:', error);
    
    // If AI generation fails, return a predefined prompt
    console.log("Using fallback prompt due to error");
    const fallbackPrompt = getFallbackPrompt(category);
    const journalingPrompt: InsertJournalingPrompt = {
      userId,
      category,
      text: fallbackPrompt,
      isCustom: false,
      aiGenerated: false,
    };
    
    return storage.createJournalingPrompt(journalingPrompt);
  }
}

/**
 * Get user's journaling prompt history
 */
export async function getUserJournalingPrompts(userId: number, limit: number = 10) {
  return storage.getUserJournalingPrompts(userId, limit);
}

/**
 * Get fallback journaling prompt
 */
function getFallbackPrompt(category: JournalingPromptCategory): string {
  // Choose a random example for each category
  const examples = promptCategoryDetails[category].examples;
  return examples[Math.floor(Math.random() * examples.length)];
}

/**
 * Mark journaling prompt as used
 */
export async function markPromptAsUsed(promptId: number): Promise<void> {
  await storage.markJournalingPromptAsUsed(promptId);
}

/**
 * Create custom journaling prompt
 */
export async function createCustomPrompt(
  userId: number,
  text: string,
  category: JournalingPromptCategory
): Promise<JournalingPrompt> {
  // Create a custom prompt object with user input
  const customPrompt: InsertJournalingPrompt = {
    userId,
    category,
    text,
    isCustom: true,
    aiGenerated: false,
  };
  
  // Save the custom prompt to the database
  return storage.createJournalingPrompt(customPrompt);
}