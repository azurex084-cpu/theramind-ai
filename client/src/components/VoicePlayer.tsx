import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';

interface VoicePlayerProps {
  text: string;
  languageCode: string;
  therapistId?: string | number;
  isDisabled?: boolean;
  className?: string;
  autoPlay?: boolean;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({
  text,
  languageCode = 'en',
  therapistId,
  isDisabled = false,
  className = '',
  autoPlay = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useTranslation();
  const { language } = useLanguage(); // 获取当前应用语言设置
  
  // Function to generate speech from text
  const generateSpeech = async () => {
    if (!text || text.trim() === '') return;
    
    try {
      setIsGenerating(true);
      
      // 强制使用当前应用语言设置，忽略传入的languageCode参数
      const systemLanguageCode = language; // 使用系统语言设置
      const normalizedLanguageCode = 
        (systemLanguageCode === 'yue') ? 'zh_HK' : systemLanguageCode;
      
      console.log(`[VoicePlayer] New text detected, language: ${systemLanguageCode}, generating speech...`);
      console.log(`[VoicePlayer] Generating speech for language: ${systemLanguageCode} (normalized: ${normalizedLanguageCode})`);
      console.log(`[VoicePlayer] Text sample: "${text.substring(0, 30)}..."`);
      
      // Call API to generate speech with system language setting
      const result = await apiRequest('/api/voice/synthesize', {
        method: 'POST',
        body: JSON.stringify({
          text: text,
          languageCode: normalizedLanguageCode, // 强制使用系统语言
          therapistId: therapistId
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (result.audioData) {
        console.log(`[VoicePlayer] Speech generation successful. Audio data length: ${result.audioData.length}`);
        // Convert base64 to audio source
        const audioDataUrl = `data:audio/mp3;base64,${result.audioData}`;
        setAudioSrc(audioDataUrl);
        
        // Auto-play if enabled
        if (autoPlay) {
          console.log(`[VoicePlayer] Auto-playing audio`);
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => console.log('[VoicePlayer] Audio playback started'))
                .catch(err => console.error('[VoicePlayer] Error auto-playing audio:', err));
            }
          }, 100);
        }
      } else {
        console.warn('[VoicePlayer] No audio data received from server');
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle play/pause
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(err => console.error('Error playing audio:', err));
    }
  };
  
  // Play automatically if autoPlay is true and audio is available
  useEffect(() => {
    if (autoPlay && audioSrc && audioRef.current) {
      audioRef.current.play()
        .catch(err => console.error('Error auto-playing audio:', err));
    }
  }, [autoPlay, audioSrc]);
  
  // Generate speech when text, languageCode, or app language changes
  useEffect(() => {
    // Clean cached audio if language or text changes to avoid playback of wrong language
    setAudioSrc(null);
    
    // Only generate speech for meaningful content
    if (text && text.trim().length > 5) {
      console.log(`[VoicePlayer] Regenerating speech: app language=${language}, passed language=${languageCode}, text="${text.substring(0, 50)}..."`);
      generateSpeech();
    } else {
      console.log(`[VoicePlayer] Text too short or empty (${text?.length || 0} chars), skipping speech generation`);
    }
  }, [text, languageCode, language]); // 添加 language 依赖，确保语言切换时重新生成
  
  // Update playing state based on audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef.current]);
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={audioSrc ? togglePlayback : generateSpeech}
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              disabled={isDisabled || isGenerating || (text?.trim().length === 0)}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isGenerating ? t('generating_speech') : 
             isPlaying ? t('stop_playback') : 
             audioSrc ? t('play_message') : t('generate_speech')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Hidden audio element */}
      {audioSrc && (
        <audio 
          ref={audioRef}
          src={audioSrc}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

export default VoicePlayer;