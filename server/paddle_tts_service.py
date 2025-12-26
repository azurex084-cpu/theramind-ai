#!/usr/bin/env python3
"""
PaddleSpeech TTS Service for Cantonese and Multilingual Text-to-Speech
Provides high-quality neural voice synthesis with native Chinese language support
"""

import sys
import os
import io
import base64
import json
import tempfile
import soundfile as sf
import numpy as np
from typing import Optional

try:
    from paddlespeech.cli.tts import TTSExecutor
    from paddlespeech.cli.download import DownloadModel
    import paddle
    
    # Initialize PaddleSpeech
    paddle.disable_signal_handler()
    
    # Create TTS executor
    tts_executor = TTSExecutor()
    
    print("[PaddleTTS] PaddleSpeech TTS service initialized successfully", file=sys.stderr)
    
except ImportError as e:
    print(f"[PaddleTTS] Import error: {e}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"[PaddleTTS] Initialization error: {e}", file=sys.stderr)
    sys.exit(1)

def get_paddle_language_config(language_code: str) -> dict:
    """
    Get PaddleSpeech model configuration based on language code
    Returns model configuration for the specified language
    """
    # PaddleSpeech supported configurations
    configs = {
        'zh': {
            'am': 'fastspeech2_csmsc',  # Chinese model
            'am_config': None,
            'am_ckpt': None,
            'am_stat': None,
            'phones_dict': None,
            'tones_dict': None,
            'speaker_dict': None,
            'voc': 'pwgan_csmsc',
            'voc_config': None, 
            'voc_ckpt': None,
            'voc_stat': None,
            'lang': 'zh',
        },
        'zh_TW': {
            'am': 'fastspeech2_csmsc',
            'am_config': None,
            'am_ckpt': None,
            'am_stat': None,
            'phones_dict': None,
            'tones_dict': None,
            'speaker_dict': None,
            'voc': 'pwgan_csmsc',
            'voc_config': None,
            'voc_ckpt': None,
            'voc_stat': None,
            'lang': 'zh',
        },
        'zh_HK': {
            # Use Chinese model for Cantonese as closest approximation
            'am': 'fastspeech2_csmsc',
            'am_config': None,
            'am_ckpt': None,
            'am_stat': None,
            'phones_dict': None,
            'tones_dict': None,
            'speaker_dict': None,
            'voc': 'pwgan_csmsc',
            'voc_config': None,
            'voc_ckpt': None,
            'voc_stat': None,
            'lang': 'zh',
        },
        'en': {
            'am': 'fastspeech2_ljspeech',  # English model
            'am_config': None,
            'am_ckpt': None,
            'am_stat': None,
            'phones_dict': None,
            'tones_dict': None,
            'speaker_dict': None,
            'voc': 'pwgan_ljspeech',
            'voc_config': None,
            'voc_ckpt': None,
            'voc_stat': None,
            'lang': 'en',
        }
    }
    
    # Default to Chinese for unsupported languages
    return configs.get(language_code, configs['zh'])

def preprocess_cantonese_text(text: str) -> str:
    """
    Preprocess Cantonese text for better pronunciation with PaddleSpeech
    """
    # Basic text normalization for Cantonese
    processed_text = text
    
    # Add spaces between key phrases for better prosody
    cantonese_phrases = {
        '你好': '你 好',
        '多謝': '多 謝',
        '唔該': '唔 該',
        '點樣': '點 樣',
        '而家': '而 家',
        '咁樣': '咁 樣',
        '冇問題': '冇 問題',
        '心理治療': '心理 治療',
        '治療師': '治療 師',
        '感覺': '感 覺',
        '情緒': '情 緒',
        '壓力': '壓 力',
        '困難': '困 難',
        '解決': '解 決',
        '幫助': '幫 助',
        '支持': '支 持',
        '理解': '理 解',
        '明白': '明 白',
    }
    
    for original, spaced in cantonese_phrases.items():
        processed_text = processed_text.replace(original, spaced)
    
    # Add pauses for punctuation
    processed_text = processed_text.replace('。', '。 ')
    processed_text = processed_text.replace('！', '！ ')
    processed_text = processed_text.replace('？', '？ ')
    processed_text = processed_text.replace('，', '， ')
    
    # Clean up extra spaces
    processed_text = ' '.join(processed_text.split())
    
    return processed_text

def generate_speech_paddle(text: str, language_code: str = 'zh_HK') -> str:
    """
    Generate speech using PaddleSpeech TTS
    Returns base64-encoded audio data
    """
    try:
        print(f"[PaddleTTS] Generating speech for language: {language_code}", file=sys.stderr)
        print(f"[PaddleTTS] Text: {text[:50]}...", file=sys.stderr)
        
        # Preprocess text if it's Cantonese
        if language_code in ['zh_HK', 'yue']:
            processed_text = preprocess_cantonese_text(text)
            print(f"[PaddleTTS] Preprocessed Cantonese text: {processed_text[:50]}...", file=sys.stderr)
        else:
            processed_text = text
        
        # Get model configuration
        config = get_paddle_language_config(language_code)
        
        # Generate speech with PaddleSpeech
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
            temp_wav_path = temp_wav.name
        
        try:
            # Use TTS executor to generate audio
            result = tts_executor(
                text=processed_text,
                output=temp_wav_path,
                **config
            )
            
            # Read the generated audio file
            audio_data, sample_rate = sf.read(temp_wav_path)
            
            print(f"[PaddleTTS] Audio generated successfully. Sample rate: {sample_rate}, Duration: {len(audio_data)/sample_rate:.2f}s", file=sys.stderr)
            
            # Convert to bytes for base64 encoding
            with io.BytesIO() as buffer:
                sf.write(buffer, audio_data, sample_rate, format='WAV')
                audio_bytes = buffer.getvalue()
            
            # Encode to base64
            base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
            
            print(f"[PaddleTTS] Base64 encoding complete. Size: {len(base64_audio)} characters", file=sys.stderr)
            
            return base64_audio
            
        finally:
            # Clean up temp file
            if os.path.exists(temp_wav_path):
                os.unlink(temp_wav_path)
        
    except Exception as e:
        print(f"[PaddleTTS] Error generating speech: {str(e)}", file=sys.stderr)
        raise e

def main():
    """
    Main function to handle command line requests
    Expects JSON input: {"text": "...", "language": "..."}
    Returns JSON output: {"audioData": "...", "error": "..."}
    """
    try:
        # Read input from stdin
        input_data = sys.stdin.read().strip()
        if not input_data:
            raise ValueError("No input data provided")
        
        # Parse JSON input
        request = json.loads(input_data)
        text = request.get('text', '')
        language_code = request.get('language', 'zh_HK')
        
        if not text:
            raise ValueError("No text provided for TTS")
        
        # Generate speech
        audio_data = generate_speech_paddle(text, language_code)
        
        # Return success response
        response = {
            "audioData": audio_data,
            "error": None
        }
        
        print(json.dumps(response))
        
    except Exception as e:
        # Return error response
        error_response = {
            "audioData": None,
            "error": str(e)
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()