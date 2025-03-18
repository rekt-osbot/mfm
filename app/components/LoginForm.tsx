'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as authService from '../services/authService';

interface LoginFormProps {
  onSuccess: (user: any) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle PIN input - only allow digits and max 4 characters
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isNewUser) {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        
        if (pin.length !== 4 || isNaN(Number(pin))) {
          throw new Error('PIN must be exactly 4 digits');
        }
        
        const user = authService.registerUser(name, pin);
        onSuccess(user);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        
        if (pin.length !== 4) {
          throw new Error('PIN must be exactly 4 digits');
        }
        
        const user = authService.loginUser(name, pin);
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6">
          <h2 className="text-white text-xl font-bold text-center">
            {isNewUser ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-purple-100 text-center mt-2">
            {isNewUser 
              ? 'Create a family account with a simple 4-digit PIN' 
              : 'Access your portfolio with your name and PIN'}
          </p>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.form 
              key={isNewUser ? 'register' : 'login'}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {error && (
                <motion.div 
                  className="bg-red-50 text-red-700 p-3 rounded-md text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  <FaUser className="inline mr-2" />
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                  placeholder="Your name"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pin">
                  <FaLock className="inline mr-2" />
                  4-Digit PIN
                </label>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={handlePinChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                  placeholder="Enter 4 digits (e.g. 1234)"
                  maxLength={4}
                />
                <p className="mt-1 text-xs text-gray-500">Simple 4-digit PIN for easy family access</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-indigo-800 transition-colors flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <FaSignInAlt className="mr-2" />
                {isLoading ? 'Processing...' : isNewUser ? 'Create Account' : 'Log In'}
              </motion.button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsNewUser(!isNewUser)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  {isNewUser ? 'Already have an account? Log in' : 'Need an account? Create one'}
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
} 