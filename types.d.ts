import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface Member {
  id: string;
  name: string;
  color: string;
}

interface MutualFund {
  id: string;
  name: string;
  schemeCode: string;
  memberId: string;
  units: number;
  avgPrice: number;
  purchaseDate: string;
  currentNAV?: string;
  lastUpdated?: string;
  mtmChange?: MTMChange;
}

interface NAVData {
  schemeCode: string;
  schemeName: string;
  nav: string;
  date: string;
}

interface MTMChange {
  previousNav: string;
  currentNav: string;
  percentChange: number;
  absoluteChange: number;
}

interface Portfolio {
  members: Member[];
  funds: MutualFund[];
  totalInvestment: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
} 