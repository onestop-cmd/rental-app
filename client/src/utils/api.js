export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};
