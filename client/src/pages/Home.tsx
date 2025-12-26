import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import ChatControls from '@/components/ChatControls';
import { DailyMotivation } from '@/components/DailyMotivation';
import { EmotionalJourney } from '@/components/EmotionalJourney';
import { TherapistSelector } from '@/components/TherapistSelector';
import { useChat } from '@/hooks/useChat';
import { useTherapyApproach } from '@/hooks/useTherapyApproach';
import { useTranslation } from '@/hooks/useTranslation';
import { therapistPersonas, TherapistPersona, TherapyApproach } from '@/lib/therapistPersonas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Quote, BookOpen, Globe, Settings } from 'lucide-react';
import { Link } from "wouter";

const Home: React.FC = () => {
  const {
    messages,
    sendMessage,
    clearChat,
    isLoading,
    hasError,
    currentLanguage,
    changeLanguage,
    sessionId,
    currentTherapistId,
    changeTherapist,
  } = useChat();

  // Use the therapy approach hook with session ID for persistence
  const { 
    currentApproach, 
    changeTherapyApproach, 
    isChangingApproach 
  } = useTherapyApproach('general', sessionId || undefined);

  const [showEmotionalJourney, setShowEmotionalJourney] = useState(false);
  
  // 获取翻译函数
  const { t } = useTranslation();
  
  return (
    <div className="font-sans text-neutral-800 antialiased h-screen flex flex-col overflow-hidden" style={{ height: '100vh' }}>
      <Header 
        currentLanguage={currentLanguage} 
        onChangeLanguage={changeLanguage}
        userId={1}
        sessionId={sessionId || undefined}
      />
      
      {/* 主导航 */}
      <div className="bg-white shadow-sm py-2 px-4 fixed top-16 left-0 right-0 z-10 border-b">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <Link href="/" className="flex items-center p-2 text-primary font-medium">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>{t('chat')}</span>
            </Link>
            <Link href="/quotes" className="flex items-center p-2 text-muted-foreground hover:text-foreground">
              <Quote className="h-5 w-5 mr-2" />
              <span>{t('quotes')}</span>
            </Link>
            <Link href="/journaling" className="flex items-center p-2 text-muted-foreground hover:text-foreground">
              <BookOpen className="h-5 w-5 mr-2" />
              <span>{t('journal')}</span>
            </Link>
          </div>
          
          {/* Therapist Selection - Compact */}
          <div className="flex-shrink-0">
            <TherapistSelector
              currentTherapistId={currentTherapistId}
              onSelectTherapist={id => changeTherapist(id)}
              userId={1}
              showManageOption={true}
            />
          </div>
        </div>
      </div>
      
      {/* Emotional Journey Visualization (if session exists) */}
      {sessionId && showEmotionalJourney && (
        <div className="px-3 py-2 theme-card border-b mt-32">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 rounded-lg shadow-sm p-3">
              <h3 className="text-sm font-medium mb-2">{t('emotional_journey')}</h3>
              <EmotionalJourney sessionId={sessionId} />
            </div>
          </div>
        </div>
      )}
      
      <ChatContainer 
        messages={messages} 
        isLoading={isLoading}
        hasError={hasError}
        currentTherapistId={currentTherapistId}
      />
      <ChatControls 
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        onToggleEmotionalJourney={() => setShowEmotionalJourney(prev => !prev)}
        showEmotionalJourney={showEmotionalJourney}
      />
    </div>
  );
};

export default Home;
