export const API_URL =
  (import.meta as any).env?.VITE_API_URL ||
  (typeof window !== 'undefined' ? `http://${window.location.hostname}:5001` : 'http://localhost:5001');
