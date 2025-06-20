import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getReferralTree = async (token) => {
  const res = await axios.get(`${API_URL}/users/referrals`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}; 