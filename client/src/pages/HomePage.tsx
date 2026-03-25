import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetFormsQuery } from '../api/formsApi';
import FormCard from '../components/FormCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { data: forms = [], isLoading, error } = useGetFormsQuery();
  const navigate = useNavigate();

  return (
    <>
      <header className="home-header">
        <div className="back-button-placeholder"></div>
        <h1>Google Forms Lite</h1>
      </header>

      <section className="create-form-container">
        <div className="create-form-section">
          <button 
            onClick={() => navigate('/forms/new')} 
            className="create-form-button"
            aria-label="Create new form"
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <p className="create-form-text">Create New Form</p>
        </div>
      </section>

      <section className="forms-list-container">
        {error && (
          <div className="error-message">
            <p>Error loading forms. Please try again.</p>
          </div>
        )}

        {isLoading && <div className="loading">Loading forms...</div>}

        {!isLoading && forms.length === 0 && (
          <div className="empty-state">
            <p>No forms yet. Create one to get started!</p>
          </div>
        )}

        {!isLoading && forms.length > 0 && (
          <div className="forms-container">
            <h2>Available forms</h2>
            {forms.map((form) => (
              <FormCard
                key={form.id}
                id={form.id}
                title={form.title}
                description={form.description}
                questionCount={form.questions.length}
                responseCount={form.responseCount}
                onViewForm={() => navigate(`/forms/${form.id}/fill`)}
                onViewResponses={() => navigate(`/forms/${form.id}/responses`)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default HomePage;

