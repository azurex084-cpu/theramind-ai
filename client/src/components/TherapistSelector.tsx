import React, { useState, useEffect } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, User, Plus, Edit } from 'lucide-react';
import { 
  getAllTherapistPersonas, 
  getTherapistPersona,
  getLocalizedTherapistField,
  fetchCustomTherapists,
  type TherapistPersona,
  type TherapyApproach
} from '@/lib/therapistPersonas';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';
import { getTherapyApproachName } from '@/lib/therapyTerms';

interface TherapistSelectorProps {
  currentTherapistId: TherapyApproach | string;
  onSelectTherapist: (therapistId: TherapyApproach | string) => void;
  userId?: number;
  showManageOption?: boolean;
}

export function TherapistSelector({
  currentTherapistId,
  onSelectTherapist,
  userId,
  showManageOption = false
}: TherapistSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentTherapist = getTherapistPersona(String(currentTherapistId));
  const [therapists, setTherapists] = useState<TherapistPersona[]>(getAllTherapistPersonas());
  const { t, language } = useLanguage();
  
  // Fetch custom therapists if userId is provided
  useEffect(() => {
    if (userId) {
      const loadCustomTherapists = async () => {
        await fetchCustomTherapists(userId);
        // Update the therapists list after fetching custom therapists
        setTherapists(getAllTherapistPersonas());
      };
      
      loadCustomTherapists();
    }
  }, [userId]);
  
  // Group therapists by custom and built-in
  const builtInTherapists = therapists.filter(t => !t.isCustom);
  const customTherapists = therapists.filter(t => t.isCustom);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          className="flex items-center justify-between px-3 py-2 w-full md:w-auto border-dashed"
          style={{ borderColor: currentTherapist.color }}
        >
          <div className="flex items-center">
            <span className="text-xl mr-2">{currentTherapist.icon}</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">{getLocalizedTherapistField(currentTherapist, 'name', language)}</span>
              <span className="text-xs text-muted-foreground">
                {currentTherapist.approach && typeof currentTherapist.approach === 'string' && (
                  // 直接使用getTherapyApproachName获取翻译
                  getTherapyApproachName(currentTherapist.approach, language)
                )}
              </span>
            </div>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-80 p-0">
        <div className="p-3 border-b">
          <h4 className="font-medium">{t('choose_therapist')}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {t('each_therapist_specializes')}
          </p>
        </div>
        <div className="max-h-72 overflow-auto p-1">
          {/* Built-in therapists section */}
          {builtInTherapists.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-semibold px-3 py-1 text-muted-foreground">
                {t('built_in_therapists')}
              </h5>
              {builtInTherapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className={`relative flex items-center space-x-3 rounded-md px-3 py-3 cursor-pointer transition-colors ${
                    String(therapist.id) === String(currentTherapistId) 
                      ? 'bg-muted' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    // 确保ID是字符串类型
                    onSelectTherapist(String(therapist.id));
                    setOpen(false);
                  }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xl">
                    {therapist.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium leading-none">{getLocalizedTherapistField(therapist, 'name', language)}</h3>
                    <p className="text-sm text-muted-foreground">{getLocalizedTherapistField(therapist, 'title', language)}</p>
                    <p className="text-xs">{getLocalizedTherapistField(therapist, 'description', language)}</p>
                    <div className="mt-2 pt-2 border-t border-dashed border-neutral-200">
                      <p className="text-xs italic">
                        <span className="font-medium text-neutral-500">{t('speaking_style')}: </span>
                        {getLocalizedTherapistField(therapist, 'speakingStyle', language)}
                      </p>
                    </div>
                  </div>
                  {String(therapist.id) === String(currentTherapistId) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Custom therapists section */}
          {customTherapists.length > 0 && (
            <div className="mb-2">
              <h5 className="text-xs font-semibold px-3 py-1 text-muted-foreground flex justify-between items-center">
                <span>{t('custom_therapists')}</span>
              </h5>
              {customTherapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className={`relative flex items-center space-x-3 rounded-md px-3 py-3 cursor-pointer transition-colors ${
                    String(therapist.id) === String(currentTherapistId) 
                      ? 'bg-muted' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    // 确保ID是字符串类型
                    onSelectTherapist(String(therapist.id));
                    setOpen(false);
                  }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xl" 
                       style={{ borderColor: therapist.color }}>
                    {therapist.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium leading-none">{getLocalizedTherapistField(therapist, 'name', language)}</h3>
                      {showManageOption && therapist.id && (
                        <Link href={`/custom-therapists/edit/${therapist.id}`}>
                          <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />
                        </Link>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{getLocalizedTherapistField(therapist, 'title', language)}</p>
                    <p className="text-xs">{getLocalizedTherapistField(therapist, 'description', language)}</p>
                    <div className="mt-2 pt-2 border-t border-dashed border-neutral-200">
                      <p className="text-xs italic">
                        <span className="font-medium text-neutral-500">{t('speaking_style')}: </span>
                        {getLocalizedTherapistField(therapist, 'speakingStyle', language)}
                      </p>
                    </div>
                    {therapist.baseTherapyApproach && (
                      <p className="text-xs mt-1">
                        <span className="font-medium text-neutral-500">{t('based_on')}: </span>
                        {getTherapyApproachName(therapist.baseTherapyApproach, language)}
                      </p>
                    )}
                  </div>
                  {String(therapist.id) === String(currentTherapistId) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Manage custom therapists button */}
          {showManageOption && (
            <div className="p-2 border-t">
              <Link href="/custom-therapists">
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('manage_custom_therapists')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}