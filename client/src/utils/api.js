// just the base URL, no /api
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
