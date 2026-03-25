import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFormQuery, useSubmitResponseMutation } from '../api/formsApi';
import { useFormFiller } from '../hooks/useFormFiller';
import QuestionInput from '../components/QuestionInput';
import './FormFillerPage.css';

const FormFillerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Scroll to top when page loads or form ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: form, isLoading, error } = useGetFormQuery(id || '');
  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();

  const {
    answers,
    updateAnswer,
    addCheckboxAnswer,
    isCheckboxSelected,
    resetAnswers,
    getAnswersArray,
  } = useFormFiller();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent concurrent submissions
    if (isProcessing || isSubmitting) {
      return;
    }
    
    setIsProcessing(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!form) {
      setIsProcessing(false);
      return;
    }

    // Validate all required questions are answered
    const unansweredQuestions = form.questions.filter((q) => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      setSubmitError('Please answer all questions before submitting');
      setIsProcessing(false);
      return;
    }

    try {
      await submitResponse({
        formId: form.id,
        answers: getAnswersArray(),
      }).unwrap();

      setSubmitSuccess(true);
      resetAnswers();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setSubmitError(err?.data?.message || 'Failed to submit form');
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    resetAnswers();
    setSubmitError(null);
  };

  if (isLoading) return <div className="loading container">Loading form...</div>;
  if (error || !form)
    return (
      <div className="container error-message">
        <h2>Form not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Forms
        </button>
      </div>
    );

  return (
    <div className="container">
      <div className="filler-header">
        <button onClick={() => navigate('/')} className="back-button" aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#673AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1>{form.title}</h1>
      </div>

      {form.description && <div className="filler-info"><p className="form-description">{form.description}</p></div>}

      <form onSubmit={handleSubmit} className="form-filler" id="form-filler">
        {submitSuccess && (
          <div className="success">
            <strong>✓ Form submitted successfully!</strong> Redirecting...
          </div>
        )}

        {form.questions.map((question) => (
          <div key={question.id} className="question-section">
            <QuestionInput
              questionId={question.id}
              text={question.text}
              type={question.type}
              options={question.options}
              value={answers[question.id] || ''}
              onChange={(value) => updateAnswer(question.id, value)}
              onCheckboxChange={(option) => addCheckboxAnswer(question.id, option)}
              isCheckboxSelected={(option) => isCheckboxSelected(question.id, option)}
              isUnanswered={submitError ? !answers[question.id] : undefined}
            />
          </div>
        ))}
      </form>

      {submitError && (
        <div className="error">
          {submitError}
        </div>
      )}

      <div className="form-actions">
        <div className="form-actions-left">
          <button type="submit" form="form-filler" className="btn-primary" disabled={isSubmitting || isProcessing}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn-secondary" disabled={isSubmitting || isProcessing}>
            Cancel
          </button>
        </div>
        <button type="button" onClick={handleClear} className="btn-clear" disabled={isSubmitting || isProcessing}>
          Clear Form
        </button>
      </div>
    </div>
  );
};

export default FormFillerPage;

