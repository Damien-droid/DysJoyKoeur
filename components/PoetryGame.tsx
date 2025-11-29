import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { Music, Mic, GripVertical, Check } from 'lucide-react';
import { PoetryLine } from '../types';

const PoetryGame: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [lines, setLines] = useState<PoetryLine[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startGame = () => {
    if (!inputText.trim()) return;
    
    // Split text into non-empty lines
    const rawLines = inputText.split('\n').filter(l => l.trim().length > 0);
    const gameLines = rawLines.map((text, index) => ({
      id: `line-${index}-${Date.now()}`,
      text: text.trim(),
      originalIndex: index
    }));

    // Shuffle
    const shuffled = [...gameLines].sort(() => Math.random() - 0.5);
    setLines(shuffled);
    setIsGameActive(true);
    setIsComplete(false);
  };

  const handlePlayLine = (text: string) => {
    generateSpeech(text, 'Puck');
  };

  // Simple array swap for drag and drop simulation (simplified for code compactness)
  const moveLine = (fromIndex: number, direction: 'up' | 'down') => {
    if (isComplete) return;
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= lines.length) return;

    const newLines = [...lines];
    const temp = newLines[fromIndex];
    newLines[fromIndex] = newLines[toIndex];
    newLines[toIndex] = temp;
    
    setLines(newLines);
    checkWin(newLines);
  };

  const checkWin = (currentLines: PoetryLine[]) => {
    const isWin = currentLines.every((line, index) => line.originalIndex === index);
    if (isWin) {
      setIsComplete(true);
      generateSpeech("Incroyable ! Tu as reconstitué le poème !", "Puck");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {!isGameActive ? (
        <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-pink-200">
          <h2 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
            <Music className="w-8 h-8" />
            Poésie Musicale
          </h2>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Colle ta poésie ici..."
            className="w-full h-48 p-4 rounded-xl border-2 border-gray-300 focus:border-pink-400 text-lg mb-4 resize-none outline-none"
          />
          <button 
            onClick={startGame}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-black text-xl rounded-xl shadow-lg transition-transform active:scale-95"
          >
            Jouer avec ma poésie !
          </button>
        </div>
      ) : (
        <div className="space-y-4">
           <div className="flex justify-between items-center mb-4">
             <button onClick={() => setIsGameActive(false)} className="text-gray-500 hover:text-gray-700 underline">← Changer de texte</button>
             {isComplete && <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold animate-pulse">Poème reconstitué ! 🎵</span>}
           </div>

           <div className="space-y-3">
             {lines.map((line, index) => {
               const isCorrectPosition = line.originalIndex === index;
               
               return (
                 <div 
                   key={line.id}
                   className={`
                     relative flex items-center gap-3 p-4 rounded-xl border-2 shadow-sm transition-all duration-300
                     ${isComplete 
                        ? 'border-green-400 bg-green-50' 
                        : 'bg-white border-gray-200 hover:border-pink-300'}
                   `}
                 >
                    {/* Controls */}
                    {!isComplete && (
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveLine(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-30">▲</button>
                        <button onClick={() => moveLine(index, 'down')} disabled={index === lines.length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-400 disabled:opacity-30">▼</button>
                      </div>
                    )}

                    <button 
                      onClick={() => handlePlayLine(line.text)}
                      className="p-2 text-pink-500 hover:bg-pink-50 rounded-full"
                    >
                      <Mic className="w-5 h-5" />
                    </button>

                    <p className={`flex-1 font-medium text-lg ${isCorrectPosition && isComplete ? 'text-green-800' : 'text-gray-800'}`}>
                      {line.text}
                    </p>

                    {isComplete && <Check className="w-6 h-6 text-green-500" />}
                 </div>
               );
             })}
           </div>
        </div>
      )}
    </div>
  );
};

export default PoetryGame;
