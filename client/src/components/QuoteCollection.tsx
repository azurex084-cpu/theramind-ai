import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Filter, List, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { getQuoteCategoryName } from '@/lib/categoryTranslations';
import { useQuoteTranslation } from '@/hooks/useQuoteTranslation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 创建翻译引用组件
interface TranslatedQuoteProps {
  text: string;
  author: string;
}

function TranslatedQuote({ text, author }: TranslatedQuoteProps) {
  const { translatedText, isLoading: isTranslating, error } = useQuoteTranslation(text);
  const { t } = useLanguage();

  return (
    <>
      <blockquote className="border-l-4 border-primary/30 pl-4 italic relative">
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

type Quote = {
  id: number;
  text: string;
  author: string | null;
  category: string;
  customized: boolean;
  favorited: boolean;
};

type QuoteCategory = {
  name: string;
  value: string;
};

interface QuoteCollectionProps {
  userId?: number;
  maxItems?: number;
  showFavoritesOnly?: boolean;
}

export function QuoteCollection({ 
  userId = 1, 
  maxItems = 10, 
  showFavoritesOnly = false 
}: QuoteCollectionProps) {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<QuoteCategory[]>([]);
  const { t, language } = useLanguage();

  // Load quote categories
  const categoryQuery = useQuery({
    queryKey: ['/api/quote-categories'],
    queryFn: () => apiRequest<QuoteCategory[]>('/api/quote-categories'),
  });

  // Update categories when data is available
  useEffect(() => {
    if (categoryQuery.data) {
      setCategories(categoryQuery.data);
    }
  }, [categoryQuery.data]);

  // Fetch quotes for the user
  const { data: quotes, isLoading, error } = useQuery({
    queryKey: ['/api/users', userId, 'quotes', selectedCategory, showFavoritesOnly],
    queryFn: async () => {
      const allQuotes = await apiRequest<Quote[]>(`/api/users/${userId}/quotes`);
      
      // Apply filters
      return allQuotes
        .filter(quote => !showFavoritesOnly || quote.favorited)
        .filter(quote => !selectedCategory || quote.category === selectedCategory)
        .slice(0, maxItems);
    },
  });

  // Function to favorite/unfavorite a quote
  const handleFavorite = async (quoteId: number, currentFavorited: boolean) => {
    try {
      await apiRequest<Quote>(
        `/api/quotes/${quoteId}/favorite`,
        {
          method: 'POST',
          body: JSON.stringify({ favorited: !currentFavorited }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      // Invalidate the quotes cache to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'quotes'] });
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  // Function to handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Quotes</h2>
          <Skeleton className="h-10 w-24" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-4 w-1/4 mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error || !quotes) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>{t('unable_to_load_quote')}</p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'quotes'] })} 
              className="mt-2"
            >
              {t('try_again')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (quotes.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {showFavoritesOnly ? t('favorites') : t('my_quotes')}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                {t('filter')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('categories')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleCategorySelect(null)}>
                {t('all_categories')}
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem 
                  key={category.value}
                  onClick={() => handleCategorySelect(category.value)}
                >
                  {getQuoteCategoryName(category.value, language)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card className="w-full">
          <CardContent className="pt-6 text-center text-muted-foreground">
            <List className="mx-auto h-12 w-12 opacity-30 mb-2" />
            <p>{t('no_quotes_yet')}</p>
            {selectedCategory && (
              <p className="text-sm">{t('try_selecting_different_category')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {showFavoritesOnly ? t('favorites') : t('my_quotes')}
          {selectedCategory && ` - ${getQuoteCategoryName(selectedCategory, language)}`}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              {t('filter')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('categories')}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleCategorySelect(null)}>
              {t('all_categories')}
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category.value}
                onClick={() => handleCategorySelect(category.value)}
              >
                {getQuoteCategoryName(category.value, language)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-4">
        {quotes.map((quote) => (
          <Card key={quote.id} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground capitalize">
                  {getQuoteCategoryName(quote.category, language)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFavorite(quote.id, quote.favorited)}
                  aria-label={quote.favorited ? "Remove from favorites" : "Add to favorites"}
                  className="h-8 w-8"
                >
                  <Heart 
                    className={`h-4 w-4 ${quote.favorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} 
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TranslatedQuote text={quote.text} author={quote.author || 'Anonymous'} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}