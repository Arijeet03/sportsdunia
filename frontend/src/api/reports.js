import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const getAuthToken = () => {
  return localStorage.getItem('token');
};


export const getEarningsSummary = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/reports/earnings-summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
};


export const getReferralAnalytics = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/reports/referral-analytics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
};

/**
 * Get level-wise earnings breakdown
 */
export const getLevelBreakdown = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/reports/level-breakdown`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
};


export const getEarningSources = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/reports/earning-sources`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
};

/**
 * Get monthly earnings trend
 */
export const getMonthlyTrend = async (months = 12) => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/reports/monthly-trend?months=${months}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}; 