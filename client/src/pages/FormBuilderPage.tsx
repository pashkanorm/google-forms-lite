import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFormMutation } from '../api/formsApi';
import { useFormBuilder } from '../hooks/useFormBuilder';
import QuestionEditor from '../components/QuestionEditor';
import './FormBuilderPage.css';

const FormBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [createForm, { isLoading: isSubmitting }] = useCreateFormMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    formData,
    updateFormData,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
  } = useFormBuilder();

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    const minHeight = textarea.id === 'title' ? '48px' : '24px';
    textarea.style.height = minHeight;
    const scrollHeight = textarea.scrollHeight;
    const minHeightNum = parseInt(minHeight);
    if (scrollHeight > minHeightNum) {
      textarea.style.height = scrollHeight + 'px';
    }
  };

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Initialize textarea heights on mount
    if (titleRef.current) {
      titleRef.current.style.height = '48px';
    }
    if (descriptionRef.current) {
      descriptionRef.current.style.height = '24px';
    }
  }, []);

  useEffect(() => {
    // Re-calculate heights when content changes
    if (titleRef.current) resizeTextarea(titleRef.current);
    if (descriptionRef.current) resizeTextarea(descriptionRef.current);
  }, [formData.title, formData.description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent concurrent submissions
    if (isProcessing || isSubmitting) {
      return;
    }
    
    setIsProcessing(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!formData.title.trim()) {
      setSubmitError('Form title is required');
      setIsProcessing(false);
      return;
    }

    if (formData.questions.length === 0) {
      setSubmitError('Please add at least one question');
      setIsProcessing(false);
      return;
    }

    try {
      await createForm({
        title: formData.title,
        description: formData.description,
        questions: formData.questions.map((q) => ({
          text: q.text,
          type: q.type,
          options: q.options?.map((opt, idx) => opt.trim() || `Option ${idx + 1}`) || [],
        })),
      }).unwrap();

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setSubmitError(err?.data?.message || 'Failed to create form');
      setIsProcessing(false);
    }
  };

  const handleTitleBlur = () => {
    if (!formData.title.trim()) {
      updateFormData('title', 'Untitled form');
    }
  };

  return (
    <div className="container">
      <div className="builder-header">
        <button onClick={() => navigate('/')} className="back-button" aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#673AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1>Create New Form</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-builder" id="form-builder">
        {submitSuccess && (
          <div className="success">
            Form created successfully! Redirecting...
          </div>
        )}

        {submitError && (
          <div className="error">
            {submitError}
          </div>
        )}

        <div className="form-info-section">
          <div className="form-group">
            <textarea
              ref={titleRef}
              id="title"
              value={formData.title}
              onChange={(e) => {
                updateFormData('title', e.target.value);
                resizeTextarea(e.target);
              }}
              onBlur={handleTitleBlur}
              placeholder="Form title"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              ref={descriptionRef}
              id="description"
              value={formData.description}
              onChange={(e) => {
                updateFormData('description', e.target.value);
                resizeTextarea(e.target);
              }}
              placeholder="Form description"
            />
          </div>
        </div>

        <div className="questions-section">
          {formData.questions.length > 0 && (
            <>
              {formData.questions.map((question) => (
                <div key={question.id} className="question-section">
                  <QuestionEditor
                    id={question.id}
                    text={question.text}
                    type={question.type}
                    options={question.options}
                    onUpdateText={(text) => updateQuestion(question.id, 'text', text)}
                    onUpdateType={(type) => updateQuestion(question.id, 'type', type)}
                    onAddOption={() => addOption(question.id)}
                    onRemoveOption={(index) => removeOption(question.id, index)}
                    onUpdateOption={(index, value) => updateOption(question.id, index, value)}
                    onDelete={() => removeQuestion(question.id)}
                  />
                </div>
              ))}
            </>
          )}

          <button type="button" onClick={addQuestion} className="btn-secondary">
            + Add Question
          </button>
        </div>
      </form>

      <div className="form-actions">
        <div className="form-actions-left">
          <button type="submit" form="form-builder" className="btn-primary" disabled={isSubmitting || isProcessing}>
            {isSubmitting ? 'Creating...' : 'Create Form'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
            disabled={isSubmitting || isProcessing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;

