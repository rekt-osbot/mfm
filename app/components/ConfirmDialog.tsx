'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'delete' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  // Handle escape key press
  useEffect(() => {
    setMounted(true);
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!mounted) return null;

  // Different color schemes based on dialog type
  const getTypeStyles = () => {
    switch (type) {
      case 'delete':
        return {
          icon: 'text-red-500',
          button: 'bg-red-600 hover:bg-red-700',
          header: 'border-red-200'
        };
      case 'warning':
        return {
          icon: 'text-amber-500',
          button: 'bg-amber-600 hover:bg-amber-700',
          header: 'border-amber-200'
        };
      case 'info':
        return {
          icon: 'text-indigo-500',
          button: 'bg-indigo-600 hover:bg-indigo-700',
          header: 'border-indigo-200'
        };
      default:
        return {
          icon: 'text-indigo-500',
          button: 'bg-indigo-600 hover:bg-indigo-700',
          header: 'border-indigo-200'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onCancel}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className={`px-6 py-4 border-b ${typeStyles.header}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaExclamationTriangle className={`mr-3 ${typeStyles.icon}`} />
                  <h3 className="text-lg font-medium text-gray-900">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-700">{message}</p>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                {cancelText}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className={`px-4 py-2 ${typeStyles.button} text-white rounded-md transition-colors`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 