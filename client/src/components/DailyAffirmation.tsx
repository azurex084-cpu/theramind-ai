import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import { RefreshCcw, Clock, Sun, Sunset, Moon, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuoteTranslation } from '@/hooks/useQuoteTranslation';

type Affirmation = {
  id: number;
  text: string;
  author: string;
  category: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
};

const timeOfDayIcons = {
  morning: <Sun className="h-5 w-5 text-amber-500" />,
  afternoon: <Sun className="h-5 w-5 text-orange-500" />,
  evening: <Sunset className="h-5 w-5 text-purple-500" />,
  night: <Moon className="h-5 w-5 text-indigo-500" />,
  any: <Clock className="h-5 w-5 text-blue-500" />
};

const timeOfDayColors = {
  morning: 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200',
  afternoon: 'bg-gradient-to-r from-orange-100 to-amber-100 border-orange-200',
  evening: 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200',
  night: 'bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-200',
  any: 'bg-gradient-to-r from-blue-100 to-sky-100 border-blue-200'
};


// Separate component for translated content to manage hooks properly
function TranslatedContent({ text, author }: { text: string; author: string }) {
  const { translatedText, isLoading: isTranslating } = useQuoteTranslation(text);
  
  return (
    <>
      <p className="text-lg font-medium leading-relaxed text-neutral-800 my-2">
        {isTranslating ? (
          <span className="flex items-center space-x-2">
            <RotateCw className="animate-spin h-4 w-4" />
            <span className="text-muted-foreground">{text}</span>
          </span>
        ) : (
          `"${translatedText}"`
        )}
      </p>
      <p className="text-sm text-neutral-500 italic">{author}</p>
    </>
  );
}

interface DailyAffirmationProps {
  userId?: number;
  sessionId?: string;
  onRefreshAffirmation?: () => void;
}

export function DailyAffirmation({ 
  userId = 1, 
  sessionId,
  onRefreshAffirmation 
}: DailyAffirmationProps) {
  const { language, t } = useLanguage();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dailyAffirmation', userId],
    queryFn: async () => {
      let url = `/api/users/${userId}/daily-affirmation`;
      if (sessionId) {
        url += `?sessionId=${sessionId}`;
      }
      return apiRequest<Affirmation>(url);
    },
  });
  
  const refreshAffirmation = async () => {
    await refetch();
    if (onRefreshAffirmation) {
      onRefreshAffirmation();
    }
  };
  
  const handleRefresh = () => {
    refreshAffirmation();
  };
  
  // Get the appropriate styling based on time of day
  const timeOfDay = data?.timeOfDay || 'any';
  const cardStyle = timeOfDayColors[timeOfDay];
  const timeIcon = timeOfDayIcons[timeOfDay];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className={`relative p-5 rounded-lg shadow-sm border ${cardStyle}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : isError ? (
        <p className="text-red-500">Could not load affirmation. Please try again.</p>
      ) : data ? (
        <>
          <motion.div className="flex items-center mb-2" variants={itemVariants}>
            {timeIcon}
            <span className="ml-2 text-sm font-medium text-neutral-600">
              {t(timeOfDay as any)} {t('affirmation')}
            </span>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TranslatedContent text={data.text} author={data.author} />
          </motion.div>
          
          <motion.div 
            className="absolute top-3 right-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              className="h-7 w-7"
              title="Get new affirmation"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </motion.div>
        </>
      ) : null}
    </motion.div>
  );
}