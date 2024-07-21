// research.js

// Fetch JSON data
async function fetchData() {
  try {
    const response = await fetch('/javascript/research/researchData.json');
    if (!response.ok) {
      throw new Error('Network response error.');
    }
    const data = await response.json();
    initializeResearchCards(data.SECTIONS);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


// Generating the research cards
function generateResearchCard(item, sectionId) {
  let cardHTML = '';

  if (sectionId === 'research-projects') {
    const titleHTML = item.link 
      ? `<h5 class="card-title"><em><a href="${item.link}" target="_blank" class="text-decoration-underline text-primary">${item.title}</a></em></h5>`
      : `<h5 class="card-title"><em>${item.title}</em></h5>`;


    cardHTML = `
      <div class="card research-card" data-section="${sectionId}">
          <div class="p-4 card-body border-bottom border-3 border-warning">
              ${titleHTML}
              <p class="card-text mt-4 fw-medium">${item.authors}</p>
              <p class="card-text">Duration: ${item.dates}</p>
          </div>
      </div>
    `;
  } else {
    let citation = item.citation.replace('[title]', item.link
      ? `<a href="${item.link}" target="_blank" class="text-decoration-underline text-primary">${item.title}</a>`
      : `${item.title}`);

    const citationHTML = `<p class="card-text">${citation}</p>`;

    cardHTML = `
      <div class="card research-card" data-section="${sectionId}">
          <div class="p-4 card-body border-bottom border-3 border-warning">
              ${citationHTML}
          </div>
      </div>
    `;
  }

  return cardHTML;
}

// Initialize the research cards
function initializeResearchCards(sections) {
  sections.forEach((section) => {
    const container = document.getElementById(section.containerId);
    let visibleCards = 5;

    if (container) {
      section.items.forEach((item, index) => {
        const cardHTML = generateResearchCard(item, section.containerId);
        container.innerHTML += cardHTML;

        if (index >= visibleCards) {
          const card = container.querySelector(`[data-section="${section.containerId}"]:last-child`);
          card.style.display = 'none';
        }
      });

      if (section.items.length > visibleCards) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = 'Show More';
        showMoreBtn.classList.add('btn', 'btn-primary', 'mt-3', 'rounded-5', 'toggle-indicator');
        showMoreBtn.style.float = 'right';
        
        showMoreBtn.addEventListener('click', () => toggleCards(container, section.containerId, visibleCards));
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

// Fetch and initialize research cards
fetchData();