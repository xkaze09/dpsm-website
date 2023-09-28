 // Division Highlights Carousel Data
const divisionCarouselData = [
    { src: './images/card1.png', alt: 'Image A', text: 'Division News A' },
    { src: './images/card2.png', alt: 'Image B', text: 'Division News B' },
    { src: './images/card3.png', alt: 'Image C', text: 'Division News C' },
];

// Function to update "Division Highlights" carousel
function updateDivisionCarousel() {
    const divisionCarouselImages = document.getElementById('division-carousel-images');
    const divisionCarouselText = document.getElementById('division-carousel-text');

    let carouselHTML = '';
    divisionCarouselData.forEach((item, index) => {
        const activeClass = index === 0 ? 'active' : '';
        carouselHTML += `
        <div class="carousel-item ${activeClass}">
            <img src="${item.src}" class="d-block w-100" alt="${item.alt}">
        </div>
        `;
    });

    divisionCarouselImages.innerHTML = carouselHTML;

    const divisionCarousel = document.getElementById('divisionCarousel');
    divisionCarousel.addEventListener('slid.bs.carousel', function () {
        const activeItem = document.querySelector('#divisionCarousel .carousel-item.active');
        const activeIndex = Array.from(divisionCarouselImages.children).indexOf(activeItem);
        divisionCarouselText.textContent = divisionCarouselData[activeIndex].text;
    });

    divisionCarouselText.textContent = divisionCarouselData[0].text;
}

// Call the function to initially populate the "Division Highlights" carousel
updateDivisionCarousel();
