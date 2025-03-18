'use client';

import * as dataService from './dataService';

// Types
export interface MutualFund {
  id: string;
  name: string;
  value: number;
  units: number;
  purchaseDate: string;
}

export interface Member {
  id: string;
  name: string;
  funds: MutualFund[];
}

export interface Portfolio {
  members: Member[];
  lastUpdated: string;
}

// Mock API for mutual fund search 
export interface FundSearchResult {
  id: string;
  name: string;
  nav: number;
  category: string;
}

// Get the full portfolio
export const getPortfolio = async (): Promise<Portfolio> => {
  return await dataService.getPortfolio();
};

// Add a new member
export const addMember = async (name: string): Promise<Member> => {
  const portfolio = await getPortfolio();
  
  const newMember: Member = {
    id: crypto.randomUUID(),
    name,
    funds: []
  };
  
  portfolio.members.push(newMember);
  await dataService.savePortfolio(portfolio);
  
  return newMember;
};

// Remove a member
export const removeMember = async (id: string): Promise<void> => {
  const portfolio = await getPortfolio();
  portfolio.members = portfolio.members.filter(member => member.id !== id);
  await dataService.savePortfolio(portfolio);
};

// Add a fund to a member
export const addFund = async (memberId: string, fund: MutualFund): Promise<void> => {
  const portfolio = await getPortfolio();
  
  const memberIndex = portfolio.members.findIndex(m => m.id === memberId);
  if (memberIndex === -1) return;
  
  portfolio.members[memberIndex].funds.push(fund);
  await dataService.savePortfolio(portfolio);
};

// Remove a fund from a member
export const removeFund = async (memberId: string, fundId: string): Promise<void> => {
  const portfolio = await getPortfolio();
  
  const memberIndex = portfolio.members.findIndex(m => m.id === memberId);
  if (memberIndex === -1) return;
  
  portfolio.members[memberIndex].funds = portfolio.members[memberIndex].funds.filter(f => f.id !== fundId);
  await dataService.savePortfolio(portfolio);
};

// Calculate the total value of the portfolio
export const calculateTotalValue = async (): Promise<number> => {
  const portfolio = await getPortfolio();
  
  return portfolio.members.reduce((total, member) => {
    const memberTotal = member.funds.reduce((sum, fund) => sum + fund.value, 0);
    return total + memberTotal;
  }, 0);
};

// Calculate a member's total portfolio value
export const calculateMemberValue = async (memberId: string): Promise<number> => {
  const portfolio = await getPortfolio();
  
  const member = portfolio.members.find(m => m.id === memberId);
  if (!member) return 0;
  
  return member.funds.reduce((total, fund) => total + fund.value, 0);
};

