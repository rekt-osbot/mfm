'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaTimes } from 'react-icons/fa';

interface AddMemberModalProps {
  onClose: () => void;
  onAddMember: (name: string) => void;
}

export default function AddMemberModal({ onClose, onAddMember }: AddMemberModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Close on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    
    // Add member
    onAddMember(name.trim());
    setName('');
  };
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { delay: 0.1 } }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white text-xl font-semibold flex items-center">
              <FaUserPlus className="mr-2" />
              Add Family Member
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <FaTimes />
            </motion.button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="memberName">
                  Member Name
                </label>
                <input
                  id="memberName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter family member's name"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-md hover:from-blue-700 hover:to-teal-700 focus:outline-none flex items-center"
                >
                  <FaUserPlus className="mr-2" />
                  Add Member
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 