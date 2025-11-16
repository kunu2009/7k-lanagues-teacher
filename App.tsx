import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { AppStatus, ConversationTurn, LanguageOption, GamificationState, LeaderboardEntry, Scenario } from './types';
import { LANGUAGES, APP_STATUS, GAMIFICATION, SCENARIOS } from './constants';
import { startConversation, stopConversation } from './services/geminiService';
import * as gamificationService from './services/gamificationService';

import LanguageSelector from './components/LanguageSelector';
import ConversationView from './components/ConversationView';
import ControlPanel from './components/ControlPanel';
import StatusBar from './components/StatusBar';
import Leaderboard from './components/Leaderboard';
import StarIcon from './components/icons/StarIcon';
import FireIcon from './components/icons/FireIcon';
import TrophyIcon from './components/icons/TrophyIcon';
import ScenarioSelector from './components/ScenarioSelector';


const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(APP_STATUS.IDLE);
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [gamificationState, setGamificationState] = useState<GamificationState>({ points: 0, streak: 0, lastPracticed: null });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);


  const conversationHistoryRef = useRef<ConversationTurn[]>([]);
  conversationHistoryRef.current = conversationHistory;
  
  // Load initial gamification state and leaderboard
  useEffect(() => {
    setGamificationState(gamificationService.loadGamificationState());
    setLeaderboard(gamificationService.loadLeaderboard());
  }, []);

  const addTurn = useCallback((turn: ConversationTurn) => {
    setConversationHistory(prev => [...prev, turn]);
  }, []);

  const updateLastTurn = useCallback((updates: Partial<ConversationTurn>) => {
    setConversationHistory(prev => {
        if (prev.length === 0) return prev;
        const newHistory = [...prev];
        const lastTurn = { ...newHistory[newHistory.length - 1], ...updates };
        newHistory[newHistory.length - 1] = lastTurn;
        return newHistory;
    });
  }, []);


  const handleStart = useCallback(async () => {
    setError(null);
    setConversationHistory([]); // Clear previous conversation
    setStatus(APP_STATUS.CONNECTING);
    try {
      await startConversation({
        systemInstruction: selectedScenario.systemInstruction(selectedLanguage.name),
        onStatusChange: setStatus,
        onTranscript: (isFinal, text, isUser) => {
          const lastTurn = conversationHistoryRef.current[conversationHistoryRef.current.length - 1];
          if (isUser) {
              if (lastTurn?.author === 'user' && !lastTurn.isFinal) {
                  updateLastTurn({ text, isFinal });
              } else {
                  addTurn({ author: 'user', text, isFinal });
              }
          } else {
              if (lastTurn?.author === 'model' && !lastTurn.isFinal) {
                  updateLastTurn({ text, isFinal });
              } else {
                  addTurn({ author: 'model', text, isFinal });
              }
          }
        },
        onError: (e) => {
          setError(e.message || 'An unknown error occurred.');
          setStatus(APP_STATUS.ERROR);
        }
      });
    } catch (e: any) {
        setError(e.message || 'Failed to start conversation.');
        setStatus(APP_STATUS.ERROR);
    }
  }, [selectedLanguage, selectedScenario, addTurn, updateLastTurn]);

  const handleStop = useCallback(() => {
    stopConversation();
    setStatus(APP_STATUS.IDLE);
    
    // Gamification logic
    if (conversationHistoryRef.current.length >= GAMIFICATION.MIN_TURNS_FOR_POINTS) {
        const pointsEarned = conversationHistoryRef.current.length * GAMIFICATION.POINTS_PER_TURN;
        
        setGamificationState(prevState => {
            const today = new Date().toISOString().split('T')[0];
            let newStreak = prevState.streak;

            if (prevState.lastPracticed) {
                const lastDate = new Date(prevState.lastPracticed);
                const todayDate = new Date(today);
                
                const yesterday = new Date(todayDate);
                yesterday.setDate(todayDate.getDate() - 1);

                if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
                    newStreak++;
                } else if (prevState.lastPracticed !== today) {
                    newStreak = 1;
                }
            } else {
                newStreak = 1;
            }

            const newTotalPoints = prevState.points + pointsEarned;
            
            const newState: GamificationState = {
                points: newTotalPoints,
                streak: newStreak,
                lastPracticed: today,
            };

            gamificationService.saveGamificationState(newState);
            const newLeaderboard = gamificationService.updateLeaderboard(newTotalPoints);
            setLeaderboard(newLeaderboard);

            return newState;
        });
    }

  }, []);

  const toggleConversation = () => {
    if (status === APP_STATUS.IDLE || status === APP_STATUS.ERROR) {
      handleStart();
    } else {
      handleStop();
    }
  };
  
  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, []);

  const isConversationActive = status !== APP_STATUS.IDLE && status !== APP_STATUS.ERROR;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <header className="w-full p-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-cyan-400">Gemini Language Pal</h1>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-yellow-400" title="Total Points">
            <StarIcon className="w-6 h-6" />
            <span className="font-bold text-lg">{gamificationState.points}</span>
          </div>
          <div className="flex items-center gap-2 text-orange-500" title="Daily Streak">
            <FireIcon className="w-6 h-6" />
            <span className="font-bold text-lg">{gamificationState.streak}</span>
          </div>
          <LanguageSelector 
            selectedLanguage={selectedLanguage} 
            onSelectLanguage={setSelectedLanguage}
            isDisabled={isConversationActive}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto flex flex-col flex-1">
          {!isConversationActive ? (
            <ScenarioSelector 
              scenarios={SCENARIOS}
              selectedScenario={selectedScenario}
              onSelectScenario={setSelectedScenario}
              isDisabled={isConversationActive}
            />
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-center animate-fade-in">
              <h2 className="text-lg font-bold text-cyan-400">{selectedScenario.name}</h2>
              <p className="text-sm text-slate-300">{selectedScenario.description}</p>
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
          )}

          <div className="mb-4 text-center">
            <button 
              onClick={() => setShowLeaderboard(prev => !prev)}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
            >
              <TrophyIcon className="w-5 h-5 text-yellow-400" />
              <span>{showLeaderboard ? 'Hide' : 'Show'} Leaderboard</span>
            </button>
          </div>
          {showLeaderboard && <Leaderboard data={leaderboard} />}
          <ConversationView conversationHistory={conversationHistory} />
        </div>
      </main>

      <footer className="w-full p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <StatusBar status={status} error={error} />
          <ControlPanel 
            status={status}
            onToggleConversation={toggleConversation}
          />
        </div>
      </footer>
    </div>
  );
};

export default App;
