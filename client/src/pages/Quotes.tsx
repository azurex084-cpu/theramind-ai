import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyQuote } from '@/components/DailyQuote';
import { QuoteCollection } from '@/components/QuoteCollection';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { getQuoteCategoryName } from '@/lib/categoryTranslations';
import Header from '@/components/Header';
import { MessageCircle, Quote, BookOpen } from 'lucide-react';
import { Link } from "wouter";

type Category = {
  name: string;
  value: string;
};

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // 使用语言上下文
  const { t, language } = useLanguage();
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/quote-categories'],
    queryFn: () => apiRequest<Category[]>('/api/quote-categories'),
  });

  const handleRefreshQuote = () => {
    // This could trigger a notification or animation
    console.log('Quote refreshed!');
  };

  return (
    <div className="font-sans antialiased h-screen flex flex-col">
      {/* 添加Header组件 */}
      <Header userId={1} />
      
      {/* 主导航 */}
      <div className="bg-white shadow-sm py-2 px-4 fixed top-16 left-0 right-0 z-10 border-b">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex space-x-6 mb-2 sm:mb-0">
            <Link href="/" className="flex items-center p-2 text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>{t('chat')}</span>
            </Link>
            <Link href="/quotes" className="flex items-center p-2 text-primary font-medium">
              <Quote className="h-5 w-5 mr-2" />
              <span>{t('quotes')}</span>
            </Link>
            <Link href="/journaling" className="flex items-center p-2 text-muted-foreground hover:text-foreground">
              <BookOpen className="h-5 w-5 mr-2" />
              <span>{t('journal')}</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container max-w-4xl py-8 mt-32">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
          {t('therapeutic_affirmations')}
        </h1>
        
        <Tabs defaultValue="daily" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="daily">{t('daily_quote')}</TabsTrigger>
            <TabsTrigger value="all">{t('my_quotes')}</TabsTrigger>
            <TabsTrigger value="favorites">{t('favorites')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="mt-0">
            <div className="mb-4 text-center text-muted-foreground">
              <p>{t('daily_quote_description')}</p>
            </div>
            
            {categories && (
              <div className="flex gap-2 flex-wrap justify-center mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    !selectedCategory 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {t('all')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedCategory === category.value 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {getQuoteCategoryName(category.value, language)}
                  </button>
                ))}
              </div>
            )}
            
            <DailyQuote 
              userId={1} 
              category={selectedCategory || undefined} 
              onRefreshQuote={handleRefreshQuote} 
            />
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            <div className="mb-4 text-center text-muted-foreground">
              <p>{t('all_quotes_description')}</p>
            </div>
            <QuoteCollection userId={1} maxItems={20} />
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <div className="mb-4 text-center text-muted-foreground">
              <p>{t('favorites_description')}</p>
            </div>
            <QuoteCollection userId={1} maxItems={20} showFavoritesOnly />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}