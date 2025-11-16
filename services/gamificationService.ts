import type { GamificationState, LeaderboardEntry } from '../types';

const GAMIFICATION_KEY = 'gemini_language_pal_gamification';
const LEADERBOARD_KEY = 'gemini_language_pal_leaderboard';
const USER_NAME = 'You';

const generateInitialLeaderboard = (): LeaderboardEntry[] => [
    { rank: 1, name: 'LinguaLinda', points: 1250 },
    { rank: 2, name: 'PolyglotPete', points: 1100 },
    { rank: 3, name: 'WordWizard', points: 980 },
    { rank: 4, name: 'ChattyCathy', points: 760 },
    { rank: 5, name: USER_NAME, points: 0 },
];

export const loadGamificationState = (): GamificationState => {
    try {
        const storedState = localStorage.getItem(GAMIFICATION_KEY);
        if (storedState) {
            return JSON.parse(storedState);
        }
    } catch (error) {
        console.error("Failed to load gamification state:", error);
    }
    return { points: 0, streak: 0, lastPracticed: null };
};

export const saveGamificationState = (state: GamificationState) => {
    try {
        localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save gamification state:", error);
    }
};

export const loadLeaderboard = (): LeaderboardEntry[] => {
    try {
        const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
        if (storedLeaderboard) {
            // Ensure the user is on the leaderboard
            const board: LeaderboardEntry[] = JSON.parse(storedLeaderboard);
            if (!board.some(e => e.name === USER_NAME)) {
                const userState = loadGamificationState();
                board.push({ rank: 0, name: USER_NAME, points: userState.points });
                 // Sort by points descending
                board.sort((a, b) => b.points - a.points);
                // Update ranks
                return board.map((entry, index) => ({ ...entry, rank: index + 1 }));
            }
            return board;
        }
    } catch (error) {
        console.error("Failed to load leaderboard:", error);
    }
    const initialLeaderboard = generateInitialLeaderboard();
    saveLeaderboard(initialLeaderboard);
    return initialLeaderboard;
};

const saveLeaderboard = (leaderboard: LeaderboardEntry[]) => {
    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    } catch (error) {
        console.error("Failed to save leaderboard:", error);
    }
}

export const updateLeaderboard = (newPoints: number): LeaderboardEntry[] => {
    const leaderboard = loadLeaderboard();
    const userIndex = leaderboard.findIndex(entry => entry.name === USER_NAME);

    if (userIndex !== -1) {
        leaderboard[userIndex].points = newPoints;
    } else {
        leaderboard.push({ rank: 0, name: USER_NAME, points: newPoints });
    }

    // Sort by points descending
    leaderboard.sort((a, b) => b.points - a.points);
    
    // Update ranks
    const updatedLeaderboard = leaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));
    
    saveLeaderboard(updatedLeaderboard);
    return updatedLeaderboard;
};
