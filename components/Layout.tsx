import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { AppMode } from '../types';
import { 
  BookOpen, 
  Music, 
  Camera, 
  Users, 
  Type, 
  Maximize,
  Home
} from 'lucide-react';

interface LayoutProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentMode, setMode, children }) => {
  const { isDyslexicFont, isHighSpacing, toggleFont, toggleSpacing } = useAccessibility();

  const navItems = [
    { mode: AppMode.DICTATION, label: 'Dictée', icon: <BookOpen className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
    { mode: AppMode.POETRY, label: 'Poésie', icon: <Music className="w-6 h-6" />, color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
    { mode: AppMode.OCR, label: 'Scanner', icon: <Camera className="w-6 h-6" />, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    { mode: AppMode.PARENTS, label: 'Parents', icon: <Users className="w-6 h-6" />, color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <nav className="md:w-64 bg-white shadow-xl z-20 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 cursor-pointer" onClick={() => setMode(AppMode.HOME)}>
           <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">D</div>
           <h1 className="text-xl font-black text-gray-800 tracking-tight">DysLexi'Fun</h1>
        </div>

        <div className="p-4 space-y-2 flex-1">
          <button 
             onClick={() => setMode(AppMode.HOME)}
             className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${currentMode === AppMode.HOME ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
             <Home className="w-6 h-6" />
             Accueil
          </button>
          
          <div className="pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider px-3">Activités</div>
          
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${currentMode === item.mode ? 'bg-white shadow-md ring-2 ring-blue-500 z-10' : item.color}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Accessibility Floating/Sticky Panel in Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-blue-50">
           <p className="text-xs font-bold text-blue-400 uppercase mb-3">Confort de lecture</p>
           <div className="flex gap-2">
             <button 
                onClick={toggleFont} 
                className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${isDyslexicFont ? 'bg-white border-blue-500 text-blue-600' : 'border-transparent hover:bg-white/50 text-gray-500'}`}
                title="Police Dyslexie"
             >
                <Type className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Police</span>
             </button>
             <button 
                onClick={toggleSpacing}
                className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${isHighSpacing ? 'bg-white border-blue-500 text-blue-600' : 'border-transparent hover:bg-white/50 text-gray-500'}`}
                title="Espacement augmenté"
             >
                <Maximize className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Espace</span>
             </button>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
