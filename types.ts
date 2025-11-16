import { APP_STATUS } from './constants';

export interface LanguageOption {
  code: string;
  name: string;
}

export type AppStatus = typeof APP_STATUS[keyof typeof APP_STATUS];

export interface ConversationTurn {
  author: 'user' | 'model';
  text: string;
  isFinal: boolean;
}

export interface GamificationState {
  points: number;
  streak: number;
  lastPracticed: string | null; // ISO date string YYYY-MM-DD
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  systemInstruction: (language: string) => string;
}
