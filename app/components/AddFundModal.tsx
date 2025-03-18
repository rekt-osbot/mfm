'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSearch, FaTimes, FaMoneyBillWave, FaSpinner } from 'react-icons/fa';
import * as portfolioService from '../services/portfolioService';

interface MutualFund {
  id: string;
  name: string;
  value: number;
  units: number;
  purchaseDate: string;
  purchaseNav?: number;
}

interface Member {
  id: string;
  name: string;
  funds: MutualFund[];
}

interface AddFundModalProps {
  onClose: () => void;
  onAddFund: (fund: MutualFund) => void;
  member: Member | undefined;
}

export default function AddFundModal({ onClose, onAddFund, member }: AddFundModalProps) {
  const [fundName, setFundName] = useState('');
  const [units, setUnits] = useState('');
  const [value, setValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<portfolioService.FundSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFund, setSelectedFund] = useState<portfolioService.FundSearchResult | null>(null);
  
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [purchaseNav, setPurchaseNav] = useState('');
  
  // Search for funds when query changes
  useEffect(() => {
    const searchFunds = async () => {
      if (searchQuery.trim().length < 3) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await portfolioService.searchFunds(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching funds:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timer = setTimeout(() => {
      searchFunds();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
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
    setError('');
    
    // Validate
    if (!fundName.trim()) {
      setError('Please enter a fund name');
      return;
    }
    
    if (!units || isNaN(Number(units)) || Number(units) <= 0) {
      setError('Please enter a valid number of units');
      return;
    }
    
    if (!purchaseDate) {
      setError('Please select a purchase date');
      return;
    }
    
    // Create new fund
    const newFund: MutualFund = {
      id: crypto.randomUUID(),
      name: fundName.trim(),
      units: Number(units),
      value: Number(value),
      purchaseDate,
      purchaseNav: purchaseNav ? Number(purchaseNav) : undefined
    };
    
    // Add to member
    onAddFund(newFund);
  };
  
  const handleSelectFund = (fund: portfolioService.FundSearchResult) => {
    setSelectedFund(fund);
    setFundName(fund.name);
    setSearchQuery('');
    setSearchResults([]);
    
    // Set the current NAV as default purchase NAV
    setPurchaseNav(fund.nav.toString());
    
    // Calculate current value based on current NAV
    if (units) {
      // Round to nearest integer
      const currentValue = Math.round(Number(units) * fund.nav);
      setValue(currentValue.toString());
    }
  };
  
  // Update calculation logic to force integers
  useEffect(() => {
    if (selectedFund && units) {
      // Current value should always be based on current NAV, not purchase NAV
      const currentCalculatedValue = Number(units) * selectedFund.nav;
      if (!isNaN(currentCalculatedValue)) {
        // Round to nearest integer to avoid validation issues
        setValue(Math.round(currentCalculatedValue).toString());
      }
    }
  }, [units, selectedFund]);
  
  // Animation variants for the modal
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
            <h2 className="text-white text-xl font-semibold">
              Add Fund to {member?.name}
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
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fundSearch">
                  Search for Fund
                </label>
                <div className="relative">
                  <input
                    id="fundSearch"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                    placeholder="Search for mutual funds (min 3 chars)"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isSearching ? (
                      <FaSpinner className="animate-spin text-gray-400" />
                    ) : (
                      <FaSearch className="text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((fund) => (
                      <motion.div
                        key={fund.id}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 flex justify-between"
                        onClick={() => handleSelectFund(fund)}
                      >
                        <div>
                          <div className="font-medium text-sm">{fund.name}</div>
                          <div className="text-xs text-gray-500">{fund.category}</div>
                        </div>
                        <div className="text-indigo-600 font-medium">₹{fund.nav.toFixed(2)}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fundName">
                  Fund Name
                </label>
                <input
                  id="fundName"
                  type="text"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter mutual fund name"
                  readOnly={!!selectedFund}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="units">
                  Number of Units
                </label>
                <input
                  id="units"
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 10.525"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchaseNav">
                  Investment NAV Price (₹)
                </label>
                <div className="relative">
                  <input
                    id="purchaseNav"
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={purchaseNav}
                    onChange={(e) => setPurchaseNav(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="NAV price at investment time"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Current NAV: ₹{selectedFund?.nav.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">
                  <FaMoneyBillWave className="inline mr-1" /> Current Investment Value (₹)
                </label>
                <input
                  id="value"
                  type="text"
                  value={value}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none text-gray-700"
                  placeholder="Auto-calculated from units and current NAV"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Auto-calculated based on current NAV and units
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchaseDate">
                  Purchase Date
                </label>
                <input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-md hover:from-blue-700 hover:to-teal-700 focus:outline-none flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Add Fund
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 