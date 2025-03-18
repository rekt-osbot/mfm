'use client';

import { useState } from 'react';
import { getPortfolio, savePortfolio } from '../services/portfolioService';

export default function SettingsPage() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    // Reset the portfolio data in localStorage
    const emptyPortfolio = {
      funds: [],
      totalInvestment: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0
    };
    
    savePortfolio(emptyPortfolio);
    setShowConfirmDialog(false);
    setResetSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setResetSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-2">Reset all your portfolio data. This action cannot be undone.</p>
              <button
                onClick={() => setShowConfirmDialog(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Reset Portfolio Data
              </button>
            </div>
            
            {/* Success message */}
            {resetSuccess && (
              <div className="p-4 bg-green-100 text-green-700 rounded-md">
                Portfolio data has been successfully reset.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-600">
            This is a portfolio tracker for Indian mutual funds. Data is provided by mfapi.in.
          </p>
          <p className="text-gray-600 mt-2">
            All your data is stored locally in your browser and is not sent to any external servers.
          </p>
        </div>
      </main>

      {/* Confirmation dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Reset</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all your portfolio data? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 