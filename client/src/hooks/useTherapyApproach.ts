import { useState, useEffect, useCallback } from 'react';
import { TherapyApproach } from '@shared/schema';

/**
 * Custom hook to manage therapy approach selection and persistence
 * @param initialApproach Optional initial therapy approach
 * @param sessionId Optional session ID to persist approach
 */
export function useTherapyApproach(
  initialApproach: TherapyApproach = 'general',
  sessionId?: string
) {
  const [currentApproach, setCurrentApproach] = useState<TherapyApproach>(initialApproach);
  const [isChangingApproach, setIsChangingApproach] = useState(false);

  // Load therapy approach from session storage on mount
  useEffect(() => {
    if (sessionId) {
      const savedApproach = sessionStorage.getItem(`therapy_approach_${sessionId}`);
      if (savedApproach) {
        try {
          const parsedApproach = JSON.parse(savedApproach);
          if (typeof parsedApproach === 'string') {
            // Validate it's a valid therapy approach
            const isValidApproach = ['general', 'cbt', 'mindfulness', 'act', 
              'psychodynamic', 'solution_focused', 'humanistic', 
              'motivational', 'dbt', 'tough_love'].includes(parsedApproach);
              
            if (isValidApproach) {
              setCurrentApproach(parsedApproach as TherapyApproach);
            }
          }
        } catch (e) {
          console.error('Error parsing saved therapy approach:', e);
        }
      }
    }
  }, [sessionId]);

  // Change therapy approach and save to session storage
  const changeTherapyApproach = useCallback(async (newApproach: TherapyApproach) => {
    if (newApproach === currentApproach) return;
    
    setIsChangingApproach(true);
    
    try {
      // Update state
      setCurrentApproach(newApproach);
      
      // Save to session storage if we have a sessionId
      if (sessionId) {
        sessionStorage.setItem(`therapy_approach_${sessionId}`, JSON.stringify(newApproach));
      }
      
      // If this is a new session, we don't need to update the server
      if (!sessionId) {
        setIsChangingApproach(false);
        return;
      }
      
      // Update session on server
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: sessionId,
          therapyApproach: newApproach,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update therapy approach on server');
      }
      
    } catch (error) {
      console.error('Error changing therapy approach:', error);
    } finally {
      setIsChangingApproach(false);
    }
  }, [currentApproach, sessionId]);

  return {
    currentApproach,
    changeTherapyApproach,
    isChangingApproach
  };
}