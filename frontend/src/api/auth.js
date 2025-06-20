import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res;
};

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  return res;
};

export const getProfile = async (token) => {
  const res = await axios.get(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}; 