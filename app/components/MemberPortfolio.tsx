'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaTrash, FaPlus, FaUserMinus, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmDialog from './ConfirmDialog';

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

interface MemberPortfolioProps {
  member: Member;
  onAddFund: () => void;
  onRemoveMember: () => void;
  onRemoveFund: (fundId: string) => void;
}

export default function MemberPortfolio({ member, onAddFund, onRemoveMember, onRemoveFund }: MemberPortfolioProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [fundToRemove, setFundToRemove] = useState<string | null>(null);
  const [isConfirmRemoveMemberOpen, setIsConfirmRemoveMemberOpen] = useState(false);

  // Calculate total portfolio value for this member
  const totalValue = member.funds.reduce((sum, fund) => sum + fund.value, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Update calculateProfitLossPercent to properly calculate based on current NAV
  const calculateProfitLossPercent = (fund: MutualFund) => {
    if (!fund.purchaseNav) return null;
    
    // Current NAV calculation is value/units
    const currentNav = fund.value / fund.units;
    const profitLossPercent = ((currentNav - fund.purchaseNav) / fund.purchaseNav) * 100;
    
    return {
      percent: profitLossPercent.toFixed(2),
      isProfit: profitLossPercent >= 0
    };
  };

  // Add function to calculate invested value
  const calculateInvestedValue = (fund: MutualFund) => {
    if (fund.purchaseNav) {
      return fund.units * fund.purchaseNav;
    }
    return fund.value; // Fallback if no purchase NAV
  };

  // Calculate total invested value for this member
  const totalInvestedValue = member.funds.reduce((sum, fund) => sum + calculateInvestedValue(fund), 0);

  // Handle fund removal with confirmation
  const handleRemoveFund = (fundId: string) => {
    setFundToRemove(fundId);
    setIsConfirmDialogOpen(true);
  };

  // Handle member removal with confirmation
  const handleRemoveMember = () => {
    setIsConfirmRemoveMemberOpen(true);
  };

  // Add a confirmRemoveFund function
  const confirmRemoveFund = () => {
    if (fundToRemove) {
      onRemoveFund(fundToRemove);
      setFundToRemove(null);
    }
    setIsConfirmDialogOpen(false);
  };

  // Add confirmRemoveMember function
  const confirmRemoveMember = () => {
    onRemoveMember();
    setIsConfirmRemoveMemberOpen(false);
  };

  // Get avatar color based on name - update to use purple/indigo shades
  const getAvatarColor = () => {
    const colors = [
      'bg-purple-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-fuchsia-500',
      'bg-purple-600',
      'bg-indigo-600',
      'bg-violet-600',
      'bg-fuchsia-600'
    ];
    
    // Use the member name to deterministically select a color
    const hashCode = member.name.split('').reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);
    
    return colors[Math.abs(hashCode) % colors.length];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold mr-3">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-gray-500 text-sm">
              {member.funds.length} funds · Current: {formatCurrency(totalValue)} 
              {totalInvestedValue !== totalValue && (
                <span className={`ml-2 ${totalValue > totalInvestedValue ? 'text-green-600' : 'text-red-600'}`}>
                  · Invested: {formatCurrency(totalInvestedValue)}
                  · {totalValue > totalInvestedValue ? '+' : ''}
                  {(((totalValue - totalInvestedValue) / totalInvestedValue) * 100).toFixed(2)}%
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={onAddFund}
            className="mr-2 text-white bg-green-600 hover:bg-green-700 p-2 rounded-full"
          >
            <FaPlus />
          </button>
          <button
            onClick={() => setIsConfirmRemoveMemberOpen(true)}
            className="mr-2 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full"
          >
            <FaTrash />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 text-gray-600 rounded-full hover:bg-gray-100 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <FaChevronDown />
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {member.funds.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No funds yet. Click the + button to add funds.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund Name</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                      <th className="hidden sm:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Invested Value</th>
                      <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                      <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P/L %</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {member.funds.map((fund) => (
                      <motion.tr 
                        key={fund.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{fund.name}</div>
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {formatDate(fund.purchaseDate)}
                            {fund.purchaseNav && (
                              <div>
                                <span>Inv: ₹{calculateInvestedValue(fund).toFixed(0)}</span>
                                <span className="ml-2">Inv. NAV: ₹{fund.purchaseNav.toFixed(2)}</span>
                                <span className="ml-2">
                                  {calculateProfitLossPercent(fund)?.isProfit ? '+' : ''}{calculateProfitLossPercent(fund)?.percent}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-gray-500">{fund.units.toFixed(3)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-gray-900">{formatCurrency(fund.value)}</td>
                        <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-right text-gray-500">
                          {formatCurrency(calculateInvestedValue(fund))}
                        </td>
                        <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-center text-gray-500">
                          {formatDate(fund.purchaseDate)}
                          {fund.purchaseNav && (
                            <div className="text-xs mt-1">
                              Inv. NAV: ₹{fund.purchaseNav.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-center">
                          {calculateProfitLossPercent(fund) ? (
                            <span className={`font-medium ${calculateProfitLossPercent(fund)?.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                              {calculateProfitLossPercent(fund)?.isProfit ? '+' : ''}{calculateProfitLossPercent(fund)?.percent}%
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleRemoveFund(fund.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <ConfirmDialog
        isOpen={isConfirmRemoveMemberOpen}
        title="Remove Member"
        message={`Are you sure you want to remove ${member.name} and all associated funds? This action cannot be undone.`}
        confirmText="Remove"
        onConfirm={confirmRemoveMember}
        onCancel={() => setIsConfirmRemoveMemberOpen(false)}
        type="delete"
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Remove Fund"
        message="Are you sure you want to remove this fund? This action cannot be undone."
        confirmText="Remove"
        onConfirm={confirmRemoveFund}
        onCancel={() => setIsConfirmDialogOpen(false)}
        type="delete"
      />
    </motion.div>
  );
} 