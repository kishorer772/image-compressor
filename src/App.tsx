import React from 'react';
import logo from './logo.svg';
import './App.css';
import FileInput from './FileInput';
import ImageCompressor from './ImageCompressor';

function App() {
  return (
    <main style={{ height: '100vh' }}>
      <header>
        <h1 style={{ textAlign: 'center' }}>Image Compressor</h1>
      </header>
      <ImageCompressor></ImageCompressor>
    </main>
  );
}

export default App;
