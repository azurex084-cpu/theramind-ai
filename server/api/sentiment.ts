import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export type SentimentAnalysis = {
  category: string;  // primary emotion: 'happy', 'sad', 'anxious', 'angry', 'neutral', etc.
  score: number;     // intensity score -1 to 1 where negative values are negative emotions
  keywords: string[]; // key emotional words identified in the text
  summary: string;   // brief summary of the emotional state
};

/**
 * Analyze the sentiment of a user message
 * @param message The user's message to analyze
 * @param sourceLanguage The language of the message (optional, defaults to auto-detection)
 * @returns A sentiment analysis object or null if analysis failed
 */
export async function analyzeSentiment(
  message: string, 
  sourceLanguage?: string
): Promise<SentimentAnalysis | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not set, skipping sentiment analysis");
      return null;
    }

    if (!message || message.trim().length < 3) {
      return null; // Message too short for meaningful analysis
    }

    // 根据消息的语言定制提示，确保关键词使用相同的语言
    const prompt = `
    Analyze the emotional sentiment in this message. Return a JSON object with:
    - "category": The primary emotion (happy, sad, anxious, angry, neutral, etc.)
    - "score": A sentiment score from -1 (very negative) to 1 (very positive)
    - "keywords": An array of up to 3 emotionally significant words FROM THE ORIGINAL TEXT in their ORIGINAL LANGUAGE. Do not translate these words. Extract them exactly as they appear in the original message.
    - "summary": A brief 1-sentence description of the emotional state in English

    IMPORTANT: The keywords must be in the same language as the original message.
    
    Message: "${message}"
    
    Message language: ${sourceLanguage || "auto-detect"}
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are an expert psychologist specializing in emotional analysis." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 250,
    });

    const content = response.choices[0].message.content || "{}";
    return JSON.parse(content) as SentimentAnalysis;
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return null;
  }
}

/**
 * Gets user's emotional journey by analyzing sentiment trends
 * @param sentiments An array of sentiment analyses sorted by timestamp
 * @returns A summary of the emotional journey
 */
export function analyzeEmotionalJourney(sentiments: SentimentAnalysis[]): {
  trend: 'improving' | 'worsening' | 'fluctuating' | 'stable';
  averageScore: number;
  dominantEmotion: string;
  summary: string;
} {
  if (!sentiments.length) {
    return {
      trend: 'stable',
      averageScore: 0,
      dominantEmotion: 'neutral',
      summary: 'Not enough data to analyze emotional journey.'
    };
  }

  // Calculate the average sentiment score
  const averageScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
  
  // Get trend direction by comparing first and last few sentiments
  let trend: 'improving' | 'worsening' | 'fluctuating' | 'stable' = 'stable';
  
  if (sentiments.length >= 3) {
    const earlyScores = sentiments.slice(0, Math.ceil(sentiments.length / 3))
      .reduce((sum, s) => sum + s.score, 0) / Math.ceil(sentiments.length / 3);
    
    const lateScores = sentiments.slice(-Math.ceil(sentiments.length / 3))
      .reduce((sum, s) => sum + s.score, 0) / Math.ceil(sentiments.length / 3);
    
    const difference = lateScores - earlyScores;
    
    if (difference > 0.2) {
      trend = 'improving';
    } else if (difference < -0.2) {
      trend = 'worsening';
    } else {
      // Calculate variance to determine if stable or fluctuating
      const scoreVariance = sentiments.reduce((variance, s) => 
        variance + Math.pow(s.score - averageScore, 2), 0) / sentiments.length;
      
      trend = scoreVariance > 0.15 ? 'fluctuating' : 'stable';
    }
  }
  
  // Find most common emotion
  const emotionCounts: Record<string, number> = {};
  sentiments.forEach(s => {
    emotionCounts[s.category] = (emotionCounts[s.category] || 0) + 1;
  });
  
  const dominantEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Generate summary
  let summary = '';
  if (trend === 'improving') {
    summary = `Emotional state has been improving from ${sentiments[0].category} towards more positive emotions.`;
  } else if (trend === 'worsening') {
    summary = `Emotional state has been trending towards more negative emotions like ${dominantEmotion}.`;
  } else if (trend === 'fluctuating') {
    summary = `Emotional state has been fluctuating between different emotions with ${dominantEmotion} being most common.`;
  } else {
    summary = `Emotional state has remained relatively stable, primarily ${dominantEmotion}.`;
  }
  
  return {
    trend,
    averageScore,
    dominantEmotion,
    summary
  };
}