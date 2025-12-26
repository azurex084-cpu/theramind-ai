import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { RotateCw, Pencil } from 'lucide-react';
import { getJournalCategoryName } from '@/lib/categoryTranslations';
import { TranslatedPromptContent } from '@/components/TranslatedPromptContent';

type JournalingPromptCategory = 
  | 'self_reflection'
  | 'gratitude'
  | 'emotional_awareness'
  | 'goal_setting'
  | 'stress_management'
  | 'personal_growth';

type PromptCategory = {
  value: JournalingPromptCategory;
  name: string;
  description: string;
};

type JournalingPrompt = {
  id: number;
  userId: number;
  text: string;
  category: JournalingPromptCategory;
  createdAt: string;
  usedAt: string | null;
  isCustom: boolean;
  aiGenerated: boolean;
};

interface JournalingPromptProps {
  userId?: number;
  sessionId?: string;
  category?: string;
  onSubmitJournalEntry?: (promptId: number, response: string) => void;
}

export function JournalingPrompt({ 
  userId = 1,
  sessionId,
  onSubmitJournalEntry,
  category
}: JournalingPromptProps) {
  const [selectedCategory, setSelectedCategory] = useState<JournalingPromptCategory>(
    category as JournalingPromptCategory || 'self_reflection'
  );
  
  // Update selectedCategory when category prop changes
  useEffect(() => {
    if (category) {
      setSelectedCategory(category as JournalingPromptCategory);
    }
  }, [category]);
  const [customPromptText, setCustomPromptText] = useState('');
  const [journalResponse, setJournalResponse] = useState('');
  const [createCustom, setCreateCustom] = useState(false);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  // Fetch the journaling prompt categories
  const { data: promptCategories = [] } = useQuery({
    queryKey: ['/api/journaling-prompt-categories'],
    select: (data: any) => data as PromptCategory[]
  });

  // Fetch the daily journaling prompt
  const { 
    data: dailyPrompt, 
    isLoading: isLoadingPrompt,
    refetch: refetchPrompt 
  } = useQuery({
    queryKey: ['/api/users', userId, 'daily-journaling-prompt', { category: selectedCategory }],
    queryFn: async () => {
      console.log(`Fetching daily prompt for user ${userId} with category ${selectedCategory}`);
      const response = await fetch(`/api/users/${userId}/daily-journaling-prompt?category=${selectedCategory}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch daily prompt:", errorText);
        throw new Error(`Failed to fetch daily prompt: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      console.log("Received daily prompt:", data);
      return data;
    },
    select: (data: any) => {
      console.log("Processing daily prompt data:", data);
      return data as JournalingPrompt;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 0
  });

  // Generate AI prompt mutation
  const generateAiPromptMutation = useMutation({
    mutationFn: async (data: { userId: number, category: JournalingPromptCategory }) => {
      console.log("Sending generate AI prompt request:", data);
      
      const response = await fetch('/api/journaling-prompts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to generate AI prompt:", errorText);
        throw new Error(`Failed to generate AI prompt: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Generate AI prompt success:", result);
      return result;
    },
    onSuccess: (newPrompt) => {
      // 直接更新查询缓存
      queryClient.setQueryData(
        ['/api/users', userId, 'daily-journaling-prompt', { category: selectedCategory }], 
        newPrompt
      );
      
      // 同时也无效化查询缓存并强制刷新
      queryClient.invalidateQueries({ 
        queryKey: ['/api/users', userId, 'daily-journaling-prompt'] 
      });
      
      // 立即强制刷新
      setTimeout(() => {
        refetchPrompt();
      }, 100);
      
      // 显示成功提示
      toast({
        title: t('generate_ai_prompt' as any),
        description: t('prompt_created_success'),
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: 'Failed to generate AI prompt',
      });
    }
  });

  // Create a custom prompt mutation
  const createCustomPromptMutation = useMutation({
    mutationFn: async (data: { userId: number, text: string, category: JournalingPromptCategory }) => {
      const response = await fetch('/api/journaling-prompts/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create custom prompt');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t('custom_prompt_created'),
        description: t('prompt_created_success'),
      });
      setCustomPromptText('');
      setCreateCustom(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'daily-journaling-prompt'] });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('prompt_text_required'),
      });
    }
  });

  // Submit journal entry mutation
  const submitJournalEntryMutation = useMutation({
    mutationFn: async (data: { promptId: number, content: string, userId: number }) => {
      // Note: In a real implementation, this would send data to the server
      // For now, we're just simulating it with a console log and delay
      console.log('Submitting journal entry:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: t('journal_entry_saved'),
        description: t('journal_entry_saved_success'),
      });
      setJournalResponse('');
      
      // Mark the prompt as used
      if (dailyPrompt) {
        fetch(`/api/journaling-prompts/${dailyPrompt.id}/used`, {
          method: 'POST',
        });
      }
      
      // Notify parent component if callback provided
      if (onSubmitJournalEntry && dailyPrompt) {
        onSubmitJournalEntry(dailyPrompt.id, journalResponse);
      }
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('journal_response_required'),
      });
    }
  });

  const handleCreateCustomPrompt = () => {
    if (!customPromptText.trim()) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('prompt_text_required'),
      });
      return;
    }

    createCustomPromptMutation.mutate({
      userId,
      text: customPromptText,
      category: selectedCategory
    });
  };

  const handleSubmitJournalEntry = () => {
    if (!journalResponse.trim() || !dailyPrompt) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('journal_response_required'),
      });
      return;
    }

    submitJournalEntryMutation.mutate({
      promptId: dailyPrompt.id,
      content: journalResponse,
      userId
    });
  };

// 使用外部的TranslatedPromptContent组件

  return (
    <Card className="w-full border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-background via-primary/5 to-background border-b border-border/10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Pencil className="h-5 w-5 text-primary" />
          {t('journaling_prompt')}
        </CardTitle>
        <CardDescription>{t('journaling_prompt_description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div>
            <div className="flex items-center gap-2 mb-0">
              <Switch
                checked={createCustom}
                onCheckedChange={setCreateCustom}
                id="custom-prompt"
              />
              <Label htmlFor="custom-prompt" className="font-medium text-sm">{t('create_custom_prompt')}</Label>
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <div className="hidden">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as JournalingPromptCategory)}
              >
                <SelectTrigger id="category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {promptCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {getJournalCategoryName(category.value, language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => generateAiPromptMutation.mutate({ userId, category: selectedCategory })}
              variant="default"
              disabled={generateAiPromptMutation.isPending}
              className="w-full shadow-sm hover:shadow transition-all duration-300"
            >
              {generateAiPromptMutation.isPending ? (
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCw className="h-4 w-4 mr-2" />
              )}
              {t('generate_ai_prompt' as any)}
            </Button>
          </div>
        </div>

        {createCustom ? (
          <div className="space-y-4 pt-2">
            <Textarea
              placeholder={t('enter_custom_prompt')}
              value={customPromptText}
              onChange={(e) => setCustomPromptText(e.target.value)}
              className="min-h-[100px] shadow-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
            <Button 
              onClick={handleCreateCustomPrompt}
              disabled={createCustomPromptMutation.isPending}
              className="shadow-sm hover:shadow transition-all duration-300"
            >
              {createCustomPromptMutation.isPending ? (
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {t('save_prompt')}
            </Button>
          </div>
        ) : (
          <div className="min-h-[120px] border rounded-md p-5 bg-gradient-to-br from-background to-muted/30 flex flex-col justify-between shadow-sm">
            {isLoadingPrompt ? (
              <div className="flex items-center justify-center h-full py-6">
                <div className="flex flex-col items-center">
                  <RotateCw className="h-8 w-8 animate-spin text-primary/50 mb-2" />
                  <p className="text-muted-foreground animate-pulse">
                    {t('loading_prompt')}
                  </p>
                </div>
              </div>
            ) : dailyPrompt ? (
              <>
                <div className="mb-3">
                  <TranslatedPromptContent text={dailyPrompt.text} sourceLanguage="en" />
                </div>
                <div className="flex justify-start items-center mt-2">
                  <div className="flex flex-wrap gap-2">
                    {dailyPrompt.isCustom && (
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 inline-block"></span>
                        {t('custom_prompt')}
                      </span>
                    )}
                    {dailyPrompt.aiGenerated && (
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 inline-block"></span>
                        {t('ai_generated')}
                      </span>
                    )}
                    {!dailyPrompt.isCustom && !dailyPrompt.aiGenerated && (
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 inline-block"></span>
                        {t('standard_prompt')}
                      </span>
                    )}
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70 inline-block"></span>
                      {getJournalCategoryName(dailyPrompt.category, language)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-6">
                <p className="text-center text-muted-foreground">
                  {t('no_prompt_available')}
                </p>
              </div>
            )}
          </div>
        )}

        {!createCustom && dailyPrompt && (
          <div className="space-y-4 pt-2">
            <Textarea
              placeholder={t('write_your_journal_entry')}
              value={journalResponse}
              onChange={(e) => setJournalResponse(e.target.value)}
              className="min-h-[200px] border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 shadow-sm"
            />
            <Button 
              onClick={handleSubmitJournalEntry}
              disabled={submitJournalEntryMutation.isPending}
              className="w-full shadow-sm hover:shadow transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
            >
              {submitJournalEntryMutation.isPending ? (
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4 mr-2" />
              )}
              {t('submit_response')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}