import React, { useState, useEffect } from 'react';
import { Brain, User, Smile, Heart, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message as MessageType } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import TranslatedMessageContent from './TranslatedMessageContent';
import { useTranslation } from '@/hooks/useTranslation';
import VoicePlayer from './VoicePlayer';

interface MessageProps {
  message: MessageType;
  currentTherapistId?: string | number;
}

// Define emoji reaction options
type EmojiReaction = {
  icon: React.ReactNode;
  label: string;
  translationKey: string;
  color: string;
};

// These will be translated in the component based on current language
const emojiReactions: EmojiReaction[] = [
  { icon: <ThumbsUp className="h-4 w-4" />, label: 'Like', translationKey: 'like', color: 'text-blue-500' },
  { icon: <Heart className="h-4 w-4" />, label: 'Love', translationKey: 'love', color: 'text-rose-500' },
  { icon: <Lightbulb className="h-4 w-4" />, label: 'Insightful', translationKey: 'insightful', color: 'text-amber-500' },
  { icon: <Smile className="h-4 w-4" />, label: 'Helpful', translationKey: 'helpful', color: 'text-green-500' },
  { icon: <ThumbsDown className="h-4 w-4" />, label: 'Dislike', translationKey: 'dislike', color: 'text-slate-500' },
];

const Message: React.FC<MessageProps> = ({ message, currentTherapistId }) => {
  const isUser = message.role === 'user';
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [typingText, setTypingText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(isUser); // User messages don't need typing animation
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  // 增强的情绪表情映射，提供更丰富的表情选择
  const getEmojiForSentiment = () => {
    if (!message.sentiment) return null;
    
    console.log(`Sentiment debug raw - message id: ${message.id}, sentiment: ${message.sentiment}`);
    
    try {
      // 解析情绪JSON字符串
      const sentiment = typeof message.sentiment === 'string' 
        ? JSON.parse(message.sentiment) 
        : message.sentiment;
      
      const category = sentiment?.category?.toLowerCase() || '';
      const score = sentiment?.score || 0; // 情绪强度分数
      
      // 根据情绪类别和强度返回不同的表情
      if (category.includes('happy') || category.includes('joy')) {
        if (score > 0.8) return '😁'; // 非常高兴
        if (score > 0.5) return '😊'; // 开心
        return '🙂'; // 轻度高兴
      } 
      else if (category.includes('sad')) {
        if (score < -0.8) return '😭'; // 非常悲伤
        if (score < -0.5) return '😔'; // 悲伤
        return '🙁'; // 轻度悲伤
      } 
      else if (category.includes('angry')) {
        if (Math.abs(score) > 0.8) return '😡'; // 非常愤怒
        if (Math.abs(score) > 0.5) return '😠'; // 愤怒
        return '😤'; // 轻度愤怒
      } 
      else if (category.includes('anxious') || category.includes('fear')) {
        if (Math.abs(score) > 0.8) return '😨'; // 非常恐惧
        if (Math.abs(score) > 0.5) return '😰'; // 焦虑
        return '😟'; // 轻度担忧
      } 
      else if (category.includes('surprise')) {
        if (Math.abs(score) > 0.8) return '😱'; // 非常惊讶
        if (Math.abs(score) > 0.5) return '😲'; // 惊讶
        return '😮'; // 轻度惊讶
      } 
      else if (category.includes('disgust')) {
        if (Math.abs(score) > 0.8) return '🤮'; // 非常恶心
        if (Math.abs(score) > 0.5) return '🤢'; // 恶心
        return '😖'; // 轻度厌恶
      }
      else if (category.includes('neutral')) {
        return '😐'; // 中性
      }
      else if (category.includes('confusion')) {
        return '🤔'; // 困惑
      }
      else if (category.includes('hope') || category.includes('optimism')) {
        return '🌟'; // 希望/乐观
      }
      else if (category.includes('love')) {
        return '❤️'; // 爱
      }
      else if (category.includes('pride')) {
        return '🏆'; // 自豪
      }
      else if (category.includes('gratitude')) {
        return '🙏'; // 感谢
      }
      else {
        // 默认情绪
        return '😐';
      }
    } catch (e) {
      // 如果解析失败，直接检查原始字符串
      const sentimentStr = message.sentiment.toLowerCase();
      if (sentimentStr.includes('happy') || sentimentStr.includes('joy')) return '😊';
      else if (sentimentStr.includes('sad')) return '😔';
      else if (sentimentStr.includes('angry')) return '😠'; 
      else if (sentimentStr.includes('anxious') || sentimentStr.includes('fear')) return '😰';
      else if (sentimentStr.includes('surprise')) return '😲';
      else if (sentimentStr.includes('disgust')) return '🤢';
      else if (sentimentStr.includes('love')) return '❤️';
      else if (sentimentStr.includes('hope')) return '🌟';
      else if (sentimentStr.includes('confusion')) return '🤔';
      
      console.error(`Error parsing sentiment: ${e}`);
      return '😐';
    }
  };
  
  // Typing animation for AI messages
  useEffect(() => {
    if (isUser) return; // No typing animation for user messages
    
    let timeout: NodeJS.Timeout;
    const content = message.content;
    let i = 0;
    
    const typeNextCharacter = () => {
      if (i < content.length) {
        setTypingText(content.substring(0, i + 1));
        i++;
        
        // Adjust typing speed based on punctuation
        const delay = content[i-1] === '.' || content[i-1] === '?' || content[i-1] === '!' 
          ? 300  // Pause longer at end of sentences
          : content[i-1] === ',' || content[i-1] === ';' 
            ? 200  // Pause a bit at commas
            : 10;  // Normal typing speed
            
        timeout = setTimeout(typeNextCharacter, delay);
      } else {
        setIsTypingComplete(true);
      }
    };
    
    timeout = setTimeout(typeNextCharacter, 200);
    
    return () => clearTimeout(timeout);
  }, [message.content, isUser]);
  
  const toggleReactions = () => {
    setShowReactions(!showReactions);
  };
  
  const handleReactionSelect = (reaction: EmojiReaction) => {
    // Store the translated label
    const translatedLabel = t(reaction.translationKey as any);
    setSelectedReaction(translatedLabel);
    setShowReactions(false);
  };
  
  // Emoji that appears with user messages based on sentiment
  const sentimentEmoji = isUser ? getEmojiForSentiment() : null;
  
  // Debug emoji display
  console.log(`Message ID: ${message.id}, isUser: ${isUser}, emoji: ${sentimentEmoji}, sentiment: ${message.sentiment}`);
  
  return (
    <motion.div 
      className={`flex mb-6 items-start ${isUser ? 'justify-end' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <motion.div 
          className="h-10 w-10 rounded-full bg-white border border-primary-200 flex items-center justify-center flex-shrink-0 mr-3"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Brain className="text-primary-500 h-5 w-5" />
        </motion.div>
      )}
      
      <div className="relative">
        {/* Sentiment emoji indicator for user messages - with improved styling */}
        {sentimentEmoji && isUser && (
          <motion.div 
            className="absolute -top-3 -right-3 text-xl z-10 bg-white rounded-full p-0.5 shadow-sm border border-gray-100"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
            whileHover={{ scale: 1.2 }}
          >
            {sentimentEmoji}
          </motion.div>
        )}
        
        <motion.div 
          className={`p-4 rounded-lg shadow-sm max-w-3xl ${
            isUser 
              ? 'bg-primary-50 border border-primary-100' 
              : 'bg-white border border-neutral-200'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onDoubleClick={toggleReactions}
        >
          {isUser || isTypingComplete ? (
            // Display full message if user message or typing finished
            <TranslatedMessageContent 
              text={message.content} 
              sourceLanguage={message.sourceLanguage || 'en'} 
              autoTranslate={true}
            />
          ) : (
            // Display typing animation
            <div>
              <p className="text-neutral-800">
                {typingText}
                <span className="animate-pulse">▋</span>
              </p>
            </div>
          )}
          
          {/* Voice player for all messages */}
          {isTypingComplete && (
            <div className="flex items-center gap-1 mt-2">
              <VoicePlayer 
                text={message.content}
                languageCode={isUser ? language : (message.sourceLanguage || language)}
                therapistId={!isUser ? currentTherapistId : undefined}
              />
            </div>
          )}

          {/* Reactions button */}
          {isTypingComplete && !isUser && (
            <div className="absolute -bottom-2 right-3">
              <button 
                onClick={toggleReactions}
                className="bg-neutral-100 hover:bg-neutral-200 rounded-full p-1 text-xs text-neutral-500 flex items-center transition-colors"
              >
                <Smile className="h-3 w-3 mr-1" /> 
                {selectedReaction || t('react_button' as any)}
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Emoji reaction selector */}
        <AnimatePresence>
          {showReactions && !isUser && (
            <motion.div
              className="absolute -bottom-12 right-0 bg-white shadow-lg rounded-full p-1 flex space-x-2 z-10 border border-neutral-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {emojiReactions.map((reaction, index) => (
                <motion.button
                  key={reaction.label}
                  className={`p-1.5 rounded-full hover:bg-neutral-100 transition-colors ${reaction.color}`}
                  onClick={() => handleReactionSelect(reaction)}
                  whileHover={{ scale: 1.2 }}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.05 } 
                  }}
                >
                  {reaction.icon}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {isUser && (
        <motion.div 
          className="h-10 w-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 ml-3"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <User className="text-neutral-500 h-5 w-5" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Message;