import { useState, useEffect } from 'react';
import { addDays, format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
};

export type Mood = 'GREAT' | 'GOOD' | 'OKAY' | 'BAD' | 'TERRIBLE';

export type MoodEntry = {
  id: string;
  date: string; // ISO string
  mood: Mood;
  note: string;
  tags: string[];
};

export type WeeklyStats = {
  averageMood: number; // 1-5 scale
  totalEntries: number;
  streak: number;
  dominantMood: Mood;
  stabilityScore: number; // 0-100
};

// Mock Data
// Mock Data - Empty by default
const MOOD_VALUES: Record<Mood, number> = {
  'GREAT': 5,
  'GOOD': 4,
  'OKAY': 3,
  'BAD': 2,
  'TERRIBLE': 1
};

// Generate some history
const generateHistory = (): MoodEntry[] => {
  return [];
};

let MOCK_ENTRIES = generateHistory();

// User storage to handle multiple "accounts" in mockup mode
const MOCK_USERS: Record<string, User> = {};

const USER_DATA: Record<string, MoodEntry[]> = {};

// Simulation Helpers
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  icon: 'Coffee' | 'Moon' | 'Sun' | 'Zap' | 'Book' | 'Music';
  color: 'blue' | 'green' | 'purple' | 'orange';
};

// API Methods
export const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(800);
      const user = MOCK_USERS[email];
      if (!user) throw new Error("User not found");
      localStorage.setItem('mindmate_current_user', JSON.stringify(user));
      return user;
    },
    signup: async (name: string, email: string): Promise<User> => {
      await delay(1000);
      const newUser: User = {
        id: `u-${Date.now()}`,
        name,
        email,
        role: 'USER',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      };
      MOCK_USERS[email] = newUser;
      USER_DATA[newUser.id] = [];
      return newUser;
    },
    me: async (): Promise<User> => {
      await delay(400);
      const stored = localStorage.getItem('mindmate_current_user');
      if (!stored) throw new Error("Not authenticated");
      return JSON.parse(stored);
    }
  },
  
  moods: {
    getToday: async (): Promise<MoodEntry | null> => {
      await delay(300);
      const user = JSON.parse(localStorage.getItem('mindmate_current_user') || '{}');
      const data = USER_DATA[user.id] || [];
      const today = new Date().toISOString().split('T')[0];
      return data.find(e => e.date.startsWith(today)) || null;
    },
    
    getHistory: async (): Promise<MoodEntry[]> => {
      await delay(600);
      const user = JSON.parse(localStorage.getItem('mindmate_current_user') || '{}');
      const data = USER_DATA[user.id] || [];
      return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    
    checkIn: async (mood: Mood, note: string, tags: string[]): Promise<MoodEntry> => {
      await delay(800);
      const user = JSON.parse(localStorage.getItem('mindmate_current_user') || '{}');
      const newEntry: MoodEntry = {
        id: `m-${Date.now()}`,
        date: new Date().toISOString(),
        mood,
        note,
        tags
      };
      if (!USER_DATA[user.id]) USER_DATA[user.id] = [];
      USER_DATA[user.id] = [newEntry, ...USER_DATA[user.id]];
      return newEntry;
    }
  },
  
  analytics: {
    getWeeklyStats: async (): Promise<WeeklyStats> => {
      await delay(500);
      const user = JSON.parse(localStorage.getItem('mindmate_current_user') || '{}');
      const data = USER_DATA[user.id] || [];
      
      // Calculate real stats from user-specific mock data
      const last7Days = data.slice(0, 7);
      const sum = last7Days.reduce((acc, curr) => acc + MOOD_VALUES[curr.mood], 0);
      const avg = last7Days.length > 0 ? sum / last7Days.length : 0;
      
      // Calculate a real streak based on consecutive days of entries
      let streak = 0;
      if (data.length > 0) {
        const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        let current = new Date();
        current.setHours(0, 0, 0, 0);
        
        for (const entry of sorted) {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          
          const diffDays = Math.floor((current.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0 || diffDays === 1) {
            streak++;
            current = entryDate;
          } else if (diffDays > 1) {
            break;
          }
        }
      }
      
      return {
        averageMood: avg || 3.0,
        totalEntries: data.length,
        streak: streak,
        dominantMood: data.length > 0 ? data[0].mood : 'OKAY',
        stabilityScore: data.length > 0 ? 85 : 0
      };
    },
    getRecommendations: async (): Promise<Recommendation[]> => {
      await delay(400);
      const user = JSON.parse(localStorage.getItem('mindmate_current_user') || '{}');
      const data = USER_DATA[user.id] || [];
      
      if (data.length === 0) {
        return [{
          id: 'rec-1',
          title: 'Start Your Journey',
          description: 'Log your first mood to receive personalized wellness recommendations.',
          icon: 'Sun',
          color: 'blue'
        }];
      }

      const recentMoods = data.slice(0, 5).map(e => e.mood);
      const moodCounts = recentMoods.reduce((acc, mood) => {
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0] as Mood;
      const recs: Recommendation[] = [];

      if (dominantMood === 'TERRIBLE' || dominantMood === 'BAD') {
        recs.push({
          id: 'rec-low-1',
          title: 'Mindful Breathing',
          description: 'Your recent trend shows some heavy days. Take 5 minutes for deep breathing.',
          icon: 'Coffee',
          color: 'blue'
        });
        recs.push({
          id: 'rec-low-2',
          title: 'Digital Detox',
          description: 'A break from screens might help lift the fog. Try a 15-minute walk.',
          icon: 'Zap',
          color: 'orange'
        });
      } else if (dominantMood === 'OKAY') {
        recs.push({
          id: 'rec-mid-1',
          title: 'Gratitude Journaling',
          description: 'You have been feeling okay. Try writing down three things you are grateful for.',
          icon: 'Book',
          color: 'green'
        });
        recs.push({
          id: 'rec-mid-2',
          title: 'Mood-Boosting Music',
          description: 'A little rhythm can shift your energy. Listen to your favorite upbeat track.',
          icon: 'Music',
          color: 'purple'
        });
      } else {
        recs.push({
          id: 'rec-high-1',
          title: 'Share the Light',
          description: 'You are trending great! Consider reaching out to a friend to spread the positivity.',
          icon: 'Sun',
          color: 'orange'
        });
        recs.push({
          id: 'rec-high-2',
          title: 'Reflection Session',
          description: 'Capture what is working well today while your energy is high.',
          icon: 'Book',
          color: 'purple'
        });
      }

      return recs;
    }
  }
};
