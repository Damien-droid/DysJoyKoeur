import React, { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Layout from './components/Layout';
import DictationGame from './components/DictationGame';
import PoetryGame from './components/PoetryGame';
import OCRScanner from './components/OCRScanner';
import ParentDashboard from './components/ParentDashboard';
import { AppMode } from './types';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.DICTATION:
        return <DictationGame />;
      case AppMode.POETRY:
        return <PoetryGame />;
      case AppMode.OCR:
        return <OCRScanner />;
      case AppMode.PARENTS:
        return <ParentDashboard />;
      case AppMode.HOME:
      default:
        return (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-center mt-12">
            <h1 className="text-4xl md:text-6xl font-black text-blue-600 mb-4">
              Coucou ! 👋
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium mb-12">
              Qu'est-ce qu'on apprend en s'amusant aujourd'hui ?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setMode(AppMode.DICTATION)}
                className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-b-8 border-yellow-300 hover:-translate-y-2"
              >
                <div className="absolute top-4 right-4 text-4xl">🏰</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">Dictée Magique</h3>
                <p className="text-gray-500">Crée des phrases rigolotes avec tes mots.</p>
              </button>

              <button 
                 onClick={() => setMode(AppMode.POETRY)}
                 className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-b-8 border-pink-300 hover:-translate-y-2"
              >
                <div className="absolute top-4 right-4 text-4xl">🎵</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">Poésie en Musique</h3>
                <p className="text-gray-500">Remets les vers dans l'ordre en écoutant.</p>
              </button>

              <button 
                 onClick={() => setMode(AppMode.OCR)}
                 className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-b-8 border-green-300 hover:-translate-y-2"
              >
                <div className="absolute top-4 right-4 text-4xl">📸</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Super Scanner</h3>
                <p className="text-gray-500">Prends ton cahier en photo pour qu'on te le lise.</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <AccessibilityProvider>
      <Layout currentMode={mode} setMode={setMode}>
        {renderContent()}
      </Layout>
    </AccessibilityProvider>
  );
};

export default App;
