import React from 'react';
import type { Scenario } from '../types';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  isDisabled: boolean;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ scenarios, selectedScenario, onSelectScenario, isDisabled }) => {
  return (
    <div className="mb-6 animate-fade-in">
      <h2 className="text-xl font-bold text-center mb-4 text-slate-300">Choose a Scenario</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            disabled={isDisabled}
            className={`p-4 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              selectedScenario.id === scenario.id
                ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                : 'bg-slate-800 hover:bg-slate-700'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <h3 className="font-bold text-lg">{scenario.name}</h3>
            <p className="text-sm text-slate-300">{scenario.description}</p>
          </button>
        ))}
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ScenarioSelector;
