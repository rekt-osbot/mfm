'use client';

import { useState } from 'react';
import { FaGithub, FaCode, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function GitHubLink() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setShowInfo(true)}
        className="fixed right-4 bottom-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="About this project"
      >
        <FaGithub size={24} />
      </motion.button>

      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex justify-between items-center">
                <h2 className="text-white text-xl font-semibold flex items-center">
                  <FaCode className="mr-2" />
                  About This Project
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInfo(false)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <FaTimes />
                </motion.button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Family Portfolio Tracker</h3>
                  <p className="text-gray-600">
                    A simple web application to help families track their mutual fund investments together.
                    Built with Next.js, TypeScript, and TailwindCSS.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Features:</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Track multiple family members' funds in one place</li>
                    <li>Passwordless login (email only) for easy family access</li>
                    <li>Portfolio growth simulator with monthly/yearly options</li>
                    <li>Persistent data with user-specific storage</li>
                    <li>Responsive design for desktop and mobile</li>
                  </ul>
                </div>
                
                <div>
                  <motion.a
                    href="https://github.com/user/mutual-fund-tracker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FaGithub className="mr-2" />
                    View Source on GitHub
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 