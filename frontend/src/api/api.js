import axios from 'axios';

const API_BASE_URL = '/api';

// Add user ID to requests
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      config.headers['User-ID'] = user.id;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = async (userData) => {
  return axios.post(`${API_BASE_URL}/auth/signup`, userData);
};

export const login = async (userData) => {
  return axios.post(`${API_BASE_URL}/auth/login`, userData);
};

export const saveAvailability = async (data) => {
  return axios.post(`${API_BASE_URL}/availability/save`, data);
};

export const generateLink = async () => {
  return axios.post(`${API_BASE_URL}/availability/generate-link`);
};

export const getAvailabilityByLink = async (link) => {
  return axios.get(`${API_BASE_URL}/booking/${link}`);
};

export const bookSlot = async (bookingData) => {
  return axios.post(`${API_BASE_URL}/booking/book`, bookingData);
};
