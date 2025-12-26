import React, { useRef, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Message from './Message';
import { Message as MessageType } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatContainerProps {
  messages: MessageType[];
  isLoading: boolean;
  hasError: boolean;
  currentTherapistId?: string | number;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, hasError, currentTherapistId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <main className="flex-1 relative pt-2 pb-24 px-4 sm:px-6 overflow-y-auto mt-32" ref={containerRef} style={{ height: 'calc(100vh - 190px)', overflowY: 'auto' }}>
      <div className="max-w-4xl mx-auto pt-2">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <Message key={message.id} message={message} currentTherapistId={currentTherapistId} />
          ))}
        </AnimatePresence>
        
        {/* Loading Indicator with Animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="flex items-start mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="h-10 w-10 rounded-full bg-white border border-primary-200 flex items-center justify-center flex-shrink-0 mr-3"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <Brain className="text-primary-500 h-5 w-5" />
              </motion.div>
              <motion.div 
                className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 flex items-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="ml-2 text-neutral-500 text-sm">{t('thinking')}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error Message with Animation */}
        <AnimatePresence>
          {hasError && (
            <motion.div 
              className="flex items-start mb-6"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="h-10 w-10 rounded-full bg-white border border-amber-200 flex items-center justify-center flex-shrink-0 mr-3"
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <AlertTriangle className="text-amber-500 h-5 w-5" />
              </motion.div>
              <motion.div 
                className="bg-amber-50 p-4 rounded-lg shadow-sm border border-amber-100 max-w-3xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <p className="text-amber-800">
                  {t('api_error')}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default ChatContainer;

// Brain icon component for the loading indicator
const Brain = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
  </svg>
);
