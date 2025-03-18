/**
 * Service for interacting with the mfapi.in API to fetch mutual fund data
 */

const BASE_URL = 'https://api.mfapi.in/mf';

// Import types
type NAVData = {
  schemeCode: string;
  schemeName: string;
  nav: string;
  date: string;
};

type MTMChange = {
  previousNav: string;
  currentNav: string;
  percentChange: number;
  absoluteChange: number;
};

/**
 * Fetch the latest NAV for a given scheme code
 */
export async function fetchLatestNAV(schemeCode: string): Promise<NAVData> {
  try {
    const response = await fetch(`${BASE_URL}/${schemeCode}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch NAV for scheme ${schemeCode}`);
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      throw new Error(`No NAV data available for scheme ${schemeCode}`);
    }
    
    // The API returns an array of NAVs sorted by date (latest first)
    const latestNAV = data.data[0];
    
    return {
      schemeCode,
      schemeName: data.meta.scheme_name,
      nav: latestNAV.nav,
      date: latestNAV.date
    };
  } catch (error) {
    console.error(`Error fetching NAV for scheme ${schemeCode}:`, error);
    throw error;
  }
}

/**
 * Calculate the MTM (Mark to Market) change by comparing current NAV with the previous trading day
 */
export async function calculateMTMChange(schemeCode: string): Promise<MTMChange> {
  try {
    const response = await fetch(`${BASE_URL}/${schemeCode}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch NAV data for scheme ${schemeCode}`);
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length < 2) {
      throw new Error(`Insufficient NAV data available for scheme ${schemeCode}`);
    }
    
    // Get the current and previous NAVs
    const currentNAV = data.data[0].nav;
    const previousNAV = data.data[1].nav;
    
    // Calculate the changes
    const absoluteChange = parseFloat(currentNAV) - parseFloat(previousNAV);
    const percentChange = (absoluteChange / parseFloat(previousNAV)) * 100;
    
    return {
      currentNav: currentNAV,
      previousNav: previousNAV,
      absoluteChange,
      percentChange
    };
  } catch (error) {
    console.error(`Error calculating MTM change for scheme ${schemeCode}:`, error);
    throw error;
  }
}

/**
 * Search for mutual funds by name
 */
export async function searchMutualFunds(query: string): Promise<{ schemeCode: string, schemeName: string }[]> {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search mutual funds');
    }
    
    const data = await response.json();
    
    return data.map((fund: any) => ({
      schemeCode: fund.schemeCode,
      schemeName: fund.schemeName
    }));
  } catch (error) {
    console.error('Error searching mutual funds:', error);
    throw error;
  }
} 