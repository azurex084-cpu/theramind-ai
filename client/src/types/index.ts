export type Language = {
  name: string;
  code: string;
};

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  sentiment?: string;
  sourceLanguage?: string; // 消息的源语言
};

export type ChatState = {
  messages: Message[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
};
