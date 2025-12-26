import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, RefreshCw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { getQuoteCategoryName } from '@/lib/categoryTranslations';
import { useQuoteTranslation } from '@/hooks/useQuoteTranslation';

type Quote = {
  id: number;
  text: string;
  author: string | null;
  category: string;
  customized: boolean;
  favorited: boolean;
};

interface DailyQuoteProps {
  userId?: number;
  category?: string;
  onRefreshQuote?: () => void;
}

// Separate component for translated content to manage hooks properly
function TranslatedQuoteContent({ text, author }: { text: string; author: string | null }) {
  const { translatedText, isLoading: isTranslating } = useQuoteTranslation(text, 'en');
  
  console.log(`[TranslatedQuoteContent] Quote text: "${text.substring(0, 30)}..."`);
  console.log(`[TranslatedQuoteContent] Translated text: "${translatedText.substring(0, 30)}..."`);
  console.log(`[TranslatedQuoteContent] Is translating: ${isTranslating}`);
  
  return (
    <>
      <blockquote className="border-l-4 border-primary/50 pl-4 italic text-xl font-serif relative">
        {isTranslating ? (
          <div className="flex items-center space-x-2">
            <RotateCw className="animate-spin h-4 w-4" />
            <span className="text-muted-foreground">{text}</span>
          </div>
        ) : (
          `"${translatedText}"`
        )}
      </blockquote>
    </>
  );
}

export function DailyQuote({ userId = 1, category, onRefreshQuote }: DailyQuoteProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { language, t } = useLanguage();

  // Fetch the daily quote for the user
  const { data: quote, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/users', userId, 'daily-quote'],
    queryFn: () => apiRequest<Quote>(`/api/users/${userId}/daily-quote`),
  });

  // Function to favorite/unfavorite a quote
  const handleFavorite = async () => {
    if (!quote) return;
    
    try {
      await apiRequest(
        `/api/quotes/${quote.id}/favorite`,
        {
          method: 'POST',
          body: JSON.stringify({ favorited: !quote.favorited }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      // Manually update the cache with the updated quote
      refetch();
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  // Function to request a new quote
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await apiRequest(
        '/api/quotes/generate',
        {
          method: 'POST',
          body: JSON.stringify({ 
            userId, 
            category: category || 'general',
            customized: true 
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      // Refetch to get the new quote
      await refetch();
      
      // Call parent callback if provided
      if (onRefreshQuote) onRefreshQuote();
    } catch (error) {
      console.error('Failed to generate new quote:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <Skeleton className="h-4 w-1/3 mb-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-4 w-1/4 mb-2" />
        </CardContent>
        <CardFooter className="justify-between">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </CardFooter>
      </Card>
    );
  }

  // Error state
  if (error || !quote) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>{t('unable_to_load_quote')}</p>
            <Button onClick={() => refetch()} className="mt-2">
              {t('try_again')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground capitalize">
          {getQuoteCategoryName(quote.category, language)} {t('affirmation')}
        </div>
      </CardHeader>
      <CardContent>
        <TranslatedQuoteContent text={quote.text} author={quote.author} />
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavorite}
          aria-label={quote.favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={quote.favorited ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-xs"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </CardFooter>
    </Card>
  );
}