// Mock fund search API
export const searchFunds = async (query: string): Promise<FundSearchResult[]> => {
  // If the query is too short, return mock data
  if (!query || query.trim().length < 3) {
    return [];
  }
  
  try {
    // Try fetching from real MFAPI first
    const response = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`);
    
    if (response.ok) {
      const data = await response.json();
      
      // Transform the data to match our FundSearchResult interface
      if (Array.isArray(data) && data.length > 0) {
        const results: FundSearchResult[] = [];
        
        // Process up to 10 funds from the API response
        const fundsToProcess = data.slice(0, 15);
        
        // Fetch NAV data for each fund
        await Promise.all(fundsToProcess.map(async (fund) => {
          try {
            // Extract scheme code from URL
            const schemeCode = fund.schemeCode;
            const navResponse = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
            
            if (navResponse.ok) {
              const navData = await navResponse.json();
              if (navData && navData.data && navData.data.length > 0) {
                const latestNav = parseFloat(navData.data[0].nav);
                
                // For simplicity, determine category based on the fund name
                let category = 'Other';
                const name = fund.schemeName.toLowerCase();
                
                if (name.includes('equity') || name.includes('growth') || name.includes('large cap') || 
                    name.includes('mid cap') || name.includes('small cap') || name.includes('flexi cap')) {
                  category = 'Equity';
                } else if (name.includes('debt') || name.includes('liquid') || name.includes('overnight') || 
                           name.includes('ultra short') || name.includes('credit risk')) {
                  category = 'Debt';
                } else if (name.includes('hybrid') || name.includes('balanced')) {
                  category = 'Hybrid';
                } else if (name.includes('tax') || name.includes('elss')) {
                  category = 'ELSS';
                }
                
                results.push({
                  id: schemeCode.toString(),
                  name: fund.schemeName,
                  nav: latestNav,
                  category
                });
              }
            }
          } catch (error) {
            console.error(`Error fetching NAV for fund ${fund.schemeName}:`, error);
          }
        }));
        
        return results;
      }
    }
  } catch (error) {
    console.error('Error fetching from MFAPI:', error);
  }
  
  // Fallback to mock data if the API call fails
  console.log('Falling back to mock data for search:', query);
  
  // Mock funds database - updated with more funds
  const mockFunds: FundSearchResult[] = [
    { id: 'fund1', name: 'HDFC Top 100 Direct Plan Growth', nav: 1245.67, category: 'Equity' },
    { id: 'fund2', name: 'SBI Blue Chip Fund Direct Growth', nav: 65.89, category: 'Equity' },
    { id: 'fund3', name: 'Axis Mid Cap Fund Direct Growth', nav: 89.12, category: 'Equity' },
    { id: 'fund4', name: 'ICICI Prudential Value Discovery Fund Direct Plan', nav: 245.67, category: 'Equity' },
    { id: 'fund5', name: 'Mirae Asset Large Cap Fund Direct Plan', nav: 95.67, category: 'Equity' },
    { id: 'fund6', name: 'Kotak Standard Multicap Fund Direct Plan', nav: 52.36, category: 'Equity' },
    { id: 'fund7', name: 'Aditya Birla Sun Life Tax Relief 96 Direct Growth', nav: 45.25, category: 'ELSS' },
    { id: 'fund8', name: 'HDFC Mid-Cap Opportunities Fund Direct Plan', nav: 105.45, category: 'Equity' },
    { id: 'fund9', name: 'DSP Small Cap Fund Direct Plan Growth', nav: 95.36, category: 'Equity' },
    { id: 'fund10', name: 'ICICI Prudential Liquid Fund Direct Plan', nav: 315, category: 'Debt' },
    { id: 'fund11', name: 'HDFC Liquid Fund Direct Plan', nav: 4198.28, category: 'Debt' },
    { id: 'fund12', name: 'Axis Liquid Fund Direct Growth', nav: 2356.78, category: 'Debt' },
    { id: 'fund13', name: 'ICICI Prudential Balanced Advantage Fund Direct Plan', nav: 52.46, category: 'Hybrid' },
    { id: 'fund14', name: 'Kotak Emerging Equity Scheme Direct Plan', nav: 70.25, category: 'Equity' },
    { id: 'fund15', name: 'SBI Magnum Multicap Fund Direct Growth', nav: 68.93, category: 'Equity' },
    { id: 'fund16', name: 'Franklin India Prima Fund Direct Growth', nav: 1567.45, category: 'Equity' },
    { id: 'fund17', name: 'Nippon India Small Cap Fund Direct Growth', nav: 115.67, category: 'Equity' },
    { id: 'fund18', name: 'UTI Mid Cap Fund Direct Growth', nav: 187.25, category: 'Equity' },
    { id: 'fund19', name: 'Mirae Asset Hybrid Equity Fund Direct Plan Growth', nav: 28.35, category: 'Hybrid' },
    { id: 'fund20', name: 'Axis Long Term Equity Fund Direct Growth', nav: 75.46, category: 'ELSS' },
    { id: 'fund21', name: 'Parag Parikh Long Term Equity Fund Direct Growth', nav: 58.93, category: 'Equity' },
    { id: 'fund22', name: 'Kotak Tax Saver Fund Direct Growth', nav: 89.72, category: 'ELSS' },
    { id: 'fund23', name: 'HDFC Corporate Bond Fund Direct Growth', nav: 27.56, category: 'Debt' },
    { id: 'fund24', name: 'ICICI Prudential Technology Fund Direct Plan', nav: 156.78, category: 'Equity' },
    { id: 'fund25', name: 'Mirae Asset Emerging Bluechip Fund Direct Plan', nav: 114.32, category: 'Equity' }
  ];
  
  // Filter funds by name containing the query (case insensitive)
  const lowerQuery = query.toLowerCase();
  return mockFunds.filter(fund => 
    fund.name.toLowerCase().includes(lowerQuery) || 
    fund.category.toLowerCase().includes(lowerQuery)
  );
}; 