import { renderHook, act } from '@testing-library/react';
import { QuestionType } from '../../../shared/types';
import { useFormBuilder } from './useFormBuilder';

describe('useFormBuilder', () => {
  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useFormBuilder());

    expect(result.current.formData.title).toBe('');
    expect(result.current.formData.description).toBe('');
    expect(result.current.formData.questions).toEqual([]);
  });

  it('should update form title', () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.updateFormData('title', 'Test Form');
    });

    expect(result.current.formData.title).toBe('Test Form');
  });

  it('should update form description', () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.updateFormData('description', 'Test Description');
    });

    expect(result.current.formData.description).toBe('Test Description');
  });

  it('should add a question', () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.addQuestion();
    });

    expect(result.current.formData.questions).toHaveLength(1);
  });

  it('should add a question with proper structure', () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.addQuestion();
    });

    const question = result.current.formData.questions[0];
    expect(question).toBeDefined();
    expect(question.text).toBe('');
    expect(question.type).toBe(QuestionType.TEXT);
    expect(question.id).toBeTruthy();
  });

  it('should add multiple questions', () => {
    const { result } = renderHook(() => useFormBuilder());

    act(() => {
      result.current.addQuestion();
      result.current.addQuestion();
      result.current.addQuestion();
    });

    expect(result.current.formData.questions).toHaveLength(3);
  });

  it('should update question text', () => {
    const { result } = renderHook(() => useFormBuilder());

    const getQuestionId = () => result.current.formData.questions[0]?.id;

    act(() => {
      result.current.addQuestion();
    });

    const questionId = getQuestionId();
    if (questionId) {
      act(() => {
        result.current.updateQuestion(questionId, 'text', 'What is your name?');
      });

      expect(result.current.formData.questions[0].text).toBe('What is your name?');
    }
  });

  it('should update question type', () => {
    const { result } = renderHook(() => useFormBuilder());

    const getQuestionId = () => result.current.formData.questions[0]?.id;

    act(() => {
      result.current.addQuestion();
    });

    const questionId = getQuestionId();
    if (questionId) {
      act(() => {
        result.current.updateQuestion(questionId, 'type', QuestionType.DATE);
      });

      expect(result.current.formData.questions[0].type).toBe(QuestionType.DATE);
    }
  });

  it('should add option to question', () => {
    const { result } = renderHook(() => useFormBuilder());

    const getQuestionId = () => result.current.formData.questions[0]?.id;

    act(() => {
      result.current.addQuestion();
    });

    const questionId = getQuestionId();
    if (questionId) {
      act(() => {
        result.current.addOption(questionId);
      });

      expect(result.current.formData.questions[0].options).toEqual(['']);
    }
  });

  it('should initialize with provided initial state', () => {
    const initialState = {
      title: 'Initial Form',
      description: 'Initial Description',
      questions: [],
    };

    const { result } = renderHook(() => useFormBuilder(initialState));

    expect(result.current.formData.title).toBe('Initial Form');
    expect(result.current.formData.description).toBe('Initial Description');
  });
});
