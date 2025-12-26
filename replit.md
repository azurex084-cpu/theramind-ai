# TheraMind AI - Multilingual AI Therapy Platform

## Overview

TheraMind AI is a comprehensive web-based therapeutic assistance platform that provides AI-powered psychological support through multiple therapy approaches and multilingual interactions. The application combines Express.js backend with React frontend, featuring PostgreSQL database storage and sophisticated AI response generation with personality-driven therapeutic personas.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom theme variables and shadcn/ui components

### Backend Architecture
- **Runtime**: Node.js with TypeScript (ES modules)
- **Framework**: Express.js for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Authentication**: Session-based (using connect-pg-simple for PostgreSQL session storage)
- **AI Integration**: OpenAI GPT-4o for therapeutic responses
- **Audio Processing**: OpenAI Whisper for transcription and custom TTS solutions

### Database Schema
- **Users**: Basic user management and preferences
- **Sessions**: Therapy session tracking with approach persistence
- **Messages**: Chat message history with sentiment analysis
- **Custom Therapists**: User-created therapeutic personas with personality traits
- **Quotes**: Motivational content categorized by emotional themes
- **Journaling Prompts**: Guided reflection questions by therapeutic category
- **Therapy Notes**: Session summaries and therapeutic insights

## Key Components

### Therapeutic Personas System
- **Built-in Personas**: Pre-configured therapists (Dr.AZ - harsh, Dr.Q - gentle, Dr.Dee - tough love)
- **Custom Therapists**: User-created personas with 4-dimensional personality traits:
  - Rational/Emotional (0-100 scale)
  - Friendly/Strict (0-100 scale)
  - Practical/Creative (0-100 scale)  
  - Direct/Indirect (0-100 scale)
- **Template-Based Responses**: Language-specific response templates ensuring consistent personality expression

### Multilingual Support
- **Supported Languages**: 15 languages including English, Chinese (Simplified/Traditional), Cantonese, Spanish, Japanese, Korean, French, German, Italian, Portuguese, Dutch, Russian, Ukrainian, Arabic
- **Real-time Translation**: Automatic message translation with fallback mechanisms
- **Localized Interfaces**: Complete UI translation with language-specific therapeutic terms
- **Audio Processing**: Multilingual speech-to-text and text-to-speech capabilities with Korean language optimization

### AI Response Generation
- **Quota Management**: Daily/hourly API call limits with usage tracking
- **Response Caching**: Prevents duplicate API calls for identical requests
- **Fallback Responses**: Pre-defined responses when API quotas are exceeded
- **Sentiment Analysis**: Emotional state detection for personalized responses
- **Template-Based Generation**: Personality-driven response patterns

### Audio Features
- **Speech Recognition**: OpenAI Whisper integration for voice input
- **Text-to-Speech**: Multi-service TTS with PaddleSpeech for Chinese languages
- **Voice Caching**: Identical content produces consistent pronunciation
- **Language Detection**: Automatic language identification for audio processing

## Data Flow

1. **User Interaction**: Voice or text input through React frontend
2. **Language Processing**: Automatic language detection and translation if needed
3. **Therapeutic Analysis**: AI generates response based on selected persona and therapy approach
4. **Response Generation**: Template-based personality expression in target language
5. **Audio Synthesis**: Optional TTS conversion for voice output
6. **Data Persistence**: Messages, sentiment, and session data stored in PostgreSQL

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o for text generation, Whisper for transcription
- **Anthropic Claude**: Secondary AI provider for response generation
- **Translation Services**: Multiple translation APIs with fallback mechanisms

### Audio Processing
- **PaddleSpeech**: Advanced TTS for Chinese languages (Mandarin, Cantonese)
- **Python TTS Services**: pyttsx3 for fallback text-to-speech
- **Audio Libraries**: librosa, soundfile for audio processing

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Connection Pooling**: @neondatabase/serverless for optimized connections

### Development Tools
- **Replit Integration**: Native development environment support
- **Vite Plugins**: Hot reload, error overlay, theme management
- **TypeScript**: Full-stack type safety

## Deployment Strategy

### Development Environment
- **Replit-native**: Configured for seamless Replit development
- **Hot Reload**: Instant frontend updates with Vite HMR
- **Environment Variables**: Secure API key and database credential management
- **Port Configuration**: 5000 (development) → 80 (production)

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles Node.js server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Process Management**: PM2 or similar for production server management

### Database Migrations
- **Drizzle Kit**: Schema migrations with `drizzle-kit push`
- **Version Control**: SQL migration files in `/migrations`
- **Type Generation**: Automatic TypeScript type generation from schema

## Recent Changes

- **July 21, 2025**: Dr.Dee "Toxic" Therapist System Fixed and Enhanced
  - Resolved critical syntax errors in Dr.Dee response generation system
  - Created simplified backup response generator (drDeeResponses_backup.ts) to replace broken original
  - Updated all import references across customTherapistResponses.ts, routes.ts, and openai.ts  
  - Fixed language localization - Dr.Dee now responds correctly in Chinese when user language is Chinese
  - Enhanced response quality to be contextually relevant to user input rather than generic templates
  - Dr.Dee now generates appropriate "tough love" responses with sarcasm and constructive criticism
  - Implemented direct OpenAI API calls with specific persona instructions for better language control
  - Added temporary simplified sensitive topic detection while main Dr.Dee functions are disabled

- **July 21, 2025**: Enhanced quote categorization system
  - Removed generic "general" category and replaced with 16 specific categories
  - New categories: confidence, growth, resilience, mindfulness, gratitude, compassion, motivation, self_care, wisdom, healing, inner_peace, self_love, courage, hope, strength, acceptance
  - Added complete translations for all 16 categories across 15 languages (English, Chinese Simplified/Traditional, Cantonese, Japanese, Korean, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Ukrainian, Arabic)
  - Migrated existing 11 "general" quotes to "motivation" category in database
  - Updated API endpoints to return new category structure

- **June 18, 2025**: Added comprehensive Korean language support
  - Complete UI translations for all interface elements and therapeutic approaches
  - Korean voice synthesis using "shimmer" voice model optimized for Asian languages  
  - Korean text preprocessing for better TTS pronunciation (AI→에이아이, Dr.→박사)
  - Integration with existing voice caching system for pronunciation consistency
  - Korean language support in Whisper speech-to-text transcription

## Changelog

- July 21, 2025: Enhanced quote categorization with 16 specific categories and multilingual support
- June 18, 2025: Initial setup and Korean language implementation

## User Preferences

Preferred communication style: Simple, everyday language.