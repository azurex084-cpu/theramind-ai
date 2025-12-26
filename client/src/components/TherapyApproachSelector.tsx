import { useState, useEffect } from 'react';
import { TherapyApproach } from '@shared/schema';
import { 
  TherapyApproachInfo,
  getAllTherapyApproaches
} from '@/lib/therapyApproaches';
// 使用新的翻译功能
import { getTherapyApproachName } from '@/lib/therapyTerms';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslatedTherapyTerm } from '@/components/TranslatedTherapyTerm';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

interface TherapyApproachSelectorProps {
  currentApproach: TherapyApproach;
  onApproachChange: (approach: TherapyApproach) => void;
  disabled?: boolean;
}

export function TherapyApproachSelector({
  currentApproach,
  onApproachChange,
  disabled = false
}: TherapyApproachSelectorProps) {
  const [selectedApproach, setSelectedApproach] = useState<TherapyApproach>(currentApproach || 'general');
  const [approaches, setApproaches] = useState<TherapyApproachInfo[]>([]);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<TherapyApproachInfo | null>(null);
  
  const { t, language } = useLanguage();
  
  // Load therapy approaches
  useEffect(() => {
    setApproaches(getAllTherapyApproaches());
  }, []);
  
  // Update when currentApproach changes externally
  useEffect(() => {
    if (currentApproach && currentApproach !== selectedApproach) {
      setSelectedApproach(currentApproach);
    }
  }, [currentApproach]);
  
  const handleApproachChange = (value: string) => {
    const newApproach = value as TherapyApproach;
    setSelectedApproach(newApproach);
    onApproachChange(newApproach);
  };
  
  const openInfoDialog = (approach: TherapyApproachInfo) => {
    setSelectedInfo(approach);
    setIsInfoOpen(true);
  };
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Select 
          value={selectedApproach} 
          onValueChange={handleApproachChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('choose_therapist')}>
              {selectedApproach && (
                <TranslatedTherapyTerm term={selectedApproach} type="approach" />
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('therapeutic_approach')}</SelectLabel>
              {approaches.map((approach) => (
                <SelectItem 
                  key={approach.id} 
                  value={approach.id}
                  className="flex items-center justify-between"
                >
                  <TranslatedTherapyTerm term={approach.id} type="approach" />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const approach = approaches.find(a => a.id === selectedApproach);
            if (approach) {
              openInfoDialog(approach);
            }
          }}
          disabled={disabled}
          aria-label={t('approach_how_it_works')}
        >
          <InfoIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedInfo && (
                <TranslatedTherapyTerm term={selectedInfo.id} type="approach" />
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedInfo && selectedInfo.description}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-3 rounded-md text-sm mt-2">
            <p className="font-semibold mb-1">{t('approach_how_it_works')}</p>
            <p className="text-muted-foreground">
              {selectedInfo?.id === 'cbt' && t('approach_cbt_how_it_works')}
              {selectedInfo?.id === 'mindfulness' && t('approach_mindfulness_how_it_works')}
              {selectedInfo?.id === 'act' && t('approach_act_how_it_works')}
              {selectedInfo?.id === 'psychodynamic' && t('approach_psychodynamic_how_it_works')}
              {selectedInfo?.id === 'solution_focused' && t('approach_solution_focused_how_it_works')}
              {selectedInfo?.id === 'humanistic' && t('approach_humanistic_how_it_works')}
              {selectedInfo?.id === 'motivational' && t('approach_motivational_how_it_works')}
              {selectedInfo?.id === 'dbt' && t('approach_dbt_how_it_works')}
              {selectedInfo?.id === 'general' && t('approach_general_how_it_works')}
              {selectedInfo?.id === 'tough_love' && t('approach_tough_love_how_it_works')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}