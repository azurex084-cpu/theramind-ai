import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Message } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getTherapistPersona, getLocalizedTherapistField, type TherapyApproach, THERAPIST_MESSAGES } from '@/lib/therapistPersonas';
import { useLanguage } from '@/contexts/LanguageContext';

// 多语言欢迎消息
const WELCOME_MESSAGES = {
  en: "Hello! I'm your AI therapeutic assistant. I'm here to listen and support you. Feel free to share what's on your mind, and we can explore it together. Your conversations are now securely stored for your future sessions.\n\nHow are you feeling today?",
  zh: "你好！我是你的AI心理治疗助手。我在这里倾听和支持你。请随时分享你的想法，我们可以一起探索。你的对话现在已安全存储，可用于未来的会话。\n\n今天你感觉如何？",
  zh_TW: "你好！我是你的AI心理治療助手。我在這裡傾聽和支持你。請隨時分享你的想法，我們可以一起探索。你的對話現在已安全存儲，可用於未來的會話。\n\n今天你感覺如何？",
  zh_HK: "你好！我係你嘅AI心理治療助手。我喺呢度聆聽同支持你。隨時分享你嘅諗法，我哋可以一齊探索。你嘅對話而家已經安全儲存，可以用於未來嘅會話。\n\n今日你感覺點呀？",
  yue: "你好！我係你嘅AI心理治療助手。我喺呢度聆聽同支持你。隨時分享你嘅諗法，我哋可以一齊探索。你嘅對話而家已經安全儲存，可以用於未來嘅會話。\n\n今日你感覺點呀？",
  es: "¡Hola! Soy tu asistente terapéutico con IA. Estoy aquí para escucharte y apoyarte. Siéntete libre de compartir lo que tienes en mente, y podemos explorarlo juntos. Tus conversaciones ahora se almacenan de forma segura para tus futuras sesiones.\n\n¿Cómo te sientes hoy?",
  ja: "こんにちは！私はAIセラピーアシスタントです。あなたの話を聞き、サポートするためにここにいます。あなたの考えを自由に共有してください、一緒に探求できます。あなたの会話は今後のセッションのために安全に保存されています。\n\n今日の気分はいかがですか？",
  ko: "안녕하세요! 저는 AI 심리 치료 도우미입니다. 당신의 이야기를 듣고 지원하기 위해 여기 있습니다. 마음에 있는 것을 자유롭게 나눠주세요, 함께 탐구할 수 있습니다. 대화 내용은 향후 세션을 위해 안전하게 저장됩니다.\n\n오늘 기분이 어떠신가요?",
  fr: "Bonjour ! Je suis votre assistant thérapeutique IA. Je suis là pour vous écouter et vous soutenir. N'hésitez pas à partager ce qui vous préoccupe, et nous pourrons l'explorer ensemble. Vos conversations sont maintenant stockées en toute sécurité pour vos futures séances.\n\nComment vous sentez-vous aujourd'hui ?",
  de: "Hallo! Ich bin Ihr KI-Therapeut. Ich bin hier, um Ihnen zuzuhören und Sie zu unterstützen. Teilen Sie gerne mit, was Sie beschäftigt, und wir können es gemeinsam erkunden. Ihre Gespräche werden jetzt sicher für Ihre zukünftigen Sitzungen gespeichert.\n\nWie fühlen Sie sich heute?",
  it: "Ciao! Sono il tuo assistente terapeutico AI. Sono qui per ascoltarti e supportarti. Sentiti libero di condividere ciò che hai in mente, e possiamo esplorarlo insieme. Le tue conversazioni ora sono archiviate in modo sicuro per le tue sessioni future.\n\nCome ti senti oggi?",
  pt: "Olá! Sou o seu assistente terapêutico de IA. Estou aqui para ouvir e apoiá-lo. Sinta-se à vontade para compartilhar o que está em sua mente, e podemos explorá-lo juntos. Suas conversas agora são armazenadas com segurança para suas sessões futuras.\n\nComo você está se sentindo hoje?",
  nl: "Hallo! Ik ben je AI-therapeutische assistent. Ik ben hier om naar je te luisteren en je te ondersteunen. Voel je vrij om te delen wat er in je omgaat, en we kunnen het samen verkennen. Je gesprekken worden nu veilig opgeslagen voor je toekomstige sessies.\n\nHoe voel je je vandaag?",
  ru: "Здравствуйте! Я ваш ИИ-терапевт. Я здесь, чтобы выслушать вас и поддержать. Не стесняйтесь делиться тем, что у вас на уме, и мы можем исследовать это вместе. Ваши разговоры теперь надежно сохраняются для ваших будущих сеансов.\n\nКак вы себя чувствуете сегодня?",
  uk: "Привіт! Я ваш терапевтичний помічник зі штучним інтелектом. Я тут, щоб вислухати вас і підтримати. Не соромтеся ділитися тим, що у вас на думці, і ми можемо дослідити це разом. Ваші розмови тепер надійно зберігаються для ваших майбутніх сеансів.\n\nЯк ви почуваєтеся сьогодні?",
  ar: "مرحباً! أنا مساعدك العلاجي بالذكاء الاصطناعي. أنا هنا للاستماع إليك ودعمك. لا تتردد في مشاركة ما يدور في ذهنك، ويمكننا استكشافه معًا. يتم الآن تخزين محادثاتك بشكل آمن لجلساتك المستقبلية.\n\nكيف تشعر اليوم؟"
};

