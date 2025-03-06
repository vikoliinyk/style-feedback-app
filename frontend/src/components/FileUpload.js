import React, { useState } from 'react';

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle when user selects a file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      setSelectedFile(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Upload Your Outfit</h2>
      
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select an image of your outfit:</label>
          <div className="file-input-wrapper">
            <button className="file-input-button" type="button">
              {selectedFile ? selectedFile.name : 'Choose an image file...'}
            </button>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="file-input"
            />
          </div>
          {selectedFile && (
            <div className="file-info" style={{ marginTop: '8px', fontSize: '0.9em', color: '#666' }}>
              Size: {Math.round(selectedFile.size / 1024)} KB
            </div>
          )}
        </div>
        
        {preview && (
          <div className="preview-container">
            <h3 className="result-label">Preview:</h3>
            <img 
              src={preview} 
              alt="Preview" 
              className="preview-image"
            />
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={!selectedFile}
          className={`btn btn-primary btn-block ${!selectedFile ? 'disabled' : ''}`}
        >
          Analyze Outfit
        </button>
      </form>
    </div>
  );
}

export default FileUpload;