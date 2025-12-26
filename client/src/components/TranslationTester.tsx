import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import TranslatedMessageContent from './TranslatedMessageContent';

const TranslationTester: React.FC = () => {
  const { language, isTranslationActive, setIsTranslationActive } = useLanguage();
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('Hello, how are you? This is a test message to see if automatic translation is working properly.');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslationToggle = () => {
    setIsTranslationActive(!isTranslationActive);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Translation Test Tool</CardTitle>
        <CardDescription>
          Test the automatic translation feature with different text inputs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-medium text-sm">Current language:</span> {language}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Auto-translate:</span>
            <Button 
              variant={isTranslationActive ? "default" : "outline"} 
              onClick={handleTranslationToggle}
              size="sm"
            >
              {isTranslationActive ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Input text (English):</label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="Enter text to translate..."
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Translated result:</label>
            {isTranslating && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> 
                {t('translating_message')}
              </div>
            )}
          </div>
          <div className="p-4 rounded-md border bg-muted/20">
            <TranslatedMessageContent
              text={inputText}
              sourceLanguage="en"
              autoTranslate={true}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {isTranslationActive ? 
            'Translation is active. Messages will be translated automatically.' :
            'Translation is disabled. Messages will be shown in their original language.'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TranslationTester;