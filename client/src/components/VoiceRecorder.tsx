import React, { useState, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, MicOff, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
// Define LanguageCode type locally
type LanguageCode = 'en' | 'es' | 'zh' | 'zh_TW' | 'zh_HK' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'ru' | 'uk' | 'ar' | 'ja';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  languageCode: string;
  isDisabled?: boolean;
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
  languageCode = 'en',
  isDisabled = false,
  className = '',
}) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    video: false,
    blobPropertyBag: { type: 'audio/webm' },
  });

  // Reset timer when recording stops
  useEffect(() => {
    if (status !== 'recording' && timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [status, timerId]);

  // Start timer when recording begins
  const handleStartRecording = () => {
    setRecordingTime(0);
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimerId(timer);
    startRecording();
  };

  const handleStopRecording = async () => {
    stopRecording();
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  // Convert blobUrl to base64 and send for transcription
  const handleTranscription = async () => {
    if (!mediaBlobUrl) return;

    try {
      setIsTranscribing(true);
      
      // Fetch the audio blob
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = async () => {
        const base64data = reader.result?.toString() || '';
        // Extract only the base64 part (remove the data URL prefix)
        const base64Audio = base64data.split(',')[1];
        
        if (base64Audio) {
          try {
            // Send to server for transcription
            const result = await apiRequest('/api/voice/transcribe', {
              method: 'POST',
              body: JSON.stringify({
                audioData: base64Audio,
                languageCode
              }),
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (result.text) {
              onTranscriptionComplete(result.text);
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
          } finally {
            setIsTranscribing(false);
            clearBlobUrl();
          }
        }
      };
    } catch (error) {
      console.error('Error preparing audio for transcription:', error);
      setIsTranscribing(false);
    }
  };

  // Format recording time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const { t } = useTranslation();
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <TooltipProvider>
        {status === 'recording' ? (
          <>
            <Badge variant="destructive" className="animate-pulse">
              {formatTime(recordingTime)}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleStopRecording} 
                  size="sm" 
                  variant="destructive"
                  disabled={isDisabled}
                >
                  <Square className="h-4 w-4 mr-1" />
                  {t('stop')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('stop_recording')}</TooltipContent>
            </Tooltip>
          </>
        ) : mediaBlobUrl ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleTranscription} 
                  size="sm" 
                  variant="secondary"
                  disabled={isTranscribing || isDisabled}
                >
                  {isTranscribing ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-1" />
                  )}
                  {isTranscribing ? t('transcribing') : t('transcribe')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('transcribe_recording')}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={clearBlobUrl} 
                  size="sm" 
                  variant="outline"
                  disabled={isTranscribing || isDisabled}
                >
                  {t('cancel')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('discard_recording')}</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleStartRecording} 
                size="sm" 
                variant="outline"
                className="bg-white/10 hover:bg-white/20"
                disabled={isDisabled}
              >
                {status === 'idle' ? (
                  <Mic className="h-4 w-4 mr-1" />
                ) : (
                  <MicOff className="h-4 w-4 mr-1" />
                )}
                {t('record')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('record_voice_message')}</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default VoiceRecorder;