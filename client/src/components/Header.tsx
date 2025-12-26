import React from 'react';
import { Brain } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { DailyMotivation } from './DailyMotivation';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  userId?: number;
  sessionId?: string;
  currentLanguage?: string;
  onChangeLanguage?: (code: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userId = 1,
  sessionId,
  currentLanguage: propCurrentLanguage,
  onChangeLanguage: propOnChangeLanguage
}) => {
  // 使用全局语言上下文，如果Props提供了则优先使用Props
  const { language, setLanguage, supportedLanguages } = useLanguage();
  
  // 获取当前语言的显示名称
  const getLanguageName = (code: string) => {
    const lang = supportedLanguages.find(l => l.code === code);
    return lang ? lang.name : code;
  };
  
  // 确定使用哪个语言代码和更改函数
  const currentLanguage = propCurrentLanguage || language;
  const onChangeLanguage = propOnChangeLanguage || setLanguage;
  return (
    <header className="bg-white shadow-sm py-3 px-4 sm:px-6 fixed top-0 left-0 right-0 z-20">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary h-6 w-6 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"></path>
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"></path>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-primary-700 mr-4">TheraMind AI</h1>
        </div>
        
        <div className="flex items-center">
          <LanguageSelector 
            currentLanguage={currentLanguage} 
            onChangeLanguage={onChangeLanguage} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
