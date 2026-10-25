const envUrl = (import.meta as any).env?.VITE_API_URL;

// Live backend URL configuration
// In production on Vercel, always connect directly to the clean production backend (fixpoint-backend.vercel.app).
// When developing on localhost, talk to http://localhost:5001.
export const API_URL = (() => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://${host}:5001`;
    }
  }
  return 'https://fixpoint-backend.vercel.app';
})();
