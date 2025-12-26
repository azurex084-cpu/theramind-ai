import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Language } from '@/types';
import { supportedLanguages } from '@/lib/translations';

interface LanguageSelectorProps {
  currentLanguage: string;
  onChangeLanguage: (code: string) => void;
}

// Use the supportedLanguages from translations.ts
const languages: Language[] = supportedLanguages;

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onChangeLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-neutral-50 px-3 py-2 rounded-md text-sm text-neutral-700 border border-neutral-200 hover:bg-neutral-100 transition-colors"
      >
        <Globe className="mr-2 h-4 w-4 text-primary-500" />
        <span>{languages.find(lang => lang.code === currentLanguage)?.name || currentLanguage}</span>
        <ChevronDown className="ml-2 h-3 w-3 text-neutral-400" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-[200] border border-neutral-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              onClick={() => {
                onChangeLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
