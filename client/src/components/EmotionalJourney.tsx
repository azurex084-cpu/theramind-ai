import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, HelpCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMessageTranslation } from '@/hooks/useMessageTranslation';
import { TranslatedText } from '@/components/TranslatedText';

// Interface for sentiment data from API
type Sentiment = {
  category: string;
  score: number;
  keywords: string[];
  summary: string;
  timestamp: string;
  messageId: number;
};

// Interface for journey analysis from API
type EmotionalJourneyAnalysis = {
  trend: 'improving' | 'worsening' | 'fluctuating' | 'stable';
  averageScore: number;
  dominantEmotion: string;
  summary: string;
};

// Interface for component props
interface EmotionalJourneyProps {
  sessionId: string;
}

// 翻译情绪类别
function TranslatedEmotion({ emotion }: { emotion: string }) {
  return <TranslatedText text={emotion} className="capitalize" />;
}

// 翻译趋势词
function TranslatedTrend({ trend }: { trend: string }) {
  const trendTranslations: Record<string, Record<string, string>> = {
    'en': { 'improving': 'improving', 'worsening': 'worsening', 'fluctuating': 'fluctuating', 'stable': 'stable' },
    'zh': { 'improving': '改善中', 'worsening': '恶化中', 'fluctuating': '波动中', 'stable': '稳定' },
    'es': { 'improving': 'mejorando', 'worsening': 'empeorando', 'fluctuating': 'fluctuante', 'stable': 'estable' },
    'ja': { 'improving': '改善中', 'worsening': '悪化中', 'fluctuating': '変動中', 'stable': '安定' },
    'fr': { 'improving': 'en amélioration', 'worsening': 'en détérioration', 'fluctuating': 'fluctuant', 'stable': 'stable' },
    'de': { 'improving': 'verbessernd', 'worsening': 'verschlechternd', 'fluctuating': 'schwankend', 'stable': 'stabil' },
    'it': { 'improving': 'in miglioramento', 'worsening': 'in peggioramento', 'fluctuating': 'fluttuante', 'stable': 'stabile' },
    'pt': { 'improving': 'melhorando', 'worsening': 'piorando', 'fluctuating': 'flutuante', 'stable': 'estável' },
    'nl': { 'improving': 'verbeterend', 'worsening': 'verslechterend', 'fluctuating': 'fluctuerend', 'stable': 'stabiel' },
    'ru': { 'improving': 'улучшение', 'worsening': 'ухудшение', 'fluctuating': 'колебание', 'stable': 'стабильно' },
    'uk': { 'improving': 'покращення', 'worsening': 'погіршення', 'fluctuating': 'коливання', 'stable': 'стабільно' },
    'ar': { 'improving': 'تحسن', 'worsening': 'تدهور', 'fluctuating': 'متقلب', 'stable': 'مستقر' }
  };
  
  const { language } = useLanguage();
  const translatedTrend = trendTranslations[language as keyof typeof trendTranslations]?.[trend as keyof (typeof trendTranslations)['en']] || trend;
  
  return <span className="font-medium capitalize">{translatedTrend}</span>;
}

