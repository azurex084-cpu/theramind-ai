import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyQuote } from './DailyQuote';
import { DailyAffirmation } from './DailyAffirmation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { QuoteIcon, PenLine, Repeat, Sparkles, Clock, SunMoon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyMotivationProps {
  userId?: number;
  sessionId?: string;
}

export function DailyMotivation({ userId = 1, sessionId }: DailyMotivationProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'quote' | 'affirmation'>('quote');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Get current time of day
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };
  
  const timeOfDay = getTimeOfDay();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return t('good_morning');
      case 'afternoon': return t('good_afternoon');
      case 'evening': return t('good_evening');
      case 'night': return t('good_night');
      default: return t('hello');
    }
  };
  
  // Get current quote/affirmation title based on active tab
  const getTitle = () => {
    return activeTab === 'quote' ? t('daily_quote') : t('daily_affirmation');
  };

  // Get time of day translation
  const getTimeOfDayText = () => {
    switch (timeOfDay) {
      case 'morning': return t('morning');
      case 'afternoon': return t('afternoon');
      case 'evening': return t('evening');
      case 'night': return t('night');
      default: return timeOfDay;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center bg-white/90 hover:bg-white/100 shadow-sm"
        >
          <Sparkles className="h-3 w-3 mr-1 text-primary-500" />
          <span className="text-xs">{getTitle()}</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <div className="w-full bg-white rounded-lg p-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <h3 className="text-base font-medium">{getTitle()}</h3>
              <div className="ml-2 flex items-center text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 mr-1" />
                <span className="mr-1">{getGreeting()}</span>
                <SunMoon className="w-3 h-3 mx-1" />
                <span>{getTimeOfDayText()}</span>
              </div>
            </div>
            
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center h-8 w-8 p-0"
                title={t('refresh')}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex space-x-2 mb-4">
              <Button
                variant={activeTab === 'quote' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('quote')}
                className="flex items-center"
              >
                <QuoteIcon className="h-4 w-4 mr-1" />
                <span>{t('quote')}</span>
              </Button>
              <Button
                variant={activeTab === 'affirmation' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('affirmation')}
                className="flex items-center"
              >
                <PenLine className="h-4 w-4 mr-1" />
                <span>{t('affirmation')}</span>
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'quote' ? (
                  <DailyQuote 
                    userId={userId} 
                    key={`quote-${refreshTrigger}`}
                    onRefreshQuote={handleRefresh}
                  />
                ) : (
                  <DailyAffirmation 
                    userId={userId} 
                    sessionId={sessionId}
                    key={`affirmation-${refreshTrigger}`}
                    onRefreshAffirmation={handleRefresh}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}