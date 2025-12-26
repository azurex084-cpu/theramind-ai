import OpenAI from "openai";
import { storage } from "../storage";
import { type QuoteCategory, type Quote, type InsertQuote } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Helper function to get the most frequent item in an array
 */
function getMostFrequent<T>(arr: T[]): T {
  const frequency: Record<string, number> = {};
  let maxFreq = 0;
  let mostFrequent: T = arr[0];
  
  for (const item of arr) {
    const key = String(item);
    frequency[key] = (frequency[key] || 0) + 1;
    
    if (frequency[key] > maxFreq) {
      maxFreq = frequency[key];
      mostFrequent = item;
    }
  }
  
  return mostFrequent;
}

// Simple quote interface for fallback quotes
interface FallbackQuote {
  text: string;
  author: string;
  category: QuoteCategory;
}

// Static quotes for fallback
const fallbackQuotes: Record<QuoteCategory, FallbackQuote[]> = {
  confidence: [
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "confidence" },
    { text: "You are capable of more than you know. Choose a goal that seems right for you and strive to be the best, however hard the path.", author: "Arthur Ashe", category: "confidence" },
  ],
  growth: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "growth" },
    { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll", category: "growth" },
  ],
  resilience: [
    { text: "Fall seven times, stand up eight.", author: "Japanese Proverb", category: "resilience" },
    { text: "The human capacity for burden is like bamboo – far more flexible than you'd ever believe at first glance.", author: "Jodi Picoult", category: "resilience" },
  ],
  mindfulness: [
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh", category: "mindfulness" },
    { text: "Be happy in the moment, that's enough. Each moment is all we need, not more.", author: "Mother Teresa", category: "mindfulness" },
  ],
  gratitude: [
    { text: "Gratitude turns what we have into enough.", author: "Anonymous", category: "gratitude" },
    { text: "When we focus on our gratitude, the tide of disappointment goes out and the tide of love rushes in.", author: "Kristin Armstrong", category: "gratitude" },
  ],
  compassion: [
    { text: "If you want others to be happy, practice compassion. If you want to be happy, practice compassion.", author: "Dalai Lama", category: "compassion" },
    { text: "Love and compassion are necessities, not luxuries. Without them, humanity cannot survive.", author: "Dalai Lama", category: "compassion" },
  ],
  motivation: [
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "motivation" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: "motivation" },
  ],
  general: [
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "general" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "general" },
  ],
};

/**
 * Get a random fallback quote when AI generation fails
 */
export function getFallbackQuote(category?: QuoteCategory): Quote {
  const selectedCategory = category || "general";
  const quotes = fallbackQuotes[selectedCategory];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const fallbackQuote = quotes[randomIndex];
  
  // Create a placeholder Quote with required fields
  return {
    id: 0, // This will be replaced when stored in DB
    text: fallbackQuote.text,
    author: fallbackQuote.author,
    category: fallbackQuote.category,
    userId: null,
    customized: false,
    favorited: false,
    createdAt: new Date(),
    displayedAt: null
  };
}

/**
 * Generate a personalized quote based on recent user messages
 */
