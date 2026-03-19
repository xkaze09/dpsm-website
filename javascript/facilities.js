// facilities.js — fetch facilities from the CMS API and render the page.
// Maintains the exact same layout and lightbox behaviour as the original static HTML.

document.addEventListener('DOMContentLoaded', async () => {

  // ── Fetch ──────────────────────────────────────────────────────────────────
  let items = [];
  try {
    const res = await fetch(API_BASE + '/api/facilities');
    if (res.ok) items = await res.json();
  } catch (e) {
    console.error('Failed to load facilities:', e);
  }

  const byCategory = (cat) => items.filter(f => f.category === cat);

  // ── Sidebar ────────────────────────────────────────────────────────────────
  // Show unique name+location combos per category in the accordion lists.

  function renderSidebarList(containerId, category) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const seen = new Set();
    const unique = byCategory(category).filter(f => {
      const key = f.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (!unique.length) { el.innerHTML = ''; return; }
    el.innerHTML = unique.map(f => `
      <li>
        <strong>${f.name}</strong>
        ${f.location ? `<br><small>${f.location}</small>` : ''}
      </li>`).join('');
  }

  renderSidebarList('sidebar-computer-labs', 'computer_labs');
  renderSidebarList('sidebar-physics-labs', 'physics_labs');
  renderSidebarList('sidebar-university', 'university');

  // ── Gallery ────────────────────────────────────────────────────────────────
  // Render photo grids — 3 per row, same visual as original.

  function renderGallery(containerId, category) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const photos = byCategory(category).filter(f => f.image_url);
    if (!photos.length) { el.innerHTML = '<p class="text-muted">No photos yet.</p>'; return; }

    // Group into rows of 3
    const rows = [];
    for (let i = 0; i < photos.length; i += 3) {
      rows.push(photos.slice(i, i + 3));
    }

    el.innerHTML = rows.map(row => `
      <div class="row g-1 py-1">
        ${row.map(f => `
          <div class="facilities-img1 col p-1">
            <div class="facilities img-desc">
              <img src="${f.image_url}" class="facilities" alt="${f.caption || f.name}" onclick="grow(this)">
              <div class="img-overlay"><h6 class="display-6">${f.caption || f.name}</h6></div>
            </div>
          </div>`).join('')}
      </div>`).join('');
  }

  renderGallery('gallery-computer-labs', 'computer_labs');
  renderGallery('gallery-physics-labs', 'physics_labs');
  renderGallery('gallery-university', 'university');

});
