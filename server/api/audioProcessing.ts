import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { LanguageCode } from "./openai";
import crypto from "crypto";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Voice cache to ensure identical pronunciation for same content
const voiceCache = new Map<string, string>();

/**
 * Preprocess text for better TTS processing across languages
 * @param text Original text
 * @param languageCode Language code for language-specific processing
 * @returns Processed text optimized for TTS
 */
function preprocessTextForTTS(text: string, languageCode: LanguageCode): string {
  let processedText = text;
  
  // Remove excessive whitespace and normalize line breaks
  processedText = processedText.replace(/\r\n/g, '\n');
  processedText = processedText.replace(/\r/g, '\n');
  
  // Replace multiple consecutive empty lines with single line break
  processedText = processedText.replace(/\n\s*\n\s*\n+/g, '\n\n');
  
  // Replace single line breaks with space to ensure continuous reading
  processedText = processedText.replace(/\n(?!\n)/g, ' ');
  
  // Replace double line breaks with pause markers for natural speech flow
  processedText = processedText.replace(/\n\n/g, '. ');
  
  // Language-specific preprocessing
  if (languageCode === 'es') {
    // Spanish: Ensure proper pronunciation of common words
    processedText = processedText.replace(/\br\b/g, 'erre'); // Standalone 'r' 
    processedText = processedText.replace(/Dr\./g, 'Doctor');
  } else if (languageCode === 'it') {
    // Italian: Ensure proper pronunciation
    processedText = processedText.replace(/Dr\./g, 'Dottore');
  } else if (languageCode === 'pt') {
    // Portuguese: Ensure proper pronunciation
    processedText = processedText.replace(/Dr\./g, 'Doutor');
  } else if (languageCode === 'ja') {
    // Japanese: Add spacing for better prosody and pronunciation
    processedText = processedText.replace(/AI/g, 'エーアイ');
    processedText = processedText.replace(/Dr\./g, '博士');
    
    // Add subtle pauses after particles for natural flow
    processedText = processedText.replace(/([はがをにでと])/g, '$1 ');
    processedText = processedText.replace(/([ですます])([。！？])/g, '$1 $2');
    
    // Ensure proper spacing for compound words
    processedText = processedText.replace(/セラピー/g, 'セラピー ');
    processedText = processedText.replace(/アシスタント/g, 'アシスタント ');
  } else if (languageCode === 'ko') {
    // Korean: Ensure proper pronunciation and natural flow
    processedText = processedText.replace(/AI/g, '에이아이');
    processedText = processedText.replace(/Dr\./g, '박사');
    
    // Add spacing after Korean sentence endings for natural pauses
    processedText = processedText.replace(/([습니다니다])([\.！？])/g, '$1 $2');
    
    // Ensure proper spacing for compound words
    processedText = processedText.replace(/치료사/g, '치료사 ');
    processedText = processedText.replace(/어시스턴트/g, '어시스턴트 ');
  }
  
  // Remove extra spaces
  processedText = processedText.replace(/\s+/g, ' ').trim();
  
  console.log(`[AudioProcessing] Preprocessed text for ${languageCode}: "${processedText.substring(0, 100)}..."`);
  return processedText;
}

/**
 * Transcribe audio data to text using OpenAI's Whisper model
 * @param audioData Base64-encoded audio data
 * @param languageCode Language code to help with transcription
 * @returns Transcribed text
 */
