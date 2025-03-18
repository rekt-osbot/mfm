'use client';

import { getCurrentUser } from './authService';
import { createClient } from '@vercel/edge-config';

// Initialize Edge Config client if on Vercel
let edgeConfig: any = null;
try {
  // Only initialize if EDGE_CONFIG is available (when deployed to Vercel)
  if (typeof process !== 'undefined' && process.env.EDGE_CONFIG) {
    edgeConfig = createClient(process.env.EDGE_CONFIG);
  }
} catch (error) {
  console.error('Failed to initialize Edge Config:', error);
}

// Get user-specific storage key
const getUserKey = (key: string): string => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not logged in');
  }
  return `cg_${user.id}_${key}`;
};

// Generic get data function with Edge Config support
export const getData = async <T>(key: string, defaultValue: T): Promise<T> => {
  const userKey = getUserKey(key);
  
  // Try Edge Config first if available
  if (edgeConfig) {
    try {
      const data = await edgeConfig.get(userKey);
      if (data !== undefined) return data as T;
    } catch (error) {
      console.error(`Error getting data from Edge Config for key ${key}:`, error);
      // Fall back to localStorage on error
    }
  }
  
  // Fall back to localStorage
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(userKey);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error getting data from localStorage for key ${key}:`, error);
    }
  }
  
  return defaultValue;
};

// Generic save data function with Edge Config support
export const saveData = async <T>(key: string, data: T): Promise<void> => {
  const userKey = getUserKey(key);
  
  // Try to save to Edge Config if available
  if (edgeConfig) {
    try {
      await edgeConfig.set(userKey, data);
    } catch (error) {
      console.error(`Error saving data to Edge Config for key ${key}:`, error);
      // Continue to save to localStorage as fallback
    }
  }
  
  // Also save to localStorage for offline/fallback
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(userKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data to localStorage for key ${key}:`, error);
    }
  }
};

// Clear all data for current user
export const clearUserData = async (): Promise<void> => {
  const user = getCurrentUser();
  if (!user) return;
  
  const prefix = `cg_${user.id}_`;
  
  // Clear data from Edge Config if available
  if (edgeConfig) {
    try {
      const keys = await edgeConfig.get('all-keys');
      if (keys && Array.isArray(keys)) {
        for (const key of keys) {
          if (key.startsWith(prefix)) {
            await edgeConfig.delete(key);
          }
        }
      }
    } catch (error) {
      console.error('Error clearing data from Edge Config:', error);
    }
  }
  
  // Also clear from localStorage
  if (typeof window !== 'undefined') {
    try {
      // Find all keys belonging to the current user
      const userKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
          userKeys.push(key);
        }
      }
      
      // Delete all user data
      userKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
    }
  }
};

// Portfolio specific functions
export const PORTFOLIO_KEY = 'portfolio';
export const MEMBERS_KEY = 'members';

export interface Member {
  id: string;
  name: string;
  funds: MutualFund[];
}

export interface MutualFund {
  id: string;
  name: string;
  value: number;
  units: number;
  purchaseDate: string;
}

export interface Portfolio {
  members: Member[];
  lastUpdated: string;
}

// Get portfolio for current user
export const getPortfolio = async (): Promise<Portfolio> => {
  return await getData<Portfolio>(PORTFOLIO_KEY, {
    members: [],
    lastUpdated: new Date().toISOString()
  });
};

// Save portfolio for current user
export const savePortfolio = async (portfolio: Portfolio): Promise<void> => {
  portfolio.lastUpdated = new Date().toISOString();
  await saveData(PORTFOLIO_KEY, portfolio);
}; 