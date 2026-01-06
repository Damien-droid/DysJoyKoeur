import React, { useState } from 'react';
import { generateSentence, generateSpeech } from '../services/geminiService';
import { Play, Sparkles, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Composant de jeu "Dictée Magique".
 * Permet à l'enfant d'entrer des mots, de générer une phrase (drôle ou sérieuse) contenant ces mots,
 * de l'écouter, puis d'essayer de l'écrire sous la dictée.
 */
const DictationGame: React.FC = () => {
  const [words, setWords] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [mode, setMode] = useState<'serious' | 'fun'>('fun');
  const [loading, setLoading] = useState(false);
  const [userAttempt, setUserAttempt] = useState('');
  const [feedback, setFeedback] = useState<'success' | 'fail' | null>(null);

  // Gère la génération de la phrase via l'IA
  const handleGenerate = async () => {
    if (!words.trim()) return;
    setLoading(true);
    setFeedback(null);
    setGeneratedText('');
    setUserAttempt('');
    
    try {
      const sentence = await generateSentence(words, mode);
      setGeneratedText(sentence);
      // Lecture automatique (TTS) dès la génération pour un renforcement immédiat
      await generateSpeech(sentence, mode === 'fun' ? 'Puck' : 'Kore');
    } catch (e) {
      alert("Erreur lors de la création de la phrase.");
    } finally {
      setLoading(false);
    }
  };

  // Relance la lecture audio de la phrase générée
  const handleReplay = () => {
    if (generatedText) generateSpeech(generatedText, mode === 'fun' ? 'Puck' : 'Kore');
  };

  // Vérifie si la phrase écrite par l'enfant correspond à la phrase générée
  const handleValidate = () => {
    if (!generatedText) return;
    
    // Normalisation simple pour la comparaison (ignorer la ponctuation/casse pour être indulgent)
    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?;:]/g, '').trim();
    const isCorrect = normalize(userAttempt) === normalize(generatedText);
    
    setFeedback(isCorrect ? 'success' : 'fail');
    if (isCorrect) {
        generateSpeech("Bravo ! Tu as réussi !", "Kore");
    } else {
        generateSpeech("Essaie encore, tu peux le faire.", "Kore");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-yellow-200">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
          <Sparkles className="w-8 h-8" />
          Dictée Magique
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Mots à apprendre (séparés par une virgule)</label>
            <input 
              type="text" 
              value={words}
              onChange={(e) => setWords(e.target.value)}
              placeholder="ex: château, dragon, fromage"
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-yellow-400 text-lg outline-none transition-colors"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setMode('serious')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${mode === 'serious' ? 'bg-blue-500 text-white shadow-lg scale-105' : 'bg-blue-100 text-blue-600'}`}
            >
              Mode Sérieux 🎓
            </button>
            <button 
              onClick={() => setMode('fun')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${mode === 'fun' ? 'bg-purple-500 text-white shadow-lg scale-105' : 'bg-purple-100 text-purple-600'}`}
            >
              Mode Rigolo 🤪
            </button>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !words}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-white font-black text-xl rounded-xl shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'La magie opère...' : 'Créer ma phrase !'}
          </button>
        </div>
      </div>

      {generatedText && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-blue-200 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-600">À toi de jouer !</h3>
            <button 
              onClick={handleReplay}
              className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 transition-colors"
              title="Réécouter"
            >
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>

          <textarea 
            value={userAttempt}
            onChange={(e) => setUserAttempt(e.target.value)}
            placeholder="Écris la phrase que tu entends..."
            className="w-full h-32 p-4 rounded-xl border-2 border-gray-300 focus:border-blue-400 text-xl resize-none mb-4 outline-none"
          />

          <div className="flex items-center justify-between">
            <button 
              onClick={handleValidate}
              className="py-3 px-8 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95"
            >
              Vérifier
            </button>
            
            {feedback === 'success' && (
              <div className="flex items-center gap-2 text-green-600 font-bold text-xl animate-bounce">
                <CheckCircle className="w-8 h-8" />
                Bravo ! ⭐⭐⭐
              </div>
            )}
            
            {feedback === 'fail' && (
              <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
                <AlertCircle className="w-6 h-6" />
                Essaie encore !
              </div>
            )}
          </div>

          {/* Solution toggle for parents/checking */}
          <details className="mt-6 text-gray-500 cursor-pointer select-none">
            <summary>Voir la correction</summary>
            <p className="mt-2 p-3 bg-gray-100 rounded-lg text-lg font-medium text-gray-800">
                {generatedText}
            </p>
          </details>
        </div>
      )}
    </div>
  );
};

export default DictationGame;