export async function transcribeAudio(audioData: string, languageCode: LanguageCode): Promise<string> {
  try {
    console.log("[AudioProcessing] Converting base64 to audio file for transcription");
    
    // Create a temporary file for the audio
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `recording_${Date.now()}.webm`);
    
    // Convert base64 to binary
    const buffer = Buffer.from(audioData, 'base64');
    fs.writeFileSync(tempFile, buffer);
    
    // Create read stream for the file
    const audioStream = fs.createReadStream(tempFile);
    
    console.log(`[AudioProcessing] Transcribing audio using language hint: ${languageCode}`);
    
    // Get language hint for Whisper
    const languageHint = getLanguageHintForWhisper(languageCode);
    
    // Transcribe using OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
      language: languageHint,
    });
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
    console.log(`[AudioProcessing] Transcription successful. Text length: ${transcription.text.length}`);
    return transcription.text;
  } catch (error: any) {
    console.error("[AudioProcessing] Error transcribing audio:", error);
    throw new Error(`Failed to transcribe audio: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Convert text to speech using appropriate TTS service based on language
 * @param text Text to convert to speech
 * @param languageCode Language code to determine voice and service
 * @param therapistId Optional therapist ID for persona-specific voice selection
 * @returns Base64-encoded audio data
 */
export async function textToSpeech(text: string, languageCode: LanguageCode, therapistId?: string | number): Promise<string> {
  try {
    console.log(`[AudioProcessing] Converting text to speech in language: ${languageCode}`);
    
    // For Cantonese, prefer Azure TTS for better pronunciation consistency
    if (languageCode === 'zh_HK' || languageCode === 'yue') {
      console.log(`[AudioProcessing] Using Azure TTS for Cantonese pronunciation`);
      return await generateAzureCantoneseAudio(text);
    }
    
    // Get the language-optimized voice for this language
    const selectedVoice = getVoiceForLanguage(languageCode, 'general');
    
    // Preprocess text to handle multiple lines and improve TTS processing
    const processedText = preprocessTextForTTS(text, languageCode);
    
    // Create cache key based on processed text, language, and voice model for consistency
    const cacheKey = crypto.createHash('md5').update(`${processedText}_${languageCode}_${selectedVoice}`).digest('hex');
    
    // Check if we have cached audio for this exact processed text and language
    if (voiceCache.has(cacheKey)) {
      console.log(`[AudioProcessing] Using cached audio for identical content (therapist: ${therapistId || 'default'})`);
      return voiceCache.get(cacheKey)!;
    }
    
    // Generate new audio with language-optimized voice
    console.log(`[AudioProcessing] Generating NEW audio with voice "${selectedVoice}" for language: ${languageCode}, therapist: ${therapistId || 'default'}`);
    
    // Generate speech using OpenAI with language-optimized voice
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: selectedVoice,
      input: processedText,
      speed: 1.0,
      response_format: "mp3"
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    
    // Convert buffer to base64
    const base64Audio = buffer.toString('base64');
    
    // Cache the audio for future identical requests
    voiceCache.set(cacheKey, base64Audio);
    console.log(`[AudioProcessing] Speech generation successful. Audio size: ${buffer.length} bytes. Cached for future use.`);
    return base64Audio;
  } catch (error: any) {
    console.error("[AudioProcessing] Error generating speech:", error);
    throw new Error(`Failed to generate speech: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Preprocess Cantonese text for better pronunciation
 * @param text Original Cantonese text
 * @returns Processed text with pronunciation hints
 */
function preprocessCantoneseText(text: string): string {
  // Add explicit Cantonese language marker to force OpenAI recognition
  let processedText = `[粤语] ${text}`;
  
  // Add tone markers and pronunciation hints for common Cantonese words
  const cantoneseReplacements: Record<string, string> = {
    // Common Cantonese particles and expressions
    '嘅': '嘅', // Keep as is - possessive particle
    '咗': '咗', // Keep as is - past tense marker
    '呢': '呢', // Keep as is - this/these
    '嗰': '嗰', // Keep as is - that/those
    '咁': '咁', // Keep as is - so/like this
    '啲': '啲', // Keep as is - some/plural marker
    '佢': '佢', // Keep as is - he/she/it
    '係': '係', // Keep as is - to be
    '唔': '唔', // Keep as is - not
    '喺': '喺', // Keep as is - at/in
    '咩': '咩', // Keep as is - what
    '點解': '點解', // Keep as is - why
    '好': '好', // Keep as is - good/very
    '冇': '冇', // Keep as is - don't have
    '會': '會', // Keep as is - will/can
    '同': '同', // Keep as is - with/and
    '個': '個', // Keep as is - classifier
    '有': '有', // Keep as is - have
    '去': '去', // Keep as is - go
    '嚟': '嚟', // Keep as is - come
    '話': '話', // Keep as is - say
    '講': '講', // Keep as is - speak
    
    // Add phonetic spacing for better pronunciation and force Cantonese recognition
    '醫生': '醫 生',
    '治療師': '治療 師', 
    '心理': '心 理',
    '傾偈': '傾 偈',
    '而家': '而 家',
    '問題': '問 題',
    '感覺': '感 覺',
    '情緒': '情 緒',
    '壓力': '壓 力',
    '困難': '困 難',
    '解決': '解 決',
    '幫助': '幫 助',
    '支持': '支 持',
    '理解': '理 解',
    '明白': '明 白',
    
    // Force Cantonese markers to override language detection
    'Dee醫生': 'Dee 醫 生',
    'Alex醫生': 'Alex 醫 生',
    'Dr.': '',  // Remove English text that confuses language detection
    'Dr ': '',
    'Therapy': '治療',
    'Coach': '教練',
    '改善': '改 善'
  };
  
  // Apply replacements
  Object.entries(cantoneseReplacements).forEach(([original, replacement]) => {
    processedText = processedText.replace(new RegExp(original, 'g'), replacement);
  });
  
  // Add pauses for better phrasing
  processedText = processedText.replace(/([。！？])/g, '$1 ');
  processedText = processedText.replace(/([，；])/g, '$1');
  
  return processedText;
}

/**
 * Generate speech using Python TTS services (PaddleSpeech or fallback)
 * @param text Text to convert to speech
 * @param languageCode Language code for TTS
 * @returns Base64-encoded audio data
 */
async function generatePythonTTSAudio(text: string, languageCode: LanguageCode): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`[AudioProcessing] Generating speech using Python TTS for language: ${languageCode}`);
      
      // First try PaddleSpeech, then fallback to simple TTS
      const pythonProcess = spawn('python3', ['server/paddle_tts_service.py']);
      
      let responseData = '';
      let errorData = '';
      
      // Send request data to Python script
      const requestData = JSON.stringify({
        text: text,
        language: languageCode
      });
      
      pythonProcess.stdin.write(requestData);
      pythonProcess.stdin.end();
      
      // Collect response data
      pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.log(`[PythonTTS] ${data.toString().trim()}`);
      });
      
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const response = JSON.parse(responseData.trim());
            if (response.error) {
              // Try fallback service
              trySimpleTTSFallback(text, languageCode, resolve, reject);
            } else {
              console.log(`[AudioProcessing] PaddleSpeech generation successful`);
              resolve(response.audioData);
            }
          } catch (parseError) {
            trySimpleTTSFallback(text, languageCode, resolve, reject);
          }
        } else {
          // Try fallback service
          trySimpleTTSFallback(text, languageCode, resolve, reject);
        }
      });
      
      pythonProcess.on('error', (error) => {
        trySimpleTTSFallback(text, languageCode, resolve, reject);
      });
      
    } catch (error: any) {
      trySimpleTTSFallback(text, languageCode, resolve, reject);
    }
  });
}

