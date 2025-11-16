import React from 'react';
import type { LeaderboardEntry } from '../types';
import TrophyIcon from './icons/TrophyIcon';

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 mb-6 animate-fade-in">
      <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
        <TrophyIcon className="w-6 h-6 text-yellow-400" />
        <span>Global Leaderboard</span>
      </h2>
      <ul className="space-y-3">
        {data.slice(0, 5).map((entry) => (
          <li
            key={entry.rank}
            className={`flex items-center justify-between p-3 rounded-lg ${
              entry.name === 'You'
                ? 'bg-cyan-500/20 border border-cyan-400'
                : 'bg-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg w-6 text-center">{entry.rank}</span>
              <span className="font-semibold">{entry.name}</span>
            </div>
            <span className="font-bold text-yellow-400">{entry.points} pts</span>
          </li>
        ))}
      </ul>
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

export default Leaderboard;
