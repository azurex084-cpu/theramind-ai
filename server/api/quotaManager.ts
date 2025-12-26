/**
 * OpenAI API quota management system
 * Handles tracking, limiting, and caching of API calls to optimize quota usage
 */

// Constants for quota management
const DAILY_CALL_LIMIT = 1000;  // 1000 API calls per day maximum
const HOURLY_CALL_LIMIT = 100;  // 100 API calls per hour maximum
const CRITICAL_THRESHOLD = 90;  // 90% of quota is considered critical

// Quota metrics tracking
type QuotaMetrics = {
  dailyUsage: number;
  hourlyUsage: number;
  dailyPercentage: number;
  hourlyPercentage: number;
  isCritical: boolean;
  lastReset: {
    daily: Date;
    hourly: Date;
  };
  usageHistory: {
    timestamp: Date;
    endpoint: string;
    tokens?: number;
  }[];
};

// Initialize quota tracking
const quotaStats: QuotaMetrics = {
  dailyUsage: 0,
  hourlyUsage: 0,
  dailyPercentage: 0,
  hourlyPercentage: 0,
  isCritical: false,
  lastReset: {
    daily: new Date(),
    hourly: new Date()
  },
  usageHistory: []
};

// Cache for API responses to prevent duplicate API calls
const responseCache = new Map<string, { 
  response: string; 
  timestamp: Date; 
  validUntil: Date;
}>();

/**
 * Check if we've exceeded quota limits and should use fallback
 */
export function shouldUseFallback(): boolean {
  checkAndResetQuotas();
  
  // If we're above our daily or hourly limits
  if (quotaStats.dailyPercentage >= 100 || quotaStats.hourlyPercentage >= 100) {
    console.log(`API quota exceeded. Daily: ${quotaStats.dailyPercentage.toFixed(1)}%, Hourly: ${quotaStats.hourlyPercentage.toFixed(1)}%`);
    return true;
  }
  
  return false;
}

/**
 * Check if we can make an API call based on current quota status
 * Prioritize more important features when quota is getting low
 * 
 * @param priority - Priority level (1-10, 1 being highest priority)
 * @returns boolean - Whether we can make the API call
 */
export function canMakeApiCall(priority: number = 5): boolean {
  checkAndResetQuotas();
  
  // If we're above our limits, no calls allowed regardless of priority
  if (quotaStats.dailyPercentage >= 100 || quotaStats.hourlyPercentage >= 100) {
    console.log(`API quota exceeded. Daily: ${quotaStats.dailyPercentage.toFixed(1)}%, Hourly: ${quotaStats.hourlyPercentage.toFixed(1)}%`);
    return false;
  }
  
  // If we're near our limits, only allow high priority calls
  if (quotaStats.isCritical) {
    // In critical zone, only allow highest priority calls (1-2)
    if (priority <= 2) {
      console.log(`API quota critical but allowing high priority (${priority}) call`);
      return true;
    } else {
      console.log(`API quota critical, blocking lower priority (${priority}) call`);
      return false;
    }
  }
  
  // If we're above 75% of quota, only allow priority 1-5
  if (quotaStats.dailyPercentage >= 75 || quotaStats.hourlyPercentage >= 75) {
    if (priority <= 5) {
      console.log(`API quota high (>75%) but allowing medium-high priority (${priority}) call`);
      return true;
    } else {
      console.log(`API quota high (>75%), blocking lower priority (${priority}) call`);
      return false;
    }
  }
  
  // If we're below thresholds, allow all calls
  return true;
}

/**
 * Record an API call and update quota usage (alias for recordApiCall)
 * Simplified function name for better readability in OpenAI integration
 */
export function trackApiCall(): void {
  recordApiCall("openai/chat");
}

/**
 * Record an API call and update quota usage
 */
export function recordApiCall(endpoint: string, tokens?: number): void {
  checkAndResetQuotas();
  
  // Record the API call
  quotaStats.dailyUsage++;
  quotaStats.hourlyUsage++;
  
  // Update percentages
  quotaStats.dailyPercentage = (quotaStats.dailyUsage / DAILY_CALL_LIMIT) * 100;
  quotaStats.hourlyPercentage = (quotaStats.hourlyUsage / HOURLY_CALL_LIMIT) * 100;
  
  // Update critical flag
  quotaStats.isCritical = 
    quotaStats.dailyPercentage >= CRITICAL_THRESHOLD || 
    quotaStats.hourlyPercentage >= CRITICAL_THRESHOLD;
  
  // Add to history (limited to last 100 calls)
  quotaStats.usageHistory.push({
    timestamp: new Date(),
    endpoint,
    tokens
  });
  
  // Trim history if needed
  if (quotaStats.usageHistory.length > 100) {
    quotaStats.usageHistory = quotaStats.usageHistory.slice(-100);
  }
  
  console.log(`API call recorded: ${endpoint}. Daily: ${quotaStats.dailyPercentage.toFixed(1)}%, Hourly: ${quotaStats.hourlyPercentage.toFixed(1)}%`);
}