/**
 * Fallback to simple TTS service when PaddleSpeech fails
 */
function trySimpleTTSFallback(text: string, languageCode: LanguageCode, resolve: Function, reject: Function) {
  console.log(`[AudioProcessing] Trying simple TTS fallback for language: ${languageCode}`);
  
  const fallbackProcess = spawn('python3', ['server/simple_tts_service.py']);
  
  let responseData = '';
  let errorData = '';
  
  const requestData = JSON.stringify({
    text: text,
    language: languageCode
  });
  
  fallbackProcess.stdin.write(requestData);
  fallbackProcess.stdin.end();
  
  fallbackProcess.stdout.on('data', (data) => {
    responseData += data.toString();
  });
  
  fallbackProcess.stderr.on('data', (data) => {
    errorData += data.toString();
    console.log(`[SimpleTTS] ${data.toString().trim()}`);
  });
  
  fallbackProcess.on('close', (code) => {
    if (code === 0) {
      try {
        const response = JSON.parse(responseData.trim());
        if (response.error) {
          reject(new Error(response.error));
        } else {
          console.log(`[AudioProcessing] Simple TTS generation successful`);
          resolve(response.audioData);
        }
      } catch (parseError) {
        reject(new Error(`Failed to parse Simple TTS response: ${parseError}`));
      }
    } else {
      reject(new Error(`Simple TTS process exited with code ${code}: ${errorData}`));
    }
  });
  
  fallbackProcess.on('error', (error) => {
    reject(new Error(`Failed to start Simple TTS process: ${error.message}`));
  });
}

