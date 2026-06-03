const DEFAULT_BACKEND_ORIGIN = 'https://shortify-pe39.onrender.com';

export const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || DEFAULT_BACKEND_ORIGIN;
export const API_BASE_URL = import.meta.env.VITE_API_URL || `${BACKEND_ORIGIN}/api`;
