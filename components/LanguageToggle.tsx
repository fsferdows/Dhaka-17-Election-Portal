
import React from 'react';
import { Language } from '../types';

interface LanguageToggleProps {
  current: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ current, onToggle }) => {
  return (
    <div className="flex bg-gray-200 p-1 rounded-lg">
      <button
        onClick={() => onToggle(Language.BN)}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          current === Language.BN ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        বাংলা
      </button>
      <button
        onClick={() => onToggle(Language.EN)}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          current === Language.EN ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
    </div>
  );
};
