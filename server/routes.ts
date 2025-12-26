import { Request, Response, Express, NextFunction } from "express";
import { createServer, Server } from "http";
import path from "path";
import { storage } from "./storage";
import { ZodError } from "zod";
import { 
  InsertCustomTherapist, 
  insertCustomTherapistSchema,
  TherapyApproach,
  QuoteCategory,
  JournalingPromptCategory,
  CustomTherapist,
} from "@shared/schema";
import { transcribeAudio, textToSpeech } from "./api/audioProcessing";
import { updateDrAZSpeakingStyle, getDrAZSpeakingStyle } from "./api/drAZPersonality";
import { LanguageCode } from "./api/openai";

// Default user ID for testing
export const DEFAULT_USER_ID = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  // Your existing route handlers here...

  // Create a new custom therapist
  app.post("/api/custom-therapists", async (req: Request, res: Response) => {
    try {
      // 解析并验证基本治疗师数据
      const therapistData = insertCustomTherapistSchema.parse(req.body);
      
      // 确保所有个性特征值都有默认值
      if (therapistData.rationalEmotional === undefined) therapistData.rationalEmotional = 50;
      if (therapistData.friendlyStrict === undefined) therapistData.friendlyStrict = 50;
      if (therapistData.practicalCreative === undefined) therapistData.practicalCreative = 50;
      if (therapistData.directIndirect === undefined) therapistData.directIndirect = 50;
      
      // 记录个性特质值
      console.log("Personality trait values:", {
        rationalEmotional: therapistData.rationalEmotional,
        friendlyStrict: therapistData.friendlyStrict,
        practicalCreative: therapistData.practicalCreative,
        directIndirect: therapistData.directIndirect
      });
      
      // 检测是否是"最差治疗师"类型
      const isWorstPerson = therapistData.name?.toLowerCase().includes('worst') || 
                          therapistData.description?.toLowerCase().includes('mean') || 
                          therapistData.description?.toLowerCase().includes('worst') || 
                          (therapistData.friendlyStrict >= 85) || 
                          (therapistData.directIndirect <= 15 && therapistData.friendlyStrict >= 80);
      
      // 如果是"最差治疗师"类型，使用预设的极端值
      if (isWorstPerson) {
        therapistData.rationalEmotional = 15;  // 高度理性
        therapistData.friendlyStrict = 100;    // 绝对严格
        therapistData.practicalCreative = 20;  // 高度实际
        therapistData.directIndirect = 0;      // 极其直接
      }
      
      // 使用增强版的说话风格生成函数，提供多语言支持和一致的格式
      try {
        // 动态导入 customTherapistResponses 模块以避免循环依赖
        const { generateSpeakingStyleDescription } = await import('./api/customTherapistResponses');
        
        // 为新创建的治疗师生成说话风格描述 - 使用英文版本，翻译会在后续步骤中处理
        console.log("[CreateTherapist] 使用增强版说话风格算法为新治疗师生成说话风格描述");
        const generatedSpeakingStyle = generateSpeakingStyleDescription(therapistData, 'en');
        console.log(`[CreateTherapist] 成功生成说话风格描述，长度: ${generatedSpeakingStyle.length}字符`);
        
        // 如果提供了基本风格描述，保留它
        let baseStyle = "";
        if (therapistData.speakingStyle && therapistData.speakingStyle.length > 10) {
          // 检查现有风格描述是否已经包含了新的模板特征
          if (!therapistData.speakingStyle.includes("This therapist's communication style") &&
              !therapistData.speakingStyle.includes("Speaking Style Characteristics")) {
            baseStyle = therapistData.speakingStyle + "\n\nAdditionally, the enhanced description:\n\n";
          }
        }
        
        // 为最差治疗师添加特殊的风格描述
        if (isWorstPerson) {
          baseStyle += "IMPORTANT OVERRIDE: I use deliberately shocking, brutally critical language. I show ZERO sympathy or coddling in my responses. I use harsh, cold, and confrontational feedback consistently. I am BRUTALLY DIRECT AND BLUNT WITH NO FILTER. I deliver my feedback in the most confrontational and unfiltered way possible.\n\n";
        }
        
        // 更新说话风格 - 使用新生成的格式
        therapistData.speakingStyle = baseStyle + generatedSpeakingStyle;
        
      } catch (error) {
        console.error('[CreateTherapist] 使用增强版说话风格生成算法失败，回退到旧版本:', error);
        
        // 如果导入失败，回退到旧的方法生成说话风格
        // 获取理性/情感的描述
        let rationalEmotionalStyle = "";
        if (therapistData.rationalEmotional < 30) {
          rationalEmotionalStyle = "I use highly logical, analytical language with minimal emotional content. I focus on facts, evidence, and rational analysis in all responses.";
        } else if (therapistData.rationalEmotional < 50) {
          rationalEmotionalStyle = "I prioritize logical reasoning while acknowledging emotions. I use clear, factual language with some emotional recognition.";
        } else if (therapistData.rationalEmotional < 70) {
          rationalEmotionalStyle = "I balance logical analysis with emotional validation equally. I acknowledge feelings while also examining thoughts.";
        } else if (therapistData.rationalEmotional < 90) {
          rationalEmotionalStyle = "I prioritize emotional understanding while including some logic. I use warm, empathetic language with occasional analytical points.";
        } else {
          rationalEmotionalStyle = "I use highly empathetic, emotionally attuned language throughout. I focus extensively on feelings, emotional needs and experiences.";
        }
        
        // 获取友好/严格的描述
        let friendlyStrictStyle = "";
        if (therapistData.friendlyStrict < 30) {
          friendlyStrictStyle = "My tone is very warm, friendly, and casual throughout. I'm extremely encouraging and supportive in every response.";
        } else if (therapistData.friendlyStrict < 50) {
          friendlyStrictStyle = "I maintain a generally warm and approachable tone. I use encouraging language and positive reinforcement often.";
        } else if (therapistData.friendlyStrict < 70) {
          friendlyStrictStyle = "I balance professional distance with approachable language. I alternate between friendly support and professional guidance.";
        } else if (therapistData.friendlyStrict < 90) {
          friendlyStrictStyle = "I maintain a predominantly formal, professional tone. I provide direct feedback with respectful delivery.";
        } else {
          friendlyStrictStyle = "I maintain strict, formal professional boundaries. I provide candid, unfiltered feedback without softening.";
        }
        
        // 获取实用/创意的描述
        let practicalCreativeStyle = "";
        if (therapistData.practicalCreative < 30) {
          practicalCreativeStyle = "I focus exclusively on practical, concrete solutions. I provide specific, actionable steps in every response.";
        } else if (therapistData.practicalCreative < 50) {
          practicalCreativeStyle = "I prioritize practical solutions with occasional creative elements. I suggest clear action steps with some room for personalization.";
        } else if (therapistData.practicalCreative < 70) {
          practicalCreativeStyle = "I balance practical guidance with creative exploration equally. I offer a mix of concrete suggestions and innovative possibilities.";
        } else if (therapistData.practicalCreative < 90) {
          practicalCreativeStyle = "I prioritize creative exploration with practical grounding. I use metaphors, stories, and innovative frameworks frequently.";
        } else {
          practicalCreativeStyle = "I focus extensively on creative, innovative approaches. I use metaphors, storytelling, and imaginative exercises extensively.";
        }
        
        // 获取直接/间接的描述
        let directIndirectStyle = "";
        if (therapistData.directIndirect < 30) {
          directIndirectStyle = "I am extremely direct, blunt and straightforward. I state observations and opinions without softening.";
        } else if (therapistData.directIndirect < 50) {
          directIndirectStyle = "I communicate mostly directly with some tactful phrasing. I state most points clearly but soften difficult feedback.";
        } else if (therapistData.directIndirect < 70) {
          directIndirectStyle = "I balance directness with diplomacy. I alternate between straightforward points and more gentle suggestions.";
        } else if (therapistData.directIndirect < 90) {
          directIndirectStyle = "I use gentle, indirect communication approaches. I phrase feedback as questions or suggestions rather than direct statements.";
        } else {
          directIndirectStyle = "I am very indirect and careful in raising concerns. I use highly diplomatic, cushioned language especially around difficult topics.";
        }
        
        // 为最差治疗师添加特殊的风格描述
        if (isWorstPerson) {
          friendlyStrictStyle = "I use deliberately shocking, brutally critical language. I show ZERO sympathy or coddling in my responses. I use harsh, cold, and confrontational feedback consistently.";
          directIndirectStyle = "I am BRUTALLY DIRECT AND BLUNT WITH NO FILTER. I deliver my feedback in the most confrontational and unfiltered way possible.";
        }
        
        // 组合所有风格描述
        const fullStyleDescription = `${rationalEmotionalStyle} ${friendlyStrictStyle} ${practicalCreativeStyle} ${directIndirectStyle}`;
        
        // 如果提供了基本风格描述，保留它
        let baseStyle = "";
        if (therapistData.speakingStyle && therapistData.speakingStyle.length > 10) {
          // 保留用户提供的基本描述作为开头，但确保不重复自动生成的部分
          if (!therapistData.speakingStyle.includes(rationalEmotionalStyle.substring(0, 20)) &&
              !therapistData.speakingStyle.includes(friendlyStrictStyle.substring(0, 20))) {
            baseStyle = therapistData.speakingStyle + " Additionally: ";
          }
        }
        
        // 更新说话风格 - 完全替换为新格式
        therapistData.speakingStyle = `${baseStyle}${fullStyleDescription}`;
      }
      
      console.log("Updated speaking style based on personality traits:", therapistData.speakingStyle);
      
      // 导入并调用生成翻译的函数
      try {
        const { generateTherapistTranslations } = await import("./api/therapistTranslation");
        
        // 生成所有字段的多语言翻译
        console.log("开始为新治疗师生成翻译");
        const translations = await generateTherapistTranslations(therapistData);
        console.log("生成的翻译字段:", Object.keys(translations));
        
        // 合并原始数据和翻译数据
        // 确保类型安全 - 必需字段已经在therapistData中得到验证
        const therapistWithTranslations: InsertCustomTherapist = {
          ...therapistData,  // 这里包含了所有必需字段
          ...translations    // 这里只有可选的翻译字段
        };
        
        // 创建带有翻译的治疗师
        const newTherapist = await storage.createCustomTherapist(therapistWithTranslations);
        console.log("成功创建带有翻译的治疗师");
        res.status(201).json(newTherapist);
      } catch (translationError) {
        // 如果翻译失败，仍然创建治疗师，但没有翻译
        console.error("生成翻译失败，创建未翻译的治疗师:", translationError);
        const newTherapist = await storage.createCustomTherapist(therapistData);
        res.status(201).json(newTherapist);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid therapist data", errors: error.errors });
      } else {
        console.error("Error creating custom therapist:", error);
        res.status(500).json({ message: "Failed to create custom therapist" });
      }
    }
  });

  // Chat API endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      let { message, sessionId, therapistId } = req.body;
      let { therapyApproach, promptPrefix } = req.body;
      
      // Validate the input using our schema
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Invalid message format" });
      }
      
      // Ensure we have a valid session ID - create one if not provided
      if (!sessionId) {
        const newSession = await storage.createSession({
          userId: DEFAULT_USER_ID,
          therapyApproach: therapyApproach || 'general'
        });
        sessionId = newSession.id;
        console.log(`Created new session: ${sessionId}`);
      }
      
      // Get user's language (default to English)
      const language = req.body.language || 'en';
      
      // 处理特殊治疗师人格
      // 如果是tough_love（Dr.Dee），强制使用tough_love方法
      if (therapistId === 'tough_love') {
        therapyApproach = 'tough_love';
        console.log("Using Dr.Dee (tough_love) personality");
      }
      
      // 如果是Dr.AZ (ID 9)，使用特殊标记确保使用模板系统
      const isDrAZ = therapistId === 9 || (typeof therapistId === 'string' && therapistId.toLowerCase().includes('dr.az'));
      if (isDrAZ) {
        console.log("使用Dr.AZ特殊模板系统，强制使用模板生成回复，避免乱码");
      }
      
      console.log(`Chat request: message length ${message.length}, therapist: ${therapistId}, approach: ${therapyApproach || 'general'}`);
      
      // If therapistId is a number, it's a custom therapist
      let customTherapistPrompt = "";
      if (typeof therapistId === 'number') {
        try {
          const customTherapist = await storage.getCustomTherapist(therapistId);
          if (customTherapist) {
            // 如果存在极端性格特征，则将其打印出来
            console.log(`Creating therapist with explicitly set personality traits: {
              rationalEmotional: ${customTherapist.rationalEmotional},
              friendlyStrict: ${customTherapist.friendlyStrict},
              practicalCreative: ${customTherapist.practicalCreative},
              directIndirect: ${customTherapist.directIndirect}
            }`);
            
            // 使用强化版本的自定义治疗师提示，强调性格特征
            // 获取当前语言设置
            const currentLanguage = language || 'en';
            console.log(`Preparing custom therapist prompt in language: ${currentLanguage}`);
            
            // 针对不同语言添加额外的语言特定指令
            let languageSpecificInstructions = "";
            
            if (currentLanguage === 'zh' || currentLanguage === 'zh_TW') {
              // 针对中文用户的特殊指令
              languageSpecificInstructions = `
特别针对中文回复的重要指令:
1. 你必须完全使用${currentLanguage === 'zh' ? '简体中文' : '繁体中文'}回复
2. 你的中文表达风格必须明确体现上述个性特征
3. 如果你被指示要直接、尖锐或严厉 - 在中文回复中必须表现得非常直接，不要软化语言
4. 如果你被指示要富有同理心或情感 - 在中文回复中必须使用非常丰富的情感表达
5. 如果你被指示要有创意 - 在中文回复中必须使用大量比喻和创意示例
6. 如果你被指示要实际 - 在中文回复中必须严格关注可行动的步骤
7. 你的中文回复的措辞、语气和结构必须与你的个性特征完全一致
8. 绝对不要在中文和英文之间混合语言
`;
            } else if (currentLanguage === 'ja') {
              // 针对日语用户的特殊指令
              languageSpecificInstructions = `
日本語の返答に関する特別な指示:
1. あなたは必ず日本語のみで返答してください
2. あなたの日本語の表現スタイルは上記の性格特性を明確に反映する必要があります
3. もし直接的、鋭い、または厳しいよう指示されていれば - 日本語の返答で非常に直接的になり、言葉を柔らかくしないでください
4. もし共感的または感情的であるよう指示されていれば - 日本語の返答で非常に豊かな感情表現を使用してください
5. もし創造的であるよう指示されていれば - 日本語の返答で多くの比喩や創造的な例を使用してください
6. もし実用的であるよう指示されていれば - 日本語の返答で厳密に実行可能なステップに焦点を当ててください
7. あなたの日本語の返答の言葉遣い、トーン、構造はあなたの性格特性と完全に一致する必要があります
8. 決して日本語と英語を混ぜないでください
`;
            } else if (currentLanguage !== 'en') {
              // 针对其他语言的通用指令
              languageSpecificInstructions = `
LANGUAGE-SPECIFIC INSTRUCTIONS FOR ${currentLanguage.toUpperCase()}:
1. You MUST respond ONLY in ${currentLanguage} language
2. Your ${currentLanguage} expressions MUST clearly reflect the personality traits described above
3. If instructed to be direct, blunt, or strict - be VERY direct in your ${currentLanguage} responses, do not soften your language
4. If instructed to be empathetic or emotional - use VERY rich emotional expressions in your ${currentLanguage} responses
5. If instructed to be creative - use MANY metaphors and creative examples in your ${currentLanguage} responses
6. If instructed to be practical - focus STRICTLY on actionable steps in your ${currentLanguage} responses
7. Your ${currentLanguage} word choice, tone, and structure MUST be perfectly aligned with your personality traits
8. NEVER mix languages between ${currentLanguage} and English
`;
            }
            
            // 获取自定义治疗师的个性特质 - 使用 typeof 检查以正确处理 0 值
            const rationalEmotional = typeof customTherapist.rationalEmotional === 'number' ? customTherapist.rationalEmotional : 50;
            const friendlyStrict = typeof customTherapist.friendlyStrict === 'number' ? customTherapist.friendlyStrict : 50;
            const practicalCreative = typeof customTherapist.practicalCreative === 'number' ? customTherapist.practicalCreative : 50;
            const directIndirect = typeof customTherapist.directIndirect === 'number' ? customTherapist.directIndirect : 50;
            
            console.log("Creating therapist with explicitly set personality traits:", {
              rationalEmotional,
              friendlyStrict,
              practicalCreative,
              directIndirect
            });
            
            // 创建个性特质描述
            const isRational = rationalEmotional > 70;
            const isEmotional = rationalEmotional < 30;
            const isStrict = friendlyStrict > 70;
            const isFriendly = friendlyStrict < 30;
            const isPractical = practicalCreative < 30;
            const isCreative = practicalCreative > 70;
            const isDirect = directIndirect < 30;
            const isIndirect = directIndirect > 70;
            
            // 构建个性特质描述文本
            let personalityDescription = "CRITICAL PERSONALITY TRAITS:\n";
            personalityDescription += isRational ? "- You use highly technical, precise, and academic language\n" : 
                                      isEmotional ? "- You use accessible, simple language focused on emotional connection\n" :
                                      "- You balance technical and accessible language\n";
                                      
            personalityDescription += isStrict ? "- You are extremely strict, challenging, and critical\n" :
                                      isFriendly ? "- You are exceptionally warm, supportive, and nurturing\n" :
                                      "- You balance warmth with professional distance\n";
                                      
            personalityDescription += isPractical ? "- You focus exclusively on concrete, actionable advice\n" :
                                      isCreative ? "- You use abundant metaphors, stories, and creative approaches\n" :
                                      "- You include both practical steps and creative perspectives\n";
                                      
            personalityDescription += isDirect ? "- You are extremely direct and straightforward\n" :
                                      isIndirect ? "- You are gentle and indirect, suggesting rather than stating\n" :
                                      "- You balance directness with tact\n";
                                      
            // 添加强度指标，使AI清楚地了解特质强度
            personalityDescription += "\nTRAIT STRENGTH (scale 0-100):\n";
            personalityDescription += `- Rational vs Emotional: ${rationalEmotional}/100 (${rationalEmotional < 50 ? "More emotional" : "More rational"})\n`;
            personalityDescription += `- Friendly vs Strict: ${friendlyStrict}/100 (${friendlyStrict < 50 ? "More friendly" : "More strict"})\n`;
            personalityDescription += `- Practical vs Creative: ${practicalCreative}/100 (${practicalCreative < 50 ? "More practical" : "More creative"})\n`;
            personalityDescription += `- Direct vs Indirect: ${directIndirect}/100 (${directIndirect < 50 ? "More direct" : "More indirect"})\n`;
            
            console.log("生成的个性特质描述:", personalityDescription);
            
            // 创建带个性特质的提示模板
            // 对于极端特质值，增加额外的强调
            const hasExtremeTraits = 
              rationalEmotional <= 10 || rationalEmotional >= 90 ||
              friendlyStrict <= 10 || friendlyStrict >= 90 ||
              practicalCreative <= 10 || practicalCreative >= 90 ||
              directIndirect <= 10 || directIndirect >= 90;
            
            console.log(`Therapist has extreme traits: ${hasExtremeTraits ? "YES" : "NO"}`);
            
            // 极端特质组合描述
            let extremeTraitDescriptions = [];
            
            if (rationalEmotional <= 10) {
              extremeTraitDescriptions.push("EXTREMELY emotional, feeling-focused, and empathetic in your approach");
            } else if (rationalEmotional >= 90) {
              extremeTraitDescriptions.push("EXTREMELY rational, logical, and analytical in your approach");
            }
            
            if (friendlyStrict >= 90) {
              extremeTraitDescriptions.push("EXTREMELY strict, harsh, critical, and confrontational");
            } else if (friendlyStrict <= 10) {
              extremeTraitDescriptions.push("EXTREMELY warm, supportive, and nurturing");
            }
            
            if (practicalCreative >= 90) {
              extremeTraitDescriptions.push("EXTREMELY creative, metaphorical, and story-focused");
            } else if (practicalCreative <= 10) {
              extremeTraitDescriptions.push("EXTREMELY practical, concrete, and action-oriented");
            }
            
            if (directIndirect <= 10) {
              extremeTraitDescriptions.push("EXTREMELY direct, blunt, and straightforward");
            } else if (directIndirect >= 90) {
              extremeTraitDescriptions.push("EXTREMELY indirect, gentle, and suggestive");
            }
            
            // 特质组合提示
            const extremeTraitCombo = extremeTraitDescriptions.length > 0 
              ? `YOU ARE: ${extremeTraitDescriptions.join(" AND ")}\n\nThis unique trait combination MUST be reflected in EVERY response!`
              : "";
              
            // 处理speakingStyle中可能存在的额外信息
            const speakingStyleOriginal = customTherapist.speakingStyle || "";
            
            // 提取关键句子和模式，用于强化说话风格
            const speakingStyleLines = speakingStyleOriginal
              .split(/[.。!！?？]/)
              .filter(line => line.trim().length > 10)
              .map(line => line.trim())
              .slice(0, 5); // 最多使用前5个关键句
            
            // 创建说话风格的详细分解指南
            let speechPatternGuide = "";
            
            if (speakingStyleLines.length > 0) {
              speechPatternGuide = `
EXACT SPEECH PATTERNS TO MIMIC:
${speakingStyleLines.map((line, i) => `${i+1}. "${line}"`).join('\n')}

YOU MUST ADOPT THESE EXACT SPEECH PATTERNS! Your response will be rejected if it doesn't match these patterns.
`;
            }
            
            customTherapistPrompt = `
!!!!! CRITICAL PERSONALITY TRAITS AND SPEECH PATTERNS - YOU MUST FOLLOW THESE INSTRUCTIONS PRECISELY !!!!!

YOU ARE: "${customTherapist.name}", a therapist with this MANDATORY character profile:

${personalityDescription}

${extremeTraitCombo}

====== SPEAKING STYLE - YOU MUST IMITATE THIS EXACTLY ======
${customTherapist.speakingStyle}
${speechPatternGuide}

Therapeutic approach:
${customTherapist.approach}

ABSOLUTE REQUIREMENTS:
1. Your responses MUST sound EXACTLY like the speaking style described above.
2. Copy the exact tone, phrasing patterns, word choices, and speech rhythm from the speaking style.
3. Every sentence should reflect the personality traits AND the specific speaking style.
4. If given examples of phrases or speech patterns, incorporate similar patterns in your response.
5. NEVER respond in a generic therapy voice - your unique speaking style is what makes you distinctive.
6. EXTREME trait values (0-10 or 90-100) must be DRAMATICALLY emphasized in your responses.
7. The speaking style description overrides any generic therapy conventions - follow it precisely.

${languageSpecificInstructions}

SPEAKING STYLE GUIDELINES BASED ON TRAITS:
- With EXTREME STRICT trait (${friendlyStrict}/100): Use harsh, judgmental, critical, and confrontational language
- With EXTREME FRIENDLY trait (${100-friendlyStrict}/100): Use extraordinarily warm, nurturing, and encouraging language  
- With EXTREME RATIONAL trait (${rationalEmotional}/100): Use highly technical, precise, and analytical terminology
- With EXTREME EMOTIONAL trait (${100-rationalEmotional}/100): Use emotionally rich, heartfelt, and feeling-focused language
- With EXTREME PRACTICAL trait (${100-practicalCreative}/100): Focus exclusively on concrete, step-by-step, actionable advice
- With EXTREME CREATIVE trait (${practicalCreative}/100): Use abundant metaphors, vivid imagery, stories, and creative expressions
- With EXTREME DIRECT trait (${100-directIndirect}/100): Be blunt, straightforward, and unapologetically honest
- With EXTREME INDIRECT trait (${directIndirect}/100): Be gentle, suggestive, and diplomatically tactful in all communications

TRAIT INTENSITY APPLICATION:
- For traits rated 0-10 or 90-100: EXTREME application - this trait should dominate every aspect of your responses
- For traits rated 10-30 or 70-90: STRONG application - this trait should be clearly noticeable throughout
- For traits rated 30-70: MODERATE application - balance this trait with others

YOUR PRIMARY GOAL IS TO PERFECTLY REPLICATE THE SPEAKING STYLE WHILE EMBODYING THE PERSONALITY TRAITS.
`;
            
            console.log(`Using custom therapist #${therapistId}: ${customTherapist.name}`);
          }
        } catch (error) {
          console.error("Error fetching custom therapist:", error);
        }
      }
      
      // Determine final prompt prefix to use
      const finalPromptPrefix = customTherapistPrompt || promptPrefix;
      
      try {
        let aiResponse: string;
        
        // Special handling for Dr. Dee - use sarcastic templates instead of AI
        if (therapistId === 'tough_love') {
          console.log("🔥🔥🔥 检测到Dr.Dee - 使用阴阳怪气模板系统生成回复 🔥🔥🔥");
          const { generateDrDeeResponse } = await import("./api/drDeeResponses");
          aiResponse = await generateDrDeeResponse(message, language as any, sessionId);
          console.log(`已生成Dr.Dee阴阳怪气回复 (${aiResponse.length}字符)`);
        } else {
          // Import and call the AI response function for other therapists
          const { getAIResponse, setCurrentLanguage } = await import("./api/openai");
          
          // Set the current language for the AI response
          setCurrentLanguage(language as any); // Type assertion to make TypeScript happy
          
          // Generate the response
          console.log("Calling AI for therapeutic response...");
          aiResponse = await getAIResponse(
            message,
            therapyApproach || 'general',
            finalPromptPrefix,
            language as any,
            therapistId
          );
        }
        
        // Perform sentiment analysis on user message
        const { analyzeSentiment } = await import("./api/openai");
        let userSentiment = null;
        try {
          userSentiment = await analyzeSentiment(message);
          console.log("User message sentiment analysis:", userSentiment);
        } catch (sentimentError) {
          console.error("Error analyzing sentiment:", sentimentError);
        }

        // Store user message in database with sentiment
        const userMessage = await storage.createMessage({
          sessionId,
          content: message,
          role: 'user',
          sentiment: userSentiment ? JSON.stringify(userSentiment) : null
        });

        // Store AI response in database with sourceLanguage for proper voice synthesis
        const assistantMessage = await storage.createMessage({
          sessionId,
          content: aiResponse,
          role: 'assistant',
          sentiment: null, // AI messages don't need sentiment analysis
          sourceLanguage: language // Set sourceLanguage to ensure correct voice synthesis
        });

        // Get all messages for this session to return complete conversation
        const allMessages = await storage.getSessionMessages(sessionId);
        
        console.log(`AI response generated (${aiResponse.length} chars)`);
        return res.json({ 
          response: aiResponse,
          sessionId,
          messages: allMessages
        });
      } catch (aiError) {
        console.error("Error generating AI response:", aiError);
        return res.status(500).json({ message: "Error generating response" });
      }
    } catch (error) {
      console.error("Chat endpoint error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all custom therapists for a user
  app.get("/api/users/:userId/custom-therapists", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Get all custom therapists for the user
      const therapists = await storage.getUserCustomTherapists(userId);
      
      // Log for debugging
      console.log(`Found ${therapists.length} custom therapists for user ${userId}`);
      
      return res.json(therapists);
    } catch (error) {
      console.error("Error fetching custom therapists:", error);
      return res.status(500).json({ message: "Failed to fetch custom therapists" });
    }
  });

  // Get a specific custom therapist by ID
  app.get("/api/custom-therapists/:id", async (req: Request, res: Response) => {
    try {
      const therapistId = parseInt(req.params.id, 10);
      if (isNaN(therapistId)) {
        return res.status(400).json({ message: "Invalid therapist ID" });
      }
      
      // Get the specific therapist
      const therapist = await storage.getCustomTherapist(therapistId);
      if (!therapist) {
        return res.status(404).json({ message: "Therapist not found" });
      }
      
      return res.json(therapist);
    } catch (error) {
      console.error("Error fetching custom therapist:", error);
      return res.status(500).json({ message: "Failed to fetch custom therapist" });
    }
  });
  
  // Update a custom therapist by ID
  app.patch("/api/custom-therapists/:id", async (req: Request, res: Response) => {
    try {
      const therapistId = parseInt(req.params.id, 10);
      if (isNaN(therapistId)) {
        return res.status(400).json({ message: "Invalid therapist ID" });
      }
      
      // 确保个性特质值都有有效值
      const updates = req.body;
      
      // 处理可能的null或undefined值
      if (updates.rationalEmotional === null) updates.rationalEmotional = 50;
      if (updates.friendlyStrict === null) updates.friendlyStrict = 50;
      if (updates.practicalCreative === null) updates.practicalCreative = 50;
      if (updates.directIndirect === null) updates.directIndirect = 50;
      
      console.log("Updating custom therapist with data:", {
        id: therapistId,
        personalityTraits: {
          rationalEmotional: updates.rationalEmotional,
          friendlyStrict: updates.friendlyStrict,
          practicalCreative: updates.practicalCreative,
          directIndirect: updates.directIndirect,
        }
      });
      
      // 使用存储接口更新治疗师
      const updatedTherapist = await storage.updateCustomTherapist(therapistId, updates);
      if (!updatedTherapist) {
        return res.status(404).json({ message: "Therapist not found or update failed" });
      }
      
      // 返回更新后的治疗师数据
      return res.json(updatedTherapist);
    } catch (error) {
      console.error("Error updating custom therapist:", error);
      return res.status(500).json({ message: "Failed to update custom therapist" });
    }
  });

  // Delete a custom therapist by ID
  app.delete("/api/custom-therapists/:id", async (req: Request, res: Response) => {
    try {
      const therapistId = parseInt(req.params.id, 10);
      if (isNaN(therapistId)) {
        return res.status(400).json({ message: "Invalid therapist ID" });
      }
      
      // First verify the therapist exists
      const therapist = await storage.getCustomTherapist(therapistId);
      if (!therapist) {
        return res.status(404).json({ message: "Therapist not found" });
      }
      
      console.log(`Deleting custom therapist with ID: ${therapistId}`);
      
      // Delete the therapist
      const success = await storage.deleteCustomTherapist(therapistId);
      if (success) {
        return res.json({ success: true, message: "Therapist deleted successfully" });
      } else {
        return res.status(500).json({ success: false, message: "Failed to delete therapist" });
      }
    } catch (error) {
      console.error("Error deleting custom therapist:", error);
      return res.status(500).json({ message: "Failed to delete custom therapist" });
    }
  });

  // Emotional journey endpoint for session
  app.get("/api/sessions/:sessionId/emotional-journey", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      // Get all messages for this session
      const messages = await storage.getSessionMessages(sessionId);
      
      // Filter user messages with sentiment data
      const userMessages = messages.filter(msg => 
        msg.role === 'user' && 
        msg.sentiment
      );
      
      // Parse sentiment data and create analysis
      const sentiments = userMessages.map(msg => {
        let sentimentData;
        try {
          sentimentData = JSON.parse(msg.sentiment || '{}');
        } catch {
          sentimentData = { category: 'neutral', score: 0 };
        }
        
        return {
          category: sentimentData.category || 'neutral',
          score: sentimentData.score || 0,
          keywords: [],
          summary: msg.content.substring(0, 100),
          timestamp: msg.timestamp.toISOString(),
          messageId: msg.id
        };
      }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Analyze emotional journey
      let journey: {
        trend: 'improving' | 'worsening' | 'fluctuating' | 'stable';
        averageScore: number;
        dominantEmotion: string;
        summary: string;
      } = {
        trend: 'stable',
        averageScore: 0,
        dominantEmotion: 'neutral',
        summary: 'Not enough data to analyze emotional patterns'
      };
      
      if (sentiments.length > 0) {
        const scores = sentiments.map(s => s.score);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        
        // Determine trend
        let trend: 'improving' | 'worsening' | 'fluctuating' | 'stable' = 'stable';
        if (sentiments.length >= 3) {
          const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
          const secondHalf = scores.slice(Math.floor(scores.length / 2));
          const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
          
          const difference = secondAvg - firstAvg;
          if (difference > 0.2) trend = 'improving';
          else if (difference < -0.2) trend = 'worsening';
          else if (Math.max(...scores) - Math.min(...scores) > 0.5) trend = 'fluctuating';
        }
        
        // Find dominant emotion
        const emotionCounts: Record<string, number> = {};
        sentiments.forEach(s => {
          emotionCounts[s.category] = (emotionCounts[s.category] || 0) + 1;
        });
        const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
          emotionCounts[a] > emotionCounts[b] ? a : b
        );
        
        // Create summary
        let summary = '';
        if (trend === 'improving') {
          summary = `Emotional state has been improving, showing more positive emotions over time.`;
        } else if (trend === 'worsening') {
          summary = `Emotional state shows some challenges, with ${dominantEmotion} being prominent.`;
        } else if (trend === 'fluctuating') {
          summary = `Emotional state varies, with ${dominantEmotion} being most common.`;
        } else {
          summary = `Emotional state remains stable, primarily ${dominantEmotion}.`;
        }
        
        journey = {
          trend,
          averageScore,
          dominantEmotion,
          summary
        };
      }
      
      return res.json({
        sentiments,
        journey
      });
      
    } catch (error) {
      console.error("Error fetching emotional journey:", error);
      return res.status(500).json({ message: "Failed to fetch emotional journey" });
    }
  });

  // Add translation API route
  app.post("/api/translate", async (req: Request, res: Response) => {
    try {
      const { text, targetLanguage } = req.body;
      
      if (!text || !targetLanguage) {
        return res.status(400).json({ 
          message: "Missing required parameters: text and targetLanguage" 
        });
      }
      
      // Default source language to English, but ideally we should detect it
      const sourceLanguage = req.body.sourceLanguage || "en";
      
      console.log(`[Translation API] Request to translate from ${sourceLanguage} to ${targetLanguage}`);
      
      // Special case for Chinese-to-Cantonese conversion
      const isChineseToCantonese = (
        (sourceLanguage === 'zh' || sourceLanguage === 'zh_TW') && 
        (targetLanguage === 'zh_HK' || targetLanguage === 'yue')
      );
      
      // Skip translation if source and target are the same (unless it's Chinese to Cantonese)
      if (sourceLanguage === targetLanguage && !isChineseToCantonese) {
        console.log(`[Translation API] Skipping translation - languages match: ${sourceLanguage}`);
        return res.json({
          translatedText: text,
          originalText: text,
          sourceLanguage,
          targetLanguage,
          isTranslated: false
        });
      }
      
      // Import translation function from API module
      const { translateText } = await import("./api/translation");
      
      // Attempt translation
      console.log(`[Translation API] Translating text (length: ${text.length})`);
      const translationResult = await translateText(text, sourceLanguage, targetLanguage);
      
      console.log(`[Translation API] Translation successful: ${sourceLanguage} → ${targetLanguage}`);
      res.json(translationResult);
    } catch (error) {
      console.error("[Translation API] Error:", error);
      res.status(500).json({ 
        translatedText: req.body.text,
        originalText: req.body.text,
        sourceLanguage: req.body.sourceLanguage || "en",
        targetLanguage: req.body.targetLanguage,
        isTranslated: false,
        error: "Failed to translate text"
      });
    }
  });

  // Add API route to check OpenAI API quota status
  app.get("/api/quota-status", async (_req: Request, res: Response) => {
    try {
      const { getQuotaStats } = await import("./api/quotaManager");
      const stats = getQuotaStats();
      res.json({
        ...stats,
        message: `API usage: ${stats.dailyUsage}/${stats.dailyPercentage.toFixed(1)}% daily, ${stats.hourlyUsage}/${stats.hourlyPercentage.toFixed(1)}% hourly`
      });
    } catch (error) {
      console.error("Error fetching quota stats:", error);
      res.status(500).json({ message: "Error fetching quota stats" });
    }
  });

  // 获取每日引用
  app.get("/api/users/:userId/daily-quote", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "无效的用户ID" });
      }
      
      console.log(`正在获取用户 ${userId} 的每日引用`);
      const dailyQuote = await storage.getDailyQuote(userId);
      
      if (!dailyQuote) {
        console.log(`未找到用户 ${userId} 的引用，将生成新引用`);
        
        // 如果没有找到引用，生成一个新引用
        const { generateQuote } = await import("./api/quotes");
        const newQuote = await generateQuote(userId, "motivation" as QuoteCategory);
        return res.json(newQuote);
      }
      
      console.log(`返回用户 ${userId} 的每日引用 ID: ${dailyQuote.id}`);
      return res.json(dailyQuote);
    } catch (error) {
      console.error("获取每日引用出错:", error);
      return res.status(500).json({ message: "获取每日引用失败" });
    }
  });

  // 获取引用类别
  app.get("/api/quote-categories", (_req: Request, res: Response) => {
    res.json([
      { value: "confidence", name: "Confidence" },
      { value: "growth", name: "Growth" },
      { value: "resilience", name: "Resilience" },
      { value: "mindfulness", name: "Mindfulness" },
      { value: "gratitude", name: "Gratitude" },
      { value: "compassion", name: "Compassion" },
      { value: "motivation", name: "Motivation" },
      { value: "self_care", name: "Self Care" },
      { value: "wisdom", name: "Wisdom" },
      { value: "healing", name: "Healing" },
      { value: "inner_peace", name: "Inner Peace" },
      { value: "self_love", name: "Self Love" },
      { value: "courage", name: "Courage" },
      { value: "hope", name: "Hope" },
      { value: "strength", name: "Strength" },
      { value: "acceptance", name: "Acceptance" }
    ]);
  });

  // 获取所有用户引用
  app.get("/api/users/:userId/quotes", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "无效的用户ID" });
      }
      
      const quotes = await storage.getUserQuotes(userId);
      return res.json(quotes);
    } catch (error) {
      console.error("获取用户引用出错:", error);
      return res.status(500).json({ message: "获取用户引用失败" });
    }
  });

  // 生成新引用
  app.post("/api/quotes/generate", async (req: Request, res: Response) => {
    try {
      const { userId, category = "motivation", customized = false } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "缺少用户ID" });
      }
      
      const { generateQuote } = await import("./api/quotes");
      const newQuote = await generateQuote(userId, category as QuoteCategory, customized);
      
      return res.json(newQuote);
    } catch (error) {
      console.error("生成引用出错:", error);
      return res.status(500).json({ message: "生成引用失败" });
    }
  });

  // 收藏/取消收藏引用
  app.post("/api/quotes/:quoteId/favorite", async (req: Request, res: Response) => {
    try {
      const quoteId = parseInt(req.params.quoteId, 10);
      if (isNaN(quoteId)) {
        return res.status(400).json({ message: "无效的引用ID" });
      }
      
      const { favorited } = req.body;
      if (typeof favorited !== 'boolean') {
        return res.status(400).json({ message: "缺少或无效的favorited参数" });
      }
      
      const updatedQuote = await storage.favoriteQuote(quoteId, favorited);
      if (!updatedQuote) {
        return res.status(404).json({ message: "未找到引用" });
      }
      
      return res.json(updatedQuote);
    } catch (error) {
      console.error("更新引用收藏状态出错:", error);
      return res.status(500).json({ message: "更新引用收藏状态失败" });
    }
  });

  // 获取每日日记提示
  app.get("/api/users/:userId/daily-journaling-prompt", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "无效的用户ID" });
      }
      
      const category = req.query.category as JournalingPromptCategory | undefined;
      console.log(`正在获取用户 ${userId} 的每日日记提示，类别: ${category || '所有'}`);
      
      const dailyPrompt = await storage.getDailyJournalingPrompt(userId, category);
      
      if (!dailyPrompt) {
        console.log(`未找到用户 ${userId} 的日记提示，将生成新提示`);
        
        // 如果没有找到提示，生成一个新提示
        const { generateJournalingPrompt } = await import("./api/journaling");
        const newPrompt = await generateJournalingPrompt(
          userId, 
          category || "self_reflection"
        );
        return res.json(newPrompt);
      }
      
      console.log(`返回用户 ${userId} 的每日日记提示 ID: ${dailyPrompt.id}, 类别: ${dailyPrompt.category}`);
      return res.json(dailyPrompt);
    } catch (error) {
      console.error("获取每日日记提示出错:", error);
      return res.status(500).json({ message: "获取每日日记提示失败" });
    }
  });

  // 获取日记提示类别
  app.get("/api/journaling-prompt-categories", (_req: Request, res: Response) => {
    res.json([
      { value: "self_reflection", name: "Self Reflection", description: "Prompts focused on understanding yourself better" },
      { value: "gratitude", name: "Gratitude", description: "Prompts to reflect on what you're thankful for" },
      { value: "emotional_awareness", name: "Emotional Awareness", description: "Prompts to explore and understand your emotions" },
      { value: "goal_setting", name: "Goal Setting", description: "Prompts to help clarify and work toward your goals" },
      { value: "stress_management", name: "Stress Management", description: "Prompts for identifying and managing stress factors" },
      { value: "personal_growth", name: "Personal Growth", description: "Prompts for reflecting on your growth journey" }
    ]);
  });

  // 将日记提示标记为已使用
  app.post("/api/journaling-prompts/:promptId/used", async (req: Request, res: Response) => {
    try {
      const promptId = parseInt(req.params.promptId, 10);
      if (isNaN(promptId)) {
        return res.status(400).json({ message: "无效的提示ID" });
      }
      
      const updatedPrompt = await storage.markJournalingPromptAsUsed(promptId);
      if (!updatedPrompt) {
        return res.status(404).json({ message: "未找到提示" });
      }
      
      return res.json(updatedPrompt);
    } catch (error) {
      console.error("标记日记提示为已使用出错:", error);
      return res.status(500).json({ message: "标记日记提示为已使用失败" });
    }
  });

  // Voice API Endpoints
  
  // Speech-to-Text (Voice Input) API
  app.post("/api/voice/transcribe", async (req: Request, res: Response) => {
    try {
      const { audioData, languageCode } = req.body;
      
      if (!audioData) {
        return res.status(400).json({ message: "Audio data is required" });
      }
      
      // Default to English if no language code is provided
      const language = (languageCode || 'en') as LanguageCode;
      
      console.log(`[Voice API] Transcribing audio to text in language: ${language}`);
      const transcribedText = await transcribeAudio(audioData, language);
      
      return res.json({ text: transcribedText });
    } catch (error: any) {
      console.error("[Voice API] Error transcribing audio:", error);
      return res.status(500).json({ 
        message: "Failed to transcribe audio", 
        error: error.message || "Unknown error" 
      });
    }
  });
  
  // Text-to-Speech (Voice Output) API
  app.post("/api/voice/synthesize", async (req: Request, res: Response) => {
    try {
      const { text, languageCode, therapistId } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      // Default to English if no language code is provided
      const language = (languageCode || 'en') as LanguageCode;
      
      console.log(`[Voice API] Converting text to speech in language: ${language}${therapistId ? ` for therapist: ${therapistId}` : ''}`);
      const audioData = await textToSpeech(text, language, therapistId);
      
      return res.json({ audioData });
    } catch (error: any) {
      console.error("[Voice API] Error synthesizing speech:", error);
      return res.status(500).json({ 
        message: "Failed to synthesize speech", 
        error: error.message || "Unknown error" 
      });
    }
  });
  
  // Fix Dr.AZ's speaking style
  app.post("/api/fix-draz-style", async (_req: Request, res: Response) => {
    try {
      console.log("[Admin API] Attempting to fix Dr.AZ's speaking style");
      const result = await updateDrAZSpeakingStyle();
      if (result) {
        return res.json({ message: "Successfully updated Dr.AZ's speaking style" });
      } else {
        return res.status(500).json({ message: "Failed to update Dr.AZ's speaking style" });
      }
    } catch (error: any) {
      console.error("[Admin API] Error fixing Dr.AZ's speaking style:", error);
      return res.status(500).json({ 
        message: "Failed to fix Dr.AZ's speaking style", 
        error: error.message || "Unknown error" 
      });
    }
  });

  // Clear cached responses for specific therapist to reset voice package
  app.post("/api/clear-therapist-cache", async (req: Request, res: Response) => {
    try {
      const { therapistId } = req.body;
      
      if (!therapistId) {
        return res.status(400).json({ 
          success: false, 
          error: "Therapist ID is required" 
        });
      }

      const { clearTherapistCache } = await import("./api/quotaManager");
      clearTherapistCache(therapistId);
      
      res.json({ 
        success: true, 
        message: `Cache cleared for therapist ${therapistId}` 
      });
    } catch (error) {
      console.error("Error clearing therapist cache:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to clear therapist cache",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}