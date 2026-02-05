import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { Music, Mic, GripVertical, Check } from 'lucide-react';
import { PoetryLine } from '../types';

/**
 * Composant de jeu "Poésie en Musique".
 * Permet à l'enfant de remettre dans l'ordre les vers d'un poème en musique.
 *
 * @neuroscience
 * Le rythme agit comme une "béquille cognitive" pour la mémoire verbale.
 * Les comptines et le rythme (Rap, Slam, Pop) exploitent la mémoire implicite et séquentielle,
 * ce qui est particulièrement efficace pour les enfants dyslexiques.
 * L'apprentissage devient multisensoriel (visuel + auditif + rythmique).
 */
const PoetryGame: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [lines, setLines] = useState<PoetryLine[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [musicStyle, setMusicStyle] = useState<'pop' | 'rap' | 'slam' | 'comptine'>('pop');

  // Initialise le jeu en découpant le texte en lignes et en les mélangeant
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

  // Joue l'audio pour une ligne spécifique
  const handlePlayLine = (text: string) => {
    // On passe le style musical pour influencer l'intonation (simulé via le prompt TTS dans le service)
    generateSpeech(text, 'Puck', musicStyle);
  };

  // Déplace une ligne vers le haut ou le bas (simulation simple de drag & drop)
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

  // Vérifie si toutes les lignes sont dans l'ordre correct
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
            Poésie en Musique
          </h2>

          <div className="mb-4">
             <label className="block text-gray-700 font-bold mb-2">Choisis ton style musical :</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['pop', 'rap', 'slam', 'comptine'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setMusicStyle(style as any)}
                    className={`py-2 px-3 rounded-lg font-bold capitalize transition-all ${musicStyle === style ? 'bg-pink-50 text-white shadow-md' : 'bg-pink-50 text-pink-400 hover:bg-pink-100'}`}
                  >
                    {style}
                  </button>
                ))}
             </div>
          </div>

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
            Transformer en chanson ! 🎵
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
