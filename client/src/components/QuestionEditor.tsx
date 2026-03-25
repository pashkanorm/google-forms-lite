import React from 'react';
import { QuestionType } from '../../../shared/types';
import './QuestionEditor.css';

interface QuestionEditorProps {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  onUpdateText: (value: string) => void;
  onUpdateType: (value: QuestionType) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onUpdateOption: (index: number, value: string) => void;
  onDelete: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  text,
  type,
  options = [],
  onUpdateText,
  onUpdateType,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onDelete,
}) => {
  return (
    <div className="question-editor">
      <div className="editor-header">
        <input
          type="text"
          value={text}
          onChange={(e) => onUpdateText(e.target.value)}
          placeholder="Question"
          className="editor-text-input"
        />
        <select value={type} onChange={(e) => onUpdateType(e.target.value as QuestionType)} className="editor-type-select">
          <option value={QuestionType.TEXT}>Text</option>
          <option value={QuestionType.DATE}>Date</option>
          <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
          <option value={QuestionType.CHECKBOX}>Checkboxes</option>
        </select>
        <button type="button" onClick={onDelete} className="btn-danger">
          Delete
        </button>
      </div>

      {(type === QuestionType.MULTIPLE_CHOICE || type === QuestionType.CHECKBOX) && (
        <div className="editor-options">
          <div className="options-label">Options:</div>
          {options.map((option, index) => (
            <div key={index} className="option-input-row">
              <input
                type="text"
                value={option}
                onChange={(e) => onUpdateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="option-text-input"
              />
              {options.length > 1 && (
                <button type="button" onClick={() => onRemoveOption(index)} className="btn-danger">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={onAddOption} className="btn-secondary">
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;
