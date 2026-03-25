import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import HomePage from './pages/HomePage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormFillerPage from './pages/FormFillerPage';
import FormResponsesPage from './pages/FormResponsesPage';
import './App.css';

function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forms/new" element={<FormBuilderPage />} />
          <Route path="/forms/:id/fill" element={<FormFillerPage />} />
          <Route path="/forms/:id/responses" element={<FormResponsesPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
