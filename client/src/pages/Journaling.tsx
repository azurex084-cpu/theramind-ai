import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { JournalingPrompt } from '@/components/JournalingPrompt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, BookOpenIcon, PenToolIcon, SparklesIcon, LightbulbIcon, StarIcon,
         MessageCircle, Quote } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { getJournalCategoryName } from '@/lib/categoryTranslations';
import Header from '@/components/Header';
import { Link } from "wouter";

type JournalEntry = {
  id: number;
  promptId: number;
  userId: number;
  content: string;
  createdAt: string;
  promptText: string;
  promptCategory: string;
};

type Category = {
  value: string;
  name: string;
  description: string;
};

export default function Journaling() {
  const [activeTab, setActiveTab] = useState('write');
  const [userId] = useState(1); // Default user
  const { t, language } = useLanguage();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/journaling-prompt-categories'],
    queryFn: () => apiRequest<Category[]>('/api/journaling-prompt-categories'),
  });

  // This would fetch journal entries if we had implemented that feature
  const { data: journalEntries = [] } = useQuery({
    queryKey: ['/api/users', userId, 'journal-entries'],
    enabled: false, // Disable this query until we implement journal entries storage
    select: (data: any) => data as JournalEntry[]
  });

  // This would handle journal entry submission if we implemented journal entries storage
  const handleSubmitJournalEntry = (promptId: number, response: string) => {
    console.log('Journal entry submitted:', { promptId, response });
    // We would save this to the database if we had implemented journal entries
  };

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
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
            <Link href="/quotes" className="flex items-center p-2 text-muted-foreground hover:text-foreground">
              <Quote className="h-5 w-5 mr-2" />
              <span>{t('quotes')}</span>
            </Link>
            <Link href="/journaling" className="flex items-center p-2 text-primary font-medium">
              <BookOpenIcon className="h-5 w-5 mr-2" />
              <span>{t('journal')}</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container max-w-4xl py-8 mt-32 px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 inline-block bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            {t('journaling')}
          </h1>
          <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
        </div>
      
        <Tabs defaultValue="write" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 rounded-lg shadow-sm">
            <TabsTrigger value="write" className="flex items-center justify-center gap-2">
              <PenToolIcon className="h-4 w-4" />
              <span>{t('write')}</span>
            </TabsTrigger>
            <TabsTrigger value="entries" className="flex items-center justify-center gap-2">
              <BookOpenIcon className="h-4 w-4" />
              <span>{t('entries')}</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center justify-center gap-2">
              <LightbulbIcon className="h-4 w-4" />
              <span>{t('insights')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="mt-0">
            <div className="mb-6 text-center">
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">{t('journaling_description')}</p>
            </div>
            
            {categories && (
              <div className="flex gap-2 flex-wrap justify-center mb-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                    !selectedCategory 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <StarIcon className="h-3.5 w-3.5" />
                    {t('all')}
                  </span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                      selectedCategory === category.value 
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {getJournalCategoryName(category.value, language)}
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
              <JournalingPrompt 
                userId={userId} 
                sessionId={sessionId}
                onSubmitJournalEntry={handleSubmitJournalEntry}
                category={selectedCategory || undefined}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="entries" className="mt-0">
            <div className="mb-6 text-center">
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">{t('entries_description')}</p>
            </div>
            
            {journalEntries.length > 0 ? (
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <Card key={entry.id} className="mb-4 overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-md">
                    <CardHeader className="bg-muted/30">
                      <CardTitle className="text-lg font-semibold">{entry.promptText}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {new Date(entry.createdAt).toLocaleString()} · {entry.promptCategory}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="leading-relaxed">{entry.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-border/50 shadow-sm">
                <CardContent className="py-12 text-center">
                  <BookOpenIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">{t('no_journal_entries')}</p>
                  <p className="text-muted-foreground/70 text-sm mt-2 max-w-md mx-auto">
                    {t('start_journaling')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="insights" className="mt-0">
            <div className="mb-6 text-center">
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">{t('insights_description')}</p>
            </div>
            
            <Card className="border border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-background pb-4">
                <CardTitle className="flex items-center gap-2">
                  <LightbulbIcon className="h-5 w-5 text-primary" />
                  {t('journaling_insights')}
                </CardTitle>
                <CardDescription>{t('journaling_insights_description')}</CardDescription>
              </CardHeader>
              <CardContent className="py-10 text-center">
                <div className="rounded-full w-16 h-16 bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <SparklesIcon className="h-8 w-8 text-primary/80" />
                </div>
                <p className="text-muted-foreground text-lg">{t('insights_coming_soon')}</p>
                <p className="text-muted-foreground/70 text-sm mt-2 max-w-md mx-auto">
                  {t('insights_coming_soon_desc')}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}