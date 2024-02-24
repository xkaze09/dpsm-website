// Division Highlights Carousel Data
const divisionCarouselData = [
  {
    src: './images/highlights/highlight1.jpg',
    alt: 'DPSM Website Launch 2024',
    title: 'Exploring Excellence: DPSM Debuts Dynamic Website!',
    text: '',
  },
  {
    src: './images/highlights/highlight2.jpg',
    alt: '',
    title: 'DPSM Serves Science with a Side of Silicon in CAS Open House!',
    text: '',
  },
  {
    src: './images/highlights/highlight3.jpg',
    alt: 'DPSM Website Launch 2024',
    title: 'Numerical Navigators Converge in Math-O Interschool Quiz Bee!',
    text: '',
  },
];

// Function to update "Division Highlights" carousel
function updateDivisionCarousel() {
  const divisionCarouselImages = document.getElementById('division-carousel-images');
  const divisionCarouselTitle = document.getElementById('division-carousel-title');
  const divisionCarouselText = document.getElementById('division-carousel-text');

  let carouselHTML = '';
  divisionCarouselData.forEach((item, index) => {
    const activeClass = index === 0 ? 'active' : '';
    carouselHTML += `
        <div class="carousel-item ${activeClass}">
            <img src="${item.src}" class="d-block w-100" alt="${item.alt}">
            <!-- No need to add title in HTML as it will be dynamically updated -->
        </div>
        `;
  });

  divisionCarouselImages.innerHTML = carouselHTML;

  // Set initial title and text
  divisionCarouselTitle.innerHTML = divisionCarouselData[0].title;
  divisionCarouselText.innerHTML = divisionCarouselData[0].text;

  const divisionCarousel = document.getElementById('divisionCarousel');
  divisionCarousel.addEventListener('slid.bs.carousel', function () {
    const activeItem = document.querySelector('#divisionCarousel .carousel-item.active');
    const activeIndex = Array.from(divisionCarouselImages.children).indexOf(activeItem);
    divisionCarouselTitle.innerHTML = divisionCarouselData[activeIndex].title; // Update title dynamically
    divisionCarouselText.innerHTML = divisionCarouselData[activeIndex].text; // Update text dynamically
  });
}

// Call the function to initially populate the "Division Highlights" carousel
updateDivisionCarousel();
