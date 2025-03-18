'use client';

// Simple in-memory authentication service that uses localStorage for persistence
// This is a PIN-based system for easy access by family members

const USER_KEY = 'mfm8_user';
const USERS_KEY = 'mfm8_users';

interface User {
  id: string;
  name: string;
  pin: string;
  createdAt: Date;
}

// Get all registered users
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  
  const usersData = localStorage.getItem(USERS_KEY);
  if (!usersData) return [];
  
  try {
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Error parsing users data', error);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current logged in user
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data', error);
    return null;
  }
};

// Register a new user
export const registerUser = (name: string, pin: string): User => {
  if (pin.length !== 4 || isNaN(Number(pin))) {
    throw new Error('PIN must be exactly 4 digits');
  }
  
  const users = getUsers();
  
  // Check if user with this name already exists
  const existingUser = users.find(user => user.name.toLowerCase() === name.toLowerCase());
  if (existingUser) {
    // Just log in the existing user if PIN matches
    if (existingUser.pin === pin) {
      return loginUser(name, pin);
    } else {
      throw new Error('A user with this name already exists. Please use a different name or enter the correct PIN.');
    }
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name,
    pin,
    createdAt: new Date()
  };
  
  // Add to users list
  users.push(newUser);
  saveUsers(users);
  
  // Set as current user
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  
  return newUser;
};

// Login with just name and PIN
export const loginUser = (name: string, pin: string): User => {
  const users = getUsers();
  const user = users.find(user => 
    user.name.toLowerCase() === name.toLowerCase() && 
    user.pin === pin
  );
  
  if (!user) {
    throw new Error('Incorrect name or PIN. Please try again.');
  }
  
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

// Logout current user
export const logoutUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
}; 