// Shared admin utilities: auth, API calls, session management

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// ── Auth ─────────────────────────────────────────────────────────────────────

function _parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch { return {}; }
}

export function getRoleFromSession(session) {
  if (!session) return null;
  // Custom claims are in the JWT payload, not on session.user
  const payload = _parseJwt(session.access_token);
  return payload.user_role
    ?? session.user.app_metadata?.user_role
    ?? session.user.user_metadata?.user_role
    ?? null;
}

export async function requireAuth(requiredRole = null) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/admin/login.html';
    return null;
  }
  if (requiredRole) {
    const role = getRoleFromSession(session);
    if (role !== requiredRole && role !== 'admin') {
      showToast('Access denied — insufficient permissions.', 'danger');
      setTimeout(() => window.location.href = '/admin/index.html', 1500);
      return null;
    }
  }
  return session;
}

export async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/admin/login.html';
}

// ── API calls ────────────────────────────────────────────────────────────────

export async function api(method, path, body = null) {
  const token = await getToken();
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${CONFIG.API_BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.detail || res.statusText), { status: res.status, data });
  return data;
}

export async function apiForm(method, path, formData) {
  const token = await getToken();
  const res = await fetch(`${CONFIG.API_BASE}${path}`, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.detail || res.statusText), { status: res.status, data });
  return data;
}

// ── UI helpers ────────────────────────────────────────────────────────────────

export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = 9999;
    document.body.appendChild(container);
  }
  const id = `toast-${Date.now()}`;
  const icons = { success: 'check-circle', danger: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' };
  container.insertAdjacentHTML('beforeend', `
    <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive">
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas fa-${icons[type] || 'info-circle'} me-2"></i>${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`);
  const el = document.getElementById(id);
  const toast = new bootstrap.Toast(el, { delay: 3500 });
  toast.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

export function setLoading(btn, loading, text = null) {
  if (loading) {
    btn.disabled = true;
    btn._origHTML = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${text || 'Loading...'}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn._origHTML || text || btn.innerHTML;
  }
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function statusBadge(status) {
  const map = { draft: 'secondary', published: 'success', archived: 'warning' };
  return `<span class="badge bg-${map[status] || 'secondary'}">${status}</span>`;
}

// ── Navbar injection ──────────────────────────────────────────────────────────

export async function renderAdminNav(activePage = '') {
  const { data: { session } } = await supabase.auth.getSession();
  const role = getRoleFromSession(session) ?? 'editor';
  const displayName = session?.user?.user_metadata?.display_name ?? session?.user?.email ?? '';

  const nav = document.getElementById('admin-nav');
  if (!nav) return;
  nav.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a class="navbar-brand fw-bold" href="/admin/index.html">
        <img src="/images/dpsmlogo.png" width="30" class="me-2 rounded-circle" alt="">DPSM Admin
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="adminNavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link ${activePage === 'articles' ? 'active' : ''}" href="/admin/index.html">
              <i class="fas fa-newspaper me-1"></i>Articles
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${activePage === 'research' ? 'active' : ''}" href="/admin/research.html">
              <i class="fas fa-flask me-1"></i>Research
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${activePage === 'faculty' ? 'active' : ''}" href="/admin/faculty.html">
              <i class="fas fa-chalkboard-teacher me-1"></i>Faculty
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${activePage === 'facilities' ? 'active' : ''}" href="/admin/facilities.html">
              <i class="fas fa-building me-1"></i>Facilities
            </a>
          </li>
          ${role === 'admin' ? `
          <li class="nav-item">
            <a class="nav-link ${activePage === 'users' ? 'active' : ''}" href="/admin/users.html">
              <i class="fas fa-users me-1"></i>Users
            </a>
          </li>` : ''}
        </ul>
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item me-3">
            <span class="navbar-text text-light">
              <i class="fas fa-user-circle me-1"></i>${displayName}
              <span class="badge bg-${role === 'admin' ? 'danger' : 'primary'} ms-1">${role}</span>
            </span>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/" target="_blank"><i class="fas fa-external-link-alt me-1"></i>View Site</a>
          </li>
          <li class="nav-item">
            <button class="btn btn-sm btn-outline-light ms-2" id="logout-btn">
              <i class="fas fa-sign-out-alt me-1"></i>Sign out
            </button>
          </li>
        </ul>
      </div>
    </nav>`;
  document.getElementById('logout-btn')?.addEventListener('click', signOut);
}
