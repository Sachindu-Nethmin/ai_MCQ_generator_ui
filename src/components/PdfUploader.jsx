import React, { useState } from 'react';
import axios from 'axios';
import QaResults from './QaResults';
import './PdfUploader.css';

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qaResults, setQaResults] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    } else {
      setFile(null);
      setFileName('');
      setError('Please select a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setQaResults([]);

    // Create form data to send the file
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the file to the backend API
      const response = await axios.post('http://localhost:8000/qa', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the Q&A results from the response
      setQaResults(response.data);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.detail || 'Error processing PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pdf-uploader-container">
      <h2>Academic PDF Q&A Generator</h2>
      <p className="description">
        Upload an academic PDF to generate questions and answers about its content.
      </p>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-container">
          <div className="file-input-wrapper">
            <input 
              type="file" 
              id="pdf-file"
              className="file-input"
              accept="application/pdf" 
              onChange={handleFileChange} 
              disabled={isLoading}
            />
            <label htmlFor="pdf-file" className="file-label">
              {fileName ? fileName : 'Choose PDF file...'}
            </label>
          </div>
          <button 
            type="submit" 
            disabled={!file || isLoading}
            className="upload-button"
          >
            {isLoading ? 'Analyzing...' : 'Generate Q&A'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </form>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing PDF and generating Q&A pairs...</p>
          <p className="loading-note">This may take a minute or two depending on the document size</p>
        </div>
      )}

      {qaResults.length > 0 && <QaResults results={qaResults} />}
    </div>
  );
};

export default PdfUploader;