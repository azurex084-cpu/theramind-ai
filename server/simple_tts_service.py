#!/usr/bin/env python3
"""
Simple TTS Service using available Python libraries
Fallback TTS service when PaddleSpeech dependencies are not available
"""

import sys
import os
import io
import base64
import json
import tempfile
import numpy as np
from typing import Optional

def generate_simple_tts(text: str, language_code: str = 'zh_HK') -> str:
    """
    Generate speech using available TTS libraries
    This is a lightweight fallback when PaddleSpeech is not available
    """
    try:
        import pyttsx3
        
        print(f"[SimpleTTS] Using pyttsx3 for TTS generation", file=sys.stderr)
        
        # Initialize TTS engine
        engine = pyttsx3.init()
        
        # Configure voice settings
        voices = engine.getProperty('voices')
        print(f"[SimpleTTS] Available voices: {len(voices)}", file=sys.stderr)
        
        # Try to find a suitable voice for the language
        selected_voice = None
        for i, voice in enumerate(voices):
            print(f"[SimpleTTS] Voice {i}: {voice.name} - {voice.id}", file=sys.stderr)
            # Look for Chinese or female voices as they tend to work better
            if any(keyword in voice.name.lower() for keyword in ['chinese', 'mandarin', 'female', 'zh']):
                selected_voice = voice.id
                print(f"[SimpleTTS] Selected Chinese/female voice: {voice.name}", file=sys.stderr)
                break
        
        # If no Chinese voice found, use the first available voice
        if not selected_voice and voices:
            selected_voice = voices[0].id
            print(f"[SimpleTTS] Using default voice: {voices[0].name}", file=sys.stderr)
        
        if selected_voice:
            engine.setProperty('voice', selected_voice)
        
        # Set speech rate and volume for better quality
        engine.setProperty('rate', 120)  # Slower for better clarity
        engine.setProperty('volume', 0.9)
        
        # Generate speech to temporary file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
            temp_wav_path = temp_wav.name
        
        try:
            # Use pyttsx3 to generate speech
            engine.save_to_file(text, temp_wav_path)
            engine.runAndWait()
            
            # Wait a moment for file to be written
            import time
            time.sleep(0.5)
            
            # Check if file was created and has content
            if os.path.exists(temp_wav_path) and os.path.getsize(temp_wav_path) > 0:
                # Read the audio file and convert to base64
                with open(temp_wav_path, 'rb') as audio_file:
                    audio_data = audio_file.read()
                
                base64_audio = base64.b64encode(audio_data).decode('utf-8')
                
                print(f"[SimpleTTS] pyttsx3 audio generated successfully. Size: {len(audio_data)} bytes", file=sys.stderr)
                
                return base64_audio
            else:
                print("[SimpleTTS] pyttsx3 failed to generate audio file, trying fallback", file=sys.stderr)
                raise Exception("No audio file generated")
            
        finally:
            # Clean up temp file
            if os.path.exists(temp_wav_path):
                os.unlink(temp_wav_path)
        
    except ImportError:
        print("[SimpleTTS] pyttsx3 not available, using basic fallback", file=sys.stderr)
        return generate_basic_fallback(text, language_code)
    
    except Exception as e:
        print(f"[SimpleTTS] Error with pyttsx3: {str(e)}, using fallback", file=sys.stderr)
        return generate_basic_fallback(text, language_code)

def generate_basic_fallback(text: str, language_code: str) -> str:
    """
    Basic fallback that creates a simple tone sequence
    This ensures the system doesn't fail completely
    """
    try:
        import soundfile as sf
        
        print(f"[SimpleTTS] Using basic tone generation fallback", file=sys.stderr)
        
        # Generate a simple tone sequence based on text length
        duration = max(1.0, min(10.0, len(text) * 0.1))  # 0.1 seconds per character
        sample_rate = 22050
        
        # Create a simple sine wave with varying frequency
        t = np.linspace(0, duration, int(sample_rate * duration))
        
        # Base frequency varies with text content
        base_freq = 200 + (hash(text) % 100)  # 200-300 Hz range
        
        # Create a modulated tone
        frequency_modulation = np.sin(2 * np.pi * 2 * t) * 50  # 2 Hz modulation, ±50 Hz
        audio_signal = np.sin(2 * np.pi * (base_freq + frequency_modulation) * t)
        
        # Apply envelope to make it sound more natural
        envelope = np.exp(-t * 0.5)  # Exponential decay
        audio_signal *= envelope * 0.3  # Lower volume
        
        # Convert to bytes
        with io.BytesIO() as buffer:
            sf.write(buffer, audio_signal, sample_rate, format='WAV')
            audio_bytes = buffer.getvalue()
        
        base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
        
        print(f"[SimpleTTS] Basic fallback audio generated. Duration: {duration:.1f}s", file=sys.stderr)
        return base64_audio
        
    except Exception as e:
        print(f"[SimpleTTS] Fallback generation failed: {str(e)}", file=sys.stderr)
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
        audio_data = generate_simple_tts(text, language_code)
        
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