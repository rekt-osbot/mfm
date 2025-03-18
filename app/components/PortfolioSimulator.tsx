'use client';

import { useState } from 'react';
import { FaCalculator, FaChartLine, FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface PortfolioSimulatorProps {
  currentValue: number;
}

interface SimulationResult {
  year: number;
  startValue: number;
  growthAmount: number;
  endValue: number;
}

export default function PortfolioSimulator({ currentValue }: PortfolioSimulatorProps) {
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(5);
  const [frequency, setFrequency] = useState<'yearly' | 'monthly'>('yearly');
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  const runSimulation = () => {
    const simulationResults: SimulationResult[] = [];
    let portfolioValue = currentValue;
    
    if (frequency === 'yearly') {
      // Calculate for yearly compounding
      for (let year = 1; year <= years; year++) {
        const yearlyStartValue = portfolioValue;
        
        // Calculate growth
        const growthAmount = portfolioValue * (expectedReturn / 100);
        portfolioValue += growthAmount;
        
        simulationResults.push({
          year,
          startValue: yearlyStartValue,
          growthAmount,
          endValue: portfolioValue
        });
      }
    } else {
      // Calculate for monthly compounding
      for (let year = 1; year <= years; year++) {
        const yearlyStartValue = portfolioValue;
        let yearlyGrowthAmount = 0;
        const monthlyReturnRate = Math.pow(1 + expectedReturn / 100, 1/12) - 1;
        
        // Calculate monthly compounding
        for (let month = 1; month <= 12; month++) {
          // Calculate growth
          const monthlyGrowth = portfolioValue * monthlyReturnRate;
          yearlyGrowthAmount += monthlyGrowth;
          portfolioValue += monthlyGrowth;
        }
        
        simulationResults.push({
          year,
          startValue: yearlyStartValue,
          growthAmount: yearlyGrowthAmount,
          endValue: portfolioValue
        });
      }
    }
    
    setResults(simulationResults);
    setIsSimulated(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaCalculator className="mr-2 text-indigo-600" />
        Portfolio Growth Simulator
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expectedReturn">
            Expected Annual Return (%)
          </label>
          <input
            id="expectedReturn"
            type="number"
            min="0"
            max="30"
            step="0.5"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="years">
            <FaCalendarAlt className="inline mr-2" />
            Simulation Years
          </label>
          <input
            id="years"
            type="number"
            min="1"
            max="30"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="frequency">
            <FaExchangeAlt className="inline mr-2" />
            Compounding Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'yearly' | 'monthly')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={runSimulation}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-violet-800 transition-colors shadow-sm flex items-center justify-center"
          >
            <FaChartLine className="mr-2" />
            Simulate Growth
          </motion.button>
        </div>
      </div>
      
      {isSimulated && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-3">Simulation Results</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Value</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <motion.tr 
                    key={result.year}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{result.year}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(result.startValue)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">{formatCurrency(result.growthAmount)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-indigo-600">{formatCurrency(result.endValue)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg">
            <p className="text-gray-700">
              Starting with <span className="font-semibold">{formatCurrency(currentValue)}</span> and 
              {frequency === 'monthly' 
                ? ' compounding monthly'
                : ' compounding yearly'
              }, 
              at <span className="font-semibold">{expectedReturn}%</span> annual returns, your portfolio would grow to:
            </p>
            <p className="text-2xl font-bold text-indigo-700 mt-2">{formatCurrency(results[results.length - 1]?.endValue || 0)}</p>
            <p className="text-sm text-gray-500 mt-1">That's a {((results[results.length - 1]?.endValue / currentValue) - 1) * 100 > 0 ? 'growth' : 'decline'} of 
              <span className="font-semibold text-indigo-600"> {(((results[results.length - 1]?.endValue / currentValue) - 1) * 100).toFixed(1)}%</span> over {years} years
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
} 