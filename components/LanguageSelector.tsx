
import React from 'react';
import type { LanguageOption } from '../types';
import { LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  selectedLanguage: LanguageOption;
  onSelectLanguage: (language: LanguageOption) => void;
  isDisabled: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage, isDisabled }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = LANGUAGES.find(lang => lang.code === event.target.value);
    if (selected) {
      onSelectLanguage(selected);
    }
  };

  return (
    <div className="relative">
      <select
        value={selectedLanguage.code}
        onChange={handleChange}
        disabled={isDisabled}
        className="appearance-none bg-slate-800 border border-slate-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
