import type { LanguageOption, Scenario } from './types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Mandarin Chinese' },
];

export const APP_STATUS = {
  IDLE: 'IDLE',
  CONNECTING: 'CONNECTING',
  LISTENING: 'LISTENING',
  THINKING: 'THINKING',
  SPEAKING: 'SPEAKING',
  ERROR: 'ERROR',
} as const;

export const GAMIFICATION = {
  POINTS_PER_TURN: 10,
  MIN_TURNS_FOR_POINTS: 2,
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'general',
    name: 'General Practice',
    description: 'An open-ended conversation to practice your skills.',
    systemInstruction: (language: string) => `You are a friendly and patient language tutor for a student learning ${language}. Converse with them naturally, ask questions, and gently correct their major mistakes. Keep your responses concise and encouraging.`,
  },
  {
    id: 'restaurant',
    name: 'At a Restaurant',
    description: 'Practice ordering food and drinks from a menu.',
    systemInstruction: (language: string) => `You are a waiter in a ${language}-speaking restaurant. The user is a customer. Greet them, take their order for drinks and food, and respond to any questions they might have about the menu. Be polite and helpful. Start the conversation by greeting the user.`,
  },
  {
    id: 'hotel',
    name: 'Booking a Hotel',
    description: 'Role-play booking a hotel room for a few nights.',
    systemInstruction: (language: string) => `You are a hotel receptionist in a ${language}-speaking country. The user wants to book a room. You need to ask them for their check-in/check-out dates, the type of room they want, and confirm the booking. Be professional and clear. Start the conversation by asking how you can help.`,
  },
  {
    id: 'transport',
    name: 'Public Transport',
    description: 'Ask for help navigating the local train or bus system.',
    systemInstruction: (language:string) => `You are a local resident in a ${language}-speaking city. The user is a tourist who is lost and needs help with public transport. They will ask you for directions to a landmark (e.g., a museum or park). Give them simple, step-by-step instructions using the bus or train. Be friendly and patient. Start by asking if they need help.`,
  },
  {
    id: 'shopping',
    name: 'Shopping for Clothes',
    description: 'Interact with a sales associate while shopping.',
    systemInstruction: (language: string) => `You are a helpful sales associate in a clothing store in a ${language}-speaking country. The user is looking for an item of clothing (e.g., a shirt or jacket). Ask them about their size, preferred color, and help them find what they're looking for. You can also suggest another item. Start the conversation by greeting them and asking if they need assistance.`,
  },
    {
    id: 'airport',
    name: 'At the Airport',
    description: 'Practice checking in for a flight.',
    systemInstruction: (language: string) => `You are an airline check-in agent at an airport in a ${language}-speaking country. The user is a passenger checking in for their flight. You must ask for their passport and ticket, ask if they have any bags to check, and inform them of their gate number and boarding time. Be efficient and polite. Start the conversation by greeting the passenger and asking for their passport.`,
  }
];
