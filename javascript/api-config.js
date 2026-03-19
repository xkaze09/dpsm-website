// Public API base URL — no keys needed for public article endpoints
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8000'
  : 'https://dpsm-backend.onrender.com';

// Fire-and-forget warmup ping so Render wakes up before actual fetches run.
// Silently ignored if it fails (offline, CORS pre-flight, etc.).
fetch(API_BASE + '/api/health', { method: 'GET', mode: 'cors' }).catch(() => {});
