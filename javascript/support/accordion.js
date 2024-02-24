// accordion.js

document.addEventListener('DOMContentLoaded', function() {
  fetch('/javascript/support/accordion.json')
    .then(response => response.json())
    .then(data => {
      initializeAccordion(data.accordionSections);
    })
    .catch(error => console.error('Error fetching accordion data:', error));
});
  // Call initializeAccordion function
  initializeAccordion(data.accordionSections);
// Initialize the accordion sections
function initializeAccordion(sections) {
  sections.forEach((section, sectionIndex) => {
    const container = document.getElementById(section.containerId);

    if (container) {
      section.items.forEach((item, index) => {
        // Add the accordion item HTML to the container
        container.innerHTML += createAccordionItem(
          sectionIndex,
          index,
          item.title,
          item.content,
          section.containerId,
        );
      });
    }
  });
}

// Creating the accordion item HTML

function createAccordionItem(sectionIndex, index, title, content, containerId) {
  // To assign a unique index for each accordion item
  const itemIndex = `${sectionIndex}-${index}`;

  // Generating the accordion item HTML
  const itemHTML = `
        <div class="accordion-item">
            <h2 class="accordion-header" id="flush-heading${itemIndex}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${itemIndex}" aria-expanded="false" aria-controls="flush-collapse${itemIndex}">
                    ${title}
                </button>
            </h2>
            <div id="flush-collapse${itemIndex}" class="accordion-collapse collapse" aria-labelledby="flush-heading${itemIndex}" data-bs-parent="#${containerId}">
                <div class="accordion-body">${content}</div>
            </div>
        </div>
    `;

  // Return the generated HTML
  return itemHTML;
}
