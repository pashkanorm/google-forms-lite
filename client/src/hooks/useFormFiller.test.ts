import { renderHook, act } from '@testing-library/react';
import { useFormFiller } from './useFormFiller';

describe('useFormFiller', () => {
  it('should initialize with empty answers', () => {
    const { result } = renderHook(() => useFormFiller());

    expect(result.current.answers).toEqual({});
  });

  it('should update answer for a question', () => {
    const { result } = renderHook(() => useFormFiller());

    act(() => {
      result.current.updateAnswer('q1', 'Test Answer');
    });

    expect(result.current.answers['q1']).toBe('Test Answer');
  });

  it('should add checkbox answer', () => {
    const { result } = renderHook(() => useFormFiller());

    act(() => {
      result.current.addCheckboxAnswer('q1', 'Option 1');
    });

    expect(result.current.answers['q1']).toBe('Option 1');
  });

  it('should add multiple checkbox answers', () => {
    const { result } = renderHook(() => useFormFiller());

    act(() => {
      result.current.addCheckboxAnswer('q1', 'Option 1');
      result.current.addCheckboxAnswer('q1', 'Option 2');
    });

    expect(result.current.answers['q1']).toBe('Option 1|Option 2');
  });

  it('should remove checkbox answer when toggled', () => {
    const { result } = renderHook(() => useFormFiller());

    act(() => {
      result.current.addCheckboxAnswer('q1', 'Option 1');
      result.current.addCheckboxAnswer('q1', 'Option 2');
    });

    expect(result.current.answers['q1']).toBe('Option 1|Option 2');

    act(() => {
      result.current.addCheckboxAnswer('q1', 'Option 1');
    });

    expect(result.current.answers['q1']).toBe('Option 2');
  });

  it('should check if checkbox is selected', () => {
    const { result } = renderHook(() => useFormFiller());

    act(() => {
      result.current.addCheckboxAnswer('q1', 'Option 1');
    });

    expect(result.current.isCheckboxSelected('q1', 'Option 1')).toBe(true);
    expect(result.current.isCheckboxSelected('q1', 'Option 2')).toBe(false);
  });

  it('should reset all answers', () => {
    const { result } = renderHook(() => useFormFiller());

    act(() => {
      result.current.updateAnswer('q1', 'Answer 1');
      result.current.updateAnswer('q2', 'Answer 2');
    });

    expect(Object.keys(result.current.answers)).toHaveLength(2);

    act(() => {
      result.current.resetAnswers();
    });

    expect(result.current.answers).toEqual({});
  });

  it('should convert answers to array format', () => {
    const { result } = renderHook(() => useFormFiller());

    act(() => {
      result.current.updateAnswer('q1', 'Answer 1');
      result.current.updateAnswer('q2', 'Answer 2');
    });

    const answersArray = result.current.getAnswersArray();

    expect(answersArray).toHaveLength(2);
    expect(answersArray).toContainEqual({ questionId: 'q1', value: 'Answer 1' });
    expect(answersArray).toContainEqual({ questionId: 'q2', value: 'Answer 2' });
  });

  it('should handle empty answers array', () => {
    const { result } = renderHook(() => useFormFiller());

    const answersArray = result.current.getAnswersArray();

    expect(answersArray).toEqual([]);
  });
});
