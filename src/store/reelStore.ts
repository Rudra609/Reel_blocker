import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReelSession {
  date: string;
  reelsWatched: number;
  breaksTaken: number;
  totalBreakTime: number;
}

interface BreakOption {
  label: string;
  minutes: number;
}

interface ReelStore {
  // State
  reelCount: number;
  isOnBreak: boolean;
  breakEndTime: number | null;
  breakMinutes: number;
  maxReels: number;
  breakOptions: BreakOption[];
  sessions: ReelSession[];
  todaySession: ReelSession | null;

  // Actions
  incrementReel: () => void;
  resetReelCount: () => void;
  startBreak: (minutes: number) => void;
  endBreak: () => void;
  setMaxReels: (count: number) => void;
  addSession: (session: ReelSession) => void;
  getTodaySession: () => ReelSession | null;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

export const useReelStore = create<ReelStore>((set, get) => ({
  reelCount: 0,
  isOnBreak: false,
  breakEndTime: null,
  breakMinutes: 0,
  maxReels: 20,
  breakOptions: [
    { label: '5 minutes', minutes: 5 },
    { label: '10 minutes', minutes: 10 },
    { label: '20 minutes', minutes: 20 },
  ],
  sessions: [],
  todaySession: null,

  incrementReel: () => {
    set((state) => {
      const newCount = state.reelCount + 1;
      if (newCount >= state.maxReels && !state.isOnBreak) {
        return { reelCount: newCount };
      }
      return { reelCount: newCount };
    });
  },

  resetReelCount: () => {
    set({ reelCount: 0 });
  },

  startBreak: (minutes: number) => {
    const endTime = Date.now() + minutes * 60 * 1000;
    set({
      isOnBreak: true,
      breakEndTime: endTime,
      breakMinutes: minutes,
    });
    get().saveData();
  },

  endBreak: () => {
    set({
      isOnBreak: false,
      breakEndTime: null,
      breakMinutes: 0,
      reelCount: 0,
    });
    get().saveData();
  },

  setMaxReels: (count: number) => {
    set({ maxReels: count });
    get().saveData();
  },

  addSession: (session: ReelSession) => {
    set((state) => ({
      sessions: [...state.sessions, session],
      todaySession: session,
    }));
    get().saveData();
  },

  getTodaySession: () => {
    const today = new Date().toISOString().split('T')[0];
    const { sessions } = get();
    return sessions.find((s) => s.date === today) || null;
  },

  loadData: async () => {
    try {
      const data = await AsyncStorage.getItem('reelBlockerData');
      if (data) {
        const parsed = JSON.parse(data);
        set({
          maxReels: parsed.maxReels || 20,
          sessions: parsed.sessions || [],
          todaySession: parsed.todaySession || null,
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  },

  saveData: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        'reelBlockerData',
        JSON.stringify({
          maxReels: state.maxReels,
          sessions: state.sessions,
          todaySession: state.todaySession,
        })
      );
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },
}));
