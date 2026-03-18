// Admin panel configuration
// API_BASE: FastAPI backend URL (change to Render URL after deploy)
const CONFIG = {
  API_BASE: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://dpsm-backend.onrender.com',
  SUPABASE_URL: 'https://ioljnomsbyegaddveyvs.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvbGpub21zYnllZ2FkZHZleXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjIyNzAsImV4cCI6MjA4OTMzODI3MH0.xo-iPmDBOnPgm8IDN5wbSbbivJGhBWK1dOS8rjdi_7U',
};
