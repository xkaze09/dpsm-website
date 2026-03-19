// sortMembers.js — fetch faculty/staff from the CMS API
// Replaces the hardcoded arrays that used to live here.

document.addEventListener('DOMContentLoaded', async () => {

  const FALLBACK_IMG = './images/dpsmlogo.png';

  const rankOrder = {
    'Professor': 1,
    'Associate Professor': 2,
    'Assistant Professor': 3,
    'Instructor': 4,
    'Lecturer': 5,
  };

  function sortAll(array) {
    return array.slice().sort((a, b) => {
      const rankA = rankOrder[a.title?.replace(/\s*\(.*\)/, '')] || 6;
      const rankB = rankOrder[b.title?.replace(/\s*\(.*\)/, '')] || 6;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name);
    });
  }

  function createCard(member, type = 'faculty') {
    const img = member.image_url || FALLBACK_IMG;
    return `
      <div class="col-lg-4 mb-3 d-flex align-items-stretch">
        <div class="card">
          <img src="${img}" class="card-img-top" alt="${member.name}"
               onerror="this.src='${FALLBACK_IMG}'">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${member.name}</h5>
            <p class="card-text mb-4">
              <i>${member.title || ''}</i><br>
              ${member.degree ? member.degree + '<br>' : ''}
              ${member.university ? member.university + '<br>' : ''}
              ${type === 'staff' ? '' : (member.additional_title ? member.additional_title + '<br>' : '')}
              ${type === 'staff' ? '' : (member.email || '')}
            </p>
          </div>
        </div>
      </div>`;
  }

  // Fetch all faculty from API
  let members = [];
  try {
    const res = await fetch(API_BASE + '/api/faculty');
    if (res.ok) members = await res.json();
  } catch (e) {
    console.error('Failed to load faculty:', e);
  }

  const byDept = (dept, type = 'faculty') =>
    members.filter(m => m.department === dept && m.type === type);

  const render = (id, list, type = 'faculty') => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = sortAll(list).map(m => createCard(m, type)).join('');
  };

  render('staff-list',    byDept('admin', 'staff'), 'staff');
  render('appMath-list',  byDept('appmath'));
  render('compSci-list',  byDept('cs'));
  render('stats-list',    byDept('statistics'));
  render('physics-list',  byDept('physics'));

  // Chairperson card (admin faculty, first in sort order)
  const chair = sortAll(byDept('admin', 'faculty'))[0];
  const chairEl = document.querySelector('.row.justify-content-center');
  if (chair && chairEl) {
    chairEl.innerHTML = createCard(chair);
  }
});
