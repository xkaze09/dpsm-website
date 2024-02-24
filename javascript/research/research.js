// research.js

import data from './researchData.json' assert { type: 'json' };

// Function to format date or date range
function formatDate(date) {
  const startDate = new Date(date.start);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  // Format date
  if (date.end) {
    const endDate = new Date(date.end);
    if (startDate.getTime() === endDate.getTime()) {
      // If start and end dates represent the same date, format as "Month Day, Year"
      return `${startDate.toLocaleDateString('en-US', options)}`;
    } else {
      // "Start Month Day, Year - End Month Day, Year"
      return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
    }
  } else {
    // Check if only the year is given
    if (date.start.length === 4) {
      // "Year"
      return `${startDate.toLocaleDateString('en-US', { year: 'numeric' })}`;
    } else if (date.start.length === 7) {
      // "Month Year"
      return `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    } else {
      // "Month Day, Year"
      return `${startDate.toLocaleDateString('en-US', options)}`;
    }
  }
}


// Generating the research cards
function generateResearchCard(title, authors, link, dates, sectionId) {
  let formattedDates = '';

  if (dates) {
    formattedDates = dates.map(formatDate).join(' & ');
  }

  // Check if link is provided or not for the title
  const titleHTML = link
    ? `<h5 class="card-title">
          <a href="${link}" target="_blank" class="text-decoration-underline text-primary">${title}</a>
       </h5>`
    : `<h5 class="card-title">${title}</h5>`;

  // Create "Access here" only if link is provided
  const accessLinkHTML = link
    ? `<a href="${link}" target="_blank" class="position-absolute bottom-0 end-0 p-3 text-primary">Access here</a>`
    : '';

  // HTML for the research card
  return `
    <div class="card research-card" data-section="${sectionId}">
        <div class="p-4 card-body border-bottom border-3 border-warning">
            ${titleHTML}
            <p class="card-text mt-4 fw-medium">${authors}</p>
            <p class="card-text">Date: ${formattedDates}</p>
            ${accessLinkHTML}
        </div>    
    </div>
    `;
}

// Initialize the research cards
function initializeResearchCards(sections) {

  sections.forEach((section) => {
    const container = document.getElementById(section.containerId);
    let visibleCards = 5; // Initial number of visible cards

    if (container) {
      section.items.forEach((item, index) => {
        const cardHTML = generateResearchCard(
          item.title,
          item.authors,
          item.link,
          item.dates || item.date,
          section.containerId,
        );
        container.innerHTML += cardHTML;

        // Hide cards if already more than the initial number of visible cards
        if (index >= visibleCards) {
          const card = container.querySelector(
            `[data-section="${section.containerId}"]:last-child`, // Use item.containerId
          );
          card.style.display = 'none';
        }
      });

      // Show More Button
      if (section.items.length > visibleCards) {

        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = 'Show More';
        showMoreBtn.classList.add('btn', 'btn-primary', 'mt-3', 'rounded-5', 'toggle-indicator');
        showMoreBtn.style.float = 'right';
        
        showMoreBtn.addEventListener('click', () =>
          toggleCards(container, section.containerId, visibleCards),
        );

        container.appendChild(showMoreBtn);
      }
    }
  });
}


// Toggle the state of the cards
function toggleCards(container, containerId, visibleCards) {

  const showMoreBtn = container.querySelector('.toggle-indicator');
  showMoreBtn.classList.toggle('show-less');

  if (showMoreBtn.textContent === 'Show More') {
    showMoreCards(containerId, visibleCards);
  } else {
    showLessCards(container, containerId, visibleCards);
  }
}

// SHOW MORE CARDS
function showMoreCards(containerId, visibleCards) {

  const container = document.getElementById(containerId);

  // Show the hidden cards
  const hiddenCards = container.querySelectorAll(
    `[data-section="${containerId}"]:nth-child(n + ${visibleCards + 1})`,
  );
  hiddenCards.forEach((card) => (card.style.display = 'block'));

  // Update button text
  const showMoreBtn = container.querySelector('.toggle-indicator');
  showMoreBtn.textContent = 'Show Less';
}

// SHOW LESS CARDS
function showLessCards(container, containerId, visibleCards) {
  
  // Hiding the excess cards
  const hiddenCards = container.querySelectorAll(
    `[data-section="${containerId}"]:nth-child(n + ${visibleCards + 1})`,
  );
  hiddenCards.forEach((card) => (card.style.display = 'none'));

  // Show the extra cards
  const remainingCards = container.querySelectorAll(`[data-section="${containerId}"]`);
  for (let i = 0; i < visibleCards; i++) {
    remainingCards[i].style.display = 'block';
  }

  // Update button text
  const showMoreBtn = container.querySelector('.toggle-indicator');
  showMoreBtn.textContent = 'Show More';
}

// Initialize the research cards
initializeResearchCards(data.SECTIONS);