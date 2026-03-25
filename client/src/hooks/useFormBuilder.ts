import { useState, useCallback } from 'react';
import { QuestionType } from '../../../shared/types';

export interface QuestionInput {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
}

export interface FormBuilderState {
  title: string;
  description: string;
  questions: QuestionInput[];
}

export const useFormBuilder = (initialState?: Partial<FormBuilderState>) => {
  const [formData, setFormData] = useState<FormBuilderState>({
    title: initialState?.title || 'Untitled form',
    description: initialState?.description || '',
    questions: initialState?.questions || [],
  });

  const updateFormData = useCallback((field: 'title' | 'description', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addQuestion = useCallback(() => {
    const newQuestion: QuestionInput = {
      id: `temp-${Date.now()}`,
      text: '',
      type: QuestionType.TEXT,
    };
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  }, []);

  const removeQuestion = useCallback((questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  }, []);

  const updateQuestion = useCallback(
    (questionId: string, field: keyof QuestionInput, value: any) => {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id === questionId) {
            const updated = { ...q, [field]: value };
            // Auto-add default option when changing to multiple choice or checkbox types
            if (
              field === 'type' &&
              (value === QuestionType.MULTIPLE_CHOICE || value === QuestionType.CHECKBOX) &&
              (!q.options || q.options.length === 0)
            ) {
              updated.options = [''];
            }
            return updated;
          }
          return q;
        }),
      }));
    },
    []
  );

  const addOption = useCallback((questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), ''],
            }
          : q
      ),
    }));
  }, []);

  const removeOption = useCallback((questionId: string, optionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((_, i) => i !== optionIndex) || [],
            }
          : q
      ),
    }));
  }, []);

  const updateOption = useCallback(
    (questionId: string, optionIndex: number, value: string) => {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options?.map((opt, i) => (i === optionIndex ? value : opt)) || [],
              }
            : q
        ),
      }));
    },
    []
  );

  return {
    formData,
    updateFormData,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
  };
};
