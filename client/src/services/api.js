import axios from 'axios';

// Normalize base URL to ensure /api suffix if not provided,
// and guarantee production builds target the live Render backend service
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // 1. If an environment variable is explicitly provided (e.g. VITE_API_URL in Render build)
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    let cleanUrl = envUrl.trim();
    // Automatically redirect stale/deprecated Render backend instances to the live service
    if (cleanUrl.includes('nutrivita-ndjf.onrender.com') || cleanUrl.includes('nutrivita-server.onrender.com')) {
      cleanUrl = cleanUrl
        .replace('nutrivita-ndjf.onrender.com', 'nutrivita-backend.onrender.com')
        .replace('nutrivita-server.onrender.com', 'nutrivita-backend.onrender.com');
    }
    const trimmed = cleanUrl.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // 2. In production builds or when running in a remote browser environment (*.onrender.com)
  if (
    import.meta.env.PROD ||
    (typeof window !== 'undefined' && window.location?.hostname && (
      window.location.hostname.includes('onrender.com') ||
      (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
    ))
  ) {
    return 'https://nutrivita-backend.onrender.com/api';
  }

  // 3. Fallback to local development proxy /api
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT auth token and safely handle FormData
api.interceptors.request.use(
  (config) => {
    // If sending FormData, delete Content-Type so Axios/browser sets boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const token = localStorage.getItem('nutrivita_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401s gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('nutrivita_token');
        localStorage.removeItem('nutrivita_user');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Safe fetch wrapper that prevents "Failed to execute 'json' on 'Response'" errors.
 * Inspects HTTP status and Content-Type before parsing JSON, and produces helpful messages.
 */
export async function safeFetchJson(url, options = {}) {
  const fullUrl = url.startsWith('http')
    ? url
    : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

  const res = await fetch(fullUrl, options);
  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const rawText = await res.text().catch(() => '');
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}: ${rawText.slice(0, 180) || res.statusText}`);
    }
    throw new Error(`Expected JSON response from server, but received ${contentType || 'non-JSON content'}.`);
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export default api;

