import React from 'react';

function ResultsDisplay({ results, imageUrl }) {
  // Don't display anything if there are no results
  if (!results) {
    return null;
  }

  return (
    <div className="card">
      <h2 className="section-title">Analysis Results</h2>
      
      <div className="results-container">
        {/* Show the image */}
        <div>
          <h3 className="result-label">Your Outfit</h3>
          <img 
            src={imageUrl} 
            alt="Analyzed outfit" 
            className="results-image"
          />
        </div>
        
        {/* Show the analysis results */}
        <div>
            {/* Rating */}
            {results.rating && (
            <div className="result-item">
              <h3 className="result-label">Rating</h3>
              <div className="result-value">{results.rating}/5</div>
            </div>
          )}

          {/* Style */}
          {results.overall_style && (
            <div className="result-item">
              <h3 className="result-label">Style</h3>
              <div className="result-value">{results.overall_style}</div>
            </div>
          )}
          
          {/* Fit */}
          {results.fit && (
            <div className="result-item">
              <h3 className="result-label">Fit</h3>
              <div className="result-value">{results.fit}</div>
            </div>
          )}

          {/* Dominant Colors */}
          {results.dominant_colors && results.dominant_colors.length > 0 && (
            <div className="result-item">
              <h3 className="result-label">Dominant Colors</h3>
              <div className="color-swatches">
                {results.dominant_colors.map((color, index) => (
                  <div 
                    key={index}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Color Analysis */}
          {results.color_analysis && (
            <div className="result-item">
              <h3 className="result-label">Color Analysis</h3>
              <div className="result-value">{results.color_analysis}</div>
            </div>
          )}
          
          {/* Pattern */}
          {results.pattern && (
            <div className="result-item">
              <h3 className="result-label">Pattern</h3>
              <div className="result-value">{results.pattern}</div>
            </div>
          )}
          
          {/* Occasions */}
          {results.occasions && results.occasions.length > 0 && (
            <div className="result-item">
              <h3 className="result-label">Suitable Occasions</h3>
              <ul className="occasions-list">
                {results.occasions.map((occasion, index) => (
                  <li key={index}>{occasion}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Suggestions */}
          {results.suggestions && results.suggestions.length > 0 && (
            <div className="result-item">
              <h3 className="result-label">Style Suggestions</h3>
              <ul className="suggestions-list">
                {results.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;