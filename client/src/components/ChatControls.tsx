import React, { useState, useRef, KeyboardEvent } from 'react';
import { Eraser, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/contexts/LanguageContext';

import { TherapyApproach } from '@shared/schema';
import { TherapyApproachSelector } from './TherapyApproachSelector';
import VoiceRecorder from './VoiceRecorder';

interface ChatControlsProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onToggleEmotionalJourney?: () => void;
  showEmotionalJourney?: boolean;
  therapyApproach?: TherapyApproach;
  onTherapyApproachChange?: (approach: TherapyApproach) => void;
}

const MAX_CHARS = 1000;

const ChatControls: React.FC<ChatControlsProps> = ({
  onSendMessage,
  onClearChat,
  onToggleEmotionalJourney,
  showEmotionalJourney,
  therapyApproach = 'general',
  onTherapyApproachChange,
}) => {
  const { t, language } = useLanguage();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && message.length <= MAX_CHARS) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <footer className="theme-card shadow-md py-3 px-4 sm:px-6 fixed bottom-0 left-0 right-0 border-t border-neutral-200 z-10">
      {/* 让输入框和容器之间有足够距离用于显示输入法候选框 */}
      <div className="h-3 md:h-0"></div>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm text-neutral-500 hover:text-neutral-700 flex items-center"
              >
                <Eraser className="h-4 w-4 mr-1" /> {t('clear_conversation')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('clear_conversation')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('clear_confirm_description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={onClearChat}>{t('clear')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <div className="flex items-center gap-4">
            {/* Removed therapy approach selector as it's now integrated with therapist selection */}
            
            {onToggleEmotionalJourney && (
              <div className="flex items-center">
                <span className="text-xs text-neutral-500 mr-2">{t('emotional_journey')}</span>
                <Switch
                  checked={showEmotionalJourney}
                  onCheckedChange={onToggleEmotionalJourney}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={t('type_message')}
            className="w-full px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none pr-12"
            maxLength={MAX_CHARS}
            style={{ position: 'relative', zIndex: 30 }} // 提高输入框z-index
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || message.length > MAX_CHARS}
            className="absolute right-3 bottom-3 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors flex items-center justify-center h-8 w-8"
            style={{ zIndex: 31 }} // 确保发送按钮在输入框之上
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <VoiceRecorder 
              onTranscriptionComplete={(text) => setMessage(prev => prev + text)}
              languageCode={language}
              className="mr-2"
            />
            <span>{t('privacy_notice')}</span>
          </div>
          <span className={message.length > MAX_CHARS ? 'text-red-500' : ''}>
            {t('character_count', { current: message.length, max: MAX_CHARS })}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default ChatControls;
