import React from 'react';
import './FormCard.css';

export interface FormCardProps {
  id: string;
  title: string;
  description?: string;
  questionCount: number;
  responseCount?: number;
  onViewForm: () => void;
  onViewResponses: () => void;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  description,
  questionCount,
  responseCount = 0,
  onViewForm,
  onViewResponses,
}) => {
  return (
    <div className="form-card">
      <div className="form-card-header">
        <h3 className="form-card-title">{title}</h3>
        <p className="form-card-description">{description || <em>No description</em>}</p>
        <div className="form-card-actions">
          <button onClick={onViewForm} className="btn-primary">
            View Form
          </button>
          <button onClick={onViewResponses} className="btn-secondary">
            View Responses ({responseCount})
          </button>
        </div>
      </div>
      <div className="form-card-content">
        <p className="form-card-count">{questionCount} question{questionCount !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
};

export default FormCard;