/**
 * Generate authentic Cantonese audio using specialized TTS
 * @param text Cantonese text to convert to speech
 * @returns Base64-encoded audio data
 */
async function generateCantoneseAudio(text: string, therapistId?: string | number): Promise<string> {
  try {
    console.log(`[AudioProcessing] Generating authentic Cantonese audio for text: ${text.substring(0, 50)}...`);
    
    // First priority: Use enhanced OpenAI configuration with persona-specific voice selection
    try {
      console.log("[AudioProcessing] Using enhanced OpenAI configuration for Cantonese pronunciation");
      
      // Get persona-specific voice for Cantonese, falling back to alloy if no therapist specified
      const voice = getVoiceForLanguage('zh_HK', therapistId);
      console.log(`[AudioProcessing] Using voice "${voice}" for Cantonese therapist: ${therapistId || 'default'}`);
      
      // Pre-process text for better Cantonese pronunciation
      const processedText = preprocessCantoneseText(text);
      
      console.log(`[AudioProcessing] Processed text for better pronunciation: ${processedText.substring(0, 50)}...`);
      console.log(`[AudioProcessing] Using pure Cantonese text without language markers`);
      
      const mp3Response = await openai.audio.speech.create({
        model: "tts-1-hd", // HD model for maximum clarity
        voice: voice, // Use persona-specific voice
        input: processedText, // Use processed text without markers
        speed: 1.0, // Standard speed for all languages
      });
      
      const buffer = Buffer.from(await mp3Response.arrayBuffer());
      const base64Audio = buffer.toString('base64');
      
      console.log(`[AudioProcessing] Cantonese audio generated using OpenAI. Audio size: ${buffer.length} bytes`);
      return base64Audio;
      
    } catch (openaiError) {
      console.log(`[AudioProcessing] OpenAI TTS failed, trying alternative services: ${openaiError}`);
    }
    
    // Try Google Cloud TTS which supports native Cantonese
    if (process.env.GOOGLE_CLOUD_API_KEY) {
      try {
        return await generateGoogleCantoneseAudio(text);
      } catch (googleError) {
        console.log(`[AudioProcessing] Google TTS failed: ${googleError}`);
      }
    }
    
    // Try Azure Cognitive Services TTS for Cantonese
    if (process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) {
      try {
        return await generateAzureCantoneseAudio(text);
      } catch (azureError) {
        console.log(`[AudioProcessing] Azure TTS failed: ${azureError}`);
      }
    }
    
    // Last resort: Try Python TTS services
    try {
      return await generatePythonTTSAudio(text, 'zh_HK');
    } catch (pythonError) {
      console.log(`[AudioProcessing] Python TTS failed: ${pythonError}`);
    }
    
    throw new Error("All TTS services failed for Cantonese audio generation");
    
  } catch (error: any) {
    console.error("[AudioProcessing] Error generating Cantonese audio:", error);
    throw new Error(`Failed to generate Cantonese audio: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate Cantonese audio using Google Cloud TTS
 * @param text Text to convert to speech
 * @returns Base64-encoded audio data
 */
async function generateGoogleCantoneseAudio(text: string): Promise<string> {
  try {
    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_CLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'yue-HK', // Cantonese (Hong Kong)
          name: 'yue-HK-Standard-A', // Female Cantonese voice
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google TTS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[AudioProcessing] Google Cantonese TTS successful`);
    return data.audioContent;
    
  } catch (error: any) {
    console.error("[AudioProcessing] Google Cantonese TTS error:", error);
    throw error;
  }
}

