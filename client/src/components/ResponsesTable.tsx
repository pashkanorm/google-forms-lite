import React from 'react';
import type { Form, Response, Question } from '../../../shared/types';
import './ResponsesTable.css';

interface ResponsesTableProps {
  form: Form;
  responses: Response[];
}

const ResponsesTable: React.FC<ResponsesTableProps> = ({ form, responses }) => {
  const getAnswersForQuestion = (questionId: string, questionType: string): string[] => {
    const allAnswers: string[] = [];
    
    responses.forEach((response) => {
      const answer = response.answers.find((a) => a.questionId === questionId);
      if (answer?.value) {
        // For checkboxes, split pipe-separated values
        if (questionType === 'CHECKBOX') {
          const parts = answer.value.split('|').filter(Boolean);
          allAnswers.push(...parts);
        } else {
          allAnswers.push(answer.value);
        }
      }
    });
    
    return allAnswers;
  };

  const getQuestionLabel = (question: Question): string => {
    return question.text;
  };

  if (responses.length === 0) {
    return (
      <div className="no-responses">
        <p>No responses yet</p>
      </div>
    );
  }

  return (
    <div className="responses-container-questions">
      {form.questions.map((question) => {
        const answers = getAnswersForQuestion(question.id, question.type);
        
        // For checkboxes, count unique responses (not individual selections)
        const responseCount = question.type === 'CHECKBOX' 
          ? responses.filter(r => r.answers.find(a => a.questionId === question.id)?.value).length
          : answers.length;
        
        const answerCounts: Record<string, number> = {};

        // Count occurrences of each answer
        answers.forEach((answer) => {
          answerCounts[answer] = (answerCounts[answer] || 0) + 1;
        });

        return (
          <div key={question.id} className="question-responses-section">
            <div className="question-responses-header">
              <h3 className="question-responses-title">{getQuestionLabel(question)}</h3>
              <span className="question-responses-count">{responseCount} response{responseCount !== 1 ? 's' : ''}</span>
            </div>

            <div className="question-responses-content">
              {question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX' ? (
                <div className="answers-summary">
                  {question.options?.map((option) => {
                    const count = answerCounts[option] || 0;
                    const divisor = question.type === 'CHECKBOX' ? responseCount : answers.length;
                    const percentage = divisor > 0 ? ((count / divisor) * 100).toFixed(1) : '0';
                    return (
                      <div key={option} className="answer-option-summary">
                        <div className="answer-option-label">
                          <span className="option-text">{option}</span>
                          <span className="option-count">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="answers-list">
                  {answers.map((answer, index) => (
                    <div key={index} className="answer-item">
                      <div className="answer-text">{answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResponsesTable;
