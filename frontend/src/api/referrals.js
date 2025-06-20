import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getReferrals = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/users/referrals`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
};

export const getEarnings = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/earnings/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
};

export const getPurchases = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/purchases/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}; 