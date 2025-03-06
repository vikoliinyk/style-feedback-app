import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ResultsDisplay from '../components/ResultsDisplay';
import api from '../services/api';

function HomePage() {
  const [results, setResults] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      // Save image URL for display
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Call the actual API
      try {
        const analysisResults = await api.analyzeOutfit(file);
        setResults(analysisResults);
        console.log('API response:', analysisResults); // For debugging
      } catch (apiError) {
        console.error('API error:', apiError);
        setError('Error connecting to the analysis service. Please try again.');
      }
    } catch (err) {
      console.error('Error analyzing outfit:', err);
      setError('Failed to analyze outfit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setImageUrl(null);
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">Outfit Analyzer</h1>
        <p className="app-description">
          Upload an image of your outfit and get AI-powered fashion analysis
        </p>
      </header>
      
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your outfit...</p>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>This might take a moment</p>
        </div>
      )}
      
      {!results && !loading && (
        <FileUpload onFileUpload={handleFileUpload} />
      )}
      
      {results && (
        <div>
          <ResultsDisplay results={results} imageUrl={imageUrl} />
          
          <div className="action-buttons">
            <button
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Analyze Another Outfit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;