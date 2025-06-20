import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const createPurchase = async (data) => {
  const token = getAuthToken();
  const res = await axios.post(`${API_URL}/purchases/create`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
};

export const getPurchaseHistory = async () => {
  const token = getAuthToken();
  const res = await axios.get(`${API_URL}/purchases/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}; 