/**
 * Generate Cantonese audio using Azure Cognitive Services
 * @param text Text to convert to speech
 * @returns Base64-encoded audio data
 */
async function generateAzureCantoneseAudio(text: string): Promise<string> {
  try {
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-HK">
        <voice name="zh-HK-HiuGaaiNeural">
          ${text}
        </voice>
      </speak>
    `;

    const response = await fetch(`https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY!,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      },
      body: ssml,
    });

    if (!response.ok) {
      throw new Error(`Azure TTS API error: ${response.status} ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    console.log(`[AudioProcessing] Azure Cantonese TTS successful. Audio size: ${audioBuffer.byteLength} bytes`);
    return base64Audio;
    
  } catch (error: any) {
    console.error("[AudioProcessing] Azure Cantonese TTS error:", error);
    throw error;
  }
}

/**
 * Map LanguageCode to appropriate voice model with persona considerations
 * @param languageCode The language code
 * @param therapistId Optional therapist ID for persona-specific voice selection
 * @returns Voice model name
 */
function getVoiceForLanguage(languageCode: LanguageCode, therapistId?: string | number): "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" {
  // Language-specific voice selection for better pronunciation
  const languageVoiceMapping: Record<string, "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"> = {
    'es': 'nova',    // Spanish - nova has better Spanish pronunciation with proper r rolling
    'en': 'alloy',   // English - alloy works well for English
    'zh': 'alloy',   // Chinese - alloy for consistency
    'zh_HK': 'alloy', // Cantonese - will use Azure if available
    'zh_TW': 'alloy', // Traditional Chinese
    'fr': 'alloy',   // French
    'de': 'alloy',   // German
    'it': 'nova',    // Italian - nova better for Romance languages
    'pt': 'nova',    // Portuguese - nova better for Romance languages
    'ru': 'alloy',   // Russian
    'ja': 'shimmer', // Japanese - shimmer optimized for Asian languages with better intonation
    'ko': 'shimmer', // Korean - shimmer for Asian languages
    'ar': 'alloy',   // Arabic
    'nl': 'alloy',   // Dutch
    'uk': 'alloy',   // Ukrainian
  };
  
  // Use language-specific voice if available
  if (languageVoiceMapping[languageCode]) {
    console.log(`[AudioProcessing] Using language-optimized voice "${languageVoiceMapping[languageCode]}" for ${languageCode}`);
    return languageVoiceMapping[languageCode];
  }
  
  // Default fallback
  return "alloy";
}

/**
 * Map LanguageCode to Whisper language code
 * @param languageCode Our app's language code
 * @returns Whisper-compatible language code
 */
function getLanguageHintForWhisper(languageCode: LanguageCode): string | undefined {
  // Mapping our language codes to Whisper's expected codes
  switch (languageCode) {
    case 'en': return 'en';
    case 'zh': return 'zh';
    case 'zh_TW': return 'zh';
    case 'zh_HK': return 'zh'; // Cantonese (Traditional)
    case 'yue': return 'zh';   // Cantonese (ISO code)
    case 'es': return 'es';
    case 'ja': return 'ja';
    case 'ko': return 'ko';
    case 'fr': return 'fr';
    case 'de': return 'de';
    case 'it': return 'it';
    case 'pt': return 'pt';
    case 'nl': return 'nl';
    case 'ru': return 'ru';
    case 'uk': return 'uk';
    case 'ar': return 'ar';
    default: return undefined; // Let Whisper auto-detect
  }
}