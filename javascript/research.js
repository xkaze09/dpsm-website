// research.js

// Generate the research cards
function generateResearchCard(title, authors, affiliations, link) {
    return `
    <div class="card">
        <div class="p-4 card-body border-bottom border-3 border-warning">
            <h5 class="card-title">
                <a href="${link}" target="_blank" class="text-decoration-underline text-primary">${title}</a>
            </h5>
            <p class="card-text lead mt-4 fw-medium">${authors}</p>
            <p class="card-text">${affiliations}</p>
            <a href="${link}" target="_blank" class="position-absolute bottom-0 end-0 p-3 text-primary">Access here</a>
        </div>    
    </div>
    `;
}

// Initialize the research cards
function initializeResearchCards(sections) {
    sections.forEach((section) => {
        const container = document.getElementById(section.containerId);

        if (container) {
            section.items.forEach((item) => {
                const cardHTML = generateResearchCard(item.title, item.authors, item.affiliations, item.link);
                container.innerHTML += cardHTML;
            });
        }
    });
}
