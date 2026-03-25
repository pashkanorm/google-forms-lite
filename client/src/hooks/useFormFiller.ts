import { useState, useCallback } from 'react';
import type { Answer } from '../../../shared/types';

export interface FormFillerState {
  answers: Record<string, string>;
}

export const useFormFiller = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const updateAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const addCheckboxAnswer = useCallback((questionId: string, optionValue: string) => {
    setAnswers((prev) => {
      const current = prev[questionId] || '';
      const values = current.split('|').filter(Boolean);
      const index = values.indexOf(optionValue);

      if (index > -1) {
        values.splice(index, 1);
      } else {
        values.push(optionValue);
      }

      return {
        ...prev,
        [questionId]: values.join('|'),
      };
    });
  }, []);

  const isCheckboxSelected = useCallback((questionId: string, optionValue: string): boolean => {
    const current = answers[questionId] || '';
    return current.split('|').includes(optionValue);
  }, [answers]);

  const resetAnswers = useCallback(() => {
    setAnswers({});
  }, []);

  const getAnswersArray = useCallback((): Answer[] => {
    return Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));
  }, [answers]);

  return {
    answers,
    updateAnswer,
    addCheckboxAnswer,
    isCheckboxSelected,
    resetAnswers,
    getAnswersArray,
  };
};
