import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings } from '../types';

interface AccessibilityContextType extends UserSettings {
  toggleFont: () => void;
  toggleSpacing: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/**
 * Fournit le contexte d'accessibilité (police dyslexique, espacement) à l'application.
 * Gère la persistance des réglages dans le localStorage.
 */
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('dys_settings');
    return saved ? JSON.parse(saved) : { isDyslexicFont: false, isHighSpacing: false };
  });

  useEffect(() => {
    localStorage.setItem('dys_settings', JSON.stringify(settings));
  }, [settings]);

  // Bascule la police adaptée aux dyslexiques
  const toggleFont = () => setSettings(prev => ({ ...prev, isDyslexicFont: !prev.isDyslexicFont }));

  // Bascule l'espacement augmenté pour une meilleure lisibilité
  const toggleSpacing = () => setSettings(prev => ({ ...prev, isHighSpacing: !prev.isHighSpacing }));

  return (
    <AccessibilityContext.Provider value={{ ...settings, toggleFont, toggleSpacing }}>
      <div className={`min-h-screen transition-all duration-300 ${settings.isDyslexicFont ? 'font-dyslexic' : 'font-standard'} ${settings.isHighSpacing ? 'spacing-high' : ''}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser les paramètres d'accessibilité dans n'importe quel composant.
 */
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
