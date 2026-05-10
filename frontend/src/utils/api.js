import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const PUBLIC_BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || fallback;
}