export async function generatePersonalizedQuote(
  userId: number,
  category: QuoteCategory = "general",
  customized: boolean = true,
  sessionId?: string,
  isAffirmation: boolean = false,
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
): Promise<Quote> {
  try {
    // Analyze recent messages if a session ID is provided
    let sessionContext = '';
    let emotionalContext = '';
    
    if (sessionId) {
      const messages = await storage.getSessionMessages(sessionId);
      
      // Get the last 5 user messages for content context
      const userMessages = messages
        .filter(m => m.role === 'user')
        .slice(-5)
        .map(m => m.content);
      
      if (userMessages.length > 0) {
        sessionContext = `Recent conversation topics: ${userMessages.join(' ')}`;
      }
      
      // Get sentiment data for emotional context
      const userSentiments = messages
        .filter(m => m.role === 'user' && m.sentiment)
        .slice(-5)
        .map(m => {
          try {
            if (m.sentiment) {
              return JSON.parse(m.sentiment);
            }
            return null;
          } catch (e) {
            return null;
          }
        })
        .filter(s => s !== null);
      
      if (userSentiments.length > 0) {
        // Calculate average sentiment and most frequent emotions
        const emotions = userSentiments.map(s => s.category);
        const mostFrequentEmotion = getMostFrequent(emotions);
        
        emotionalContext = `The user has recently expressed emotions like: ${emotions.join(', ')}. ` +
          `The most frequent emotion is: ${mostFrequentEmotion}.`;
      }
    }
    
    // Add time of day context for daily affirmations
    let timeContext = '';
    if (isAffirmation && timeOfDay) {
      timeContext = `This affirmation is for the ${timeOfDay}. `;
      
      switch(timeOfDay) {
        case 'morning':
          timeContext += 'Focus on energy, positivity, and setting intentions for the day.';
          break;
        case 'afternoon':
          timeContext += 'Focus on persistence, productivity, and maintaining momentum.';
          break;
        case 'evening':
          timeContext += 'Focus on reflection, gratitude, and acknowledging achievements.';
          break;
        case 'night':
          timeContext += 'Focus on peace, relaxation, and restful preparation for tomorrow.';
          break;
      }
    }
    
    // Determine if this should be an affirmation or quote
    const contentType = isAffirmation ? 
      "personal affirmation (written in first person, starting with 'I')" : 
      "inspirational quote";
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a therapeutic ${contentType} generator. Create a ${isAffirmation ? 'powerful, personal affirmation' : 'inspiring, uplifting quote'} related to the '${category}' theme.
           ${sessionContext ? `Consider these recent conversation topics from the user: ${sessionContext}` : ''}
           ${emotionalContext ? `Consider the user's emotional state: ${emotionalContext}` : ''}
           ${timeContext ? `Time context: ${timeContext}` : ''}
           ${isAffirmation ? 'The affirmation should be in first person (starting with "I"), present tense, positive, and empowering.' : ''}
           The ${contentType} should be concise (under 150 characters if possible), meaningful, and have potential to provide emotional support.
           Return only the ${contentType} and its author in JSON format with 'text' and 'author' fields. ${isAffirmation ? 'Use "Personal Affirmation" as the author.' : 'Use "Anonymous" if there\'s no specific author.'}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 150,
    });
    
    const content = response.choices[0].message.content || "";
    const result = JSON.parse(content);
    
    // Create the quote object for storage
    const quoteData: InsertQuote = {
      userId,
      text: result.text,
      author: result.author ? result.author : (isAffirmation ? "Personal Affirmation" : "Anonymous"),
      category,
      customized,
      favorited: false
    };
    
    // Store the quote in the database
    const newQuote = await storage.createQuote(quoteData);
    return newQuote;
  } catch (error) {
    console.error("Failed to generate personalized quote:", error);
    
    // Create a fallback quote
    const fallbackQuote = getFallbackQuote(category);
    
    // Store the fallback quote in the database
    const quoteData: InsertQuote = {
      userId,
      text: fallbackQuote.text,
      author: fallbackQuote.author,
      category: fallbackQuote.category,
      customized: false,
      favorited: false
    };
    
    try {
      // Try to store in the database
      return await storage.createQuote(quoteData);
    } catch (dbError) {
      console.error("Failed to store fallback quote:", dbError);
      // Return the in-memory fallback if database storage fails
      return fallbackQuote;
    }
  }
}

/**
 * Main generateQuote function that serves as the entry point for quote generation
 * This is the function called by the API routes
 */
export async function generateQuote(
  userId: number,
  category: QuoteCategory = "general",
  customized: boolean = true,
  sessionId?: string
): Promise<Quote> {
  return await generatePersonalizedQuote(userId, category, customized, sessionId);
}