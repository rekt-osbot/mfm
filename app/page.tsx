'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaUsers, FaSignOutAlt, FaChartLine, FaUser, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AddMemberModal from './components/AddMemberModal';
import AddFundModal from './components/AddFundModal';
import MemberPortfolio from './components/MemberPortfolio';
import PortfolioSimulator from './components/PortfolioSimulator';
import LoginForm from './components/LoginForm';
import GitHubLink from './components/GitHubLink';
import * as portfolioService from './services/portfolioService';
import * as authService from './services/authService';
import * as dataService from './services/dataService';

interface Member {
  id: string;
  name: string;
  funds: MutualFund[];
}

interface MutualFund {
  id: string;
  name: string;
  value: number;
  units: number;
  purchaseDate: string;
}

interface Portfolio {
  members: Member[];
  lastUpdated: string;
}

export default function Home() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Portfolio state
  const [portfolio, setPortfolio] = useState<Portfolio>({
    members: [],
    lastUpdated: new Date().toISOString()
  });
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(false);

  // Modal state
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddFundModalOpen, setIsAddFundModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  
  // Load user and portfolio data on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      loadPortfolio();
    }
    
    setLoading(false);
  }, []);
  
  // Load portfolio data
  const loadPortfolio = async () => {
    setIsPortfolioLoading(true);
    try {
      const portfolioData = await dataService.getPortfolio();
      setPortfolio(portfolioData);
    } catch (error) {
      console.error("Failed to load portfolio:", error);
    } finally {
      setIsPortfolioLoading(false);
    }
  };
  
  // Handle login/register success
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    loadPortfolio();
  };
  
  // Handle logout
  const handleLogout = () => {
    authService.logoutUser();
    setCurrentUser(null);
    setPortfolio({
      members: [],
      lastUpdated: new Date().toISOString()
    });
  };
  
  // Add a member to the portfolio
  const addMember = async (name: string) => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      name,
      funds: []
    };
    
    const updatedMembers = [...portfolio.members, newMember];
    const updatedPortfolio = {
      ...portfolio,
      members: updatedMembers
    };
    
    setPortfolio(updatedPortfolio);
    await dataService.savePortfolio(updatedPortfolio);
    setIsAddMemberModalOpen(false);
    return newMember;
  };
  
  // Add a fund to a member
  const addFundToMember = async (memberId: string, fund: MutualFund) => {
    const updatedMembers = portfolio.members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          funds: [...member.funds, fund]
        };
      }
      return member;
    });
    
    const updatedPortfolio = {
      ...portfolio,
      members: updatedMembers
    };
    
    setPortfolio(updatedPortfolio);
    await dataService.savePortfolio(updatedPortfolio);
    setIsAddFundModalOpen(false);
    setSelectedMemberId(null);
  };
  
  // Remove a member from the portfolio
  const removeMember = async (memberId: string) => {
    const updatedMembers = portfolio.members.filter(member => member.id !== memberId);
    
    const updatedPortfolio = {
      ...portfolio,
      members: updatedMembers
    };
    
    setPortfolio(updatedPortfolio);
    await dataService.savePortfolio(updatedPortfolio);
  };
  
  // Remove a fund from a member
  const removeFund = async (memberId: string, fundId: string) => {
    const updatedMembers = portfolio.members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          funds: member.funds.filter(fund => fund.id !== fundId)
        };
      }
      return member;
    });
    
    const updatedPortfolio = {
      ...portfolio,
      members: updatedMembers
    };
    
    setPortfolio(updatedPortfolio);
    await dataService.savePortfolio(updatedPortfolio);
  };
  
  // Calculate portfolio metrics
  const calculatePortfolioMetrics = () => {
    let totalCurrentValue = 0;
    let totalInvestedValue = 0;
    let totalFunds = 0;

    portfolio.members.forEach(member => {
      member.funds.forEach(fund => {
        totalCurrentValue += fund.value;
        totalFunds++;
        
        // Calculate invested value if purchase NAV is available
        if ('purchaseNav' in fund && fund.purchaseNav) {
          totalInvestedValue += fund.units * (fund.purchaseNav as number);
        } else {
          totalInvestedValue += fund.value;
        }
      });
    });

    const profitLoss = totalCurrentValue - totalInvestedValue;
    const profitLossPercentage = totalInvestedValue > 0 
      ? (profitLoss / totalInvestedValue) * 100 
      : 0;

    return {
      totalCurrentValue,
      totalInvestedValue,
      profitLoss,
      profitLossPercentage,
      totalFunds
    };
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <GitHubLink />
      </div>
    );
  }

  // Show login form if user not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <motion.div
              className="flex items-center justify-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-700 inline-flex items-center"
                initial={{ y: 0 }}
                animate={{ y: 0 }}
              >
                MFM
                <motion.span
                  initial={{ y: 0, rotateY: 0 }}
                  animate={{ 
                    y: [0, 15, 0],
                    rotateY: [0, 0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="inline-block ml-1"
                >
                  8
                </motion.span>
              </motion.h1>
            </motion.div>
            <p className="text-gray-600 mt-2">Your Family's Mutual Fund Manager</p>
          </div>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
        <GitHubLink />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-700">MFM</h1>
            <p className="text-gray-600 mt-1">
              Last updated: {new Date(portfolio.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
              <FaUser className="text-blue-600 mr-2" />
              <span className="font-medium">{currentUser.name}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-full transition-colors shadow-sm"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </motion.button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white"
          >
            <h2 className="text-xl font-semibold mb-2">Total Portfolio Value</h2>
            <div className="text-3xl font-bold">
              {formatCurrency(calculatePortfolioMetrics().totalCurrentValue)}
            </div>
            {calculatePortfolioMetrics().totalCurrentValue !== calculatePortfolioMetrics().totalInvestedValue && (
              <div className={`text-sm mt-2 ${calculatePortfolioMetrics().profitLoss >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {calculatePortfolioMetrics().profitLoss >= 0 ? 'Profit: ' : 'Loss: '}
                {formatCurrency(Math.abs(calculatePortfolioMetrics().profitLoss))}
                {' '}
                ({calculatePortfolioMetrics().profitLoss >= 0 ? '+' : ''}
                {calculatePortfolioMetrics().profitLossPercentage.toFixed(2)}%)
              </div>
            )}
            <div className="text-xs mt-2 text-indigo-100">
              Invested: {formatCurrency(calculatePortfolioMetrics().totalInvestedValue)}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white"
          >
            <h2 className="text-xl font-semibold mb-2">Family Members</h2>
            <p className="text-3xl font-bold">{portfolio.members.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white"
          >
            <h2 className="text-xl font-semibold mb-2">Total Funds</h2>
            <p className="text-3xl font-bold">
              {calculatePortfolioMetrics().totalFunds}
            </p>
          </motion.div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <FaUsers className="mr-2 text-indigo-600" />
            Family Members
          </h2>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddMemberModalOpen(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors shadow-sm"
            >
              <FaPlus className="mr-2" />
              Add Member
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSimulator(true)}
              className="flex items-center bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors shadow-sm"
            >
              <FaChartLine className="mr-2" />
              Show Simulator
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {showSimulator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <PortfolioSimulator 
                currentValue={calculatePortfolioMetrics().totalCurrentValue} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 gap-6">
          {isPortfolioLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : portfolio.members.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg p-8 text-center border border-gray-200"
            >
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Family Members Yet</h3>
              <p className="text-gray-500 mb-4">Add your first family member to start tracking their mutual fund portfolio</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddMemberModalOpen(true)}
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-violet-700 text-white py-2 px-4 rounded-md hover:from-indigo-700 hover:to-violet-800 transition-colors shadow-sm"
              >
                <FaPlus className="mr-2" />
                Add First Member
              </motion.button>
            </motion.div>
          ) : (
            portfolio.members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MemberPortfolio 
                  member={member} 
                  onAddFund={() => {
                    setSelectedMemberId(member.id);
                    setIsAddFundModalOpen(true);
                  }}
                  onRemoveMember={() => removeMember(member.id)}
                  onRemoveFund={(fundId) => removeFund(member.id, fundId)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isAddMemberModalOpen && (
          <AddMemberModal 
            onClose={() => setIsAddMemberModalOpen(false)}
            onAddMember={addMember}
          />
        )}
        
        {isAddFundModalOpen && selectedMemberId && (
          <AddFundModal 
            onClose={() => {
              setIsAddFundModalOpen(false);
              setSelectedMemberId(null);
            }}
            onAddFund={(fund) => addFundToMember(selectedMemberId, fund)}
            member={portfolio.members.find(m => m.id === selectedMemberId)}
          />
        )}
      </AnimatePresence>
      
      <GitHubLink />
    </main>
  );
}