export function EmotionalJourney({ sessionId }: EmotionalJourneyProps) {
  const [activeTab, setActiveTab] = useState('chart');
  const { t, language } = useLanguage();
  
  // Fetch emotional journey data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'emotional-journey'],
    queryFn: () => apiRequest<{
      sentiments: Sentiment[];
      journey: EmotionalJourneyAnalysis;
    }>(`/api/sessions/${sessionId}/emotional-journey`),
    enabled: !!sessionId,
  });
  
  // Format data for charts
  const getFormattedChartData = () => {
    if (!data?.sentiments) return [];
    
    return data.sentiments.map(sentiment => ({
      name: format(new Date(sentiment.timestamp), 'HH:mm'),
      value: sentiment.score,
      emotion: sentiment.category,
      summary: sentiment.summary,
    }));
  };
  
  const chartData = getFormattedChartData();
  
  // Get mood color
  const getMoodColor = (score: number) => {
    if (score > 0.5) return 'text-green-500';
    if (score > 0.1) return 'text-emerald-400';
    if (score > -0.1) return 'text-blue-400';
    if (score > -0.5) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-7 w-7 text-green-500" />;
      case 'worsening':
        return <TrendingDown className="h-7 w-7 text-red-500" />;
      case 'fluctuating':
        return <Activity className="h-7 w-7 text-amber-500" />;
      default:
        return <HelpCircle className="h-7 w-7 text-blue-500" />;
    }
  };
  
  // Get color for area chart gradient
  const getAreaColor = () => {
    const trend = data?.journey?.trend;
    switch (trend) {
      case 'improving': return ['#4ade80', '#a7f3d0'];
      case 'worsening': return ['#f87171', '#fca5a5'];
      case 'fluctuating': return ['#facc15', '#fde68a'];
      default: return ['#60a5fa', '#bfdbfe'];
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-56 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle><TranslatedText text="Emotional Journey" /></CardTitle>
          <CardDescription><TranslatedText text="Unable to load emotional data" /></CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[200px] text-muted-foreground">
          <TranslatedText text="Not enough data to display emotional journey" />
        </CardContent>
      </Card>
    );
  }
  
  // No data state
  if (data.sentiments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle><TranslatedText text="Emotional Journey" /></CardTitle>
          <CardDescription><TranslatedText text="Share how you're feeling to see your emotional journey" /></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-[200px] text-muted-foreground">
          <HelpCircle className="h-12 w-12 text-muted-foreground/40 mb-2" />
          <p><TranslatedText text="Continue the conversation to track emotional patterns" /></p>
        </CardContent>
      </Card>
    );
  }
  
  // Format positive score as percentage
  const positivePercentage = Math.max(0, Math.min(100, (data.journey.averageScore + 1) * 50));
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle><TranslatedText text="Emotional Journey" /></CardTitle>
            <CardDescription><TranslatedText text="Track your emotional patterns during the conversation" /></CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getTrendIcon(data.journey.trend)}
            <div className="text-sm">
              <TranslatedTrend trend={data.journey.trend} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chart"><TranslatedText text="Emotion Chart" /></TabsTrigger>
            <TabsTrigger value="insights"><TranslatedText text="Insights" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getAreaColor()[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={getAreaColor()[1]} stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[-1, 1]} 
                    tick={{ fontSize: 12 }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                    tickFormatter={(value) => value === 0 ? 
                      (language === 'en' ? 'Neutral' : 
                       language === 'zh' ? '中性' : 
                       language === 'es' ? 'Neutral' : 
                       language === 'ja' ? 'ニュートラル' : 
                       language === 'fr' ? 'Neutre' :
                       language === 'de' ? 'Neutral' :
                       language === 'it' ? 'Neutrale' :
                       language === 'pt' ? 'Neutro' :
                       language === 'nl' ? 'Neutraal' :
                       language === 'ru' ? 'Нейтрально' :
                       language === 'uk' ? 'Нейтрально' :
                       language === 'ar' ? 'محايد' : 'Neutral') : ''}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium capitalize"><TranslatedText text={data.emotion} /></p>
                            <p className="text-sm text-muted-foreground">{data.name}</p>
                            <p className="text-sm">
                              <TranslatedText text="Score" />: {data.value.toFixed(2)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getAreaColor()[0]} 
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {data.sentiments
                .map(s => s.category)
                .filter((value, index, self) => self.indexOf(value) === index) // remove duplicates
                .map((emotion, i) => (
                  <div key={i} className="bg-muted px-2 py-1 rounded-full text-xs capitalize">
                    <TranslatedText text={emotion} />
                  </div>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div>
              <h4 className="font-medium mb-1"><TranslatedText text="Average Emotional Tone" /></h4>
              <div className="flex items-center">
                <span className="text-xs w-16 text-muted-foreground"><TranslatedText text="Negative" /></span>
                <Progress value={positivePercentage} className="h-2 flex-1 mx-2" />
                <span className="text-xs w-16 text-right text-muted-foreground"><TranslatedText text="Positive" /></span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-1"><TranslatedText text="Dominant Emotion" /></h4>
              <p className="text-lg capitalize"><TranslatedText text={data.journey.dominantEmotion} /></p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1"><TranslatedText text="Summary" /></h4>
              <p className="text-sm text-muted-foreground"><TranslatedText text={data.journey.summary} /></p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1"><TranslatedText text="Key Emotional Words" /></h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.sentiments.flatMap(s => s.keywords || [])
                  .filter((word, i, arr) => arr.indexOf(word) === i)
                  .slice(0, 8)
                  .map((word, i) => (
                    <div key={i} className="bg-primary/10 px-2 py-1 rounded-full text-xs">
                      {/* 不翻译关键词，保持原始语言 */}
                      {word}
                    </div>
                  ))
                }
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}