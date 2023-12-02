// research.js

// Generating the research cards
function generateResearchCard(title, authors, affiliations, link, date, sectionId) {
    
  const formattedDate = new Date(date);

  // Format the date as "Month day, Year"
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDateString = formattedDate.toLocaleDateString('en-US', options);

  return `
    <div class="card research-card" data-section="${sectionId}">
        <div class="p-4 card-body border-bottom border-3 border-warning">
            <h5 class="card-title">
                <a href="${link}" target="_blank" class="text-decoration-underline text-primary">${title}</a>
            </h5>
            <p class="card-text lead mt-4 fw-medium">${authors}</p>
            <p class="card-text">${affiliations}</p>
            <p class="card-text">Date: ${formattedDateString}</p>
            <a href="${link}" target="_blank" class="position-absolute bottom-0 end-0 p-3 text-primary">Access here</a>
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
          item.affiliations,
          item.link,
          item.date,
          section.containerId,
        );
        container.innerHTML += cardHTML;

        // Hide cards if already more than the initial number of visible cards
        if (index >= visibleCards) {
          const card = container.querySelector(
            `[data-section="${section.containerId}"]:last-child`,
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

  // SShow the extra cards
  const remainingCards = container.querySelectorAll(`[data-section="${containerId}"]`);
  for (let i = 0; i < visibleCards; i++) {
    remainingCards[i].style.display = 'block';
  }

  // Update button text
  const showMoreBtn = container.querySelector('.toggle-indicator');
  showMoreBtn.textContent = 'Show More';
}

// Research Card Section Data
const researchCardSections = [
  {
    containerId: 'researchSection1',
    items: [
      {
        title:
          "Social Comparisons on Social Media: The Impact of Facebook on Young Women's Body Image Concerns and Mood",
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
        date: '2020-11-16',
      },
      {
        title:
          'Randomized Controlled Trial of a Brief Online Mindfulness-Based Intervention in a Non-clinical Sample of Undergraduate Students: Study Protocol for a Pragmatic Trial',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
        date: '2019-12-21',
      },
      {
        title:
          'Analyzing Statistics of the COVID-19 Pandemic in the Philippines Using the SIR Model',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
        date: '2017-05-06',
      },
      {
        title:
          'Study of the COVID-19 Pandemic in the Philippines Using the SIR Model and Machine Learning',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
        date: '2023-01-26',
      },
      {
        title:
          'A Systematic Review of the Impact of Exposure to Internet-Based Interventions on Anxiety',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
        date: '2002-07-19',
      },
      {
        title:
          'Effects of Social Media Use on Body Image and Mental Health: A Systematic Review and Meta-Analysis',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
        date: '2007-05-16',
      },
    ],
  },
  {
    containerId: 'researchSection2',
    items: [
      {
        title:
          "Social Comparisons on Social Media: The Impact of Facebook on Young Women's Body Image Concerns and Mood",
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'Randomized Controlled Trial of a Brief Online Mindfulness-Based Intervention in a Non-clinical Sample of Undergraduate Students: Study Protocol for a Pragmatic Trial',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'Analyzing Statistics of the COVID-19 Pandemic in the Philippines Using the SIR Model',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'Study of the COVID-19 Pandemic in the Philippines Using the SIR Model and Machine Learning',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'A Systematic Review of the Impact of Exposure to Internet-Based Interventions on Anxiety',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'Effects of Social Media Use on Body Image and Mental Health: A Systematic Review and Meta-Analysis',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title: 'Additional Research for Social Media Use',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
    ],
  },
  {
    containerId: 'researchSection3',
    items: [
      {
        title:
          'Analyzing Statistics of the COVID-19 Pandemic in the Philippines Using the SIR Model',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'Study of the COVID-19 Pandemic in the Philippines Using the SIR Model and Machine Learning',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'A Systematic Review of the Impact of Exposure to Internet-Based Interventions on Anxiety',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
    ],
  },
  {
    containerId: 'researchSection4',
    items: [
      {
        title:
          'Analyzing Statistics of the COVID-19 Pandemic in the Philippines Using the SIR Model',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'Study of the COVID-19 Pandemic in the Philippines Using the SIR Model and Machine Learning',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'A Systematic Review of the Impact of Exposure to Internet-Based Interventions on Anxiety',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
    ],
  },
  {
    containerId: 'researchSection5',
    items: [
      {
        title:
          'Analyzing Statistics of the COVID-19 Pandemic in the Philippines Using the SIR Model',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'Study of the COVID-19 Pandemic in the Philippines Using the SIR Model and Machine Learning',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
      {
        title:
          'A Systematic Review of the Impact of Exposure to Internet-Based Interventions on Anxiety',
        authors: 'Jasmin Fardouly, Philippa C Diedrich and Emma Halliwell',
        affiliations:
          'School of Psychology, University of New South WalesCentre for Appearance Research, University of the West',
        link: 'https://example.com',
      },
    ],
  },
];

// Initialize the research cards
initializeResearchCards(researchCardSections);