export function useChat() {
  // 使用LanguageContext中的语言设置
  const { language: currentLanguage, setLanguage } = useLanguage();
  
  // 状态管理
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentTherapistId, setCurrentTherapistId] = useState<TherapyApproach | string>('general');
  const { toast } = useToast();
  
  // 根据当前语言选择欢迎消息
  const getWelcomeMessage = useCallback(() => {
    return WELCOME_MESSAGES[currentLanguage as keyof typeof WELCOME_MESSAGES] || WELCOME_MESSAGES.en;
  }, [currentLanguage]);
  
  // 初始化消息列表
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: getWelcomeMessage(),
      role: 'assistant',
      timestamp: Date.now(),
      sourceLanguage: currentLanguage, // 设置欢迎消息的源语言
    },
  ]);

  // Fetch existing session messages if we have a session ID
  const { data: sessionMessages } = useQuery({
    queryKey: ['sessionMessages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      return apiRequest<any[]>(`/api/sessions/${sessionId}/messages`);
    },
    enabled: !!sessionId, // Only run this query if we have a sessionId
  });

  // Update messages from session data when available - 仅在初次加载时
  useEffect(() => {
    if (sessionMessages && sessionMessages.length > 0 && messages.length <= 1) {
      // 仅当消息数量为1（只有欢迎消息）时才替换消息数组
      setMessages(sessionMessages.map((msg: any) => ({
        id: msg.id.toString(),
        content: msg.content,
        role: msg.role,
        timestamp: new Date(msg.timestamp).getTime(),
        sentiment: msg.sentiment,
        sourceLanguage: msg.sourceLanguage || currentLanguage, // 设置消息源语言，如果没有则使用当前语言
      })));
    }
  }, [sessionMessages, messages.length, currentLanguage]);
  
  // 语言变化时更新欢迎消息
  useEffect(() => {
    // 仅当有消息且首条消息为助手消息时更新
    if (messages.length > 0 && messages[0].role === 'assistant') {
      // 更新欢迎消息
      const welcomeMessage = getWelcomeMessage();
      if (messages[0].content !== welcomeMessage) {
        const updatedMessages = [...messages];
        updatedMessages[0] = {
          ...messages[0],
          content: welcomeMessage,
          sourceLanguage: currentLanguage, // 更新语言时也更新消息的源语言
        };
        setMessages(updatedMessages);
      }
    }
  }, [currentLanguage, getWelcomeMessage, messages]);

  const sendMessageMutation = useMutation<any, Error, string>({
    mutationFn: async (message: string) => {
      // Get the current therapist's prompt prefix
      const therapistPersona = getTherapistPersona(currentTherapistId);
      
      // Get the therapy approach from session storage if available
      let therapyApproach = 'general';
      if (sessionId) {
        const savedApproach = sessionStorage.getItem(`therapy_approach_${sessionId}`);
        if (savedApproach) {
          try {
            therapyApproach = JSON.parse(savedApproach);
          } catch (e) {
            console.error('Error parsing saved therapy approach:', e);
          }
        }
      }
      
      console.log("Using therapy approach in chat request:", therapyApproach);
      
      return apiRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          language: currentLanguage,
          sessionId: sessionId, // Include session ID if we have one
          therapistId: currentTherapistId,
          promptPrefix: therapistPersona.promptPrefix,
          therapyApproach: therapyApproach, // Include therapy approach
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (data) => {
      // Update session ID if returned from API
      if (data.sessionId && sessionId !== data.sessionId) {
        setSessionId(data.sessionId);
      }
      
      // If we get back message history, use it
      if (data.messages && Array.isArray(data.messages)) {
        // 找到我们刚刚发送的用户消息(更新情感分析数据)
        const userMessageFromResponse = data.messages
          .filter((msg: any) => msg.role === 'user')
          .sort((a: any, b: any) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          
        // 找到最新的助手消息，而不是替换整个消息列表
        const latestAssistantMessage = data.messages
          .filter((msg: any) => msg.role === 'assistant')
          .sort((a: any, b: any) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          
        // 更新消息列表，替换本地的临时用户消息并添加助手回复
        setMessages((prev) => {
          // 创建拷贝避免直接修改原数组
          const updatedMessages = [...prev];
          
          // 寻找并替换最新的用户消息
          if (userMessageFromResponse) {
            const lastUserMsgIndex = updatedMessages.findIndex(
              msg => msg.role === 'user' && 
              new Date(msg.timestamp).getTime() > Date.now() - 10000 // 查找最近10秒内的用户消息
            );
            
            // 如果找到匹配的用户消息，更新它的情感分析
            if (lastUserMsgIndex !== -1) {
              updatedMessages[lastUserMsgIndex] = {
                ...updatedMessages[lastUserMsgIndex],
                id: userMessageFromResponse.id.toString(),
                sentiment: userMessageFromResponse.sentiment,
              };
            }
          }
          
          // 添加最新的助手消息
          if (latestAssistantMessage) {
            updatedMessages.push({
              id: latestAssistantMessage.id.toString(),
              content: latestAssistantMessage.content,
              role: 'assistant',
              timestamp: new Date(latestAssistantMessage.timestamp).getTime(),
              sentiment: latestAssistantMessage.sentiment,
              sourceLanguage: latestAssistantMessage.sourceLanguage || currentLanguage,
            });
          }
          
          return updatedMessages;
        });
      } 
      // Otherwise just add the response (fallback for backward compatibility)
      else if (data.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            content: data.response,
            role: 'assistant',
            timestamp: Date.now(),
            sourceLanguage: currentLanguage, // 为fallback响应设置源语言
          },
        ]);
      }
      
      // If we used the fallback, inform the user but don't block the conversation
      if (data.usedFallback) {
        toast({
          title: 'Using offline responses',
          description: 'The AI service is currently unavailable. Using pre-defined responses instead.',
          variant: 'default',
        });
      }
    },
    onError: (error) => {
      // Even though we should never get here due to our fallback mechanism
      toast({
        title: 'Error',
        description: error.message || 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      
      // Add user message to chat immediately for UI responsiveness
      // The actual message will be replaced when we get the response
      const userMessage: Message = {
        id: String(Date.now()),
        content,
        role: 'user',
        timestamp: Date.now(),
        sourceLanguage: currentLanguage, // 用户消息的源语言设置为当前语言
        // 初始化为undefined, 稍后更新
      };
      
      setMessages((prev) => [...prev, userMessage]);
      
      // Send to API
      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation]
  );

  const clearChat = useCallback(() => {
    // Reset the session ID to create a new conversation
    setSessionId(null);
    
    // Reset local messages with welcome message in the current language
    const welcomeMessage = WELCOME_MESSAGES[currentLanguage as keyof typeof WELCOME_MESSAGES] || WELCOME_MESSAGES.en;
    
    setMessages([
      {
        id: String(Date.now()),
        content: welcomeMessage,
        role: 'assistant',
        timestamp: Date.now(),
        sourceLanguage: currentLanguage, // 清除聊天时设置新欢迎消息的源语言
      },
    ]);
  }, [currentLanguage]);

  const changeLanguage = useCallback((code: string) => {
    // 使用全局的setLanguage
    setLanguage(code);
  }, [setLanguage]);
  
  const changeTherapist = useCallback((therapistId: TherapyApproach | string | number) => {
    console.log(`Switching therapist, ID: ${therapistId}, type: ${typeof therapistId}`);
    setCurrentTherapistId(String(therapistId) as any); // 转换为字符串并设置
    
    // Add a system message indicating the change in therapist
    const therapist = getTherapistPersona(therapistId);
    console.log(`Found therapist:`, {
      id: therapist.id,
      name: therapist.name,
      isCustom: therapist.isCustom
    });
    
    // 使用当前语言的模板生成消息
    const messageTemplate = THERAPIST_MESSAGES[currentLanguage as keyof typeof THERAPIST_MESSAGES] || THERAPIST_MESSAGES.en;
    
    // 使用getLocalizedTherapistField获取本地化字段
    const localizedName = getLocalizedTherapistField(therapist, 'name', currentLanguage);
    const localizedApproach = getLocalizedTherapistField(therapist, 'approach', currentLanguage);
    const localizedDescription = getLocalizedTherapistField(therapist, 'description', currentLanguage);
    
    console.log(`Localized fields:`, {
      name: localizedName,
      approach: localizedApproach,
      description: localizedDescription.substring(0, 30) + '...'
    });
    
    const switchMessageContent = messageTemplate(localizedName, localizedApproach, localizedDescription);
    
    const switchMessage: Message = {
      id: String(Date.now()),
      content: switchMessageContent,
      role: 'assistant',
      timestamp: Date.now(),
      sourceLanguage: currentLanguage, // 设置消息的源语言为当前语言
    };
    
    setMessages((prev: Message[]) => [...prev, switchMessage]);
  }, [currentLanguage]);

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading: sendMessageMutation.isPending,
    hasError: sendMessageMutation.isError,
    currentLanguage,
    changeLanguage,
    sessionId,
    currentTherapistId,
    changeTherapist,
  };
}