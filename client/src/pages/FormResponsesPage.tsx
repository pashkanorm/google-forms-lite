import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFormQuery, useGetResponsesQuery } from '../api/formsApi';
import ResponsesTable from '../components/ResponsesTable';
import './FormResponsesPage.css';

const FormResponsesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Scroll to top when page loads or form ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: form, isLoading: formLoading, error: formError } = useGetFormQuery(id || '');
  const {
    data: responses = [],
    isLoading: responsesLoading,
    error: responsesError,
  } = useGetResponsesQuery(id || '', { skip: !id });

  if (formLoading || responsesLoading) {
    return <div className="loading container">Loading...</div>;
  }

  if (formError || !form) {
    return (
      <div className="container error-message">
        <h2>Form not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Forms
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="responses-header">
        <button onClick={() => navigate('/')} className="back-button" aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#673AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1>{form.title}</h1>
      </div>

      {responsesError && (
        <div className="error-message">
          <p>Error loading responses. Please try again.</p>
        </div>
      )}

      <div className="responses-container">
        <ResponsesTable form={form} responses={responses} />
      </div>
    </div>
  );
};

export default FormResponsesPage;

