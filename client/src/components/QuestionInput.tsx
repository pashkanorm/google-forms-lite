import React from 'react';
import { QuestionType } from '../../../shared/types';
import './QuestionInput.css';

interface QuestionInputProps {
  questionId: string;
  text: string;
  type: QuestionType;
  options?: string[];
  value?: string;
  onChange: (value: string) => void;
  onCheckboxChange?: (optionValue: string) => void;
  isCheckboxSelected?: (value: string) => boolean;
  isUnanswered?: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  text,
  type,
  options = [],
  value = '',
  onChange,
  onCheckboxChange,
  isCheckboxSelected,
  isUnanswered = false,
}) => {
  return (
    <div className="question-input">
      <label className="question-label">{text}{isUnanswered && <span className="unanswered-asterisk"> *</span>}</label>

      {type === QuestionType.TEXT && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="question-text-input"
          placeholder="Your answer"
        />
      )}

      {type === QuestionType.DATE && (
        <div className="date-input-wrapper">
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              // Prevent typing invalid characters
              if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab') {
                return;
              }
              // Allow only numbers and dash
              if (!/[0-9-]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className="question-date-input"
            max="9999-12-31"
          />
          <svg 
            className="calendar-icon" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            onClick={(e) => {
              const wrapper = e.currentTarget.parentElement;
              const input = wrapper?.querySelector('input[type="date"]') as HTMLInputElement | null;
              if (input) {
                input.focus();
                if ('showPicker' in input) {
                  input.showPicker();
                }
              }
            }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      )}

      {type === QuestionType.MULTIPLE_CHOICE && (
        <div className="question-options">
          {options.map((option) => (
            <label key={option} className="radio-label">
              <input
                type="radio"
                name={`question-${text}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {type === QuestionType.CHECKBOX && (
        <div className="question-options">
          {options.map((option) => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                checked={isCheckboxSelected?.(option) || false}
                onChange={() => onCheckboxChange?.(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionInput;