/**
 * Get a cached response if available
 */
export function getCachedResponse(cacheKey: string): string | null {
  const cached = responseCache.get(cacheKey);
  
  if (cached && cached.validUntil > new Date()) {
    console.log(`Cache hit for key: ${cacheKey.substring(0, 20)}...`);
    return cached.response;
  }
  
  // Clean expired cache entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean on each miss
    cleanExpiredCache();
  }
  
  return null;
}

/**
 * Cache a response for future use
 * @param cacheKey - The unique key for this response
 * @param response - The response content to cache
 * @param validDays - Number of days to keep in cache (default: 7)
 */
export function cacheResponse(cacheKey: string, response: string, validDays: number = 7): void {
  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setDate(validUntil.getDate() + validDays);
  
  responseCache.set(cacheKey, {
    response,
    timestamp: now,
    validUntil
  });
  
  console.log(`Cached response for key: ${cacheKey.substring(0, 20)}... Valid until: ${validUntil.toISOString()}`);
}

/**
 * Clear all cached responses for a specific therapist
 * @param therapistId - The therapist ID to clear cache for
 */
export function clearTherapistCache(therapistId: string | number): void {
  let cleared = 0;
  
  responseCache.forEach((value, key) => {
    // Check if the cache key contains the therapist ID
    if (key.includes(`_${therapistId}_`)) {
      responseCache.delete(key);
      cleared++;
    }
  });
  
  console.log(`Cleared ${cleared} cached responses for therapist ${therapistId}`);
}

/**
 * Clear all cached responses (nuclear option)
 */
export function clearAllCache(): void {
  const size = responseCache.size;
  responseCache.clear();
  console.log(`Cleared all ${size} cached responses`);
}

/**
 * Clean expired cache entries
 */
function cleanExpiredCache(): void {
  const now = new Date();
  let cleaned = 0;
  
  // Using forEach instead of for...of to avoid downlevelIteration issues
  responseCache.forEach((value, key) => {
    if (value.validUntil < now) {
      responseCache.delete(key);
      cleaned++;
    }
  });
  
  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} expired cache entries`);
  }
}

/**
 * Check and reset quotas if needed (daily/hourly)
 */
function checkAndResetQuotas(): void {
  const now = new Date();
  
  // Check if we need to reset daily count (different calendar day)
  if (now.getDate() !== quotaStats.lastReset.daily.getDate() ||
      now.getMonth() !== quotaStats.lastReset.daily.getMonth() ||
      now.getFullYear() !== quotaStats.lastReset.daily.getFullYear()) {
    
    console.log("Resetting daily quota counter");
    quotaStats.dailyUsage = 0;
    quotaStats.dailyPercentage = 0;
    quotaStats.lastReset.daily = now;
  }
  
  // Check if we need to reset hourly count (different hour)
  if (now.getHours() !== quotaStats.lastReset.hourly.getHours() ||
      now.getDate() !== quotaStats.lastReset.hourly.getDate() ||
      now.getMonth() !== quotaStats.lastReset.hourly.getMonth() ||
      now.getFullYear() !== quotaStats.lastReset.hourly.getFullYear()) {
    
    console.log("Resetting hourly quota counter");
    quotaStats.hourlyUsage = 0;
    quotaStats.hourlyPercentage = 0;
    quotaStats.lastReset.hourly = now;
  }
  
  // Update critical status after potential resets
  quotaStats.isCritical = 
    quotaStats.dailyPercentage >= CRITICAL_THRESHOLD || 
    quotaStats.hourlyPercentage >= CRITICAL_THRESHOLD;
}

/**
 * Get current quota statistics
 */
export function getQuotaStats(): QuotaMetrics {
  checkAndResetQuotas();
  return { ...quotaStats };
}

/**
 * Calculate a unique cache key for a conversation
 */
export function calculateCacheKey(message: string, therapyApproach: string, language: string): string {
  // Simplify the message to reduce variations
  // Remove extra spaces, convert to lowercase, only consider first 100 chars
  const simplifiedMessage = message
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100);
  
  return `${simplifiedMessage}|${therapyApproach}|${language}`;
}