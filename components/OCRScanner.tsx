import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, FileText, Play } from 'lucide-react';
import { processAndRecognize } from '../services/ocrService';
import { generateSpeech } from '../services/geminiService';

const OCRScanner: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setExtractedText('');
    try {
      const text = await processAndRecognize(file);
      setExtractedText(text);
    } catch (error) {
      console.error(error);
      alert("Impossible de lire l'image. Assurez-vous qu'elle est claire.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReadAloud = () => {
    if (extractedText) generateSpeech(extractedText, 'Kore');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-green-200">
        <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
          <Camera className="w-8 h-8" />
          Scanner Intelligent
        </h2>

        {!extractedText && !isProcessing && (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-green-300 rounded-2xl hover:bg-green-50 transition-colors cursor-pointer group"
            >
              <Upload className="w-12 h-12 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg text-green-700">Prendre une photo ou choisir un fichier</span>
              <span className="text-sm text-green-600 mt-1">Transforme ton cahier en texte !</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
            <p className="text-lg font-bold text-gray-600 text-center">
              Analyse en cours...<br/>
              <span className="text-sm font-normal text-gray-500">J'augmente le contraste pour mieux lire.</span>
            </p>
          </div>
        )}

        {extractedText && (
          <div className="animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Texte détecté
                </h3>
                <button 
                    onClick={handleReadAloud}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold shadow transition-colors"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Lire
                </button>
            </div>
            
            <textarea 
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="w-full h-64 p-4 rounded-xl border-2 border-gray-300 text-lg leading-relaxed resize-none focus:border-green-400 outline-none"
            />
            
            <button 
                onClick={() => setExtractedText('')}
                className="w-full py-3 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
                Scanner une autre page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRScanner;
