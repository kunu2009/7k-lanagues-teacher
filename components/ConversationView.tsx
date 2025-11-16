import React, { useEffect, useRef } from 'react';
import type { ConversationTurn } from '../types';

interface ConversationViewProps {
  conversationHistory: ConversationTurn[];
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationHistory }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  const introText = "Ready to practice? Choose a language, select a scenario above, and press the microphone button to begin!";
  
  return (
    <div className="flex-1 space-y-6 overflow-y-auto pb-24">
      {conversationHistory.length === 0 ? (
          <div className="flex justify-center items-center h-full">
              <p className="text-center text-slate-400 max-w-md text-lg p-8 bg-slate-800/50 rounded-xl">
                  {introText}
              </p>
          </div>
      ) : (
        conversationHistory.map((turn, index) => (
          <div key={index} className={`flex items-start gap-4 ${turn.author === 'user' ? 'justify-end' : 'justify-start'}`}>
            {turn.author === 'model' && (
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center font-bold">AI</div>
            )}
            <div
              className={`max-w-md lg:max-w-lg p-4 rounded-2xl ${
                turn.author === 'user'
                  ? 'bg-indigo-600 rounded-br-none'
                  : 'bg-slate-700 rounded-bl-none'
              } ${!turn.isFinal && turn.author === 'user' ? 'text-slate-400' : 'text-white'}`}
            >
              <p className="whitespace-pre-wrap">{turn.text}</p>
            </div>
            {turn.author === 'user' && (
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center font-bold">You</div>
            )}
          </div>
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ConversationView;
