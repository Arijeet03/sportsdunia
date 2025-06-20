import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getEarningsSummary = async (token) => {
  const res = await axios.get(`${API_URL}/earnings/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getEarningsHistory = async (token) => {
  const res = await axios.get(`${API_URL}/earnings/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 