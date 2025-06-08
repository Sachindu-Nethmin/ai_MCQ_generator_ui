import React from 'react';
import PdfUploader from './components/PdfUploader';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Academic PDF Q&A Service</h1>
      </header>
      <main className="app-main">
        <PdfUploader />
      </main>
    </div>
  );
}

export default App;