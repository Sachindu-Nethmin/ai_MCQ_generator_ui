import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './QaResults.css';

const QaResults = ({ results }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    
    // Set PDF document properties
    doc.setProperties({
      title: 'Academic Q&A Results',
      subject: 'Questions and Answers generated from PDF',
      creator: 'PDF Q&A Service'
    });
    
    // Add title
    doc.setFontSize(22);
    doc.setTextColor(66, 133, 244); // Google blue
    doc.text('Academic Q&A Results', 14, 20);
    
    // Add generation info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Q&A Pairs: ${results.length}`, 14, 35);
    
    // Start position for content
    let yPos = 45;
    
    // Add each Q&A pair with formatting
    results.forEach((qa, index) => {
      // Check if we need to add a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Add question
      doc.setFontSize(12);
      doc.setTextColor(66, 133, 244); // Blue for questions
      doc.setFont(undefined, 'bold');
      
      // Handle text wrapping for questions
      const splitQuestion = doc.splitTextToSize(`Q${index + 1}: ${qa.question}`, 180);
      doc.text(splitQuestion, 14, yPos);
      
      // Move down based on question length
      yPos += splitQuestion.length * 7;
      
      // Add answer
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60); // Dark gray for answers
      doc.setFont(undefined, 'normal');
      
      // Handle text wrapping for the answer
      const splitAnswer = doc.splitTextToSize(qa.answer, 180);
      doc.text(splitAnswer, 14, yPos);
      
      // Update y position for next Q&A pair (plus some spacing)
      yPos += splitAnswer.length * 5 + 15;
    });
    
    // Save the PDF
    doc.save('academic_qa_results.pdf');
  };

  // Add JSON export function
  const exportToJson = () => {
    // Create a blob with the JSON data
    const jsonData = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a temporary download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'academic_qa_results.json';
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="qa-results">
      <div className="qa-header">
        <div>
          <h3>Generated Questions & Answers</h3>
          <p className="result-count">{results.length} items generated</p>
        </div>
        <div className="export-actions">
          <button className="export-button pdf-button" onClick={exportToPdf}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export as PDF
          </button>
          <button className="export-button json-button" onClick={exportToJson}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export as JSON
          </button>
        </div>
      </div>
      
      <div className="qa-list">
        {results.map((qa, index) => (
          <div 
            key={index} 
            className={`qa-item ${expandedIndex === index ? 'expanded' : ''}`}
            onClick={() => toggleExpand(index)}
          >
            <div className="question">
              <div className="question-number">Q{index + 1}</div>
              <div className="question-text">{qa.question}</div>
              <div className="expand-icon">{expandedIndex === index ? '−' : '+'}</div>
            </div>
            
            {expandedIndex === index && (
  <div className="answer">
    {qa.options ? (
      <div className="multiple-choice">
        {Object.entries(qa.options).map(([key, value]) => (
          <div 
            key={key} 
            className={`option ${qa.answer === key ? 'correct' : ''}`}
          >
            <span className="option-key">{key}.</span>
            <span className="option-value">{value}</span>
            {qa.answer === key && (
              <span className="correct-marker">✓</span>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p>{qa.answer}</p>
    )}
  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
};

export default QaResults;